import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Leaf } from "lucide-react";
import { ProductArt } from "@/components/nganh/product-art";
import { Reveal } from "@/components/shared/reveal";
import { HUB_NEWS } from "@/lib/content/hub-home";
import type { NewsItem } from "@/lib/data/types";
import { formatDate } from "@/lib/format";
import type { pickHomeNews } from "@/lib/hub/home";
import type { Settings } from "@/lib/settings/server";
import { cn } from "@/lib/utils";
import { CardCue, HUB_WRAP, SectorDot, StackedSectionHeader } from "./ui";

type Verticals = Settings["VERTICALS"];

/** Khối "Tin tức": bài phân bón lớn bên trái; lốp xe, sắt thép và danh sách bài phân bón khác bên phải. */
export function NewsSection({ news, verticals }: { news: ReturnType<typeof pickHomeNews>; verticals: Verticals }) {
  const { feature, side, more } = news;
  if (!feature) return null;
  return (
    <section id="tin-tuc" aria-labelledby="tin-tuc-title" className={cn(HUB_WRAP, "scroll-mt-24 py-20 md:py-28")}>
      <StackedSectionHeader id="tin-tuc-title" eyebrow={HUB_NEWS.eyebrow} title={HUB_NEWS.title} lead={HUB_NEWS.lead} action={{ href: "/tin-tuc", label: HUB_NEWS.allLabel }} />

      <div className="grid gap-5 lg:grid-cols-12">
        <Reveal className="lg:col-span-7">
          <FeatureNewsCard item={feature} label={verticals[feature.site].short} />
        </Reveal>

        <div className="flex flex-col gap-5 lg:col-span-5">
          {side.map((item, i) => (
            <Reveal key={`${item.site}-${item.slug}`} delay={(i + 1) * 80}>
              <CompactNewsCard item={item} label={verticals[item.site].short} />
            </Reveal>
          ))}
          {more.length > 0 && (
            <Reveal delay={240} className="flex-1">
              <MoreNewsList items={more} allHref={`${verticals.phanbon.base}/tin-tuc`} />
            </Reveal>
          )}
        </div>
      </div>
    </section>
  );
}

function NewsMeta({ item, label }: { item: NewsItem; label: string }) {
  return (
    <p className="flex flex-wrap items-center gap-x-3 text-caption text-hub-ink-soft">
      <span className="inline-flex items-center gap-1.5 font-medium text-hub-ink">
        <SectorDot id={item.site} /> {label}
      </span>
      <time dateTime={item.date}>{formatDate(item.date)}</time>
    </p>
  );
}

/** Tiêu đề bài, cả thẻ bấm được nhờ lớp phủ ::after. */
function NewsTitleLink({ item }: { item: NewsItem }) {
  return (
    <Link href={item.href} className="after:absolute after:inset-0 after:content-[''] group-hover:text-hub-blue">
      {item.title}
    </Link>
  );
}

function FeatureNewsCard({ item, label }: { item: NewsItem; label: string }) {
  return (
    <article className="group relative flex h-full flex-col overflow-hidden rounded-[22px] bg-hub-paper">
      <div className="relative aspect-[16/9] overflow-hidden bg-hub-blue-tint">
        {item.cover && <Image src={item.cover} alt={item.title} fill sizes="(min-width: 1024px) 56vw, 100vw" className="object-cover transition-transform duration-700 ease-soft group-hover:scale-[1.03]" />}
        <span className="absolute left-4 top-4 inline-flex items-center gap-1.5 rounded-full bg-hub-paper/95 px-3 py-1.5 text-caption font-semibold text-hub-blue backdrop-blur-sm">
          <Leaf className="size-3.5" aria-hidden /> {HUB_NEWS.featureBadge}
        </span>
      </div>
      <div className="flex flex-1 flex-col p-6 sm:p-8">
        <NewsMeta item={item} label={label} />
        <h3 className="mt-3 text-h3 font-semibold leading-snug text-hub-ink">
          <NewsTitleLink item={item} />
        </h3>
        <p className="mt-3 max-w-[40rem] text-body leading-relaxed text-hub-ink-soft">{item.excerpt}</p>
        <CardCue className="pt-6">Đọc bài viết</CardCue>
      </div>
    </article>
  );
}

function CompactNewsCard({ item, label }: { item: NewsItem; label: string }) {
  return (
    <article className="group relative grid grid-cols-[minmax(0,9rem)_minmax(0,1fr)] gap-4 overflow-hidden rounded-[22px] bg-hub-paper p-3 sm:grid-cols-[minmax(0,12rem)_minmax(0,1fr)] sm:gap-5">
      <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-hub-canvas">
        {item.cover ? (
          <Image src={item.cover} alt={item.title} fill sizes="12rem" className="object-cover transition-transform duration-700 ease-soft group-hover:scale-[1.05]" />
        ) : (
          item.art && <ProductArt kind={item.art} className="absolute inset-0 m-auto !size-[70%]" />
        )}
      </div>
      <div className="flex min-w-0 flex-col py-1 pr-2">
        <NewsMeta item={item} label={label} />
        <h3 className="mt-2 line-clamp-3 text-body font-semibold leading-snug text-hub-ink sm:text-title">
          <NewsTitleLink item={item} />
        </h3>
        <CardCue className="pt-3">Đọc tiếp</CardCue>
      </div>
    </article>
  );
}

function MoreNewsList({ items, allHref }: { items: NewsItem[]; allHref: string }) {
  return (
    <div className="flex h-full flex-col rounded-[22px] bg-hub-blue-tint p-5 sm:p-6">
      <p className="flex items-center gap-2 text-small font-semibold text-hub-blue">
        <Leaf className="size-4" aria-hidden /> {HUB_NEWS.moreTitle}
      </p>
      <ul className="mt-3">
        {items.map((n) => (
          <li key={n.slug}>
            <Link href={n.href} className="group/l -mx-2 flex min-h-12 items-center justify-between gap-4 rounded-lg px-2 py-2 text-body text-hub-ink transition-colors hover:bg-hub-paper">
              <span className="line-clamp-2">{n.title}</span>
              <ArrowRight className="size-4 shrink-0 text-hub-ink-soft transition-transform duration-200 group-hover/l:translate-x-0.5 group-hover/l:text-hub-blue" aria-hidden />
            </Link>
          </li>
        ))}
      </ul>
      <Link href={allHref} className="group mt-auto inline-flex min-h-11 items-center gap-1.5 pt-4 text-small font-semibold text-hub-blue">
        {HUB_NEWS.moreAllLabel} <ArrowRight className="size-4 transition-transform duration-200 group-hover:translate-x-0.5" aria-hidden />
      </Link>
    </div>
  );
}
