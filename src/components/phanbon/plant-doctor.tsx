"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Camera, Check, Phone, Stethoscope } from "lucide-react";
import { SYMPTOMS, ZONES, type SymptomIcon, type ZoneId } from "@/lib/content/plant-doctor";
import { telHref } from "@/lib/verticals";
import { cn } from "@/lib/utils";

/* ---------------------------------------------------------------- hình minh hoạ từng triệu chứng */
const LEAF = "M32 5 C 53 15 57 41 32 59 C 7 41 11 15 32 5 Z";
const VEINS = "M32 9 V 56 M32 20 L 20 14 M32 20 L 44 14 M32 30 L 17 24 M32 30 L 47 24 M32 40 L 19 35 M32 40 L 45 35 M32 49 L 23 46 M32 49 L 41 46";

function Leaf({ fill = "#3e9b37", vein = "#2a6e26", veinW = 1.6, children, transform }: { fill?: string; vein?: string; veinW?: number; children?: React.ReactNode; transform?: string }) {
  return (
    <g transform={transform}>
      <path d={LEAF} fill={fill} />
      <path d={VEINS} stroke={vein} strokeWidth={veinW} fill="none" strokeLinecap="round" />
      {children}
    </g>
  );
}
const Fruit = ({ children, fill = "#6aa84f" }: { children?: React.ReactNode; fill?: string }) => (
  <g>
    <path d="M32 8 v8" stroke="#6b4a2f" strokeWidth="3" strokeLinecap="round" />
    <circle cx="32" cy="36" r="20" fill={fill} />
    <ellipse cx="25" cy="29" rx="5" ry="7" fill="#ffffff" opacity="0.25" />
    {children}
  </g>
);

