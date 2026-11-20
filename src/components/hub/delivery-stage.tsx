"use client";

import { useCallback, useEffect, useMemo, useRef, useState, type CSSProperties } from "react";
import { Check, Pause, Play } from "lucide-react";
import { blocks, fields, LAKES, RIVERS, ROADS, SIZE, TOWNS, U, pathD, placeKm, pointAt, smooth, toU, track, type FieldKind, type Track } from "@/lib/content/delivery-geo";
import { PLACES, ZONES } from "@/lib/content/hub-extras";
import { cn } from "@/lib/utils";

/**
 * Sa bàn giao hàng: tấm bản đồ giấy đặt nghiêng (CSS 3D, không cần thư viện WebGL), vẽ gần đúng sông Bé,
 * sông Sài Gòn, hồ Dầu Tiếng, QL13/QL14 và các thửa vườn quanh Chơn Thành. Một xe máy chở bao phân chạy
 * theo đường thật từ cửa hàng tới từng địa danh của vòng đang chọn.
 *
 * Hiệu năng: bản đồ là một lớp SVG tĩnh (vẽ một lần); mỗi khung hình chỉ đổi transform của xe (GPU)
 * và dashoffset của đường đi. Vòng lặp chỉ chạy khi sa bàn nằm trong màn hình, dừng khi người dùng bấm
 * tạm dừng hoặc bật "giảm chuyển động".
 */

const ZOOM = [2.3, 1.45, 0.92]; // phóng theo vòng đang chọn
const TILT = 52;
const RZ = -14;
const FIELD_FILL: Record<FieldKind, string> = { rubber: "#d3dfc4", cashew: "#e2e5c9", soil: "#ecdcc6", open: "#e8ecda" };
const ZONE_TINT = ["#fff1cf", "#e3f0fb", "#efede9"];
const ZONE_STROKE = ["#e09a00", "#3d8fd6", "#8b857d"];
const DOT = ["bg-hub-marigold", "bg-hub-sky", "bg-hub-muted"];

const placesOf = (zoneId: string) => PLACES.filter((p) => p.zone === zoneId).map((p) => p.name);
const zoneOfPlace = (name: string) => ZONES.findIndex((z) => z.id === PLACES.find((p) => p.name === name)?.zone);
const kmOf = (name: string) => PLACES.find((p) => p.name === name)?.km ?? 0;
const ease = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

const C = SIZE / 2;
/** chặn biến 3D (đang chuyển động) lan xuống hàng nghìn phần tử SVG → không phải tính lại style mỗi khung hình */
const ISOLATE = { "--kn-zoom": 1, "--kn-fit": 1, "--kn-tilt": "0deg", "--kn-rz": "0deg" } as CSSProperties;

/* ---------------------------------------------------------------- lớp bản đồ tĩnh */

