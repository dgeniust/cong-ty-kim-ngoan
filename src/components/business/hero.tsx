"use client";

import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import Image from "next/image";
import { Pause, Play } from "lucide-react";
import type { HeroSlide, Stat } from "@/lib/hub/home";
import { cn } from "@/lib/utils";
import { BIZ_WRAP } from "./ui";

const AUTOPLAY = 6000;

/**
 * Hero tràn viền: ảnh nền toàn cảnh (3 ngành, đổi mỗi 6s), lớp scrim trắng mượt từ trái sang phải
 * giữ chữ bên trái đạt tương phản cao mà ảnh bên phải vẫn sắc nét. Đáy hero là thanh chỉ số neo đáy.
 * Hẹn giờ giữ "thời gian còn lại" khi tạm dừng (rê chuột vào nội dung/nút, focus, tab ẩn, nút tạm dừng).
 */
export function BizHero({ slides, stats, children }: { slides: HeroSlide[]; stats: Stat[]; children: ReactNode }) {
  const n = slides.length;
  const [index, setIndex] = useState(0);
  const [hold, setHold] = useState(false);
  const [paused, setPaused] = useState(false);
  const [reduced, setReduced] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [lap, setLap] = useState(0); // đổi mỗi lần chuyển slide → khởi động lại thanh thời gian
  const lapRef = useRef(0);
  const remaining = useRef(AUTOPLAY);

  useEffect(() => {
    const mq = matchMedia("(prefers-reduced-motion: reduce)");
    const syncMotion = () => setReduced(mq.matches);
    const syncVisibility = () => setHidden(document.hidden);
    syncMotion();
    mq.addEventListener("change", syncMotion);
    document.addEventListener("visibilitychange", syncVisibility);
    return () => {
      mq.removeEventListener("change", syncMotion);
      document.removeEventListener("visibilitychange", syncVisibility);
    };
  }, []);

  const restartLap = () => {
    remaining.current = AUTOPLAY;
    lapRef.current += 1;
    setLap(lapRef.current);
  };
  const go = useCallback(
    (i: number) => {
      restartLap();
      setIndex(((i % n) + n) % n);
    },
    [n],
  );

  const autoplay = !paused && !reduced;
  const running = autoplay && !hold && !hidden;

  useEffect(() => {
    if (!running) return;
    const start = performance.now();
    const myLap = lapRef.current;
    const timer = setTimeout(() => go(index + 1), remaining.current);
    return () => {
      clearTimeout(timer);
      // còn đúng lượt (chỉ tạm dừng) thì trừ phần đã chạy; đã chuyển slide thì go() đặt lại 6s rồi
      if (lapRef.current === myLap) remaining.current = Math.max(0, remaining.current - (performance.now() - start));
    };
  }, [running, go, index, lap]);

  const togglePause = () => {
    if (paused) restartLap();
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

  return (
    <section id="top" aria-labelledby="hero-title" className="relative isolate -mt-16 flex flex-col overflow-hidden bg-white md:min-h-[max(660px,92svh)] md:bg-hub-stone lg:-mt-[76px] lg:min-h-[max(680px,90vh)]">
      {/* ảnh nền (điện thoại: ảnh nằm trên, chữ bên dưới trên nền trắng) */}
      <div className="relative -z-10 h-[46svh] min-h-[280px] md:absolute md:inset-0 md:h-auto">
        {slides.map((s, i) => {
          const on = i === index;
          return (
            <div key={s.id} aria-hidden={!on} className={cn("absolute inset-0 transition-opacity duration-[1200ms] ease-soft", on ? "opacity-100" : "opacity-0")}>
              <Image
                src={s.image}
                alt={s.alt}
                fill
                sizes="100vw"
                {...(i === 0 ? { preload: true } : { loading: "lazy" as const })}
                className={cn("object-cover transition-transform ease-out motion-reduce:transition-none", on && autoplay ? "scale-100 duration-[7000ms]" : "scale-[1.04] duration-[1200ms]")}
                style={{ objectPosition: s.focus }}
              />
            </div>
          );
        })}
        {/* scrim: điện thoại chỉ làm mờ mép dưới để ảnh liền với nền trắng; từ md phủ trái → phải theo đặc tả */}
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.6)_0%,rgba(255,255,255,0)_22%,rgba(255,255,255,0)_70%,rgba(255,255,255,1)_100%)] md:bg-[linear-gradient(90deg,rgba(255,255,255,0.96)_0%,rgba(255,255,255,0.85)_45%,rgba(255,255,255,0)_100%)]" />
        {/* dải sáng phía trên để menu trong suốt luôn đọc được */}
        <div className="absolute inset-x-0 top-0 hidden h-40 bg-[linear-gradient(180deg,rgba(255,255,255,0.75),rgba(255,255,255,0))] md:block" />
      </div>

      {/* nội dung */}
      <div className={cn(BIZ_WRAP, "flex flex-1 flex-col pb-8 pt-4 md:justify-center md:pb-14 md:pt-32")}>
        <div className="max-w-[620px]" {...holdProps}>
          {children}
        </div>

        {/* chọn ảnh */}
        <div className="mt-10 flex items-center gap-1 md:mt-14" role="group" aria-label="Chọn ảnh ngành hàng" {...holdProps}>
          {slides.map((s, i) => {
            const on = i === index;
            return (
              <button key={s.id} type="button" onClick={() => go(i)} aria-current={on} aria-label={`0${i + 1} ${s.label}`} className="group flex min-h-11 w-16 flex-col justify-center gap-2 pr-3 text-left sm:w-36">
                <span className="relative block h-[2px] overflow-hidden bg-hub-ink/15">
                  {on && (
                    <span
                      key={lap}
                      aria-hidden
                      className={cn("absolute inset-0 origin-left bg-hub-blue", autoplay ? "animate-[biz-progress_linear_forwards]" : "")}
                      style={{ animationDuration: `${AUTOPLAY}ms`, animationPlayState: running ? "running" : "paused" }}
                    />
                  )}
                </span>
                <span className={cn("text-[12px] font-semibold tabular-nums tracking-[0.08em] transition-colors", on ? "text-hub-ink" : "text-hub-ink-soft group-hover:text-hub-ink")}>
                  0{i + 1}
                  <span className="ml-2 hidden font-medium tracking-normal sm:inline">{s.label}</span>
                </span>
              </button>
            );
          })}
          {!reduced && (
            <button type="button" onClick={togglePause} aria-label={paused ? "Tiếp tục tự chuyển ảnh" : "Tạm dừng tự chuyển ảnh"} className="ml-1 grid size-11 place-items-center rounded-full text-hub-ink-soft transition-colors hover:bg-hub-ink/5 hover:text-hub-ink">
              {paused ? <Play className="size-4" aria-hidden /> : <Pause className="size-4" aria-hidden />}
            </button>
          )}
        </div>
      </div>

      {/* thanh chỉ số neo đáy */}
      <div className="border-t border-hub-ink/10 bg-white md:bg-white/80 md:backdrop-blur-md">
        <dl className={cn(BIZ_WRAP, "grid grid-cols-2 lg:grid-cols-4")}>
          {stats.map((s, i) => (
            <div key={s.label} className={cn("py-5 lg:py-6", i % 2 === 1 && "pl-5 lg:pl-0", i > 0 && "lg:border-l lg:border-hub-ink/10 lg:pl-8", i > 1 && "border-t border-hub-ink/10 lg:border-t-0")}>
              <dt className="sr-only">{s.label}</dt>
              <dd className="text-[clamp(1.5rem,2.4vw,2rem)] font-bold leading-none tracking-[-0.02em] tabular-nums text-hub-ink">{s.value}</dd>
              <dd className="mt-1.5 text-small text-hub-ink-soft">{s.label}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
