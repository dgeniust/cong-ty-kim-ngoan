"use client";

import { useEffect, useRef } from "react";

/**
 * Số đếm tăng dần khi cuộn tới. HTML gốc luôn chứa giá trị thật (tốt cho SEO / không JS).
 * Cập nhật thẳng vào DOM trong rAF – không setState mỗi khung hình (tránh render lại React ~60 lần/giây).
 */
export function CountUp({ value, suffix = "" }: { value: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let raf = 0;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        io.disconnect();
        const start = performance.now();
        const duration = 1100;
        const tick = (now: number) => {
          const p = Math.min((now - start) / duration, 1);
          el.textContent = `${Math.round(value * (1 - Math.pow(1 - p, 3)))}${suffix}`;
          if (p < 1) raf = requestAnimationFrame(tick);
        };
        raf = requestAnimationFrame(tick);
      },
      { threshold: 0.6 },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [value, suffix]);

  return (
    <span ref={ref} className="tabular-nums">
      {value}
      {suffix}
    </span>
  );
}