export function SymptomArt({ kind, className }: { kind: SymptomIcon; className?: string }) {
  return (
    <svg viewBox="0 0 64 64" className={className} aria-hidden>
      {kind === "yellow" && <Leaf fill="#e3cf5a" vein="#c2ab3e" />}
      {kind === "scorch" && (
        <Leaf>
          <path d={LEAF} fill="none" stroke="#8a5a2b" strokeWidth="6" strokeLinejoin="round" />
          <path d="M32 5 C 40 9 45 14 48 20 L 32 12 Z" fill="#8a5a2b" />
        </Leaf>
      )}
      {kind === "interveinal" && <Leaf fill="#e8d96f" vein="#2e7d32" veinW={3.2} />}
      {kind === "young-interveinal" && (
        <>
          <path d="M32 62 V 40" stroke="#4a8f2e" strokeWidth="3" />
          <Leaf fill="#efe38c" vein="#3e9b37" veinW={2.6} transform="translate(9 0) scale(0.72)" />
        </>
      )}
      {kind === "purple" && (
        <Leaf fill="#2c5a33" vein="#1d3f22">
          <path d="M32 5 C 53 15 57 41 32 59 Z" fill="#7b3f7a" opacity="0.55" />
          <ellipse cx="20" cy="38" rx="7" ry="5" fill="#7b3f7a" opacity="0.5" />
        </Leaf>
      )}
      {kind === "small" && (
        <>
          <path d="M32 62 V 30" stroke="#4a8f2e" strokeWidth="3" />
          {[
            [-8, 22, -30],
            [8, 22, 30],
            [0, 14, 0],
            [-6, 30, -55],
            [6, 30, 55],
          ].map(([x, y, r], i) => (
            <Leaf key={i} fill="#8bbd4a" vein="#5c8a2e" transform={`translate(${32 + x - 7} ${y - 8}) rotate(${r} 7 9) scale(0.24)`} />
          ))}
        </>
      )}
      {kind === "deformed" && (
        <>
          <path d="M32 62 C 30 50, 36 42, 30 30" stroke="#4a8f2e" strokeWidth="3" fill="none" />
          <path d="M30 30 C 18 26 14 14 24 8 C 28 16 36 14 40 8 C 46 18 40 28 30 30 Z" fill="#9cbf4e" />
          <path d="M24 8 C 26 6 28 6 30 8" stroke="#6b3a1f" strokeWidth="3" strokeLinecap="round" />
          <path d="M38 9 l 2 -3" stroke="#6b3a1f" strokeWidth="3" strokeLinecap="round" />
        </>
      )}
      {kind === "holes" && (
        <Leaf>
          {[
            [24, 26, 4],
            [40, 34, 3.2],
            [28, 44, 3],
          ].map(([x, y, r], i) => (
            <circle key={i} cx={x} cy={y} r={r} fill="#f7f9f4" />
          ))}
          <ellipse cx="42" cy="18" rx="5" ry="3.4" fill="#3b2a1a" />
          <circle cx="47" cy="17" r="2.2" fill="#3b2a1a" />
        </Leaf>
      )}
      {kind === "drop" && (
        <>
          <path d="M14 10 Q 32 2 50 10" stroke="#6b4a2f" strokeWidth="3" fill="none" strokeLinecap="round" />
          <circle cx="22" cy="20" r="6" fill="#6aa84f" />
          <circle cx="40" cy="44" r="8" fill="#9bbf5a" />
          <path d="M40 30 v6 M36 33 l4 4 4 -4" stroke="#c0392b" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M8 60 H 56" stroke="#8a6a4a" strokeWidth="3" strokeLinecap="round" />
          <ellipse cx="48" cy="58" rx="5" ry="2.5" fill="#9bbf5a" />
        </>
      )}
      {kind === "crack" && (
        <Fruit>
          <path d="M28 20 l 6 8 -5 6 7 8 -4 8" stroke="#5a3a1f" strokeWidth="2.5" fill="none" strokeLinejoin="round" />
        </Fruit>
      )}
      {kind === "rot" && (
        <Fruit fill="#7fae4a">
          <circle cx="38" cy="40" r="7" fill="#2b2117" />
          <circle cx="26" cy="46" r="3.5" fill="#2b2117" />
          <circle cx="38" cy="40" r="10" fill="none" stroke="#e8e2d0" strokeWidth="1.5" strokeDasharray="2 2" />
        </Fruit>
      )}
      {(kind === "root-rot" || kind === "knots") && (
        <>
          <rect x="2" y="14" width="60" height="48" rx="6" fill="#7a5a3c" />
          <path d="M32 2 V 18" stroke="#6b4a2f" strokeWidth="6" />
          <g stroke={kind === "root-rot" ? "#1f1712" : "#efe3cf"} strokeWidth="3" fill="none" strokeLinecap="round">
            <path d="M32 18 C 32 30 30 40 32 56" />
            <path d="M32 26 C 24 30 18 34 12 44" />
            <path d="M32 30 C 40 34 46 38 52 48" />
          </g>
          {kind === "knots" &&
            [
              [31, 40],
              [20, 36],
              [44, 39],
              [32, 50],
            ].map(([x, y], i) => <circle key={i} cx={x} cy={y} r="3.4" fill="#e9d9b9" stroke="#b49a6d" />)}
          {kind === "root-rot" && <path d="M32 6 q -4 4 0 8" stroke="#f3e1a8" strokeWidth="2" fill="none" />}
        </>
      )}
      {kind === "hard-soil" && (
        <>
          <rect x="2" y="14" width="60" height="48" rx="6" fill="#9b7b55" />
          <path d="M8 26 l 10 6 8 -4 10 8 M40 22 l 6 10 -6 8 10 10 M12 46 l 10 -4 6 8" stroke="#5e4630" strokeWidth="2.2" fill="none" />
          <path d="M32 2 V 18" stroke="#6b4a2f" strokeWidth="6" />
          <path d="M32 18 v 10 M32 22 l -6 4" stroke="#efe3cf" strokeWidth="2.5" strokeLinecap="round" />
        </>
      )}
    </svg>
  );
}

/* ---------------------------------------------------------------- cây có 4 điểm bấm */
const SPOTS: Record<ZoneId, { x: string; y: string }> = {
  "la-non": { x: "60%", y: "11%" },
  "la-gia": { x: "26%", y: "48%" },
  trai: { x: "72%", y: "44%" },
  re: { x: "50%", y: "88%" },
};

