"use client";

import { useId, useLayoutEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Phone } from "lucide-react";
import type { Spotlight } from "@/lib/hub/home";
import { cn } from "@/lib/utils";
import { SlideArrow, bizButton } from "./ui";

/** Màu nhận diện ngành: gạch chân tab + chấm. */
const ACCENT: Record<string, { bar: string; dot: string }> = {
  phanbon: { bar: "bg-biz-moss", dot: "bg-biz-moss" },
  lopxe: { bar: "bg-biz-graphite", dot: "bg-biz-graphite" },
  satthep: { bar: "bg-biz-copper", dot: "bg-biz-copper" },
};

/**
 * Không gian trưng bày từng ngành: 3 tab lớn (gạch chân trượt theo tab đang chọn),
 * bên dưới là danh sách dòng sản phẩm tiêu biểu + ảnh thật cỡ lớn. Bàn phím: ←/→ giữa các tab.
 */
export function SpotlightTabs({ items }: { items: Spotlight[] }) {
  const uid = useId();
  const [active, setActive] = useState(0);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const [bar, setBar] = useState({ x: 0, w: 0 });
  const cur = items[active];

  // đặt gạch chân dưới tab đang chọn (đo lại khi đổi cỡ màn hình)
  useLayoutEffect(() => {
    const measure = () => {
      const el = tabRefs.current[active];
      // gạch chân chỉ dài bằng phần chữ (trừ khoảng đệm bên phải)
      if (el) setBar({ x: el.offsetLeft, w: el.offsetWidth - parseFloat(getComputedStyle(el).paddingRight) });
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [active]);

  const select = (i: number, focus = false) => {
    setActive(i);
    if (focus) tabRefs.current[i]?.focus();
  };

  return (
    <div>
      <div
        role="tablist"
        aria-label="Ngành hàng"
        className="relative flex overflow-x-auto border-b border-hub-ink/10 [scrollbar-width:none]"
        onKeyDown={(e) => {
          if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
          e.preventDefault();
          select((active + (e.key === "ArrowRight" ? 1 : -1) + items.length) % items.length, true);
        }}
      >
        {items.map((s, i) => {
          const on = i === active;
          return (
            <button
              key={s.id}
              ref={(el) => {
                tabRefs.current[i] = el;
              }}
              id={`${uid}-tab-${s.id}`}
              type="button"
              role="tab"
              aria-selected={on}
              aria-controls={`${uid}-panel`}
              tabIndex={on ? 0 : -1}
              onClick={() => select(i)}
              className={cn("flex shrink-0 items-baseline gap-1.5 py-5 pr-6 text-left transition-colors duration-200 sm:gap-2 sm:pr-14", on ? "text-hub-ink" : "text-hub-ink/40 hover:text-hub-ink/70")}
            >
              <span className="text-small font-semibold tabular-nums">0{i + 1}.</span>
              <span className="text-[clamp(1.25rem,2.4vw,1.75rem)] font-bold tracking-[-0.02em]">{s.short}</span>
            </button>
          );
        })}
        <span aria-hidden className={cn("absolute -bottom-px left-0 h-[3px] transition-[transform,width,background-color] duration-500 ease-soft", ACCENT[cur.id].bar)} style={{ width: bar.w, transform: `translateX(${bar.x}px)` }} />
      </div>

      <div id={`${uid}-panel`} role="tabpanel" aria-labelledby={`${uid}-tab-${cur.id}`} className="mt-10 md:mt-14">
        <div key={cur.id} className="grid animate-[biz-panel_500ms_var(--ease-soft)_both] gap-10 lg:grid-cols-12 lg:gap-14">
          <div className="flex flex-col lg:col-span-5">
            <p className="inline-flex items-center gap-2 text-[12px] font-semibold uppercase tracking-[0.14em] text-hub-ink-soft">
              <span aria-hidden className={cn("size-1.5 rounded-full", ACCENT[cur.id].dot)} /> {cur.name}
            </p>
            <h3 className="mt-4 text-[clamp(1.5rem,2.4vw,2rem)] font-bold leading-tight tracking-[-0.02em] text-hub-ink">{cur.title}</h3>
            <p className="mt-4 text-body leading-relaxed text-hub-ink-soft">{cur.text}</p>

            <ul className="mt-8 border-t border-hub-ink/10">
              {cur.lines.map((line) => (
                <li key={line.href}>
                  <Link href={line.href} className="group flex items-center gap-4 border-b border-hub-ink/10 py-3.5">
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-body font-semibold text-hub-ink transition-colors group-hover:text-hub-blue">{line.name}</span>
                      <span className="mt-0.5 block truncate text-small text-hub-ink-soft">
                        {line.group}
                        {line.spec && <span className="tabular-nums"> · {line.spec}</span>}
                      </span>
                    </span>
                    <ArrowUpRight className="size-4 shrink-0 text-hub-ink/30 transition-[color,transform] duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-hub-blue" aria-hidden />
                  </Link>
                </li>
              ))}
            </ul>

            <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3">
              <Link href={cur.href} className={bizButton.solid}>
                Xem danh mục {cur.short.toLowerCase()} ({cur.total}) <SlideArrow />
              </Link>
              <a href={cur.phoneHref} className="group inline-flex h-12 items-center gap-2 text-body font-semibold tabular-nums text-hub-ink transition-colors hover:text-hub-blue">
                <Phone className="size-4 text-hub-blue" aria-hidden /> {cur.phone}
              </a>
            </div>
          </div>

          <figure className="lg:col-span-7">
            <div className="relative aspect-[4/3] overflow-hidden rounded-[4px] bg-hub-stone">
              <Image src={cur.image} alt={cur.alt} fill sizes="(min-width: 1024px) 55vw, 100vw" className="object-cover" style={{ objectPosition: "70% 50%" }} />
            </div>
            <figcaption className="mt-3 text-caption text-hub-ink-soft">{cur.caption}</figcaption>
          </figure>
        </div>
      </div>
    </div>
  );
}
