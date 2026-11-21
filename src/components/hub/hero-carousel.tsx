"use client";

import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ChevronLeft, ChevronRight, Pause, Phone, Play } from "lucide-react";
import { cn } from "@/lib/utils";

export type HeroSlide = {
  id: string;
  /** tên ngành (nút chuyển ảnh, nhãn) */
  label: string;
  /** câu ngắn cho ngành này, hiện dưới tiêu đề chính */
  text: string;
  href: string;
  cta: string;
  phone: string;
  phoneHref: string;
  image: string;
  alt: string;
  /** vị trí khung ảnh – chủ thể ảnh nằm lệch phải */
  focus?: string;
};

const AUTOPLAY = 6000;

/**
 * Hero tràn viền: ảnh nền đổi qua 3 ngành mỗi 6 giây.
 * - Ảnh phủ toàn chiều ngang, lớp phủ màu giấy đậm dần sang trái để chữ luôn dễ đọc.
 * - Điều hướng: nút trước/sau, 3 nút ngành (kiêm chấm phân trang + thanh thời gian), phím ←/→, vuốt trên điện thoại.
 * - Tự chuyển 6s bằng setTimeout có tính "thời gian còn lại": dừng khi rê chuột vào phần chữ/nút hoặc focus,
 *   tiếp tục đúng chỗ dừng (thanh thời gian CSS dừng cùng lúc nên luôn khớp). Bấm chuyển tay thì đếm lại từ đầu.
 * - Có nút tạm dừng; "giảm chuyển động" thì không tự chuyển, không phóng ảnh.
 */
