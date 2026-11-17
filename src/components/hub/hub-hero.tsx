"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { ProductArt } from "@/components/nganh/product-art";
import type { ArtKind } from "@/lib/data/types";
import { cn } from "@/lib/utils";

export type HeroSlide = {
  id: "phanbon" | "lopxe" | "satthep";
  /** Dòng tiêu đề tương ứng với ngành (VD: "Phân bón cho vườn.") */
  line: string;
  label: string;
  tagline: string;
  href: string;
  url: string;
  image?: string;
  art?: ArtKind;
  spot?: { name: string; meta: string; href: string };
};

const INTERVAL = 5000; // phác thảo của khách: 5 giây chuyển 1 hình

/** Mỗi ngành một "tờ giấy" pastel riêng: phân bón = ảnh thật, lốp xe = vàng, sắt thép = lam. */
const STAGE = {
  phanbon: { panel: "bg-brand-900 text-white", dot: "bg-sector-phanbon", bar: "bg-white", track: "bg-white/35", chip: "bg-white/85 text-hub-ink" },
  lopxe: { panel: "bg-gradient-to-br from-hub-marigold to-[#ffd7a8] text-hub-ink", dot: "bg-sector-lopxe", bar: "bg-hub-ink", track: "bg-hub-ink/15", chip: "bg-white/80 text-hub-ink" },
  satthep: { panel: "bg-gradient-to-br from-hub-peri to-hub-sky-soft text-hub-ink", dot: "bg-sector-satthep", bar: "bg-hub-ink", track: "bg-hub-ink/15", chip: "bg-white/80 text-hub-ink" },
} as const;

/**
 * Hero landing tổng: tiêu đề 3 dòng ĐỒNG BỘ với slideshow 3 ngành bên phải.
 * Dòng của ngành đang hiện được tô đậm; rê chuột vào dòng nào thì slideshow nhảy sang ngành đó.
 * `children` là phần mô tả + nút (render ở server).
 */
