"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { ProductArt } from "@/components/nganh/product-art";
import type { ArtKind } from "@/lib/data/types";
import { cn } from "@/lib/utils";

export type HubSlide = {
  id: string;
  label: string;
  title: string;
  description: string;
  href: string;
  image?: string;
  art?: ArtKind;
  /** Lớp nền + màu chữ của slide (mỗi ngành một sắc thái riêng). */
  tone: "green" | "dark" | "steel";
};

const INTERVAL = 5000; // phác thảo của khách: 5 giây chuyển 1 hình

const TONES = {
  green: { panel: "bg-brand-900 text-white", chip: "bg-sun-300 text-brand-950", bar: "bg-sun-300" },
  dark: { panel: "bg-[#0b0b0c] text-white", chip: "bg-sector-lopxe text-black", bar: "bg-sector-lopxe" },
  steel: { panel: "bg-[#dcdcd9] text-[#0f0f10]", chip: "bg-[#0f0f10] text-white", bar: "bg-[#0f0f10]" },
} as const;

export function HeroSlideshow({ slides }: { slides: HubSlide[] }) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const reduced = useRef(false);

  useEffect(() => {
    reduced.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }, []);

  const go = useCallback((i: number) => setIndex((i + slides.length) % slides.length), [slides.length]);

  useEffect(() => {
    if (paused || reduced.current || slides.length < 2) return;
    const t = setTimeout(() => go(index + 1), INTERVAL);
    return () => clearTimeout(t);
  }, [index, paused, go, slides.length]);

  return (
    <div
      role="region"
      aria-roledescription="carousel"
      aria-label="Các lĩnh vực của Kim Ngoan"
      className="relative h-full min-h-[440px] overflow-hidden rounded-[2rem] lg:min-h-[560px]"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={() => setPaused(false)}
    >
      {slides.map((s, i) => {
        const active = i === index;
        const tone = TONES[s.tone];
        return (
          <div
            key={s.id}
            role="group"
            aria-roledescription="slide"
            aria-label={`${i + 1} / ${slides.length}: ${s.label}`}
            aria-hidden={!active}
            inert={!active}
            className={cn("absolute inset-0 transition-[opacity,transform] duration-[900ms] ease-soft", tone.panel, active ? "opacity-100" : "pointer-events-none scale-[1.03] opacity-0")}
          >
            {s.image && (
              <>
                <Image src={s.image} alt="" fill priority={i === 0} sizes="(min-width: 1024px) 58vw, 100vw" className={cn("object-cover transition-transform duration-[6000ms] ease-out", active ? "scale-105" : "scale-100")} />
                <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-brand-950/90 via-brand-950/35 to-transparent" />
              </>
            )}
            {s.art && (
              <ProductArt
                kind={s.art}
                className={cn("absolute -right-[8%] top-[4%] !size-[78%] transition-transform duration-[1400ms] ease-soft md:!size-[70%]", active ? "translate-x-0 rotate-0" : "translate-x-10 rotate-12")}
              />
            )}
            <div className="absolute inset-x-0 bottom-0 p-7 pb-20 md:p-10 md:pb-24">
              <span className={cn("inline-block rounded-full px-3.5 py-1.5 text-xs font-semibold tracking-wide", tone.chip)}>{s.label}</span>
              <p className={cn("mt-4 max-w-md text-4xl font-bold leading-[1.05] tracking-tight transition-[opacity,transform] delay-150 duration-700 ease-soft md:text-5xl", active ? "translate-y-0 opacity-100" : "translate-y-5 opacity-0")}>
                {s.title}
              </p>
              <p className={cn("mt-3 max-w-md text-[15px] leading-relaxed opacity-80 transition-[opacity,transform] delay-200 duration-700 ease-soft", active ? "translate-y-0" : "translate-y-5 !opacity-0")}>{s.description}</p>
              <Link href={s.href} className="group mt-5 inline-flex items-center gap-2 text-[15px] font-semibold underline decoration-2 underline-offset-[6px]">
                Vào chuyên trang <ArrowRight className="size-4 transition-transform duration-300 ease-soft group-hover:translate-x-1.5" aria-hidden />
              </Link>
            </div>
          </div>
        );
      })}

      {/* Chấm điều hướng kèm thanh tiến trình 5 giây */}
      <div className="absolute inset-x-0 bottom-0 flex items-center gap-2 p-7 md:p-10">
        {slides.map((s, i) => (
          <button
            key={s.id}
            type="button"
            aria-label={`Xem ${s.label}`}
            aria-current={i === index ? "true" : undefined}
            onClick={() => go(i)}
            className="group relative h-8 flex-1 max-w-24"
          >
            <span className={cn("absolute inset-x-0 top-1/2 h-1 -translate-y-1/2 overflow-hidden rounded-full", slides[index].tone === "steel" ? "bg-black/15" : "bg-white/25")}>
              {i === index && (
                <span
                  key={`${index}-${paused}`}
                  className={cn("block h-full origin-left rounded-full", TONES[slides[index].tone].bar, paused ? "" : "animate-progress")}
                  style={{ animationDuration: `${INTERVAL}ms` }}
                />
              )}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
