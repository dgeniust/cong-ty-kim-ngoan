"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { telHref } from "@/lib/verticals";
import Link from "next/link";
import { ArrowRight, ArrowUpRight, Sprout } from "lucide-react";
import { ProductArt } from "@/components/nganh/product-art";
import type { ArtKind } from "@/lib/data/types";
import { cn } from "@/lib/utils";

export type HeroSector = {
  id: "phanbon" | "lopxe" | "satthep";
  /** Từ nằm trong viên màu của tiêu đề: "đồng hành cùng [nhà nông]" */
  audience: string;
  short: string;
  name: string;
  tagline: string;
  description: string;
  href: string;
  url: string;
  phone: string;
  image?: string;
  art?: ArtKind;
  groups: { name: string; href: string }[];
  products: { name: string; meta: string; href: string }[];
};

const INTERVAL = 5000; // phác thảo của khách: 5 giây chuyển 1 hình

/** Màu từng ngành – phẳng, không gradient; khớp theme chuyên trang con (lốp xe: đen + cam; sắt thép: trắng + xám + đen). */
const TONE = {
  phanbon: { pill: "bg-[#cfeed6]", dot: "bg-sector-phanbon", stage: "bg-brand-900", tag: "bg-hub-mint-soft" },
  lopxe: { pill: "bg-lopxe-orange", dot: "bg-sector-lopxe", stage: "bg-lopxe-ink", tag: "bg-lopxe-soft" },
  satthep: { pill: "bg-satthep-gray", dot: "bg-sector-satthep", stage: "bg-satthep-soft", tag: "bg-satthep-soft" },
} as const;

/** Hàng "dấu tròn" kiểu Notion: biểu tượng trong vòng viền màu, nhún nhẹ, bật lên khi rê chuột. */
const MARKS: { ring: string; art?: ArtKind; leaf?: boolean }[] = [
  { ring: "border-hub-signal", leaf: true },
  { ring: "border-hub-coral", art: "tyre" },
  { ring: "border-hub-marigold", art: "rebar" },
  { ring: "border-hub-sky", art: "tyre-truck" },
  { ring: "border-sector-phanbon", art: "ibeam" },
  { ring: "border-hub-coral", art: "roofing" },
  { ring: "border-hub-signal", art: "tyre-at" },
];

