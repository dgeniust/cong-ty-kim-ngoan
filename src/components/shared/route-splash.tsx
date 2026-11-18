"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";

/**
 * Splash nhẹ khi CHUYỂN GIỮA CÁC KHU: landing tổng ↔ phân bón ↔ lốp xe ↔ sắt thép.
 * - Trong cùng một khu không hiện (trang đã gần như tức thì nhờ prefetch, có skeleton riêng).
 * - Hiện ngay khi bấm link / nút quay lại, tắt khi trang mới đã có, tối thiểu ~0.55s để không “nháy”.
 * - prefers-reduced-motion: chỉ mờ chuyển, không chuyển động.
 */
export type SplashSection = "hub" | "phanbon" | "lopxe" | "satthep";
export type SplashBrand = { prefix: string; name: string; sections: Record<SplashSection, { title: string; tagline: string }> };

const MIN_MS = 1050; // đủ để chạy trọn chuyển động logo (~0.9s)
const MAX_MS = 6000;
const OUT_MS = 260;

export function sectionOf(pathname: string): SplashSection | "admin" | null {
  const seg = pathname.split("/")[1] ?? "";
  if (seg === "admin" || seg === "api" || seg === "uploads") return "admin";
  if (seg === "phanbon" || seg === "lopxe" || seg === "satthep") return seg;
  if (seg === "" || seg === "tin-tuc") return "hub";
  return null;
}

export function RouteSplash({ brand }: { brand: SplashBrand }) {
  const pathname = usePathname();
  const [target, setTarget] = useState<SplashSection | null>(null);
  const [leaving, setLeaving] = useState(false);
  const started = useRef(0);
  const timers = useRef<number[]>([]);
  const current = useRef(sectionOf(pathname));

  const clear = () => {
    timers.current.forEach((t) => window.clearTimeout(t));
    timers.current = [];
  };
  const hide = useCallback((delay: number) => {
    clear();
    timers.current.push(
      window.setTimeout(() => {
        setLeaving(true);
        timers.current.push(
          window.setTimeout(() => {
            setTarget(null);
            setLeaving(false);
          }, OUT_MS),
        );
      }, delay),
    );
  }, []);
  const show = useCallback(
    (to: SplashSection) => {
      clear();
      started.current = performance.now();
      setLeaving(false);
      setTarget(to);
      timers.current.push(window.setTimeout(() => hide(0), MAX_MS)); // an toàn: không bao giờ kẹt
    },
    [hide],
  );

  // Bắt click vào link nội bộ dẫn sang khu khác (pha capture: trước khi Next xử lý)
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const a = (e.target as Element | null)?.closest?.("a[href]") as HTMLAnchorElement | null;
      if (!a || (a.target && a.target !== "_self") || a.hasAttribute("download")) return;
      const url = new URL(a.href, location.href);
      if (url.origin !== location.origin || url.pathname === location.pathname) return;
      const from = sectionOf(location.pathname);
      const to = sectionOf(url.pathname);
      if (!to || to === "admin" || from === "admin" || to === from) return;
      show(to);
    };
    const onPop = () => {
      const to = sectionOf(location.pathname);
      if (to && to !== "admin" && current.current !== "admin" && to !== current.current) show(to);
    };
    document.addEventListener("click", onClick, true);
    window.addEventListener("popstate", onPop);
    return () => {
      document.removeEventListener("click", onClick, true);
      window.removeEventListener("popstate", onPop);
    };
  }, [show]);

  // Trang mới đã hiển thị → tắt splash (giữ tối thiểu MIN_MS cho mượt)
  useEffect(() => {
    current.current = sectionOf(pathname);
    if (!target || current.current !== target) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const elapsed = performance.now() - started.current;
    hide(reduce ? 0 : Math.max(0, MIN_MS - elapsed));
  }, [pathname, target, hide]);

  useEffect(() => clear, []);

  if (!target) return null;
  const info = brand.sections[target];
  const T = THEME[target];
  return (
    <div
      role="status"
      aria-live="polite"
      data-state={leaving ? "out" : "in"}
      className="splash fixed inset-0 z-[100] grid place-items-center"
      style={{ background: T.bg }}
    >
      <span className="sr-only">Đang mở {info.title}…</span>
      <div aria-hidden className="flex flex-col items-center px-6">
        <Wordmark color={T.ink} />
        {target !== "hub" && (
          <span className="splash-tag mt-7 inline-flex h-8 items-center rounded-full px-3.5 text-caption font-semibold" style={{ background: T.tagBg, color: T.tagFg }}>
            {info.title}
          </span>
        )}
      </div>
    </div>
  );
}