function DoctorPlant({ zone }: { zone: ZoneId | null }) {
  const on = (z: ZoneId) => zone === null || zone === z;
  const fade = (z: ZoneId) => cn("transition-opacity duration-500", on(z) ? "opacity-100" : "opacity-30");
  return (
    <svg viewBox="0 0 400 520" className="size-full" aria-hidden>
      <rect width="400" height="400" fill="#eaf3df" />
      <rect y="400" width="400" height="120" fill="#7a5a3c" />
      <path d="M0 400 H 400" stroke="#4f3a26" strokeWidth="3" />
      {/* rễ */}
      <g className={fade("re")} stroke="#efe3cf" strokeLinecap="round" fill="none">
        <path d="M200 400 C 202 440, 196 470, 200 510" strokeWidth="7" />
        <path d="M200 420 C 170 430, 140 450, 115 485" strokeWidth="4" />
        <path d="M200 428 C 232 440, 262 455, 290 492" strokeWidth="4" />
        <path d="M200 450 C 180 470, 165 490, 160 515" strokeWidth="2.5" />
      </g>
      {/* thân, cành */}
      <g stroke="#6b4a2f" strokeLinecap="round" fill="none">
        <path d="M200 400 C 198 320, 205 200, 215 70" strokeWidth="12" />
        <path d="M203 300 C 160 280, 120 270, 85 250" strokeWidth="6" />
        <path d="M206 240 C 250 220, 290 215, 320 200" strokeWidth="6" />
        <path d="M209 170 C 180 150, 160 140, 135 120" strokeWidth="5" />
      </g>
      {/* lá già: to, xanh đậm, phía dưới */}
      <g className={fade("la-gia")}>
        {[
          [80, 245, -60],
          [110, 262, -100],
          [145, 280, -40],
          [60, 230, -80],
          [175, 305, -120],
          [125, 300, -150],
        ].map(([x, y, r], i) => (
          <g key={i} transform={`translate(${x - 24} ${y - 24}) rotate(${r} 24 24) scale(0.75)`}>
            <path d={LEAF} fill={i % 2 ? "#2e7d32" : "#22662a"} />
            <path d={VEINS} stroke="#18501d" strokeWidth="1.4" fill="none" />
          </g>
        ))}
      </g>
      {/* lá vừa */}
      <g>
        {[
          [255, 222, 40],
          [300, 205, 70],
          [160, 145, -50],
          [135, 118, -80],
          [240, 240, 120],
        ].map(([x, y, r], i) => (
          <g key={i} transform={`translate(${x - 20} ${y - 20}) rotate(${r} 20 20) scale(0.62)`}>
            <path d={LEAF} fill="#3e9b37" />
          </g>
        ))}
      </g>
      {/* lá non: nhỏ, xanh nhạt, ở ngọn */}
      <g className={fade("la-non")}>
        {[
          [215, 60, 0],
          [200, 75, -40],
          [232, 74, 40],
          [222, 92, 70],
          [205, 95, -70],
        ].map(([x, y, r], i) => (
          <g key={i} transform={`translate(${x - 12} ${y - 14}) rotate(${r} 12 14) scale(0.4)`}>
            <path d={LEAF} fill="#9fd36a" />
          </g>
        ))}
      </g>
      {/* hoa, trái */}
      <g className={fade("trai")}>
        {[
          [280, 235],
          [300, 228],
          [292, 252],
          [268, 250],
          [312, 245],
        ].map(([x, y], i) => (
          <circle key={i} cx={x} cy={y} r="9" fill={i % 2 ? "#d9482b" : "#b3261e"} />
        ))}
        {[
          [310, 192],
          [322, 198],
        ].map(([x, y], i) => (
          <circle key={`h${i}`} cx={x} cy={y} r="5" fill="#ffffff" stroke="#f6e27a" strokeWidth="2" />
        ))}
      </g>
    </svg>
  );
}

/**
 * “Bác sĩ cây trồng”: 1) chạm chỗ cây đang bị trên hình → 2) chọn triệu chứng giống nhất
 * → 3) nguyên nhân thường gặp, vì sao, việc nên làm, nhóm phân/thuốc, gửi ảnh cho kỹ thuật viên.
 */
