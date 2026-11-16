import Link from "next/link";
import { SmartImage } from "@/components/shared/smart-image";
import type { NewsItem } from "@/lib/data/types";
import { formatDate } from "@/lib/format";
import { cn } from "@/lib/utils";
import { ProductArt } from "./product-art";

export function VNewsCard({ item, large, headingLevel: Heading = "h3" }: { item: NewsItem; large?: boolean; headingLevel?: "h2" | "h3" }) {
  return (
    <article className={cn("group relative flex flex-col", large && "md:grid md:grid-cols-2 md:items-end md:gap-10")}>
      <div className={cn("v-art relative overflow-hidden", large ? "aspect-[16/11]" : "aspect-[16/10]")}>
        {item.cover ? (
          <SmartImage src={item.cover} alt="" fill sizes="(min-width: 768px) 40vw, 100vw" className="object-cover v-hover-zoom" />
        ) : (
          item.art && <ProductArt kind={item.art} className="absolute inset-0 m-auto size-[64%] v-hover-zoom" />
        )}
      </div>
      <div className={cn("pt-5", large && "md:pb-2 md:pt-0")}>
        <p className="v-label flex gap-3 text-xs text-v-mute">
          <time dateTime={item.date}>{formatDate(item.date)}</time>
          <span aria-hidden className="text-v-mark">/</span>
          <span>{item.readingMinutes} phút đọc</span>
        </p>
        <Heading className={cn("mt-2 font-semibold leading-snug text-v-fg", large ? "text-2xl md:text-3xl" : "text-lg")}>
          <Link href={item.href} className="bg-[linear-gradient(currentColor,currentColor)] bg-[length:0_2px] bg-[position:0_100%] bg-no-repeat transition-[background-size] duration-500 ease-soft after:absolute after:inset-0 after:content-[''] group-hover:bg-[length:100%_2px]">
            {item.title}
          </Link>
        </Heading>
        <p className={cn("mt-2.5 text-[15px] leading-relaxed text-v-mute", !large && "line-clamp-2")}>{item.excerpt}</p>
      </div>
    </article>
  );
}
