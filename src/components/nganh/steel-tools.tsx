"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { ArtKind } from "@/lib/data/types";
import { cn } from "@/lib/utils";
import { ProductArt } from "./product-art";

export type ExplorerGroup = {
  slug: string;
  name: string;
  description: string;
  art: ArtKind;
  href: string;
  products: { name: string; brand: string; spec: string; href: string }[];
};

/** Duyệt theo nhóm vật tư kiểu thanh bên Notion: trái là danh sách nhóm, phải là trang của nhóm đang chọn. */
export function CategoryExplorer({ groups }: { groups: ExplorerGroup[] }) {
  const [active, setActive] = useState(groups[0]?.slug);
  const g = groups.find((x) => x.slug === active) ?? groups[0];
  if (!g) return null;

  return (
    <div className="grid overflow-hidden rounded-xl border border-v-line bg-v-card md:grid-cols-[260px_1fr]">
      <div role="tablist" aria-label="Nhóm vật tư" aria-orientation="vertical" className="flex gap-1 overflow-x-auto border-b border-v-line bg-v-raise p-2 [scrollbar-width:none] md:flex-col md:border-b-0 md:border-r [&::-webkit-scrollbar]:hidden">
        <p className="hidden px-3 pb-1 pt-2 text-[12px] font-medium text-v-mute md:block">Nhóm vật tư</p>
        {groups.map((x) => {
          const on = x.slug === g.slug;
          return (
            <button
              key={x.slug}
              role="tab"
              type="button"
              id={`nhom-${x.slug}`}
              aria-selected={on}
              aria-controls="trang-nhom"
              onClick={() => setActive(x.slug)}
              className={cn("flex shrink-0 items-center gap-2.5 rounded-md px-3 py-2 text-left text-[15px] transition-colors duration-200", on ? "bg-v-card font-medium text-v-fg shadow-[0_0_0_1px_var(--v-line)]" : "text-v-fg/65 hover:bg-v-card/60 hover:text-v-fg")}
            >
              <ProductArt kind={x.art} className="!size-6 shrink-0" />
              <span className="whitespace-nowrap">{x.name}</span>
              <span className="ml-auto hidden text-[12px] tabular-nums text-v-mute md:inline">{x.products.length}</span>
            </button>
          );
        })}
      </div>

      <div id="trang-nhom" role="tabpanel" aria-labelledby={`nhom-${g.slug}`} key={g.slug} className="animate-fade p-6 sm:p-8">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h3 className="text-2xl font-semibold tracking-[-0.03em] text-v-fg">{g.name}</h3>
            <p className="mt-1.5 max-w-lg text-[15px] text-v-mute">{g.description}</p>
          </div>
          <Link href={g.href} className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-v-line px-3.5 text-sm font-medium text-v-fg transition-colors hover:bg-v-raise">
            Xem nhóm này <ArrowUpRight className="size-4" aria-hidden />
          </Link>
        </div>
        <table className="mt-6 w-full text-left text-sm">
          <thead className="text-[13px] text-v-mute">
            <tr className="[&>th]:pb-2.5 [&>th]:font-normal">
              <th scope="col">Sản phẩm</th>
              <th scope="col" className="hidden sm:table-cell">Quy cách</th>
              <th scope="col" className="hidden md:table-cell">Hãng</th>
              <th scope="col" className="text-right">Giá</th>
            </tr>
          </thead>
          <tbody>
            {g.products.map((p) => (
              <tr key={p.href} className="group relative transition-colors duration-150 hover:bg-v-raise [&>td]:border-t [&>td]:border-v-line [&>td]:py-3">
                <td className="pr-3 font-medium text-v-fg">
                  <Link href={p.href} className="after:absolute after:inset-0 after:content-['']">{p.name}</Link>
                </td>
                <td className="hidden pr-3 sm:table-cell">
                  <span className="rounded-md bg-v-chip px-2 py-0.5 text-[13px] tabular-nums text-v-fg">{p.spec}</span>
                </td>
                <td className="hidden pr-3 text-v-mute md:table-cell">{p.brand}</td>
                <td className="text-right text-v-mute">Liên hệ</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

const DIAMETERS = [6, 8, 10, 12, 14, 16, 18, 20, 22, 25, 28, 32];
const BAR_LENGTH = 11.7; // m / cây thép thanh vằn

/**
 * Ước tính trọng lượng thép tròn (thanh vằn / trơn): m = d² × 0,00617 kg/m (d tính bằng mm).
 * Số liệu tham khảo theo công thức lý thuyết – barem thực tế từng nhà máy có thể chênh vài %.
 */
export function WeightCalculator() {
  const [d, setD] = useState(16);
  const [bars, setBars] = useState(100);
  const perM = useMemo(() => d * d * 0.00617, [d]);
  const perBar = perM * BAR_LENGTH;
  const total = perBar * bars;
  const fmt = (n: number, digits = 2) => n.toLocaleString("vi-VN", { maximumFractionDigits: digits, minimumFractionDigits: digits });

  return (
    <div className="rounded-xl border border-v-line bg-v-card p-6 shadow-[0_4px_12px_rgb(0_0_0/0.1)] sm:p-7">
      <p className="text-sm font-semibold text-v-fg">Ước tính trọng lượng thép tròn</p>
      <div className="mt-5">
        <p className="mb-2 text-[13px] text-v-mute">Đường kính (mm)</p>
        <div className="flex flex-wrap gap-1.5">
          {DIAMETERS.map((x) => (
            <button
              key={x}
              type="button"
              aria-pressed={x === d}
              onClick={() => setD(x)}
              className={cn("h-9 min-w-11 rounded-lg px-2.5 text-sm font-medium tabular-nums transition-colors duration-200", x === d ? "bg-v-accent text-v-on-accent" : "bg-v-chip text-v-fg hover:bg-v-tint")}
            >
              Ø{x}
            </button>
          ))}
        </div>
      </div>
      <label className="mt-5 block">
        <span className="mb-2 block text-[13px] text-v-mute">Số cây (dài {fmt(BAR_LENGTH, 1)} m/cây)</span>
        <input
          type="number"
          inputMode="numeric"
          min={1}
          max={100000}
          value={bars}
          onChange={(e) => setBars(Math.max(0, Math.min(100000, Number(e.target.value) || 0)))}
          className="h-11 w-full rounded-lg border border-v-line bg-v-bg px-3.5 text-[17px] font-semibold tabular-nums text-v-fg outline-none focus:border-v-accent focus:shadow-[0_0_0_3px_var(--v-tint)]"
        />
      </label>
      <dl className="mt-6 grid grid-cols-3 divide-x divide-v-line overflow-hidden rounded-lg border border-v-line text-center" aria-live="polite">
        {[
          ["kg / m", fmt(perM, 3)],
          ["kg / cây", fmt(perBar)],
          ["Tổng (kg)", fmt(total, 0)],
        ].map(([k, v], i) => (
          <div key={k} className={cn("px-2 py-4", i === 2 && "bg-v-island text-v-on-island")}>
            <dd className="text-xl font-semibold tabular-nums tracking-[-0.02em]">{v}</dd>
            <dt className={cn("mt-1 text-[12px]", i === 2 ? "opacity-70" : "text-v-mute")}>{k}</dt>
          </div>
        ))}
      </dl>
      <p className="mt-3 text-[12px] text-v-mute">Theo công thức lý thuyết d² × 0,00617; barem thực tế từng nhà máy có thể chênh lệch vài phần trăm.</p>
    </div>
  );
}