export function PlantDoctor({ phone, zalo }: { phone: string; zalo: string }) {
  const [zone, setZone] = useState<ZoneId | null>(null);
  const [sid, setSid] = useState<string | null>(null);
  const result = useRef<HTMLDivElement>(null);
  const list = SYMPTOMS.filter((s) => s.zone === zone);
  const s = SYMPTOMS.find((x) => x.id === sid);
  const z = ZONES.find((x) => x.id === zone);

  const pickZone = (id: ZoneId) => {
    setZone(id);
    setSid(null);
  };
  const pickSymptom = (id: string) => {
    setSid(id);
    requestAnimationFrame(() => {
      const el = result.current;
      if (el && el.getBoundingClientRect().top > window.innerHeight * 0.8) el.scrollIntoView({ behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth", block: "center" });
    });
  };
  const step = s ? 3 : zone ? 2 : 1;

  return (
    <div className="grid gap-5 lg:grid-cols-12">
      {/* cây có điểm bấm */}
      <div className="relative overflow-hidden rounded-[28px] bg-[#eaf3df] ring-1 ring-brand-900/10 lg:sticky lg:top-24 lg:col-span-5 lg:self-start">
        <div className="relative mx-auto aspect-[400/520] max-h-[620px]">
          <DoctorPlant zone={zone} />
          {ZONES.map((zz) => {
            const on = zone === zz.id;
            return (
              <button
                key={zz.id}
                type="button"
                onClick={() => pickZone(zz.id)}
                aria-pressed={on}
                className="group absolute -translate-x-1/2 -translate-y-1/2"
                style={{ left: SPOTS[zz.id].x, top: SPOTS[zz.id].y }}
              >
                <span aria-hidden className={cn("absolute inset-0 m-auto size-12 rounded-full", on ? "bg-sun-300/50" : "animate-ping bg-white/60 motion-reduce:animate-none")} />
                <span className={cn("relative inline-flex h-10 items-center gap-1.5 whitespace-nowrap rounded-full px-3.5 text-small font-semibold shadow-lift transition-colors", on ? "bg-brand-900 text-white" : "bg-white text-brand-900 group-hover:bg-sun-300")}>
                  {on && <Check className="size-4 text-sun-300" strokeWidth={3} aria-hidden />}
                  {zz.label}
                </span>
              </button>
            );
          })}
        </div>
        <p className="absolute left-4 top-4 inline-flex items-center gap-2 rounded-full bg-white/90 px-3 py-1.5 text-caption font-semibold text-brand-900">
          <Stethoscope className="size-4 text-brand-600" aria-hidden /> Bước {step} / 3
        </p>
      </div>

      <div className="flex flex-col gap-4 lg:col-span-7">
        {/* bước 1–2 */}
        <div className="rounded-[28px] bg-white p-5 ring-1 ring-brand-900/10 sm:p-7">
          {!zone ? (
            <div>
              <p className="text-caption font-semibold text-brand-600">Bước 1</p>
              <h3 className="mt-1 text-h3 font-semibold text-brand-900">Cây đang bị ở đâu?</h3>
              <p className="mt-2 text-body text-ink-muted">Chạm vào chỗ có dấu hiệu lạ trên hình — hoặc chọn nhanh:</p>
              <div className="mt-5 grid gap-2 sm:grid-cols-2">
                {ZONES.map((zz) => (
                  <button key={zz.id} type="button" onClick={() => pickZone(zz.id)} className="flex items-center justify-between gap-3 rounded-2xl bg-surface px-4 py-3.5 text-left transition-colors hover:bg-brand-100">
                    <span>
                      <span className="block text-body font-semibold text-brand-900">{zz.label}</span>
                      <span className="block text-caption text-ink-muted">{zz.hint}</span>
                    </span>
                    <ArrowRight className="size-4 text-brand-600" aria-hidden />
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div>
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-caption font-semibold text-brand-600">Bước 2 · {z?.label}</p>
                  <h3 className="mt-1 text-h3 font-semibold text-brand-900">Dấu hiệu nào giống nhất?</h3>
                </div>
                <button type="button" onClick={() => {
                    setZone(null);
                    setSid(null);
                  }} className="inline-flex h-9 items-center gap-1.5 rounded-full px-3 text-small font-medium text-brand-800 ring-1 ring-brand-900/15 hover:bg-surface">
                  <ArrowLeft className="size-4" aria-hidden /> Chọn chỗ khác
                </button>
              </div>
              <ul role="radiogroup" aria-label="Triệu chứng" className="mt-5 grid gap-2.5 sm:grid-cols-2">
                {list.map((x) => {
                  const on = x.id === sid;
                  return (
                    <li key={x.id}>
                      <button
                        type="button"
                        role="radio"
                        aria-checked={on}
                        onClick={() => pickSymptom(x.id)}
                        className={cn("flex h-full w-full items-center gap-3.5 rounded-2xl p-3 text-left transition-colors", on ? "bg-brand-900 text-white" : "bg-surface text-brand-900 hover:bg-brand-100")}
                      >
                        <span className={cn("grid size-16 shrink-0 place-items-center rounded-xl", on ? "bg-white/10" : "bg-white")}>
                          <SymptomArt kind={x.icon} className="size-12" />
                        </span>
                        <span className="text-small font-semibold leading-snug">{x.title}</span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          )}
        </div>

        {/* bước 3: kết quả */}
        <div ref={result} aria-live="polite">
          {s && (
            <div key={s.id} className="kn-pop rounded-[28px] bg-brand-900 p-6 text-white sm:p-8">
              <div className="flex flex-wrap items-start gap-5">
                <span className="grid size-16 shrink-0 place-items-center rounded-2xl bg-white/10 sm:size-20">
                  <SymptomArt kind={s.icon} className="size-12 sm:size-14" />
                </span>
                <span className="ml-auto rounded-2xl bg-sun-300 px-4 py-2 text-h4 font-semibold tabular-nums text-brand-900 sm:order-last">{s.tag}</span>
                <div className="min-w-0 basis-full sm:basis-0 sm:flex-1">
                  <p className="text-caption font-semibold text-sun-300">Bước 3 · Nguyên nhân thường gặp</p>
                  <p className="mt-1 text-h3 font-semibold !text-white">{s.cause}</p>
                </div>
              </div>
              <p className="mt-5 text-body leading-relaxed text-white/80">{s.why}</p>
              <p className="mt-5 text-caption font-semibold uppercase tracking-[0.12em] text-white/50">Nên làm</p>
              <ul className="mt-2 space-y-2">
                {s.todo.map((t) => (
                  <li key={t} className="flex gap-2.5 text-body">
                    <Check className="mt-1 size-4 shrink-0 text-sun-300" strokeWidth={3} aria-hidden /> {t}
                  </li>
                ))}
              </ul>
              <div className="mt-6 flex flex-wrap gap-2">
                {s.links.map((l) => (
                  <Link key={l.label} href={l.href} className="group inline-flex h-10 items-center gap-1.5 rounded-full bg-white px-4 text-small font-semibold text-brand-900 hover:bg-sun-200">
                    {l.label} <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" aria-hidden />
                  </Link>
                ))}
                <a href={zalo} target="_blank" rel="noopener noreferrer" className="inline-flex h-10 items-center gap-1.5 rounded-full bg-sun-300 px-4 text-small font-semibold text-brand-900 hover:bg-sun-200">
                  <Camera className="size-4" aria-hidden /> Gửi ảnh lá qua Zalo
                </a>
                <a href={telHref(phone)} className="inline-flex h-10 items-center gap-1.5 rounded-full px-4 text-small font-semibold text-white ring-1 ring-white/25 hover:bg-white/10">
                  <Phone className="size-4" aria-hidden /> {phone}
                </a>
              </div>
              <p className="mt-6 border-t border-white/10 pt-4 text-caption leading-relaxed text-white/55">
                Đây là gợi ý theo dấu hiệu thường gặp, chưa phải chẩn đoán. Nhiều nguyên nhân cho triệu chứng giống nhau — gửi ảnh lá, trái, gốc cho kỹ thuật viên Kim Ngoan để được xác định đúng trước khi mua thuốc.
              </p>
            </div>
          )}
          {!s && zone && <p className="px-2 text-small text-ink-muted">Chọn một dấu hiệu để xem nguyên nhân và cách xử lý.</p>}
        </div>
      </div>
    </div>
  );
}
