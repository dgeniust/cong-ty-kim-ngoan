"use client";

import { useId, useMemo, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { ProductArt } from "@/components/nganh/product-art";
import type { ArtKind } from "@/lib/data/types";
import { cn } from "@/lib/utils";

export type ShowcaseVisual =
  | { type: "image"; src: string }
  | { type: "art"; art: ArtKind }
  /** phân bón chưa có ảnh bao bì: vẽ "nhãn bao" – công thức + 3 thanh N-P-K */
  | { type: "label"; formula: string; note?: string; bars?: number[]; tone: "npk" | "organic" | "drug" };

export type ShowcaseItem = {
  id: string;
  name: string;
  group: string;
  desc: string;
  spec?: string;
  href: string;
  badge?: string;
  visual: ShowcaseVisual;
};

export type ShowcaseTab = {
  id: string;
  label: string;
  dot: string;
  allHref: string;
  allLabel: string;
  total: number;
  items: ShowcaseItem[];
};

const MAX = 8;

const TONE = {
  npk: { band: "bg-brand-700", bg: "bg-brand-50" },
  organic: { band: "bg-[#6b4f2a]", bg: "bg-[#f6efe4]" },
  drug: { band: "bg-[#1f5f6b]", bg: "bg-[#e9f3f4]" },
};
const BAR = ["bg-brand-500", "bg-sun-300", "bg-brand-900"];

function Visual({ v, name }: { v: ShowcaseVisual; name: string }) {
  if (v.type === "image")
    return <Image src={v.src} alt={name} fill sizes="(min-width: 1024px) 22vw, 50vw" className="object-contain p-4 transition-transform duration-500 ease-soft group-hover:scale-105" />;
  if (v.type === "art") return <ProductArt kind={v.art} className="absolute inset-0 m-auto !size-[72%] transition-transform duration-500 ease-soft group-hover:scale-105" />;
  const t = TONE[v.tone];
  const max = v.bars ? Math.max(30, ...v.bars) : 1;
  return (
    <div className={cn("absolute inset-0 grid place-items-center", t.bg)}>
      {/* bao phân thu nhỏ */}
      <div className="w-[80%] overflow-hidden rounded-[12px] sm:w-[64%] sm:rounded-[14px] bg-white shadow-[0_6px_18px_rgba(30,60,30,0.10)] transition-transform duration-500 ease-soft group-hover:-translate-y-1 group-hover:rotate-[-1.5deg]">
        <div className={cn("px-2 py-2 text-center text-white sm:px-3 sm:py-2.5", t.band)}>
          <p className="truncate text-[15px] font-bold leading-none tracking-tight tabular-nums sm:text-[clamp(1rem,1.6vw,1.35rem)]">{v.formula}</p>
          {v.note && <p className="mt-1 truncate text-[8.5px] font-medium uppercase tracking-[0.1em] text-white/80 sm:text-[10px] sm:tracking-[0.12em]">{v.note}</p>}
        </div>
        <div className="space-y-1.5 px-2.5 py-2.5 sm:px-3 sm:py-3">
          {v.bars ? (
            v.bars.map((b, i) => (
              <div key={i} className="flex items-center gap-2">
                <span className="w-3 text-[10px] font-bold text-hub-ink-soft">{"NPK"[i]}</span>
                <span className="h-1.5 flex-1 overflow-hidden rounded-full bg-hub-stone">
                  <span className={cn("block h-full rounded-full", BAR[i])} style={{ width: `${(b / max) * 100}%` }} />
                </span>
              </div>
            ))
          ) : (
            <>
              <span className="block h-1.5 w-4/5 rounded-full bg-hub-stone" />
              <span className="block h-1.5 w-3/5 rounded-full bg-hub-stone" />
              <span className="block h-1.5 w-2/3 rounded-full bg-hub-stone" />
            </>
          )}
        </div>
      </div>
    </div>
  );
}

/**
 * Sản phẩm tiêu biểu theo 3 ngành: thẻ chọn ngành (tab) + nút lọc nhóm trong ngành.
 * Bàn phím: ←/→ giữa các tab (WAI-ARIA tabs, tự kích hoạt).
 */
export function ProductTabs({ tabs }: { tabs: ShowcaseTab[] }) {
  const uid = useId();
  const [active, setActive] = useState(0);
  const [group, setGroup] = useState<string | null>(null);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const tab = tabs[active];

  const groups = useMemo(() => [...new Set(tab.items.map((i) => i.group))], [tab]);
  const items = (group ? tab.items.filter((i) => i.group === group) : tab.items).slice(0, MAX);

  const select = (i: number) => {
    setActive(i);
    setGroup(null);
  };

  return (
    <div>
      <div className="flex flex-col gap-5">
        {/* chọn ngành */}
        <div
          role="tablist"
          aria-label="Ngành hàng"
          className="inline-flex w-full gap-1 self-start rounded-2xl bg-hub-canvas p-1.5 md:w-auto"
          onKeyDown={(e) => {
            if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
            e.preventDefault();
            const i = (active + (e.key === "ArrowRight" ? 1 : -1) + tabs.length) % tabs.length;
            select(i);
            tabRefs.current[i]?.focus();
          }}
        >
          {tabs.map((t, i) => {
            const on = i === active;
            return (
              <button
                key={t.id}
                ref={(el) => {
                  tabRefs.current[i] = el;
                }}
                id={`${uid}-tab-${t.id}`}
                type="button"
                role="tab"
                aria-selected={on}
                aria-controls={`${uid}-panel`}
                tabIndex={on ? 0 : -1}
                onClick={() => select(i)}
                className={cn(
                  "flex min-h-12 flex-1 items-center justify-center gap-2 rounded-xl px-3 text-small font-semibold transition-[background-color,color,box-shadow] duration-200 sm:px-5 sm:text-body md:flex-none",
                  on ? "bg-hub-paper text-hub-ink shadow-sm" : "text-hub-ink-soft hover:text-hub-ink"
                )}
              >
                <span aria-hidden className={cn("size-2 rounded-full", t.dot)} />
                {t.label}
                <span className={cn("hidden rounded-full px-1.5 text-caption tabular-nums sm:inline", on ? "bg-hub-blue-tint text-hub-blue" : "bg-hub-paper/60")}>{t.total}</span>
              </button>
            );
          })}
        </div>

        {/* lọc nhóm trong ngành */}
        <div className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 [scrollbar-width:none] md:mx-0 md:flex-wrap md:overflow-visible md:px-0" aria-label={`Lọc nhóm ${tab.label}`} role="group">
          {[null, ...groups].map((g) => {
            const on = group === g;
            return (
              <button
                key={g ?? "all"}
                type="button"
                aria-pressed={on}
                onClick={() => setGroup(g)}
                className={cn("min-h-10 shrink-0 rounded-full px-4 text-small font-medium transition-colors duration-200", on ? "bg-hub-ink text-white" : "bg-hub-canvas text-hub-ink-soft hover:bg-hub-stone hover:text-hub-ink")}
              >
                {g ?? "Tất cả"}
              </button>
            );
          })}
        </div>
      </div>

      <div id={`${uid}-panel`} role="tabpanel" aria-labelledby={`${uid}-tab-${tab.id}`} className="mt-8">
        <ul key={`${tab.id}-${group ?? "all"}`} className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
          {items.map((p, i) => (
            <li key={p.id} className="kn-pop" style={{ animationDelay: `${Math.min(i, 7) * 40}ms` }}>
              <article className="group relative flex h-full flex-col overflow-hidden rounded-[20px] bg-hub-paper shadow-sm transition-shadow duration-300 hover:shadow-[0_10px_30px_rgba(25,40,20,0.08)]">
                <div className="relative aspect-[4/3] overflow-hidden bg-hub-canvas">
                  <Visual v={p.visual} name={p.name} />
                  {p.badge && <span className="absolute left-3 top-3 hidden sm:block rounded-full bg-hub-paper/95 px-2.5 py-1 text-[11px] font-semibold text-hub-blue shadow-sm">{p.badge}</span>}
                </div>
                <div className="flex flex-1 flex-col p-4 sm:p-5">
                  <p className="text-caption text-hub-ink-soft">{p.group}</p>
                  <h3 className="mt-1 line-clamp-2 text-small font-semibold leading-snug text-hub-ink sm:text-body">
                    <Link href={p.href} className="after:absolute after:inset-0 after:content-[''] group-hover:text-hub-blue">
                      {p.name}
                    </Link>
                  </h3>
                  <p className="mt-1.5 line-clamp-2 hidden text-small leading-relaxed text-hub-ink-soft sm:block">{p.desc}</p>
                  <div className="mt-auto flex items-center justify-between gap-2 pt-4">
                    {p.spec ? <span className="truncate rounded-md bg-hub-canvas px-2 py-1 text-caption font-medium tabular-nums text-hub-ink">{p.spec}</span> : <span />}
                    <ArrowRight className="size-4 shrink-0 text-hub-ink-soft transition-[transform,color] duration-200 group-hover:translate-x-0.5 group-hover:text-hub-blue" aria-hidden />
                  </div>
                </div>
              </article>
            </li>
          ))}
        </ul>

        <div className="mt-8 flex justify-center">
          <Link href={tab.allHref} className="group inline-flex min-h-12 items-center gap-2 rounded-xl bg-hub-blue-tint px-5 font-semibold text-hub-blue transition-colors hover:bg-[#e0eed3]">
            {tab.allLabel} <ArrowRight className="size-4 transition-transform duration-200 group-hover:translate-x-0.5" aria-hidden />
          </Link>
        </div>
      </div>
    </div>
  );
}