export function HubHero({ eyebrow, slides, children }: { eyebrow: React.ReactNode; slides: HeroSlide[]; children: React.ReactNode }) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const reduced = useRef(false);

  useEffect(() => {
    reduced.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }, []);

  const go = useCallback((i: number) => setIndex((i + slides.length) % slides.length), [slides.length]);

  useEffect(() => {
    if (paused || reduced.current) return;
    const t = setTimeout(() => go(index + 1), INTERVAL);
    return () => clearTimeout(t);
  }, [index, paused, go]);

  const hold = { onMouseEnter: () => setPaused(true), onMouseLeave: () => setPaused(false), onFocusCapture: () => setPaused(true), onBlurCapture: () => setPaused(false) };
  const current = slides[index];

  return (
    <div className="grid items-center gap-10 lg:grid-cols-[1.05fr_1fr] lg:gap-16">
      <div>
        <div className="animate-rise">{eyebrow}</div>
        <h1 id="hero-title" className="mt-6 text-[clamp(2.1rem,3.7vw,3.4rem)] font-light leading-[1.12] tracking-[-0.02em]" {...hold}>
          {slides.map((s, i) => (
            <Link
              key={s.id}
              href={s.href}
              onMouseEnter={() => setIndex(i)}
              onFocus={() => setIndex(i)}
              style={{ animationDelay: `${80 + i * 90}ms` }}
              className={cn(
                "group animate-rise flex w-fit items-center gap-3 outline-none transition-colors duration-500 focus-visible:underline",
                i === index ? "text-hub-ink" : "text-hub-muted hover:text-hub-ink-soft",
              )}
            >
              <span
                aria-hidden
                className={cn("size-2.5 shrink-0 rounded-full transition-[transform,opacity] duration-500 ease-soft", STAGE[s.id].dot, i === index ? "scale-100 opacity-100" : "scale-0 opacity-0")}
              />
              <span className={cn("transition-transform duration-500 ease-soft xl:whitespace-nowrap", i === index ? "translate-x-0" : "-translate-x-[1.375rem]")}>{s.line}</span>
            </Link>
          ))}
        </h1>
        <div className="animate-rise" style={{ animationDelay: "380ms" }}>
          {children}
        </div>
      </div>

      {/* Slideshow 3 ngành */}
      <div className="animate-rise relative" style={{ animationDelay: "200ms" }}>
        {/* mảnh giấy cắt dán phía sau */}
        <div aria-hidden className="hub-torn absolute -right-4 -top-5 h-2/5 w-1/2 rotate-3 bg-hub-mint sm:-right-6 sm:-top-6" />
        <div aria-hidden className="hub-torn hub-dots absolute -bottom-6 -left-5 h-1/3 w-2/5 -rotate-3 bg-hub-marigold" />
        <div role="region" aria-roledescription="carousel" aria-label="Ba lĩnh vực của Kim Ngoan" className="relative aspect-[4/5] max-h-[640px] w-full overflow-hidden rounded-[28px] shadow-[var(--shadow-craft)] sm:aspect-[5/4] lg:aspect-[4/5]" {...hold}>
          {slides.map((s, i) => {
            const active = i === index;
            return (
              <div
                key={s.id}
                role="group"
                aria-roledescription="slide"
                aria-label={`${i + 1} / ${slides.length}: ${s.label}`}
                aria-hidden={!active}
                inert={!active}
                className={cn("absolute inset-0 transition-opacity duration-700 ease-soft", STAGE[s.id].panel, active ? "opacity-100" : "pointer-events-none opacity-0")}
              >
                {s.image ? (
                  <>
                    <Image src={s.image} alt="" fill priority={i === 0} sizes="(min-width: 1024px) 48vw, 100vw" className={cn("object-cover transition-transform duration-[7000ms] ease-out", active ? "scale-110" : "scale-100")} />
                    <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-black/25" />
                  </>
                ) : (
                  <>
                    <div aria-hidden className="hub-dots absolute inset-0 opacity-70" />
                    <div aria-hidden className={cn("absolute left-1/2 top-[40%] size-[62%] -translate-x-1/2 -translate-y-1/2 rounded-full blur-[60px]", s.id === "lopxe" ? "bg-[#ffb36b]/70" : "bg-white/70")} />
                    {s.art && (
                      <div className={cn("absolute inset-x-0 top-[6%] mx-auto size-[72%] transition-[transform,opacity] duration-1000 ease-soft", active ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0")}>
                        <ProductArt kind={s.art} className="animate-float" />
                      </div>
                    )}
                  </>
                )}

                <p className={cn("absolute left-6 top-6 inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 text-[13px] backdrop-blur-md", STAGE[s.id].chip)}>
                  <span aria-hidden className={cn("size-2 rounded-full", STAGE[s.id].dot)} /> {s.url}
                </p>

                <div className="absolute inset-x-0 bottom-0 p-6 pb-16 sm:p-8 sm:pb-[4.5rem]">
                  <p className="text-sm opacity-80">{s.label}</p>
                  <p className={cn("mt-1 text-[clamp(1.75rem,3vw,2.5rem)] font-light leading-[1.1] tracking-[-0.02em] transition-[transform,opacity] delay-100 duration-700 ease-soft", active ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0")}>
                    {s.tagline}
                  </p>
                  <Link href={s.href} className={cn("group mt-5 inline-flex h-11 items-center gap-2 rounded-full px-5 text-sm font-medium shadow-[var(--shadow-craft)]", s.image ? "bg-white text-hub-ink" : "bg-hub-ink text-white")}>
                    Vào chuyên trang <ArrowRight className="size-4 transition-transform duration-300 ease-soft group-hover:translate-x-1" aria-hidden />
                  </Link>
                </div>
              </div>
            );
          })}

          {/* thanh tiến trình 5 giây / chấm chuyển slide */}
          <div className="absolute inset-x-6 bottom-6 flex gap-2 sm:inset-x-8">
            {slides.map((s, i) => (
              <button key={s.id} type="button" aria-label={`Xem ${s.label}`} aria-current={i === index ? "true" : undefined} onClick={() => go(i)} className="group relative h-6 flex-1">
                <span className={cn("absolute inset-x-0 top-1/2 h-[3px] -translate-y-1/2 overflow-hidden rounded-full transition-[height] group-hover:h-[5px]", STAGE[current.id].track)}>
                  {i < index && <span className={cn("block h-full", STAGE[current.id].bar)} />}
                  {i === index && (
                    <span
                      key={`${index}-${paused}`}
                      className={cn("block h-full origin-left", STAGE[current.id].bar, !paused && "animate-progress")}
                      style={{ animationDuration: `${INTERVAL}ms` }}
                    />
                  )}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* thẻ sản phẩm bán chạy của ngành đang hiện – nổi lệch mép trái */}
        {current.spot && (
          <Link
            key={current.id}
            href={current.spot.href}
            className="group animate-rise absolute -left-8 top-[18%] hidden w-60 -rotate-2 items-center gap-3 rounded-[20px] bg-hub-paper p-4 shadow-[var(--shadow-craft)] transition-transform duration-300 ease-soft hover:-translate-y-1 hover:rotate-0 xl:flex"
          >
            <span>
              <span className="inline-block rounded-full bg-hub-mint-soft px-2 py-0.5 text-[12px] text-hub-graphite">Bán chạy · {current.label}</span>
              <span className="mt-1.5 block text-[15px] font-medium leading-snug text-hub-ink">{current.spot.name}</span>
              <span className="mt-0.5 block text-[13px] tabular-nums text-hub-ink-soft">{current.spot.meta}</span>
            </span>
            <span className="ml-auto grid size-9 shrink-0 place-items-center rounded-full bg-hub-marigold text-hub-ink transition-transform duration-300 group-hover:rotate-45">
              <ArrowUpRight className="size-4" aria-hidden />
            </span>
          </Link>
        )}
      </div>
    </div>
  );
}
