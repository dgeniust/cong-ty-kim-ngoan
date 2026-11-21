"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

/**
 * Nền chung “vườn xanh” của landing tổng (ảnh dựng bằng tools/garden-bg/gen.py, design.md §6).
 *
 * - Một lớp dính (sticky) cao đúng 1 màn hình, nằm sau toàn bộ các khối từ Giới thiệu → Liên hệ:
 *   nền đứng yên, nội dung trôi qua → cảm giác một bức nền liền mạch, không bị cắt theo từng khối.
 * - Lớp ánh sáng (nắng sớm, bokeh, cỏ mờ) dùng chung; điện thoại dùng ảnh dọc riêng, lá chỉ ở góc.
 * - Khung lá bám mép trái/phải (từ lg; dưới lg dùng ảnh dọc có lá ở góc): 3 biến thể, đổi nhẹ (mờ dần + trôi 12px) khi cuộn sang khối
 *   có `data-garden` khác. Mép trái và phải luôn dùng hai biến thể khác nhau để bố cục không đối xứng cứng.
 * - Vị trí khung tự lùi ra ngoài khi lề trang hẹp để lá nét không đè lên chữ.
 */
const VARIANTS = [1, 2, 3] as const;
type Variant = (typeof VARIANTS)[number];
const pair = (v: Variant): Variant => ((v % 3) + 1) as Variant;

/** lề trong của nội dung = (100vw − 1280)/2 + 32px; phần lá nét chiếm ~23% chiều cao màn hình */
const EDGE = "clamp(-16.5vh, calc(max(0px, (100vw - 1280px) / 2) + 32px - 23vh), 0px)";

export function GardenBackdrop() {
  const ref = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState<Variant>(1);
  // biến thể 2, 3 chỉ tải khi người xem đã cuộn tới phần nền (không tranh băng thông với hero)
  const [warm, setWarm] = useState(false);

  useEffect(() => {
    const root = ref.current?.parentElement;
    if (!root) return;
    const sections = [...root.querySelectorAll<HTMLElement>("[data-garden]")];
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (!e.isIntersecting) continue;
          setWarm(true);
          const v = Number((e.target as HTMLElement).dataset.garden);
          if (v === 1 || v === 2 || v === 3) setActive(v);
        }
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );
    sections.forEach((s) => io.observe(s));
    return () => io.disconnect();
  }, []);

  return (
    <div ref={ref} aria-hidden className="pointer-events-none sticky top-0 -z-10 -mb-[100lvh] h-[100lvh] w-full overflow-hidden">
      <div className="garden-light absolute inset-0" />
      <div className="absolute inset-0 hidden lg:block">
        {VARIANTS.map((v) => {
          const on = v === active;
          if (v !== 1 && !warm) return null;
          return (
            <div
              key={v}
              className={cn(
                "absolute inset-0 transition-[opacity,translate] duration-[1400ms] ease-soft motion-reduce:transition-none",
                on ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0",
              )}
            >
              <Image
                src={`/garden/frame-l-${v}.webp`}
                alt=""
                width={600}
                height={1300}
                unoptimized
                loading="lazy"
                className="absolute inset-y-0 h-full w-auto max-w-none opacity-80 min-[1440px]:opacity-100"
                style={{ left: EDGE }}
              />
              <Image
                src={`/garden/frame-r-${pair(v)}.webp`}
                alt=""
                width={600}
                height={1300}
                unoptimized
                loading="lazy"
                className="absolute inset-y-0 h-full w-auto max-w-none opacity-80 min-[1440px]:opacity-100"
                style={{ right: EDGE }}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}