export function HeroCarousel({ slides, eyebrow, title, slogan }: { slides: HeroSlide[]; eyebrow: ReactNode; title: ReactNode; slogan: string }) {
  const n = slides.length;
  const [index, setIndex] = useState(0);
  const [hold, setHold] = useState(false);
  const [paused, setPaused] = useState(false);
  const [reduced, setReduced] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [cycle, setCycle] = useState(0); // đổi key thanh thời gian khi chuyển slide
  const remaining = useRef(AUTOPLAY);
  const cycleRef = useRef(0); // tăng mỗi lần chuyển slide – để biết bộ hẹn giờ cũ có còn "đúng lượt" không
  const touchX = useRef<number | null>(null);

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

  const go = useCallback(
    (i: number) => {
      remaining.current = AUTOPLAY;
      cycleRef.current += 1;
      setIndex(((i % n) + n) % n);
      setCycle(cycleRef.current);
    },
    [n]
  );
  const next = useCallback(() => go(index + 1), [go, index]);
  const prev = useCallback(() => go(index - 1), [go, index]);

  const autoplay = !paused && !reduced;
  const running = autoplay && !hold && !hidden;

  // hẹn giờ chuyển slide, giữ phần thời gian còn lại khi tạm dừng
  useEffect(() => {
    if (!running) return;
    const start = performance.now();
    const lap = cycleRef.current;
    const t = setTimeout(next, remaining.current);
    return () => {
      clearTimeout(t);
      // chỉ trừ thời gian đã chạy nếu vẫn là slide này (tạm dừng); đã chuyển slide thì go() đặt lại 6s rồi
      if (cycleRef.current === lap) remaining.current = Math.max(0, remaining.current - (performance.now() - start));
    };
  }, [running, next, cycle]);

  const togglePause = () => {
    if (paused) {
      remaining.current = AUTOPLAY;
      cycleRef.current += 1;
      setCycle(cycleRef.current);
    }
    setPaused(!paused);
  };

  const holdProps = {
    onMouseEnter: () => setHold(true),
    onMouseLeave: () => setHold(false),
    onFocus: () => setHold(true),
    onBlur: (e: React.FocusEvent<HTMLElement>) => {
      if (!e.currentTarget.contains(e.relatedTarget as Node)) setHold(false);
    },
  };

  const cur = slides[index];

  return (
    <section
      id="top"
      aria-labelledby="hero-title"
      aria-roledescription="trình chiếu"
      className="relative isolate w-full overflow-hidden bg-hub-stone"
      onTouchStart={(e) => (touchX.current = e.touches[0].clientX)}
      onTouchEnd={(e) => {
        if (touchX.current === null) return;
        const dx = e.changedTouches[0].clientX - touchX.current;
        touchX.current = null;
        if (Math.abs(dx) > 50) (dx < 0 ? next : prev)();
      }}
    >
      {/* ảnh nền */}
      <div className="absolute inset-0 -z-10">
        {slides.map((s, i) => {
          const on = i === index;
          return (
            <div key={s.id} aria-hidden={!on} className={cn("absolute inset-0 transition-opacity duration-[1100ms] ease-soft", on ? "opacity-100" : "opacity-0")}>
              <Image
                src={s.image}
                alt={s.alt}
                fill
                sizes="100vw"
                {...(i === 0 ? { preload: true } : { loading: "lazy" as const })}
                className={cn("object-cover transition-transform ease-out motion-reduce:transition-none", on && autoplay ? "scale-100 duration-[7000ms]" : "scale-[1.05] duration-[1100ms]")}
                style={{ objectPosition: s.focus ?? "70% 50%" }}
              />
            </div>
          );
        })}
        {/* lớp phủ: đậm bên trái (chữ), trong dần sang phải (ảnh); trên điện thoại phủ đều hơn */}
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(246,245,244,0)_0%,rgba(246,245,244,0.15)_26%,rgba(246,245,244,0.88)_46%,rgba(246,245,244,0.97)_100%)] md:bg-[linear-gradient(90deg,rgba(246,245,244,0.97)_0%,rgba(246,245,244,0.9)_30%,rgba(246,245,244,0.45)_55%,rgba(246,245,244,0)_74%)]" />
        <div className="absolute inset-x-0 bottom-0 h-32 bg-[linear-gradient(0deg,rgba(246,245,244,1)_0%,rgba(246,245,244,0)_100%)]" />
      </div>

      <div className="mx-auto flex min-h-[clamp(640px,88vh,820px)] w-full max-w-[1320px] flex-col justify-center px-4 pb-32 pt-[56vw] sm:px-6 sm:pt-56 md:pt-16 lg:px-10">
        <div className="max-w-[600px]" {...holdProps}>
          {eyebrow}
          <h1 id="hero-title" className="mt-5 text-[clamp(2.5rem,4.6vw,4rem)] font-semibold leading-[1.06] tracking-[-0.03em] text-hub-ink">
            {title}
          </h1>

          {/* nội dung theo ngành: các khối chồng cùng một ô lưới → chiều cao không nhảy khi đổi */}
          <div className="mt-6 grid">
            {slides.map((s, i) => {
              const on = i === index;
              return (
                <div key={s.id} aria-hidden={!on} inert={!on} className={cn("col-start-1 row-start-1 transition-[opacity,transform] duration-500 ease-soft", on ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-2 opacity-0")}>
                  <p className="inline-flex items-center gap-2 rounded-full bg-hub-paper/90 px-3 py-1.5 text-caption font-semibold text-hub-blue shadow-sm">
                    <span aria-hidden className="size-1.5 rounded-full bg-current" /> {s.label}
                  </p>
                  <p className="mt-4 max-w-[34rem] text-lead leading-relaxed text-hub-ink-soft">{s.text}</p>
                  <div className="mt-7 flex flex-wrap gap-3">
                    <Link href={s.href} className="group inline-flex min-h-12 items-center gap-2 rounded-xl bg-hub-blue px-5 font-medium text-white shadow-sm transition-colors hover:bg-hub-blue-hover">
                      {s.cta} <ArrowRight className="size-4 transition-transform duration-200 group-hover:translate-x-0.5" aria-hidden />
                    </Link>
                    <a href={s.phoneHref} className="inline-flex min-h-12 items-center gap-2 rounded-xl bg-hub-paper px-5 font-medium text-hub-ink shadow-sm transition-colors hover:bg-hub-blue-tint">
                      <Phone className="size-4 text-hub-blue" aria-hidden /> <span className="tabular-nums">{s.phone}</span>
                    </a>
                  </div>
                </div>
              );
            })}
          </div>

          <p className="mt-7 font-script text-[1.75rem] leading-none text-hub-blue sm:text-[2.1rem]">{slogan}</p>
        </div>

        {/* điều hướng */}
        <div
          className="mt-10 flex flex-wrap items-center gap-3"
          {...holdProps}
          onKeyDown={(e) => {
            if (e.key === "ArrowRight") {
              e.preventDefault();
              next();
            } else if (e.key === "ArrowLeft") {
              e.preventDefault();
              prev();
            }
          }}
        >
          <div className="flex items-center gap-1 rounded-full bg-hub-paper/90 p-1 shadow-sm backdrop-blur">
            <button type="button" onClick={prev} aria-label="Ảnh trước" className="grid size-10 place-items-center rounded-full text-hub-ink transition-colors hover:bg-hub-canvas">
              <ChevronLeft className="size-5" aria-hidden />
            </button>
            <button type="button" onClick={next} aria-label="Ảnh sau" className="grid size-10 place-items-center rounded-full text-hub-ink transition-colors hover:bg-hub-canvas">
              <ChevronRight className="size-5" aria-hidden />
            </button>
            {!reduced && (
              <button type="button" onClick={togglePause} aria-label={paused ? "Tiếp tục tự chuyển ảnh" : "Tạm dừng tự chuyển ảnh"} className="grid size-10 place-items-center rounded-full text-hub-ink transition-colors hover:bg-hub-canvas">
                {paused ? <Play className="size-4" aria-hidden /> : <Pause className="size-4" aria-hidden />}
              </button>
            )}
          </div>

          <div className="flex items-center gap-2" role="group" aria-label="Chọn ngành">
            {slides.map((s, i) => {
              const on = i === index;
              return (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => go(i)}
                  aria-current={on}
                  aria-label={`${s.label} (${i + 1}/${n})`}
                  className={cn(
                    "group relative flex h-12 items-center overflow-hidden rounded-full px-1 transition-[background-color,width] duration-300 sm:h-11 sm:px-4",
                    on ? "bg-hub-paper shadow-sm" : "hover:bg-hub-paper/70"
                  )}
                >
                  {/* chấm (điện thoại) */}
                  <span aria-hidden className={cn("block h-2 rounded-full transition-all duration-300 sm:hidden", on ? "w-7 bg-hub-blue" : "w-2 bg-hub-ink/30")} />
                  {/* nhãn + thanh thời gian (từ sm) */}
                  <span className={cn("hidden text-small font-semibold sm:inline", on ? "text-hub-ink" : "text-hub-ink-soft group-hover:text-hub-ink")}>{s.label}</span>
                  {on && (
                    <span aria-hidden className="absolute inset-x-4 bottom-1.5 hidden h-[2px] overflow-hidden rounded-full bg-hub-ink/10 sm:block">
                      <span
                        key={cycle}
                        className={cn("absolute inset-0 origin-left rounded-full bg-hub-blue", autoplay ? "animate-[kn-hero-progress_linear_forwards]" : "scale-x-100")}
                        style={{ animationDuration: `${AUTOPLAY}ms`, animationPlayState: running ? "running" : "paused" }}
                      />
                    </span>
                  )}
                </button>
              );
            })}
          </div>
          <p className="sr-only" aria-live={autoplay ? "off" : "polite"}>
            Đang xem: {cur.label}
          </p>
        </div>
      </div>
    </section>
  );
}