/* =====================================================================
 * Logo chữ “kim ngoan” – nét đơn, đầu tròn (theo video tham khảo):
 *  1. Cận cảnh: nét bút vẽ liền một hơi cụm “ng” (n → vòng nối → bầu g → móc đuôi)
 *  2. Camera lùi ra; m-i-k bật vào từ trái, o-a-n từ phải, so le từ giữa ra ngoài
 *  3. Tag tên ngành hiện dưới logo
 * Toạ độ: đường cơ sở y=100, chiều cao chữ x = 100, nét 24.
 * ===================================================================== */
const STROKE = 24;
type Glyph = { x: number; d: string; dot?: [number, number]; side: "l" | "r"; order: number };
const GLYPHS: Glyph[] = [
  { x: 0, d: "M12,-55 V100 M62,2 L12,64 M32,42 L64,100", side: "l", order: 2 }, // k
  { x: 96, d: "M12,0 V100", dot: [12, -42], side: "l", order: 1 }, // i
  { x: 138, d: "M12,100 V44 Q12,0 50,0 Q88,0 88,44 V100 M88,44 Q88,0 126,0 Q164,0 164,44 V100", side: "l", order: 0 }, // m
  { x: 608, d: "M112,50 A50,50 0 1 1 12,50 A50,50 0 1 1 112,50", side: "r", order: 0 }, // o
  { x: 750, d: "M112,50 A50,50 0 1 1 12,50 A50,50 0 1 1 112,50 M112,0 V100", side: "r", order: 1 }, // a
  { x: 892, d: "M12,100 V44 Q12,0 52,0 Q92,0 92,44 V100", side: "r", order: 2 }, // n
];
// “ng” vẽ liền: thân n → vòm → chân phải → nối vòng lên bầu g → đi trọn vòng → thân g → móc đuôi
const NG =
  "M12,100 V44 Q12,0 52,0 Q92,0 92,44 V80 Q92,102 106,102 Q120,102 120,82 V50 A50,50 0 0 1 170,0 A50,50 0 0 1 220,50 A50,50 0 0 1 170,100 A50,50 0 0 1 120,50 A50,50 0 0 1 170,0 A50,50 0 0 1 220,50 V125 Q220,170 176,170 Q142,170 126,152";
const NG_X = 362;

function Wordmark({ color }: { color: string }) {
  return (
    // khung zoom: bắt đầu phóng to quanh cụm “ng”, rồi lùi về kích thước thật
    <div className="splash-zoom w-[min(520px,78vw)]" style={{ transformOrigin: "48% 47%" }}>
      <svg viewBox="-4 -72 1004 258" className="block w-full overflow-visible" fill="none" stroke={color} strokeWidth={STROKE} strokeLinecap="round" strokeLinejoin="round">
        <path d={NG} transform={`translate(${NG_X} 0)`} pathLength={1} className="splash-draw" />
        {GLYPHS.map((g, i) => (
          <g key={i} transform={`translate(${g.x} 0)`}>
            <g className={g.side === "l" ? "splash-letter-l" : "splash-letter-r"} style={{ animationDelay: `${430 + g.order * 55}ms` }}>
              <path d={g.d} />
              {g.dot && <circle cx={g.dot[0]} cy={g.dot[1]} r={14} fill={color} stroke="none" />}
            </g>
          </g>
        ))}
      </svg>
    </div>
  );
}

const THEME: Record<SplashSection, { bg: string; ink: string; tagBg: string; tagFg: string }> = {
  hub: { bg: "#f6f5f4", ink: "#111111", tagBg: "#111111", tagFg: "#ffffff" },
  phanbon: { bg: "#f4f7f1", ink: "#1c5424", tagBg: "#1c5424", tagFg: "#f6e27a" },
  lopxe: { bg: "#0a0a0a", ink: "#ff6b1a", tagBg: "#ff6b1a", tagFg: "#0a0a0a" },
  satthep: { bg: "#f1f1f2", ink: "#3f3f46", tagBg: "#111111", tagFg: "#ffffff" },
};
