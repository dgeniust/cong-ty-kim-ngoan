import { ProductArt } from "@/components/shared/product-art";
import { SmartImage } from "@/components/shared/smart-image";
import { BrandText } from "@/components/shared/brand-text";
import { Container } from "@/components/shared/container";
import { VPageHead } from "@/components/verticals/v-page-head";
import { formatDate } from "@/lib/format";
import type { Vertical } from "@/lib/verticals";
import type { ArtKind } from "@/types/catalog";
import type { ArticleBlock } from "@/types/phanbon";

/** What the tyre / steel article page shows – shared by the live page and the admin preview so both always match. */
export type VArticleViewData = {
  title: string;
  excerpt: string;
  author: string;
  date: string;
  readingMinutes: number;
  cover?: string;
  art?: ArtKind;
  tags: string[];
  content: ArticleBlock[];
};

/** One content block. `index` marks the element so the admin preview can scroll to the block being edited. */
export function VArticleBlock({ block, index }: { block: ArticleBlock; index?: number }) {
  const mark = index === undefined ? undefined : { "data-block": index };
  switch (block.type) {
    case "h2":
      return <h2 {...mark} className="text-h2 v-display mt-12 text-v-fg">{block.text}</h2>;
    case "p":
      return <p {...mark} className="mt-5">{block.text}</p>;
    case "ul":
      return (
        <ul {...mark} className="mt-5 space-y-3">
          {block.items.map((it, i) => (
            <li key={i} className="flex gap-3.5">
              <span aria-hidden className="mt-[11px] size-2 shrink-0 rounded-full bg-v-accent" />
              <span>{it}</span>
            </li>
          ))}
        </ul>
      );
    case "quote":
      return (
        <blockquote {...mark} className="my-10 rounded-xl bg-v-island px-7 py-8 text-v-on-island md:px-10">
          <p className="v-display text-h3">{block.text}</p>
        </blockquote>
      );
    case "img":
      return (
        <figure {...mark} className="my-10">
          <div className="relative aspect-[16/9] overflow-hidden rounded-xl bg-v-raise">
            <SmartImage src={block.src} alt={block.caption ?? ""} fill sizes="(min-width: 1024px) 720px, 100vw" className="object-cover" />
          </div>
          {block.caption && <figcaption className="mt-3 text-small text-v-mute">{block.caption}</figcaption>}
        </figure>
      );
  }
}

/** Page head (breadcrumb, title, meta) + cover, excerpt, body and tags. */
export function VArticleView({ vertical, item, markBlocks }: { vertical: Vertical; item: VArticleViewData; markBlocks?: boolean }) {
  return (
    <>
      <VPageHead vertical={vertical} crumbs={[{ label: "Tin tức", href: `${vertical.base}/tin-tuc` }, { label: item.title }]} title={item.title}>
        <p className="mt-6 flex flex-wrap gap-x-3 text-caption text-v-mute">
          <time dateTime={item.date}>{formatDate(item.date)}</time>
          <span aria-hidden className="text-v-mark">/</span>
          <span><BrandText text={item.author} /></span>
          <span aria-hidden className="text-v-mark">/</span>
          <span>{item.readingMinutes} phút đọc</span>
        </p>
      </VPageHead>

      <Container className="grid gap-10 py-12 md:py-16 lg:grid-cols-[1fr_minmax(0,68ch)_1fr]">
        <div className="lg:col-start-2">
          <div className="v-art relative mb-10 aspect-[16/9] overflow-hidden">
            {item.cover ? (
              <SmartImage src={item.cover} alt={item.title} fill preload sizes="(min-width: 1024px) 720px, 100vw" className="object-cover" />
            ) : (
              item.art && <ProductArt kind={item.art} className="absolute inset-0 m-auto size-[70%]" />
            )}
          </div>
          <p className="text-h4 font-medium leading-relaxed text-v-fg">{item.excerpt}</p>
          <div className="text-lead leading-[1.8] text-v-mute [&_li]:text-v-fg/90">
            {item.content.map((b, i) => <VArticleBlock key={i} block={b} index={markBlocks ? i : undefined} />)}
          </div>
          <ul className="mt-10 flex flex-wrap gap-2">
            {item.tags.map((t) => (
              <li key={t} className="rounded-full bg-v-chip px-3 py-1 text-caption text-v-fg">{t}</li>
            ))}
          </ul>
        </div>
      </Container>
    </>
  );
}
