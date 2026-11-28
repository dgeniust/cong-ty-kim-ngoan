import Link from "next/link";
import { Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { telHref } from "@/lib/verticals";
import { Container } from "@/components/shared/container";
import { SmartImage } from "@/components/shared/smart-image";
import { BrandText } from "@/components/shared/brand-text";
import { formatDate } from "@/lib/format";
import type { ArticleBlock, ArticleSection } from "@/types/phanbon";
import { Breadcrumbs } from "./breadcrumbs";
import { ShareButtons } from "./share-buttons";

/** What the fertilizer article page shows – shared by the live page and the admin preview so both always match. */
export type PbArticleViewData = {
  section: ArticleSection;
  title: string;
  excerpt: string;
  author: string;
  date: string;
  readingMinutes: number;
  cover: string;
  tags: string[];
  content: ArticleBlock[];
};

/** One content block. `index` marks the element so the admin preview can scroll to the block being edited. */
export function PbArticleBlock({ block, index }: { block: ArticleBlock; index?: number }) {
  const mark = index === undefined ? undefined : { "data-block": index };
  switch (block.type) {
    case "h2":
      return <h2 {...mark} className="text-h3 mt-12 font-bold text-brand-900">{block.text}</h2>;
    case "p":
      return <p {...mark} className="mt-5">{block.text}</p>;
    case "ul":
      return (
        <ul {...mark} className="mt-5 space-y-3">
          {block.items.map((it, i) => (
            <li key={i} className="flex gap-3.5">
              <span className="mt-[13px] size-1.5 shrink-0 rounded-full bg-sun-500" aria-hidden />
              <span>{it}</span>
            </li>
          ))}
        </ul>
      );
    case "quote":
      return (
        <blockquote {...mark} className="my-10 rounded-2xl bg-surface px-7 py-6 md:px-9 md:py-8">
          <p className="font-script text-h3 text-brand-800">{block.text}</p>
        </blockquote>
      );
    case "img":
      return (
        <figure {...mark} className="my-10">
          <div className="relative aspect-[16/9] overflow-hidden rounded-2xl bg-surface">
            <SmartImage src={block.src} alt={block.caption ?? ""} fill sizes="(min-width: 1024px) 720px, 100vw" className="object-cover" />
          </div>
          {block.caption && <figcaption className="mt-3 text-center text-small text-ink-subtle">{block.caption}</figcaption>}
        </figure>
      );
  }
}

/** "Need a technician?" card at the top of the side column. */
export function PbArticleCallCard({ phone }: { phone: string }) {
  return (
    <div className="rounded-lg bg-brand-900 p-6 text-white">
      <p className="text-title font-semibold">Cần kỹ thuật viên hỗ trợ?</p>
      <p className="mt-2 text-small leading-relaxed text-white/70">Gọi để được tư vấn miễn phí cho vườn của bạn.</p>
      <Button asChild variant="sun" className="mt-5 w-full">
        <a href={telHref(phone)}>
          <Phone /> {phone}
        </a>
      </Button>
    </div>
  );
}

/** Article head, cover and body (+ the side column passed in as `aside`). */
export function PbArticleView({ article, sectionTitle, aside, markBlocks }: { article: PbArticleViewData; sectionTitle: string; aside?: React.ReactNode; markBlocks?: boolean }) {
  const { section } = article;
  return (
    <article>
      <header className="bg-paper pb-20 pt-8 md:pb-28 md:pt-10">
        <Container className="max-w-6xl">
          <Breadcrumbs items={[{ label: sectionTitle, href: `/phanbon/${section}` }, { label: article.title }]} />
          <div className="mt-10 max-w-3xl">
            <Link href={`/phanbon/${section}`} className="text-small font-medium text-brand-600 hover:text-brand-800">
              {sectionTitle}
            </Link>
            <h1 className="text-h1 mt-3 font-bold text-brand-900">{article.title}</h1>
            <p className="mt-5 text-lead text-ink-muted">{article.excerpt}</p>
            <p className="mt-6 flex flex-wrap items-center gap-x-4 gap-y-1 text-small text-ink-subtle">
              <span className="font-medium text-ink-muted"><BrandText text={article.author} /></span>
              <time dateTime={article.date}>{formatDate(article.date)}</time>
              <span>{article.readingMinutes} phút đọc</span>
            </p>
          </div>
        </Container>
      </header>

      <Container className="max-w-6xl">
        <div className="relative -mt-12 aspect-[16/9] overflow-hidden rounded-lg bg-surface md:-mt-16">
          <SmartImage src={article.cover} alt={article.title} fill preload sizes="(min-width: 1024px) 1024px, 100vw" className="object-cover" />
        </div>
      </Container>

      <Container className="grid max-w-6xl gap-14 py-14 md:py-20 lg:grid-cols-[1fr_300px] lg:gap-16">
        <div className="prose-kn min-w-0">
          {article.content.map((b, i) => (
            <PbArticleBlock key={i} block={b} index={markBlocks ? i : undefined} />
          ))}

          <footer className="mt-14 flex flex-wrap items-center justify-between gap-5 rounded-2xl bg-surface px-5 py-4">
            {article.tags.length > 0 && (
              <ul className="flex flex-wrap gap-2" aria-label="Chủ đề">
                {article.tags.map((t) => (
                  <li key={t}>
                    <Link href={`/phanbon/tim-kiem?q=${encodeURIComponent(t)}`} className="inline-flex h-8 items-center rounded-full bg-white px-3.5 text-caption font-medium text-brand-800 transition-shadow hover:shadow-soft">
                      {t}
                    </Link>
                  </li>
                ))}
              </ul>
            )}
            <ShareButtons title={article.title} />
          </footer>
        </div>

        <aside className="space-y-8 lg:sticky lg:top-28 lg:self-start" aria-label="Thông tin thêm">
          {aside}
        </aside>
      </Container>
    </article>
  );
}
