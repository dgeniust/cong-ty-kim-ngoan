"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

/**
 * Splash nhẹ khi CHUYỂN GIỮA CÁC KHU: landing tổng ↔ phân bón ↔ lốp xe ↔ sắt thép.
 * - Trong cùng một khu không hiện (trang đã gần như tức thì nhờ prefetch, có skeleton riêng).
 * - Hiện ngay khi bấm link / nút quay lại, tắt khi trang mới đã có, tối thiểu ~0.55s để không “nháy”.
 * - prefers-reduced-motion: chỉ mờ chuyển, không chuyển động.
 */
export type SplashSection = "hub" | "phanbon" | "lopxe" | "satthep";
export type SplashBrand = { prefix: string; name: string; sections: Record<SplashSection, { title: string; tagline: string }> };

const MIN_MS = 550;
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
      className={cn("splash fixed inset-0 z-[100] grid place-items-center", T.bg)}
    >
      <span className="sr-only">Đang mở {info.title}…</span>
      <div aria-hidden className="flex flex-col items-center px-6 text-center">
        <div className="splash-rise">{T.mark}</div>
        <p className={cn("splash-rise mt-6 logo-prefix", T.muted)} style={{ animationDelay: "80ms" }}>
          {brand.prefix} {brand.name}
        </p>
        <p className={cn("splash-rise mt-2 text-h3 font-semibold", T.fg)} style={{ animationDelay: "120ms" }}>
          {info.title}
        </p>
        <p className={cn("splash-rise mt-1.5 max-w-xs text-small", T.muted)} style={{ animationDelay: "160ms" }}>
          {info.tagline}
        </p>
        <span className={cn("mt-7 block h-[3px] w-40 overflow-hidden rounded-full", T.track)}>
          <span className={cn("splash-bar block h-full w-full rounded-full", T.bar)} />
        </span>
      </div>
    </div>
  );
}

/* ---------- 4 dấu hiệu chuyển động, vẽ bằng SVG/CSS (không tải ảnh) ---------- */

const HubMarkAnimated = (
  <svg viewBox="0 0 48 48" className="size-20">
    <rect width="48" height="48" rx="12" fill="#000" />
    <path d="M14 12v24M14 24l12-12M14 24l12 12" stroke="#fff" strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round" fill="none" strokeDasharray="60" style={{ ["--len" as string]: 60, animation: "splash-draw 380ms 40ms cubic-bezier(.6,0,.2,1) both" }} />
    {(["#2e9e4f", "#ff6b1a", "#a1a1aa"] as const).map((c, i) => (
      <circle key={c} cx="34" cy={14 + i * 10} r="4" fill={c} style={{ transformBox: "fill-box", transformOrigin: "center", animation: `splash-pop 300ms ${240 + i * 70}ms cubic-bezier(.34,1.56,.64,1) both` }} />
    ))}
  </svg>
);

const SproutAnimated = (
  <svg viewBox="0 0 64 64" className="size-20" fill="none">
    <circle cx="32" cy="32" r="31" fill="#f6e27a" opacity="0.12" />
    <path d="M14 50h36" stroke="#c7e1ae" strokeWidth="3" strokeLinecap="round" opacity="0.6" />
    <path d="M32 50V28" stroke="#c7e1ae" strokeWidth="3.5" strokeLinecap="round" style={{ transformBox: "fill-box", transformOrigin: "bottom", animation: "splash-grow 300ms 40ms cubic-bezier(.2,.8,.2,1) both" }} />
    <path d="M32 34c0-8 6-13 15-13 0 9-6 14-15 13Z" fill="#6db33f" style={{ transformBox: "fill-box", transformOrigin: "0% 100%", animation: "splash-leaf 320ms 220ms cubic-bezier(.34,1.56,.64,1) both" }} />
    <path d="M32 38c0-7-5-11-12-11 0 7 5 11 12 11Z" fill="#a3cd82" style={{ transformBox: "fill-box", transformOrigin: "100% 100%", animation: "splash-leaf 320ms 300ms cubic-bezier(.34,1.56,.64,1) both" }} />
  </svg>
);

const TyreAnimated = (
  <div className="relative">
    <svg viewBox="0 0 64 64" className="size-20" style={{ animation: "splash-spin 900ms linear infinite" }}>
      <circle cx="32" cy="32" r="29" fill="#1a1a1a" stroke="#2a2a2a" strokeWidth="2" />
      {Array.from({ length: 16 }, (_, i) => (
        <rect key={i} x="30.5" y="2" width="3" height="7" rx="1" fill="#3a3a3a" transform={`rotate(${i * 22.5} 32 32)`} />
      ))}
      <circle cx="32" cy="32" r="15" fill="none" stroke="#a1a1aa" strokeWidth="3" />
      {Array.from({ length: 5 }, (_, i) => (
        <path key={i} d="M32 32V18" stroke="#d4d4d8" strokeWidth="3" strokeLinecap="round" transform={`rotate(${i * 72} 32 32)`} />
      ))}
      <circle cx="32" cy="32" r="3.5" fill="#ff6b1a" />
    </svg>
    {/* vệt đường chạy */}
    <svg viewBox="0 0 120 6" className="absolute -bottom-3 left-1/2 w-28 -translate-x-1/2 overflow-hidden">
      <g style={{ animation: "splash-road 300ms linear infinite" }}>
        {Array.from({ length: 8 }, (_, i) => (
          <rect key={i} x={i * 24} y="2" width="12" height="2" rx="1" fill="#ff6b1a" opacity="0.6" />
        ))}
      </g>
    </svg>
  </div>
);

const BeamsAnimated = (
  <svg viewBox="0 0 64 64" className="size-20">
    <rect x="1" y="1" width="62" height="62" rx="12" fill="#fff" stroke="rgb(0 0 0 / 0.08)" />
    {[0, 1, 2].map((i) => (
      <g key={i} style={{ animation: `splash-slide 320ms ${40 + i * 80}ms cubic-bezier(.2,.8,.2,1) both` }}>
        <rect x="12" y={16 + i * 12} width="40" height="3" rx="1" fill="#111" />
        <rect x="12" y={22 + i * 12} width="40" height="3" rx="1" fill="#111" />
        <rect x="30.5" y={18 + i * 12} width="3" height="5" fill="#52525b" />
      </g>
    ))}
  </svg>
);

const THEME: Record<SplashSection, { bg: string; fg: string; muted: string; track: string; bar: string; mark: React.ReactNode }> = {
  hub: { bg: "bg-hub-canvas", fg: "text-hub-ink", muted: "text-hub-ink-soft", track: "bg-hub-ink/10", bar: "bg-hub-blue", mark: HubMarkAnimated },
  phanbon: { bg: "bg-brand-900", fg: "text-white", muted: "text-brand-200", track: "bg-white/15", bar: "bg-sun-300", mark: SproutAnimated },
  lopxe: { bg: "bg-lopxe-ink", fg: "text-white", muted: "text-white/60", track: "bg-white/10", bar: "bg-lopxe-orange", mark: TyreAnimated },
  satthep: { bg: "bg-satthep-soft", fg: "text-satthep-ink", muted: "text-black/60", track: "bg-black/10", bar: "bg-satthep-ink", mark: BeamsAnimated },
};