function Squiggle({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 24" aria-hidden className={className} fill="none">
      <path d="M2 16c6-10 10-10 14 0s8 10 14 0 8-10 14 0 8 10 14 0" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}
function Sparkle({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden className={className}>
      <path d="M12 0c.6 6.2 5.8 11.4 12 12-6.2.6-11.4 5.8-12 12-.6-6.2-5.8-11.4-12-12C6.2 11.4 11.4 6.2 12 0Z" fill="currentColor" />
    </svg>
  );
}

/**
 * Hero landing tổng (Notion): dấu tròn → tiêu đề có viên màu → mô tả → 2 nút → "cửa sổ" xem trước chuyên trang.
 * Ba tab trong cửa sổ tự chuyển 5 giây/lần; viên màu trong tiêu đề đổi theo ngành đang hiện.
 */
export function HubHero({ sectors, lead, actions }: { sectors: HeroSector[]; lead: React.ReactNode; actions: React.ReactNode }) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [auto, setAuto] = useState(true);
  const reduced = useRef(false);

  useEffect(() => {
    reduced.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced.current) setAuto(false);
  }, []);

  const go = useCallback((i: number) => setIndex((i + sectors.length) % sectors.length), [sectors.length]);

  useEffect(() => {
    if (!auto || paused) return;
    const t = setTimeout(() => go(index + 1), INTERVAL);
    return () => clearTimeout(t);
  }, [index, paused, auto, go]);

  const s = sectors[index];
  const tone = TONE[s.id];
  const hold = { onMouseEnter: () => setPaused(true), onMouseLeave: () => setPaused(false), onFocusCapture: () => setPaused(true), onBlurCapture: () => setPaused(false) };

  return (
    <div className="text-center">
      {/* dấu tròn */}
      <ul aria-hidden className="flex flex-wrap items-center justify-center gap-2.5">
        {MARKS.map((m, i) => (
          <li
            key={i}
            style={{ animationDelay: `${i * 0.35}s` }}
            className={cn("grid size-11 animate-bob place-items-center rounded-full border-2 bg-hub-paper transition-transform duration-300 [transition-timing-function:cubic-bezier(0.34,1.56,0.64,1)] hover:scale-125", m.ring, i > 4 && "max-sm:hidden")}
          >
            {m.leaf ? <Sprout className="size-5 text-sector-phanbon" strokeWidth={2} /> : <ProductArt kind={m.art!} className="!size-7" />}
          </li>
        ))}
      </ul>

      {/* tiêu đề */}
      <div className="relative mx-auto mt-8 max-w-5xl">
        <Squiggle className="absolute -left-2 top-2 hidden w-14 -rotate-12 text-hub-coral md:block lg:-left-10" />
        <Sparkle className="absolute -right-1 -top-3 hidden size-7 text-hub-marigold md:block lg:-right-8" />
        <Sparkle className="absolute -bottom-4 right-[18%] hidden size-4 text-hub-sky md:block" />
        <h1 id="hero-title" className="text-display font-semibold text-hub-ink">
          Một địa chỉ tin cậy,
          <br />
          đồng hành cùng{" "}
          <span className={cn("relative inline-block rounded-full px-[0.4em] pb-[0.06em] align-baseline transition-colors duration-500", tone.pill)}>
            <span key={s.id} className="inline-block animate-pop">
              {s.audience}
            </span>
          </span>
        </h1>
      </div>
      <div className="mx-auto mt-6 max-w-2xl">{lead}</div>
      <div className="mt-8 flex flex-wrap justify-center gap-2.5">{actions}</div>

      {/* cửa sổ xem trước chuyên trang */}
      <div className="relative mx-auto mt-14 max-w-6xl text-left" {...hold}>
        <div role="tablist" aria-label="Xem trước chuyên trang" className="mb-3 flex flex-wrap justify-center gap-1.5">
          {sectors.map((x, i) => {
            const active = i === index;
            return (
              <button
                key={x.id}
                role="tab"
                type="button"
                id={`tab-${x.id}`}
                aria-selected={active}
                aria-controls="cua-so-chuyen-trang"
                onClick={() => {
                  go(i);
                  setAuto(false);
                }}
                className={cn(
                  "relative inline-flex h-9 items-center gap-2 overflow-hidden rounded-lg px-4 text-small font-medium transition-colors duration-200",
                  active ? "bg-hub-paper text-hub-ink shadow-[inset_0_0_0_1px_var(--color-hub-line)]" : "text-hub-ink/55 hover:text-hub-ink",
                )}
              >
                <span aria-hidden className={cn("size-2 rounded-full", TONE[x.id].dot)} />
                {x.name}
                {active && auto && !paused && (
                  <span aria-hidden key={index} className="absolute inset-x-0 bottom-0 h-0.5 origin-left animate-progress bg-hub-blue" style={{ animationDuration: `${INTERVAL}ms` }} />
                )}
              </button>
            );
          })}
        </div>

        <div id="cua-so-chuyen-trang" role="tabpanel" aria-labelledby={`tab-${s.id}`} className="overflow-hidden rounded-xl bg-hub-paper shadow-[0_0_0_1px_var(--color-hub-line),var(--shadow-hub-ui)]">
          {/* thanh trình duyệt */}
          <div className="flex items-center gap-3 border-b border-hub-line px-4 py-3">
            <span aria-hidden className="flex gap-1.5">
              <span className="size-3 rounded-full bg-hub-coral" />
              <span className="size-3 rounded-full bg-hub-marigold" />
              <span className="size-3 rounded-full bg-sector-phanbon" />
            </span>
            <span className="mx-auto flex h-7 min-w-0 max-w-sm flex-1 items-center justify-center rounded-md bg-hub-canvas px-3 text-caption text-hub-ink-soft">
              <span className="truncate">{s.url}</span>
            </span>
            <span aria-hidden className="w-[46px]" />
          </div>

          <div key={s.id} className="grid animate-fade md:grid-cols-[1fr_1.1fr]">
            <div className="flex flex-col p-6 sm:p-9">
              <span className={cn("inline-flex w-fit items-center gap-2 rounded-full px-3 py-1 text-caption font-medium text-hub-ink", tone.tag)}>
                <span aria-hidden className={cn("size-1.5 rounded-full", tone.dot)} /> {s.tagline}
              </span>
              <h2 className="text-h2 mt-4 font-semibold text-hub-ink">{s.name}</h2>
              <p className="mt-3 max-w-md text-body leading-relaxed text-hub-ink-soft">{s.description}</p>

              <ul className="mt-6 flex flex-wrap gap-1.5">
                {s.groups.map((g) => (
                  <li key={g.href}>
                    <Link href={g.href} className="inline-flex h-8 items-center rounded-full bg-hub-canvas px-3 text-caption text-hub-ink transition-colors duration-200 hover:bg-hub-stone">
                      {g.name}
                    </Link>
                  </li>
                ))}
              </ul>

              {/* sản phẩm tiêu biểu – dạng thẻ việc kiểu bảng Kanban */}
              <ul className="mt-6 space-y-2">
                {s.products.map((p) => (
                  <li key={p.href}>
                    <Link href={p.href} className="group flex items-center justify-between gap-3 rounded-lg border border-hub-line bg-hub-paper px-3 py-2.5 transition-colors duration-200 hover:bg-hub-canvas">
                      <span className="min-w-0">
                        <span className="block truncate text-small font-medium text-hub-ink">{p.name}</span>
                        <span className="block text-micro tabular-nums text-hub-ink-soft">{p.meta}</span>
                      </span>
                      <ArrowUpRight className="size-4 shrink-0 text-hub-ink/60 transition-colors group-hover:text-hub-blue" aria-hidden />
                    </Link>
                  </li>
                ))}
              </ul>

              <div className="mt-auto flex flex-wrap items-center gap-2 pt-7">
                <Link href={s.href} className="group inline-flex h-11 items-center gap-2 rounded-lg bg-hub-blue-tint px-5 text-body font-medium text-hub-blue transition-colors duration-200 hover:bg-[#d4eafd]">
                  Vào chuyên trang <ArrowRight className="size-4 transition-transform duration-200 group-hover:translate-x-0.5" aria-hidden />
                </Link>
                <a href={telHref(s.phone)} className="inline-flex h-11 items-center rounded-lg px-5 text-body font-medium tabular-nums text-hub-ink/80 transition-colors hover:bg-hub-canvas">
                  {s.phone}
                </a>
              </div>
            </div>

            <div className={cn("relative min-h-[280px] overflow-hidden md:min-h-[460px]", tone.stage)}>
              {s.image ? (
                <Image src={s.image} alt={s.name} fill priority sizes="(min-width: 768px) 55vw, 100vw" className="object-cover" />
              ) : (
                <>
                  {s.id === "satthep" && (
                    <>
                      <div aria-hidden className="hub-dots absolute inset-0 opacity-60" />
                      <div aria-hidden className="absolute right-[14%] top-[16%] h-[38%] w-[40%] rotate-6 rounded-xl bg-satthep-ink" />
                    </>
                  )}
                  {s.id === "lopxe" && <div aria-hidden className="absolute left-[16%] top-[14%] size-[52%] rounded-full bg-lopxe-orange" />}
                  {s.art && <ProductArt kind={s.art} title={s.name} className="absolute inset-0 m-auto !size-[70%]" />}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
