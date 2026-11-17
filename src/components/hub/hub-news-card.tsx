import Image from "next/image";
import Link from "next/link";
import { ProductArt } from "@/components/nganh/product-art";
import type { NewsItem } from "@/lib/data/types";
import { formatDate } from "@/lib/format";
import { VERTICALS } from "@/lib/verticals";
import { cn } from "@/lib/utils";

const DOT = { phanbon: "bg-sector-phanbon", lopxe: "bg-sector-lopxe", satthep: "bg-sector-satthep" } as const;

export function HubNewsCard({ item, large, headingLevel: Heading = "h3" }: { item: NewsItem; large?: boolean; headingLevel?: "h2" | "h3" }) {
  return (
    <article className={cn("group relative flex flex-col", large && "lg:row-span-2")}>
      <div className={cn("relative overflow-hidden rounded-[20px]", item.site === "lopxe" ? "bg-hub-marigold-soft" : item.site === "satthep" ? "bg-hub-peri-soft" : "bg-hub-mint-soft", large ? "aspect-[16/10] lg:aspect-auto lg:flex-1" : "aspect-[16/10]")}>
        {item.cover ? (
          <Image src={item.cover} alt="" fill sizes="(min-width: 1024px) 40vw, 100vw" className="object-cover transition-transform duration-700 ease-soft group-hover:scale-105" />
        ) : (
          item.art && <ProductArt kind={item.art} className="absolute inset-0 m-auto !size-[62%] transition-transform duration-700 ease-soft group-hover:scale-110" />
        )}
      </div>
      <div className="pt-4">
        <p className="flex flex-wrap items-center gap-x-2.5 text-[13px] text-hub-ink-soft">
          <span className="inline-flex items-center gap-1.5 font-medium text-hub-ink">
            <span aria-hidden className={cn("size-2 rounded-full", DOT[item.site])} /> {VERTICALS[item.site].short}
          </span>
          <time dateTime={item.date}>{formatDate(item.date)}</time>
        </p>
        <Heading className={cn("mt-2 leading-snug text-hub-ink", large ? "text-2xl font-light tracking-[-0.02em] md:text-[2rem]" : "text-lg font-medium")}>
          <Link href={item.href} className="after:absolute after:inset-0 after:rounded-2xl after:content-[''] group-hover:underline decoration-2 underline-offset-4">
            {item.title}
          </Link>
        </Heading>
        <p className="mt-2 line-clamp-2 text-[15px] leading-relaxed text-hub-ink-soft">{item.excerpt}</p>
      </div>
    </article>
  );
}
