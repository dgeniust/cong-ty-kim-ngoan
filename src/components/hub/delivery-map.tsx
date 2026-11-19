"use client";

import { useState } from "react";
import { PLACES, ZONES } from "@/lib/content/hub-extras";
import { cn } from "@/lib/utils";

const C = 300; // tâm sơ đồ (cửa hàng)
/** Thang không tuyến tính để vòng trong (dày địa danh) đủ rộng: 0–20 km → 0–115px, 20–50 → 115–205, 50–90 → 205–280. */
const STOPS: [number, number][] = [[0, 0], [20, 115], [50, 205], [90, 280]];
function radius(km: number) {
  for (let i = 1; i < STOPS.length; i++) {
    const [k0, r0] = STOPS[i - 1];
    const [k1, r1] = STOPS[i];
    if (km <= k1 || i === STOPS.length - 1) return r0 + ((Math.min(km, k1) - k0) / (k1 - k0)) * (r1 - r0);
  }
  return 0;
}
const RING_FILL = ["fill-hub-marigold-soft", "fill-hub-sky-soft", "fill-hub-stone/60"];
const DOT = ["bg-hub-marigold", "bg-hub-sky", "bg-hub-muted"];

function point(bearing: number, km: number) {
  const r = radius(km);
  const a = (bearing * Math.PI) / 180;
  // làm tròn 0,1 để server và trình duyệt ra cùng chuỗi số (sin/cos có thể lệch ở chữ số cuối)
  return { x: Math.round((C + r * Math.sin(a)) * 10) / 10, y: Math.round((C - r * Math.cos(a)) * 10) / 10 };
}
const at = (name: string) => {
  const p = PLACES.find((x) => x.name === name)!;
  return point(p.bearing, p.km);
};
const line = (names: string[]) => names.map((n) => (n === "*" ? { x: C, y: C } : at(n))).map((p, i) => `${i ? "L" : "M"}${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(" ");

/**
 * Sơ đồ vùng giao hàng: 3 vòng đồng tâm quanh cửa hàng ở Chơn Thành, các địa danh lân cận và 2 trục QL13, QL14.
 * Là sơ đồ minh hoạ (khoảng cách gần đúng), không phải bản đồ thật – bản đồ thật nằm ở khối Liên hệ.
 */
export function DeliveryMap({ storeLabel }: { storeLabel: string }) {
  const [active, setActive] = useState(0);
  const zone = ZONES[active];

  return (
    <div className="grid gap-4 lg:grid-cols-[1fr_1.15fr] lg:items-stretch">
      <ol className="flex flex-col gap-2">
        {ZONES.map((z, i) => {
          const on = i === active;
          return (
            <li key={z.id}>
              <button
                type="button"
                onMouseEnter={() => setActive(i)}
                onFocus={() => setActive(i)}
                onClick={() => setActive(i)}
                aria-pressed={on}
                className={cn("w-full rounded-xl border p-5 text-left transition-colors duration-200 sm:p-6", on ? "border-hub-ink/25 bg-hub-paper" : "border-hub-line bg-hub-paper/50 hover:bg-hub-paper")}
              >
                <span className="flex items-center justify-between gap-4">
                  <span className="inline-flex items-center gap-2.5 text-caption text-hub-ink-soft">
                    <span aria-hidden className={cn("size-2.5 rounded-full", DOT[i])} /> {z.label} · dưới {z.radiusKm} km
                  </span>
                </span>
                <span className="mt-2 block text-h4 font-semibold text-hub-ink">{z.when}</span>
                <span className="mt-1.5 block text-body text-hub-ink-soft">{z.places}</span>
                <span className={cn("grid transition-[grid-template-rows,opacity] duration-300 ease-soft", on ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0")}>
                  <span className="min-h-0 overflow-hidden">
                    <span className="mt-3 block border-t border-hub-line pt-3 text-small text-hub-ink">{z.note}</span>
                  </span>
                </span>
              </button>
            </li>
          );
        })}
      </ol>

      <figure className="relative overflow-hidden rounded-xl border border-hub-line bg-hub-paper p-3 sm:p-5">
        <svg viewBox="0 0 600 600" className="mx-auto block aspect-square w-full max-w-[560px]" role="img" aria-label={`Sơ đồ vùng giao hàng quanh ${storeLabel}. ${zone.when}: ${zone.places}.`}>
          {[...ZONES].reverse().map((z) => {
            const i = ZONES.indexOf(z);
            return (
              <circle
                key={z.id}
                cx={C}
                cy={C}
                r={radius(z.radiusKm)}
                className={cn(RING_FILL[i], "transition-[stroke-width,opacity] duration-300")}
                stroke="var(--color-hub-ink)"
                strokeOpacity={i === active ? 0.55 : 0.12}
                strokeWidth={i === active ? 2 : 1}
                strokeDasharray={i === active ? "6 6" : undefined}
                opacity={i <= active || i === 2 ? 1 : 0.65}
              />
            );
          })}
          {/* nhãn vòng */}
          {/* nhãn vòng: đặt ở góc Tây Bắc (không có địa danh), ngay ngoài mép vòng */}
          {ZONES.map((z, i) => {
            const p = point(315, z.radiusKm);
            return (
              <text key={z.id} x={p.x + 2} y={p.y - 6} textAnchor="end" className={cn("fill-hub-ink text-[16px] transition-opacity duration-300", i === active ? "font-semibold opacity-100" : "opacity-50")}>
                {z.when}
              </text>
            );
          })}
          {/* quốc lộ */}
          <g fill="none" stroke="var(--color-hub-ink)" strokeOpacity="0.3" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
            <path d={line(["Lộc Ninh", "Bình Long", "Hớn Quản", "*", "Bàu Bàng", "Bến Cát", "TP.HCM"])} />
            <path d={line(["*", "Đồng Xoài", "Bù Đăng"])} />
          </g>
          {(() => {
            const a = point(352, 40);
            const b = point(72, 42);
            return (
              <g className="fill-hub-ink-soft text-[13px] font-semibold" style={{ letterSpacing: "0.06em" }}>
                <text x={a.x - 10} y={a.y} textAnchor="end">QL13</text>
                <text x={b.x} y={b.y - 12} textAnchor="middle">QL14</text>
              </g>
            );
          })()}
          {/* địa danh */}
          {PLACES.map((p) => {
            const { x, y } = point(p.bearing, p.km);
            const on = ZONES[active].id === p.zone;
            const right = x >= C - 4 && x < 500; // sát mép phải thì đặt chữ bên trái điểm
            return (
              <g key={p.name} className="transition-opacity duration-300" opacity={on ? 1 : 0.55}>
                <circle cx={x} cy={y} r={on ? 6 : 4.5} className="fill-hub-ink" stroke="#fff" strokeWidth="2" />
                <text x={right ? x + 11 : x - 11} y={y + 5} textAnchor={right ? "start" : "end"} className={cn("fill-hub-ink text-[17px]", on && "font-semibold")} paintOrder="stroke" stroke="#fff" strokeWidth="4" strokeLinejoin="round">
                  {p.name}
                </text>
              </g>
            );
          })}
          {/* cửa hàng */}
          <g>
            <circle cx={C} cy={C} r="22" className="fill-hub-blue motion-reduce:hidden" opacity="0.18">
              <animate attributeName="r" values="14;30;14" dur="2.6s" repeatCount="indefinite" />
              <animate attributeName="opacity" values="0.35;0;0.35" dur="2.6s" repeatCount="indefinite" />
            </circle>
            <circle cx={C} cy={C} r="11" className="fill-hub-blue" stroke="#fff" strokeWidth="3" />
            <text x={C - 18} y={C + 5} textAnchor="end" className="fill-hub-ink text-[17px] font-semibold" paintOrder="stroke" stroke="#fff" strokeWidth="4" strokeLinejoin="round">
              Kim Ngoan
            </text>
          </g>
        </svg>
        <figcaption className="mt-2 text-center text-caption text-hub-ink-soft">Sơ đồ minh hoạ, khoảng cách gần đúng tính từ cửa hàng ở {storeLabel}.</figcaption>
      </figure>
    </div>
  );
}