/** Bản đồ tĩnh dựng sẵn thành chuỗi SVG một lần (≈1.500 hình) → React không phải tạo/hydrate từng phần tử. */
const esc = (t: string) => t.replace(/&/g, "&amp;").replace(/</g, "&lt;");
let mapCache = "";
function mapSvg() {
  if (mapCache) return mapCache;
  mapCache = (() => {
  const o: string[] = [];
  o.push(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${SIZE} ${SIZE}" width="${SIZE}" height="${SIZE}" style="position:absolute;inset:0;display:block">`);
  o.push("<defs>");
  // nền thửa + luống cây gộp trong một pattern → mỗi thửa chỉ một <path>
  [24, 68, -32].forEach((a, i) => o.push(`<pattern id="sb-rows-${i}" width="4.2" height="4.2" patternUnits="userSpaceOnUse" patternTransform="rotate(${a})"><rect width="4.2" height="4.2" fill="${FIELD_FILL.rubber}"/><line x1="0" y1="2" x2="4.2" y2="2" stroke="#56794a" stroke-opacity="0.2" stroke-width="0.9" stroke-dasharray="1.6 1"/></pattern>`));
  o.push(`<pattern id="sb-dots" width="6" height="6" patternUnits="userSpaceOnUse"><rect width="6" height="6" fill="${FIELD_FILL.cashew}"/><circle cx="3" cy="3" r="0.9" fill="#7a8f4a" fill-opacity="0.28"/></pattern>`);
  // cung phía Tây Nam, chạy từ Tây sang Nam để chữ đứng thẳng khi nhìn
  ZONES.forEach((z, i) => {
    const r = z.radiusKm * U;
    o.push(`<path id="sb-ring-${i}" d="M${C - r} ${C} A${r} ${r} 0 0 0 ${C} ${C + r}"/>`);
  });
  RIVERS.filter((r) => r.name).forEach((r) => o.push(`<path id="sb-river-${r.id}" d="${pathD(smooth(r.pts.slice(2, 7), 6))}"/>`));
  o.push("</defs>");

  o.push(`<rect width="${SIZE}" height="${SIZE}" fill="#f1efe7"/>`);
  // thửa vườn + luống cây
  fields().forEach((f) => o.push(`<path d="${f.d}" fill="${f.kind === "rubber" ? `url(#sb-rows-${f.hatch})` : f.kind === "cashew" ? "url(#sb-dots)" : FIELD_FILL[f.kind]}"/>`));
  // hồ, sông
  LAKES.forEach((l) => o.push(`<path d="${pathD(smooth(l.pts, 6, true), true)}" fill="#b7d3ea" stroke="#9fc3e2" stroke-width="1.2"/>`));
  o.push(`<g fill="none" stroke="#a9cae6" stroke-linecap="round" stroke-linejoin="round">`);
  RIVERS.forEach((r) => o.push(`<path d="${pathD(smooth(r.pts, 8))}" stroke-width="${r.width}"/>`));
  o.push("</g>");
  // vòng giao hàng (nhấn mạnh vòng đang chọn bằng thuộc tính data-ring)
  [...ZONES].reverse().forEach((z) => {
    const i = ZONES.indexOf(z);
    o.push(`<circle data-ring="${i}" cx="${C}" cy="${C}" r="${z.radiusKm * U}" fill="${ZONE_TINT[i]}" fill-opacity="0.4" stroke="${ZONE_STROKE[i]}" stroke-opacity="0.45" stroke-width="1.6" stroke-dasharray="7 6"/>`);
  });
  // khu dân cư
  o.push(`<g fill="#dcd6cc">`);
  TOWNS.forEach((t) => {
    const [x, y] = toU(t.at);
    o.push(`<circle cx="${x}" cy="${y}" r="${11 * t.size}" fill="#e9e4da"/>`);
  });
  blocks().forEach((b) => o.push(`<rect x="${b.x}" y="${b.y}" width="${b.w}" height="${b.h}" rx="0.6"/>`));
  o.push("</g>");
  // đường: viền trước, lòng đường sau
  o.push(`<g fill="none" stroke-linecap="round" stroke-linejoin="round">`);
  ROADS.filter((r) => r.cls === "lane").forEach((r) => o.push(`<path d="${pathD(smooth(r.pts, 8))}" stroke="#fbfaf6" stroke-width="1.8"/>`));
  ROADS.filter((r) => r.cls !== "lane").forEach((r) => o.push(`<path d="${pathD(smooth(r.pts, 10))}" stroke="#c9c0b0" stroke-width="${r.cls === "ql" ? 8.6 : 5.4}"/>`));
  ROADS.filter((r) => r.cls === "dt").forEach((r) => o.push(`<path d="${pathD(smooth(r.pts, 10))}" stroke="#ffffff" stroke-width="3.6"/>`));
  ROADS.filter((r) => r.cls === "ql").forEach((r) => o.push(`<path d="${pathD(smooth(r.pts, 10))}" stroke="#f6d27e" stroke-width="6"/>`));
  o.push("</g>");
  // chữ in trên giấy: vòng, sông, hồ, vùng
  ZONES.forEach((z, i) =>
    o.push(`<text data-ring-label="${i}" font-size="${[6, 9, 12.5][i]}" font-weight="600" letter-spacing="${[1.4, 2, 2.6][i]}" fill="${ZONE_STROKE[i]}" fill-opacity="0.9"><textPath href="#sb-ring-${i}" startOffset="${i === 0 ? "30%" : "34%"}">${esc(z.when.toUpperCase())} · ${z.radiusKm} KM</textPath></text>`)
  );
  o.push(`<g font-style="italic" fill="#4f84b4" font-size="10" letter-spacing="0.8">`);
  RIVERS.filter((r) => r.name).forEach((r) => o.push(`<text dy="-6"><textPath href="#sb-river-${r.id}" startOffset="20%">${esc(r.name)}</textPath></text>`));
  LAKES.filter((l) => l.name).forEach((l) => {
    const [x, y] = toU(l.label);
    o.push(`<text x="${x}" y="${y}" text-anchor="middle">${esc(l.name)}</text>`);
  });
  o.push("</g>");
  o.push(`<g fill="#37352f" fill-opacity="0.16" font-size="22" font-weight="700" letter-spacing="9" text-anchor="middle">`);
  ([[[22, 74], "ĐỒNG NAI"], [[30, -82], "TP. HỒ CHÍ MINH"], [[-70, -44], "TÂY NINH"]] as const).forEach(([pt, name]) => {
    const [x, y] = toU([pt[0], pt[1]]);
    o.push(`<text x="${x}" y="${y}">${esc(name)}</text>`);
  });
  o.push("</g>");
  o.push(`<g fill="#615d59" font-size="10.5" font-weight="500" text-anchor="middle" paint-order="stroke" stroke="#f1efe7" stroke-width="3">`);
  TOWNS.filter((t) => t.label).forEach((t) => {
    const [x, y] = toU(t.at);
    o.push(`<text x="${x}" y="${y + 22 * t.size}">${esc(t.name)}</text>`);
  });
  o.push("</g>");
  o.push(`<rect x="0.5" y="0.5" width="${SIZE - 1}" height="${SIZE - 1}" fill="none" stroke="#d8d2c6"/>`);
  o.push("</svg>");
  return o.join("");
  })();
  return mapCache;
}

/** Gắn chuỗi SVG trực tiếp (effect của con chạy trước effect tô vòng của cha). */
function MapArt() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (ref.current && !ref.current.firstChild) ref.current.innerHTML = mapSvg();
  }, []);
  return <div ref={ref} className="absolute inset-0 bg-[#f1efe7]" style={ISOLATE} aria-hidden />;
}

/* ---------------------------------------------------------------- xe máy chở phân (nhìn ngang, hướng phải) */

function Courier() {
  return (
    <svg viewBox="0 0 76 60" width="76" height="60" aria-hidden className="block overflow-visible">
      {/* bao phân sau yên */}
      <rect x="2" y="17" width="20" height="15" rx="4.5" fill="#f5f0e4" stroke="#cfc4ad" strokeWidth="1" />
      <rect x="2" y="22.5" width="20" height="3.2" fill="#2e8a46" />
      <rect x="4.5" y="5" width="17" height="13.5" rx="4.5" fill="#f5f0e4" stroke="#cfc4ad" strokeWidth="1" />
      <rect x="4.5" y="9.6" width="17" height="3" fill="#2e8a46" />
      {/* thân xe */}
      <path d="M7 41c0-6 4-9.5 10-9.5h22c5 0 7.6 2.4 9 6.5l1 2.6h3.6L58.6 22h4.6l-6.2 20.4c-1.3 3.7-4.1 5.6-8 5.6H16.5C11 48 7 45.6 7 41z" fill="#0068c9" />
      <path d="M16 31.5h22c2 0 3.4.5 4.4 1.6H15.4z" fill="#00569f" />
      <rect x="18" y="27" width="22" height="5.2" rx="2.6" fill="#232220" />
      <circle cx="62.5" cy="27.5" r="2.1" fill="#ffd66b" />
      {/* người lái */}
      <path d="M31 28.5c-1-6 1-12 4.5-15.6" stroke="#2f6f3e" strokeWidth="7" strokeLinecap="round" fill="none" />
      <path d="M31.5 28.5l9.5 2.2 3.4 8.6" stroke="#37352f" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <path d="M37.6 15.2l9.6 6.6 9.6-1.4" stroke="#2f6f3e" strokeWidth="3.6" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <circle cx="56.8" cy="20.6" r="1.9" fill="#e7b48f" />
      <circle cx="39" cy="6.6" r="5.2" fill="#e7b48f" />
      <path d="M32.6 6.4a6.6 6.6 0 0 1 13.2 0z" fill="#ffb110" />
      <rect x="44" y="5.4" width="3.6" height="1.6" rx="0.8" fill="#ffb110" />
      <path d="M57.6 21.2l3.2-2.4" stroke="#232220" strokeWidth="2" strokeLinecap="round" />
      {/* bánh xe */}
      {[16, 56].map((x) => (
        <g key={x}>
          <circle cx={x} cy="49" r="8.6" fill="#232220" />
          <circle cx={x} cy="49" r="3.6" fill="#cfc9bf" />
        </g>
      ))}
    </svg>
  );
}

/* ---------------------------------------------------------------- hộp 3D (kho Kim Ngoan) */

function Warehouse() {
  const w = 34, d = 24, h = 15;
  const wall = "absolute border border-black/10";
  return (
    <div className="sb-3d" style={{ left: C - w / 2, top: C - d / 2, width: w, height: d }} aria-hidden>
      {/* tường Nam (phía người xem) */}
      <div className={wall} style={{ left: 0, top: d - h, width: w, height: h, transformOrigin: "50% 100%", transform: "rotateX(-90deg)", background: "#fbfaf7" }}>
        <div className="absolute bottom-0 left-1/2 h-[8px] w-[9px] -translate-x-1/2 bg-[#37352f]/70" />
      </div>
      {/* tường Bắc */}
      <div className={wall} style={{ left: 0, top: -h, width: w, height: h, transformOrigin: "50% 100%", transform: "translateY(" + 0 + "px) rotateX(-90deg)", background: "#eeeae2" }} />
      {/* tường Đông, Tây */}
      <div className={wall} style={{ left: w, top: 0, width: h, height: d, transformOrigin: "0 50%", transform: "rotateY(-90deg)", background: "#e6e1d7" }} />
      <div className={wall} style={{ left: -h, top: 0, width: h, height: d, transformOrigin: "100% 50%", transform: "rotateY(90deg)", background: "#f3f0ea" }} />
      {/* mái */}
      <div className="absolute inset-0 border border-black/10" style={{ transform: `translateZ(${h}px)`, background: "#0068c9" }}>
        <div className="absolute inset-x-0 top-1/2 h-px bg-white/40" />
      </div>
    </div>
  );
}

/* ---------------------------------------------------------------- component chính */

type Phase = "idle" | "drive" | "drop" | "swap";

export function DeliveryStage({ storeLabel, active, setActive }: { storeLabel: string; active: number; setActive: (i: number) => void }) {
  const [dest, setDest] = useState<string | null>(null);
  const [phase, setPhase] = useState<Phase>("idle");
  const [paused, setPaused] = useState(false);
  const [reduced, setReduced] = useState(false);
  const zone = ZONES[active];

  const stageRef = useRef<HTMLDivElement>(null);
  const carRef = useRef<HTMLDivElement>(null);
  const flipRef = useRef<HTMLDivElement>(null);
  const progRef = useRef<SVGPathElement>(null);
  const progCaseRef = useRef<SVGPathElement>(null);
  const kmRef = useRef<HTMLSpanElement>(null);
  const barRef = useRef<HTMLSpanElement>(null);
  const tickRef = useRef<(now: number) => void>(() => {});

  const anim = useRef({ track: null as Track | null, t0: 0, dur: 0, phase: "idle" as Phase, phaseAt: 0, name: "", queue: [] as string[], facing: 1, visible: false, raf: 0, stopAt: 0 });
  const route = useMemo(() => (dest ? track(dest) : null), [dest]);

  /* ---- đo khung, đặt tỉ lệ ---- */
  useEffect(() => {
    const el = stageRef.current;
    if (!el) return;
    const ro = new ResizeObserver(([e]) => {
      const w = e.contentRect.width;
      el.style.setProperty("--kn-fit", String(Math.round((w / (w < 640 ? 680 : 1060)) * 1000) / 1000));
    });
    ro.observe(el);
    const mq = matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReduced(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => {
      ro.disconnect();
      mq.removeEventListener("change", sync);
    };
  }, []);

  /* ---- phóng theo vòng; bật will-change trong lúc chuyển để mượt, tắt sau để chữ nét lại ---- */
  useEffect(() => {
    const el = stageRef.current;
    if (!el) return;
    el.dataset.moving = "";
    el.style.setProperty("--kn-zoom", String(ZOOM[active]));
    const t = setTimeout(() => delete el.dataset.moving, 1200);
    // làm nổi vòng đang chọn trên lớp SVG tĩnh (chỉ đổi thuộc tính, không render lại bản đồ)
    el.querySelectorAll<SVGCircleElement>("[data-ring]").forEach((c) => {
      const on = Number(c.dataset.ring) === active;
      c.setAttribute("stroke-opacity", on ? "0.95" : "0.35");
      c.setAttribute("stroke-width", on ? "2.6" : "1.4");
      c.setAttribute("fill-opacity", on ? "0.7" : "0.3");
    });
    el.querySelectorAll<SVGTextElement>("[data-ring-label]").forEach((t) => t.setAttribute("opacity", Number(t.dataset.ringLabel) === active ? "1" : "0.45"));
    return () => clearTimeout(t);
  }, [active]);

  /* ---- đặt xe ---- */
  const placeCar = useCallback((x: number, y: number, dx = 0, dy = 0) => {
    const car = carRef.current;
    if (!car) return;
    car.style.transform = `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, 0)`;
    // hướng trên màn hình = hướng trên giấy xoay theo góc xoay sa bàn
    const a = (RZ * Math.PI) / 180;
    const sx = dx * Math.cos(a) - dy * Math.sin(a);
    if (Math.abs(sx) > 0.05) {
      const f = sx >= 0 ? 1 : -1;
      if (f !== anim.current.facing && flipRef.current) {
        anim.current.facing = f;
        flipRef.current.style.transform = `scaleX(${f})`;
      }
    }
  }, []);

  const setProgress = useCallback((p: number, len: number, km: number) => {
    const off = String(Math.max(0, len * (1 - p)).toFixed(1));
    progRef.current?.setAttribute("stroke-dashoffset", off);
    progCaseRef.current?.setAttribute("stroke-dashoffset", off);
    const k = String(Math.round(km * p));
    if (kmRef.current && kmRef.current.textContent !== k) kmRef.current.textContent = k;
    if (barRef.current) barRef.current.style.transform = `scaleX(${p.toFixed(3)})`;
  }, []);

  /* ---- bắt đầu một chuyến ---- */
  const start = useCallback(
    (name: string, now = performance.now()) => {
      const t = track(name);
      if (!t) return;
      const a = anim.current;
      a.track = t;
      a.name = name;
      a.t0 = now;
      // nếu đang ẩn khỏi màn hình thì coi như "dừng" từ lúc này, khi hiện lại sẽ chạy từ đầu chuyến
      a.stopAt = a.visible ? 0 : now;
      a.dur = Math.min(5200, 1500 + t.len * 9);
      a.phase = "drive";
      setDest(name);
      setPhase("drive");
      if (carRef.current) carRef.current.style.opacity = "1";
      placeCar(t.pts[0][0], t.pts[0][1], t.pts[1][0] - t.pts[0][0], t.pts[1][1] - t.pts[0][1]);
    },
    [placeCar]
  );

  /* ---- vòng lặp ---- */
  const loop = useCallback(
    (now: number) => {
      const a = anim.current;
      a.raf = 0;
      if (!a.visible) return;
      if (a.phase === "drive" && a.track) {
        const p = Math.max(0, Math.min(1, (now - a.t0) / a.dur));
        const e = ease(p);
        const pt = pointAt(a.track, e * a.track.len);
        placeCar(pt.x, pt.y, pt.dx, pt.dy);
        setProgress(e, a.track.len, kmOf(a.name));
        if (p >= 1) {
          a.phase = "drop";
          a.phaseAt = now;
          setPhase("drop");
        }
      } else if (a.phase === "drop" && now - a.phaseAt > 1700) {
        a.phase = "swap";
        a.phaseAt = now;
        if (carRef.current) carRef.current.style.opacity = "0";
      } else if (a.phase === "swap" && now - a.phaseAt > 420) {
        const next = a.queue.shift();
        if (next) {
          a.queue.push(next);
          start(next, now);
        } else a.phase = "idle";
      }
      a.raf = requestAnimationFrame((t) => tickRef.current(t));
    },
    [placeCar, setProgress, start]
  );
  useEffect(() => {
    tickRef.current = loop;
  }, [loop]);

  const kick = useCallback(() => {
    const a = anim.current;
    if (!a.raf && a.visible) a.raf = requestAnimationFrame((t) => tickRef.current(t));
  }, []);

  /* ---- chỉ chạy khi nhìn thấy, không tạm dừng, không giảm chuyển động ---- */
  useEffect(() => {
    const el = stageRef.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => {
      const a = anim.current;
      a.visible = e.isIntersecting && !paused && !reduced;
      if (a.visible) {
        // tiếp tục chuyến đang dở: dời mốc thời gian để xe chạy tiếp từ chỗ dừng, không "nhảy"
        if (a.stopAt) {
          const gap = performance.now() - a.stopAt;
          a.t0 += gap;
          a.phaseAt += gap;
          a.stopAt = 0;
        }
        kick();
      } else {
        if (!a.stopAt) a.stopAt = performance.now();
        if (a.raf) cancelAnimationFrame(a.raf);
        a.raf = 0;
      }
    }, { threshold: 0.2 });
    io.observe(el);
    return () => io.disconnect();
  }, [paused, reduced, kick]);

  /* ---- đổi vòng: lập lịch các điểm của vòng và chạy chuyến đầu ---- */
  const tour = useCallback(
    (zoneIdx: number, first?: string) => {
      const names = placesOf(ZONES[zoneIdx].id);
      const a = anim.current;
      const startName = first ?? names[0];
      const i = names.indexOf(startName);
      a.queue = [...names.slice(i + 1), ...names.slice(0, i + 1)];
      if (reduced || paused) {
        // tĩnh: vẽ cả tuyến, đặt xe ở điểm đến
        const t = track(startName);
        if (!t) return;
        a.track = t;
        a.name = startName;
        a.phase = "drop";
        setDest(startName);
        setPhase("drop");
        const n = t.pts.length;
        requestAnimationFrame(() => {
          placeCar(t.pts[n - 1][0], t.pts[n - 1][1], t.pts[n - 1][0] - t.pts[n - 2][0], t.pts[n - 1][1] - t.pts[n - 2][1]);
          setProgress(1, t.len, kmOf(startName));
        });
        return;
      }
      start(startName);
      kick();
    },
    [kick, paused, placeCar, reduced, setProgress, start]
  );

  // chuyến đầu tiên khi vào trang & mỗi lần đổi vòng
  const lastZone = useRef(-1);
  useEffect(() => {
    if (lastZone.current === active) return;
    lastZone.current = active;
    tour(active);
  }, [active, tour]);

  // khi dash của đường mới gắn vào DOM → đặt lại tiến độ về 0 (hoặc đầy nếu tĩnh)
  useEffect(() => {
    if (!route) return;
    const a = anim.current;
    setProgress(a.phase === "drive" ? 0 : 1, route.len, kmOf(route ? (dest ?? "") : ""));
  }, [route, dest, setProgress]);

  const pick = (name: string) => {
    const z = zoneOfPlace(name);
    if (z !== active) {
      lastZone.current = z;
      setActive(z);
    }
    tour(z, name);
  };

  const togglePause = () => setPaused((p) => !p);

  const destKm = dest ? kmOf(dest) : 0;
  const destZone = dest ? ZONES[zoneOfPlace(dest)] : zone;
  const store = toU([0, 0]);

  return (
  <div
    ref={stageRef}
    className="sb-stage relative isolate aspect-[4/5] w-full overflow-hidden rounded-xl border border-hub-line bg-hub-canvas sm:aspect-[5/4] lg:aspect-auto lg:min-h-[560px] lg:flex-1"
    style={{ "--kn-tilt": `${TILT}deg`, "--kn-rz": `${RZ}deg`, "--kn-zoom": ZOOM[0] } as CSSProperties}
    role="group"
    aria-label={`Sa bàn minh hoạ vùng giao hàng quanh cửa hàng ở ${storeLabel}. ${zone.when}: ${zone.places}.`}
  >
    <div className="sb-plane">
      {/* bóng & mép dày của tấm sa bàn */}
      <div className="absolute inset-0 bg-black/10 blur-2xl" style={{ transform: "translateZ(-26px)" }} aria-hidden />
      <div className="absolute left-0 top-full h-[18px] w-full bg-[#ddd6c9]" style={{ transformOrigin: "50% 0", transform: "rotateX(-90deg)" }} aria-hidden />
      <div className="absolute left-full top-0 h-full w-[18px] bg-[#d2cabb]" style={{ transformOrigin: "0 50%", transform: "rotateY(90deg)" }} aria-hidden />
      <div className="absolute right-full top-0 h-full w-[18px] bg-[#e3ddd1]" style={{ transformOrigin: "100% 50%", transform: "rotateY(-90deg)" }} aria-hidden />

      <MapArt />

      {/* tuyến đang chạy */}
      <svg viewBox={`0 0 ${SIZE} ${SIZE}`} width={SIZE} height={SIZE} className="pointer-events-none absolute inset-0" style={{ ...ISOLATE, transform: "translateZ(0.5px)" }} aria-hidden>
        {route && (
          <g fill="none" strokeLinecap="round" strokeLinejoin="round" key={dest}>
            <path d={route.d} stroke="#0068c9" strokeOpacity="0.35" strokeWidth="2.4" strokeDasharray="2 6" />
            <path ref={progCaseRef} d={route.d} stroke="#fff" strokeWidth="8.5" strokeDasharray={`${route.len.toFixed(1)} ${route.len.toFixed(1)}`} strokeDashoffset={route.len.toFixed(1)} />
            <path ref={progRef} d={route.d} stroke="#0068c9" strokeWidth="4.6" strokeDasharray={`${route.len.toFixed(1)} ${route.len.toFixed(1)}`} strokeDashoffset={route.len.toFixed(1)} />
          </g>
        )}
        {/* chân ghim địa danh */}
        {PLACES.map((p) => {
          const [x, y] = toU(placeKm(p.name));
          const on = p.zone === zone.id;
          return <circle key={p.name} cx={x} cy={y} r={on ? 4.6 : 3.4} fill={dest === p.name ? "#0068c9" : "#37352f"} fillOpacity={on ? 1 : 0.5} stroke="#fff" strokeWidth="1.8" />;
        })}
      </svg>

      {/* sóng toả quanh cửa hàng */}
      <div className="sb-3d" style={{ left: store[0] - 40, top: store[1] - 40, width: 80, height: 80, transform: "translateZ(0.8px)" }} aria-hidden>
        <span className="sb-pulse absolute inset-0 rounded-full border-2 border-hub-blue" />
      </div>
      <Warehouse />

      {/* nhãn đứng: địa danh (bấm được), biển QL, cửa hàng */}
      {PLACES.map((p) => {
        const [x, y] = toU(placeKm(p.name));
        const on = p.zone === zone.id;
        const cur = dest === p.name;
        return (
          <div key={p.name} className={cn("sb-3d", !on && !cur && "max-sm:hidden")} style={{ left: x, top: y, transform: "translateZ(1px)" }}>
            <div className="sb-bb" style={{ left: -80, bottom: 0, width: 160 }}>
              <div className="flex flex-col items-center">
                <button
                  type="button"
                  onClick={() => pick(p.name)}
                  aria-label={`Giao tới ${p.name}, khoảng ${p.km} km – ${ZONES[zoneOfPlace(p.name)].when}`}
                  className={cn(
                    "flex items-baseline gap-1.5 whitespace-nowrap rounded-md border px-2 py-1 text-[12.5px] leading-none transition-[background-color,color,opacity,border-color] duration-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-hub-blue",
                    cur ? "border-hub-blue bg-hub-blue font-semibold text-white" : on ? "border-hub-ink/15 bg-hub-paper font-semibold text-hub-ink hover:border-hub-ink/40" : "border-transparent bg-hub-paper/70 text-hub-ink-soft opacity-70 hover:opacity-100"
                  )}
                >
                  {p.name}
                  <span className={cn("text-[10.5px] font-normal tabular-nums", cur ? "text-white/80" : "text-hub-ink-soft")}>{p.km} km</span>
                </button>
                <span aria-hidden className={cn("w-px transition-[height] duration-500 ease-soft", cur ? "h-[58px] bg-hub-blue" : "h-3.5 bg-hub-ink/35")} />
              </div>
            </div>
          </div>
        );
      })}
      {[
        { id: "QL13", at: toU([-5.4, 44]) },
        { id: "QL14", at: toU([56, 15.6]) },
      ].map((s) => (
        <div key={s.id} className="sb-3d" style={{ left: s.at[0], top: s.at[1], transform: "translateZ(1px)" }} aria-hidden>
          <div className="sb-bb" style={{ left: -30, bottom: 0, width: 60 }}>
            <div className="mx-auto w-fit rounded-[4px] border border-[#b98b16] bg-[#f6d27e] px-1.5 py-[3px] text-[10px] font-bold leading-none tracking-wide text-[#3d2e05]">{s.id}</div>
          </div>
        </div>
      ))}
      <div className="sb-3d" style={{ left: store[0], top: store[1], transform: "translateZ(16px)" }} aria-hidden>
        <div className="sb-bb" style={{ left: -90, bottom: 0, width: 180 }}>
          <div className="flex flex-col items-center">
            <span className="whitespace-nowrap rounded-md bg-hub-ink px-2.5 py-1.5 text-[12.5px] font-semibold leading-none text-white">Kho Kim Ngoan</span>
            <span className="h-3 w-px bg-hub-ink" />
          </div>
        </div>
      </div>

      {/* xe giao hàng */}
      <div ref={carRef} className="sb-3d left-0 top-0 transition-opacity duration-300" style={{ transform: `translate3d(${store[0]}px, ${store[1]}px, 0)` }} aria-hidden>
        <span className="absolute -left-[9px] -top-[3px] h-[6px] w-[18px] rounded-full bg-black/25 blur-[1.5px]" />
        <div className="sb-bb" style={{ left: -38, bottom: 1, width: 76 }}>
          <div className="relative">
            <span className={cn("absolute -top-7 left-1/2 inline-flex -translate-x-1/2 items-center gap-1 whitespace-nowrap rounded-full bg-hub-ink px-2 py-1 text-[11px] font-semibold leading-none text-white transition-[opacity,transform] duration-300", phase === "drop" ? "translate-y-0 opacity-100" : "translate-y-1 opacity-0")}>
              <Check className="size-3" strokeWidth={3} aria-hidden /> Đã tới
            </span>
            <div ref={flipRef} className="transition-transform duration-200">
              <div className={cn(phase === "drive" && !paused && "sb-bob")}>
                <Courier />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    {/* lớp phẳng: la bàn, tạm dừng, thẻ trạng thái */}
    <div className="pointer-events-none absolute inset-x-0 top-0 flex items-start justify-between gap-3 p-3 sm:p-4">
      <span className="rounded-md bg-hub-paper/90 px-2.5 py-1.5 text-caption text-hub-ink-soft ring-1 ring-hub-line">Sa bàn minh hoạ</span>
      <div className="pointer-events-auto flex items-center gap-2">
        <button
          type="button"
          onClick={togglePause}
          aria-pressed={paused}
          aria-label={paused ? "Cho xe chạy tiếp" : "Tạm dừng xe giao hàng"}
          className="grid size-9 place-items-center rounded-full bg-hub-paper text-hub-ink ring-1 ring-hub-line transition-colors hover:bg-hub-stone focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-hub-blue"
          hidden={reduced}
        >
          {paused ? <Play className="size-4" aria-hidden /> : <Pause className="size-4" aria-hidden />}
        </button>
        <span className="grid size-9 place-items-center rounded-full bg-hub-paper ring-1 ring-hub-line" aria-hidden>
          <svg viewBox="0 0 24 24" className="size-6" style={{ transform: `rotate(${RZ}deg)` }}>
            <path d="M12 3l3.2 9H8.8z" fill="#f64932" />
            <path d="M12 21l-3.2-9h6.4z" fill="#a39e98" />
          </svg>
        </span>
      </div>
    </div>

    <div className="pointer-events-none absolute inset-x-3 bottom-3 sm:inset-x-auto sm:bottom-4 sm:left-4 sm:w-[300px]">
      <div className="rounded-lg bg-hub-paper/95 p-3 ring-1 ring-hub-line backdrop-blur-sm sm:p-3.5" aria-live="polite">
        <p className="hidden items-center justify-between gap-3 text-caption text-hub-ink-soft sm:flex">
          <span>Xe giao hàng</span>
          <span className="inline-flex items-center gap-1.5">
            <span aria-hidden className={cn("size-2 rounded-full", DOT[dest ? zoneOfPlace(dest) : active])} />
            {destZone.when}
          </span>
        </p>
        <p className="text-small font-semibold text-hub-ink sm:mt-1 sm:text-body">
          {!dest ? "Đang chuẩn bị chuyến hàng" : phase === "drive" ? `Đang chở hàng tới ${dest}` : `Đã tới ${dest}`}
        </p>
        <div className="mt-2 flex items-center gap-3 sm:mt-2.5">
          <span className="relative h-1.5 flex-1 overflow-hidden rounded-full bg-hub-stone">
            <span ref={barRef} className="absolute inset-0 origin-left rounded-full bg-hub-blue" style={{ transform: "scaleX(0)" }} />
          </span>
          <span className="shrink-0 text-caption tabular-nums text-hub-ink-soft">
            <span ref={kmRef}>0</span> / {destKm} km
          </span>
        </div>
      </div>
    </div>
  </div>
  );
}
