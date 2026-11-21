"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Pause, Play } from "lucide-react";
import { cn } from "@/lib/utils";

export type HeroSlide = {
  id: string;
  /** tên ngành ngắn trên thẻ chọn */
  label: string;
  /** dòng mô tả ngắn dưới tên ngành (thẻ chọn) */
  hint: string;
  /** chú thích trên ảnh */
  title: string;
  href: string;
  cta: string;
  image: string;
  alt: string;
  /** vị trí lấy khung ảnh (object-position) – chủ thể ảnh nằm lệch phải */
  focus?: string;
};

const INTERVAL = 6000;

/**
 * Ảnh hero đổi qua 3 ngành mỗi 6 giây.
 * - Đồng hồ là chính thanh tiến trình CSS: hết 6s (animationend) → sang ảnh kế. Rê chuột / focus vào
 *   khối thì thanh dừng (animation-play-state) nên không lệch thời gian, không cần setInterval.
 * - Ảnh chuyển bằng opacity + phóng nhẹ (transform) → chạy trên GPU, mượt cả trên máy yếu.
 * - Có nút tạm dừng (WCAG 2.2.2); bật "giảm chuyển động" thì không tự chuyển.
 */
export function HeroSlides({ slides }: { slides: HeroSlide[] }) {
  const [index, setIndex] = useState(0);
  const [hold, setHold] = useState(false); // rê chuột / focus
  const [paused, setPaused] = useState(false); // người dùng bấm tạm dừng
  const [reduced, setReduced] = useState(false);
  const [hidden, setHidden] = useState(false); // tab bị ẩn
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mq = matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReduced(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    const vis = () => setHidden(document.hidden);
    document.addEventListener("visibilitychange", vis);
    return () => {
      mq.removeEventListener("change", sync);
      document.removeEventListener("visibilitychange", vis);
    };
  }, []);

  const next = useCallback(() => setIndex((i) => (i + 1) % slides.length), [slides.length]);
  const stopped = paused || reduced;
  const running = !stopped && !hold && !hidden;
  const cur = slides[index];

  return (
    <div
      ref={rootRef}
      className="flex flex-col gap-4"
      onMouseEnter={() => setHold(true)}
      onMouseLeave={() => setHold(false)}
      onFocus={() => setHold(true)}
      onBlur={(e) => {
        if (!rootRef.current?.contains(e.relatedTarget as Node)) setHold(false);
      }}
    >
      {/* khung ảnh */}
      <div className="relative aspect-[5/4] w-full overflow-hidden rounded-[22px] bg-hub-stone sm:aspect-[16/11] lg:aspect-[5/4]" aria-roledescription="trình chiếu" aria-label="Ba ngành hàng của Kim Ngoan">
        {slides.map((s, i) => {
          const on = i === index;
          return (
            <div
              key={s.id}
              id={`hero-slide-${s.id}`}
              role="group"
              aria-roledescription="trang chiếu"
              aria-label={`${i + 1} / ${slides.length}: ${s.label}`}
              aria-hidden={!on}
              className={cn("absolute inset-0 transition-opacity duration-[900ms] ease-soft", on ? "z-10 opacity-100" : "z-0 opacity-0")}
            >
              <Image
                src={s.image}
                alt={s.alt}
                fill
                sizes="(min-width: 1024px) 52vw, 100vw"
                loading={i === 0 ? "eager" : "lazy"}
                fetchPriority={i === 0 ? "high" : "auto"}
                className={cn("object-cover transition-transform ease-out motion-reduce:transition-none", on && !stopped ? "scale-100 duration-[7000ms]" : "scale-[1.06] duration-[900ms]")}
                style={{ objectPosition: s.focus ?? "50% 50%" }}
              />
            </div>
          );
        })}

        {/* chú thích ảnh */}
        <div className="absolute inset-x-3 bottom-3 z-20 sm:inset-x-auto sm:bottom-5 sm:left-5 sm:max-w-[360px]">
          <div key={cur.id} className="kn-pop rounded-2xl bg-hub-paper/95 p-4 shadow-[var(--shadow-hub-ui)] backdrop-blur-sm sm:p-5">
            <p className="text-caption font-medium text-hub-blue">{cur.label}</p>
            <p className="mt-1 text-title font-semibold leading-snug text-hub-ink">{cur.title}</p>
            <Link href={cur.href} tabIndex={-1} className="group mt-3 inline-flex items-center gap-1.5 text-small font-medium text-hub-ink hover:text-hub-blue">
              {cur.cta} <ArrowRight className="size-4 transition-transform duration-200 group-hover:translate-x-0.5" aria-hidden />
            </Link>
          </div>
        </div>

        {/* tạm dừng */}
        {!reduced && (
          <button
            type="button"
            onClick={() => setPaused((p) => !p)}
            aria-label={paused ? "Tiếp tục tự chuyển ảnh" : "Tạm dừng tự chuyển ảnh"}
            className="absolute right-3 top-3 z-20 grid size-10 place-items-center rounded-full bg-hub-paper/90 text-hub-ink backdrop-blur-sm transition-colors hover:bg-hub-paper sm:right-4 sm:top-4"
          >
            {paused ? <Play className="size-4" aria-hidden /> : <Pause className="size-4" aria-hidden />}
          </button>
        )}
      </div>

      {/* chọn ngành + thanh thời gian */}
      <div className="grid grid-cols-3 gap-2 sm:gap-3" role="tablist" aria-label="Chọn ngành hàng">
        {slides.map((s, i) => {
          const on = i === index;
          return (
            <button
              key={s.id}
              type="button"
              role="tab"
              aria-selected={on}
              aria-controls={`hero-slide-${s.id}`}
              onClick={() => setIndex(i)}
              className={cn("group rounded-xl px-3 pb-3 pt-2.5 text-left transition-colors duration-200 sm:px-4", on ? "bg-hub-paper" : "hover:bg-hub-paper/60")}
            >
              <span className="relative block h-[3px] overflow-hidden rounded-full bg-hub-ink/10">
                {on && (
                  <span
                    key={`${s.id}-${stopped ? "s" : "r"}`}
                    className={cn("absolute inset-0 origin-left rounded-full bg-hub-blue", stopped ? "scale-x-100" : "animate-[kn-hero-progress_linear_forwards]")}
                    style={{ animationDuration: `${INTERVAL}ms`, animationPlayState: running ? "running" : "paused" }}
                    onAnimationEnd={next}
                  />
                )}
              </span>
              <span className={cn("mt-2.5 block text-small font-semibold sm:text-body", on ? "text-hub-ink" : "text-hub-ink-soft group-hover:text-hub-ink")}>{s.label}</span>
              <span className="mt-0.5 hidden text-caption text-hub-ink-soft sm:block">{s.hint}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
