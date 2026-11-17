"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { ProductArt } from "@/components/nganh/product-art";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { ArtKind } from "@/lib/data/types";
import { cn } from "@/lib/utils";

export type BrowserItem = { name: string; href: string; group: string; meta?: string; image?: string; art?: ArtKind };
export type BrowserTab = {
  id: string;
  label: string;
  href: string;
  groupLabel: string;
  groups: string[];
  items: BrowserItem[];
  dot: string;
};

/**
 * "Chọn ngành → chọn hãng/nhóm → lưới sản phẩm" theo phác thảo thứ 2 của khách:
 * cột trái là danh sách hãng/nhóm, bên phải là ô sản phẩm với tên + nút Chi tiết.
 */
export function ProductBrowser({ tabs }: { tabs: BrowserTab[] }) {
  const [group, setGroup] = useState<Record<string, string | null>>({});

  return (
    <Tabs defaultValue={tabs[0].id} className="gap-8">
      <TabsList className="gap-2 shadow-none">
        {tabs.map((t) => (
          <TabsTrigger
            key={t.id}
            value={t.id}
            className="h-10 rounded-lg bg-transparent px-4 text-[15px] font-medium text-hub-ink/55 shadow-none transition-colors duration-200 after:hidden hover:text-hub-ink focus-visible:ring-hub-blue data-[state=active]:bg-hub-canvas data-[state=active]:font-medium data-[state=active]:text-hub-ink data-[state=active]:shadow-[inset_0_0_0_1px_var(--color-hub-line)]"
          >
            <span aria-hidden className={cn("size-2 rounded-full", t.dot)} />
            {t.label}
          </TabsTrigger>
        ))}
      </TabsList>

      {tabs.map((t) => {
        const current = group[t.id] ?? null;
        const items = (current ? t.items.filter((i) => i.group === current) : t.items).slice(0, 8);
        const pick = (g: string | null) => setGroup((s) => ({ ...s, [t.id]: g }));
        return (
          <TabsContent key={t.id} value={t.id} forceMount className="animate-fade grid data-[state=inactive]:hidden gap-8 lg:grid-cols-[220px_1fr] lg:gap-12">
            <div>
              <p className="mb-3 px-3.5 text-[13px] font-medium text-hub-ink/45">{t.groupLabel}</p>
              <ul className="flex gap-1.5 overflow-x-auto pb-1 [scrollbar-width:none] lg:block lg:space-y-1 [&::-webkit-scrollbar]:hidden">
                {[null, ...t.groups].map((g) => (
                  <li key={g ?? "all"}>
                    <button
                      type="button"
                      aria-pressed={current === g}
                      onClick={() => pick(g)}
                      className={cn(
                        "w-full whitespace-nowrap rounded-lg px-3.5 py-2 text-left text-[15px] transition-colors duration-200",
                        current === g ? "bg-hub-blue-tint font-medium text-hub-blue" : "text-hub-ink/60 hover:bg-hub-canvas hover:text-hub-ink",
                      )}
                    >
                      {g ?? "Tất cả"}
                    </button>
                  </li>
                ))}
              </ul>
              <Link href={t.href} className="group mt-6 hidden items-center gap-2 px-3.5 text-sm font-medium text-hub-blue lg:inline-flex">
                Vào chuyên trang <ArrowRight className="size-4 transition-transform duration-300 ease-soft group-hover:translate-x-1" aria-hidden />
              </Link>
            </div>

            <ul className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 xl:grid-cols-4">
              {items.map((it) => (
                <li key={it.href} className="group relative flex flex-col overflow-hidden rounded-xl border border-hub-line bg-hub-paper transition-colors duration-200 hover:border-hub-ink/20">
                  <div className={cn("relative m-1.5 mb-0 aspect-square overflow-hidden rounded-lg", t.id === "lopxe" ? "bg-lopxe-ink" : t.id === "satthep" ? "bg-satthep-soft" : "bg-hub-mint-soft")}>
                    {it.image ? (
                      <Image src={it.image} alt={it.name} fill sizes="(min-width: 1280px) 18vw, (min-width: 768px) 28vw, 45vw" className="object-cover transition-transform duration-500 ease-soft group-hover:scale-[1.03]" />
                    ) : (
                      it.art && <ProductArt kind={it.art} title={it.name} className="absolute inset-0 m-auto !size-[76%] transition-transform duration-500 ease-soft group-hover:scale-105" />
                    )}
                  </div>
                  <div className="flex flex-1 flex-col p-4">
                    {it.meta && <p className="text-[13px] tabular-nums text-hub-ink-soft">{it.meta}</p>}
                    <h3 className="mt-1 text-[15px] font-semibold leading-snug text-hub-ink">
                      <Link href={it.href} className="after:absolute after:inset-0 after:content-['']">{it.name}</Link>
                    </h3>
                    <span aria-hidden className="mt-auto inline-flex items-center gap-1.5 pt-3 text-[13px] font-medium text-hub-blue">
                      Chi tiết <ArrowRight className="size-3.5 transition-transform duration-300 ease-soft group-hover:translate-x-1" />
                    </span>
                  </div>
                </li>
              ))}
              <li className="col-span-2 md:col-span-3 xl:col-span-4">
                <Link href={`${t.href}/san-pham`} className="group flex items-center justify-between rounded-lg bg-hub-blue-tint px-5 py-3.5 text-hub-blue transition-colors duration-200 hover:bg-[#d4eafd]">
                  <span className="text-sm font-medium">Xem toàn bộ sản phẩm {t.label.toLowerCase()}</span>
                  <ArrowRight className="size-5 transition-transform duration-300 ease-soft group-hover:translate-x-1.5" aria-hidden />
                </Link>
              </li>
            </ul>
          </TabsContent>
        );
      })}
    </Tabs>
  );
}
