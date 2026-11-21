import Image from "next/image";
import { cn } from "@/lib/utils";

/**
 * Nhành lá trang trí ở hai mép landing tổng (nền chung “vườn xanh nhẹ”).
 * Mỗi khối dùng một bộ vị trí khác nhau để nền thay đổi nhẹ khi cuộn, nhưng vẫn cùng một chất liệu.
 * Lá nằm sau nội dung (-z-10 trong khối `isolate`), chỉ trang trí → aria-hidden, alt rỗng.
 */
const SPRIGS = {
  a: { src: "/decor/sprig-a.webp", w: 520, h: 760 }, // cành rõ nét, dài
  b: { src: "/decor/sprig-b.webp", w: 460, h: 520 }, // cành mờ vừa
  c: { src: "/decor/sprig-c.webp", w: 560, h: 560 }, // cụm lá mờ sâu (bokeh)
  d: { src: "/decor/sprig-d.webp", w: 300, h: 420 }, // nhánh non mảnh
} as const;

type Leaf = {
  sprig: keyof typeof SPRIGS;
  /** vị trí + kích thước (class Tailwind) */
  className: string;
  /** xoay / lật (class Tailwind) */
  turn?: string;
};

export const LEAF_SETS = {
  about: [
    { sprig: "a", className: "-left-16 top-10 hidden w-[150px] md:block lg:-left-10 lg:w-[210px] 2xl:left-0 2xl:w-[250px]", turn: "rotate-[8deg]" },
    { sprig: "c", className: "-right-40 bottom-[-6rem] w-[260px] opacity-40 md:opacity-70 lg:-right-28 lg:w-[360px]", turn: "-scale-x-100" },
  ],
  products: [
    { sprig: "b", className: "-right-24 top-8 w-[180px] opacity-50 md:opacity-80 lg:-right-16 lg:w-[280px] 2xl:right-0", turn: "-scale-x-100 rotate-[6deg]" },
    { sprig: "d", className: "-left-10 bottom-16 hidden w-[150px] md:block lg:-left-4 lg:w-[170px] 2xl:left-6", turn: "-rotate-[14deg]" },
  ],
  news: [
    { sprig: "c", className: "-left-44 -top-24 w-[260px] opacity-60 lg:-left-36 lg:w-[380px]", turn: "rotate-[24deg]" },
    { sprig: "a", className: "-right-16 bottom-0 hidden w-[150px] md:block lg:-right-8 lg:w-[200px] 2xl:right-2 2xl:w-[230px]", turn: "-scale-x-100 -rotate-[4deg]" },
  ],
  contact: [
    { sprig: "b", className: "-left-24 bottom-[-3rem] w-[200px] opacity-80 lg:-left-16 lg:w-[290px]", turn: "rotate-[200deg]" },
  ],
} satisfies Record<string, Leaf[]>;

export function LeafBackdrop({ set, className }: { set: keyof typeof LEAF_SETS; className?: string }) {
  return (
    <div aria-hidden className={cn("pointer-events-none absolute inset-0 -z-10", className)}>
      {LEAF_SETS[set].map((leaf: Leaf, i) => {
        const s = SPRIGS[leaf.sprig];
        return (
          <div key={i} className={cn("absolute select-none", leaf.className)}>
            <Image src={s.src} alt="" width={s.w} height={s.h} sizes="(min-width: 1024px) 380px, 260px" loading="lazy" className={cn("h-auto w-full", leaf.turn)} />
          </div>
        );
      })}
    </div>
  );
}
