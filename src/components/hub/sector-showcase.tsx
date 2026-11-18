"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { ProductArt } from "@/components/nganh/product-art";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { ArtKind } from "@/lib/data/types";
import { cn } from "@/lib/utils";

export type ShowcaseSector = {
  id: string;
  label: string;
  name: string;
  tagline: string;
  description: string;
  href: string;
  url: string;
  phone: string;
  groups: { name: string; href: string }[];
  products: { name: string; meta: string; href: string }[];
  image?: string;
  art?: ArtKind;
};

const INTERVAL = 5000; // phác thảo của khách: 5 giây chuyển 1 hình

/** Mỗi ngành một "sân khấu" riêng cho hình sản phẩm – nơi duy nhất trang tổng dùng màu. */
const STAGE: Record<string, { dot: string; stage: string; caption: string; bar: string }> = {
  phanbon: { dot: "bg-sector-phanbon", stage: "bg-brand-900", caption: "text-white/70", bar: "bg-sector-phanbon" },
  lopxe: { dot: "bg-sector-lopxe", stage: "bg-[#100904]", caption: "text-[#ffedd7]/70", bar: "bg-sector-lopxe" },
  satthep: { dot: "bg-sector-satthep", stage: "bg-[#08090a]", caption: "text-white/60", bar: "bg-sector-satthep" },
};

/**
 * Khối trung tâm của landing tổng: 3 tab ngành, mỗi tab cho thấy ngay
 * công ty bán gì (nhóm hàng + sản phẩm tiêu biểu) và lối vào chuyên trang.
 * Tự chuyển tab mỗi 5 giây, dừng khi người xem rê chuột/đặt tiêu điểm hoặc đã tự chọn tab.
 */
export function SectorShowcase({ sectors }: { sectors: ShowcaseSector[] }) {
  const [value, setValue] = useState(sectors[0].id);
  const [paused, setPaused] = useState(false);
  const [auto, setAuto] = useState(true);
  const reduced = useRef(false);

  useEffect(() => {
    reduced.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced.current) setAuto(false);
  }, []);

  useEffect(() => {
    if (!auto || paused) return;
    const t = setTimeout(() => {
      const i = sectors.findIndex((s) => s.id === value);
      setValue(sectors[(i + 1) % sectors.length].id);
    }, INTERVAL);
    return () => clearTimeout(t);
  }, [value, paused, auto, sectors]);

  return (
    <Tabs
      value={value}
      onValueChange={(v) => {
        setValue(v);
        setAuto(false); // người xem đã tự chọn → thôi tự chuyển
      }}
      className="gap-5"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={() => setPaused(false)}
    >
      <TabsList aria-label="Lĩnh vực kinh doanh" className="gap-2 shadow-none">
        {sectors.map((s) => {
          const active = s.id === value;
          return (
            <TabsTrigger
              key={s.id}
              value={s.id}
              className="relative h-11 overflow-hidden rounded-full bg-hub-paper px-5 text-sm font-medium text-hub-ink-soft shadow-[inset_0_0_0_1px_var(--color-hub-stone)] transition-colors duration-300 after:hidden hover:text-hub-ink focus-visible:ring-hub-ink data-[state=active]:bg-hub-ink data-[state=active]:font-medium data-[state=active]:text-white data-[state=active]:shadow-none"
            >
              <span aria-hidden className={cn("size-2 rounded-full", STAGE[s.id].dot, active && s.id === "satthep" && "bg-white")} />
              {s.label}
              {active && auto && !paused && (
                <span aria-hidden key={value} className="absolute inset-x-0 bottom-0 h-0.5 origin-left animate-progress bg-white/60" style={{ animationDuration: `${INTERVAL}ms` }} />
              )}
            </TabsTrigger>
          );
        })}
      </TabsList>

      {sectors.map((s) => {
        const st = STAGE[s.id];
        return (
          <TabsContent key={s.id} value={s.id} forceMount className="animate-fade grid overflow-hidden rounded-3xl bg-hub-sand data-[state=inactive]:hidden lg:grid-cols-[1fr_1.05fr]">
            <div className="flex flex-col p-7 sm:p-10 lg:p-12">
              <p className="text-sm text-hub-ink-soft">{s.url}</p>
              <h3 className="mt-3 text-[clamp(2rem,3.2vw,2.75rem)] font-light leading-[1.1] tracking-[-0.02em] text-hub-ink">{s.name}</h3>
              <p className="mt-4 max-w-md text-base leading-relaxed text-hub-ink-soft">{s.description}</p>

              <ul className="mt-7 flex flex-wrap gap-2">
                {s.groups.map((g) => (
                  <li key={g.href}>
                    <Link href={g.href} className="inline-flex h-9 items-center rounded-full bg-hub-paper px-4 text-sm text-hub-ink shadow-[inset_0_0_0_1px_var(--color-hub-stone)] transition-colors duration-200 hover:bg-hub-stone">
                      {g.name}
                    </Link>
                  </li>
                ))}
              </ul>

              <ul className="mt-8">
                {s.products.map((p) => (
                  <li key={p.href} className="border-t border-hub-stone">
                    <Link href={p.href} className="group flex items-center justify-between gap-4 py-3.5">
                      <span className="text-[15px] font-medium text-hub-ink group-hover:underline underline-offset-4">{p.name}</span>
                      <span className="flex shrink-0 items-center gap-3 text-sm tabular-nums text-hub-ink-soft">
                        {p.meta} <ArrowUpRight className="size-4" aria-hidden />
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>

              <div className="mt-auto flex flex-wrap items-center gap-3 pt-9">
                <Link href={s.href} className="group inline-flex h-11 items-center gap-2 rounded-full bg-hub-ink px-5 text-sm font-medium text-white">
                  Vào chuyên trang {s.label.toLowerCase()} <ArrowRight className="size-4 transition-transform duration-300 ease-soft group-hover:translate-x-1" aria-hidden />
                </Link>
                <a href={`tel:${s.phone.replace(/\s/g, "")}`} className="inline-flex h-11 items-center rounded-full bg-hub-paper px-5 text-sm font-medium tabular-nums text-hub-ink shadow-[inset_0_0_0_1px_var(--color-hub-stone)] transition-colors duration-200 hover:bg-hub-stone">
                  {s.phone}
                </a>
              </div>
            </div>

            <div className={cn("relative min-h-[300px] overflow-hidden lg:min-h-[560px]", st.stage)}>
              {s.image ? (
                <Image src={s.image} alt={s.name} fill priority={s.id === sectors[0].id} sizes="(min-width: 1024px) 50vw, 100vw" className="object-cover" />
              ) : (
                s.art && <ProductArt kind={s.art} title={s.name} className="absolute inset-0 m-auto !size-[74%]" />
              )}
              {s.image && <div aria-hidden className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/55 to-transparent" />}
              <p className={cn("absolute bottom-5 left-6 text-sm", s.image ? "text-white" : st.caption)}>{s.tagline}</p>
            </div>
          </TabsContent>
        );
      })}
    </Tabs>
  );
}
