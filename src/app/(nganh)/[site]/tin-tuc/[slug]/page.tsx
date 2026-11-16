import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProductArt } from "@/components/nganh/product-art";
import { VNewsCard } from "@/components/nganh/v-news-card";
import { VPageHead } from "@/components/nganh/v-page-head";
import { VContainer, VHeading } from "@/components/nganh/v-section";
import { JsonLd } from "@/components/shared/json-ld";
import { SmartImage } from "@/components/shared/smart-image";
import { getNews, getNewsItem } from "@/lib/data/news";
import { formatDate } from "@/lib/format";
import type { ArticleBlock } from "@/lib/mock/types";
import { absoluteUrl } from "@/lib/site";
import { resolveSite } from "@/lib/site-params";
import { CATALOG_SITES, COMPANY, isCatalogSite } from "@/lib/verticals";

type Params = Promise<{ site: string; slug: string }>;

export async function generateStaticParams() {
  const all = await Promise.all(CATALOG_SITES.map((site) => getNews({ site })));
  return all.flat().map((n) => ({ site: n.site, slug: n.slug }));
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { site, slug } = await params;
  if (!isCatalogSite(site)) return {};
  const n = await getNewsItem(site, slug);
  if (!n) return {};
  return {
    title: n.title,
    description: n.excerpt,
    alternates: { canonical: n.href },
    openGraph: { type: "article", url: n.href, title: n.title, description: n.excerpt, publishedTime: n.date, authors: [n.author], ...(n.cover ? { images: [n.cover] } : {}) },
  };
}

function Block({ block }: { block: ArticleBlock }) {
  switch (block.type) {
    case "h2":
      return <h2 className="v-display mt-12 text-3xl text-v-fg md:text-4xl">{block.text}</h2>;
    case "p":
      return <p className="mt-5">{block.text}</p>;
    case "ul":
      return (
        <ul className="mt-5 space-y-3">
          {block.items.map((it) => (
            <li key={it} className="flex gap-3.5">
              <span aria-hidden className="mt-[11px] size-2 shrink-0 rotate-45 bg-v-mark" />
              <span>{it}</span>
            </li>
          ))}
        </ul>
      );
    case "quote":
      return (
        <blockquote className="my-10 bg-v-invert px-7 py-8 text-v-on-invert md:px-10">
          <p className="v-display text-2xl md:text-3xl">{block.text}</p>
        </blockquote>
      );
    case "img":
      return (
        <figure className="my-10">
          <div className="relative aspect-[16/9] overflow-hidden bg-v-raise">
            <SmartImage src={block.src} alt={block.caption ?? ""} fill sizes="(min-width: 1024px) 720px, 100vw" className="object-cover" />
          </div>
          {block.caption && <figcaption className="mt-3 text-sm text-v-mute">{block.caption}</figcaption>}
        </figure>
      );
  }
}

export default async function NewsDetail({ params }: { params: Params }) {
  const { site: rawSite, slug } = await params;
  const { site, vertical } = resolveSite(rawSite);
  const item = await getNewsItem(site, slug);
  if (!item) notFound();
  const others = (await getNews({ site })).filter((n) => n.slug !== slug).slice(0, 3);

  return (
    <article>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Article",
          headline: item.title,
          description: item.excerpt,
          datePublished: item.date,
          author: { "@type": "Organization", name: item.author },
          publisher: { "@type": "Organization", name: COMPANY.legalName, url: absoluteUrl("/") },
          mainEntityOfPage: absoluteUrl(item.href),
        }}
      />
      <VPageHead vertical={vertical} crumbs={[{ label: "Tin tức", href: `${vertical.base}/tin-tuc` }, { label: item.title }]} title={item.title}>
        <p className="v-label mt-6 flex flex-wrap gap-x-3 text-xs text-v-mute">
          <time dateTime={item.date}>{formatDate(item.date)}</time>
          <span aria-hidden className="text-v-mark">/</span>
          <span>{item.author}</span>
          <span aria-hidden className="text-v-mark">/</span>
          <span>{item.readingMinutes} phút đọc</span>
        </p>
      </VPageHead>

      <VContainer className="grid gap-10 py-12 md:py-16 lg:grid-cols-[1fr_minmax(0,68ch)_1fr]">
        <div className="lg:col-start-2">
          <div className="v-art relative mb-10 aspect-[16/9] overflow-hidden">
            {item.cover ? (
              <SmartImage src={item.cover} alt="" fill priority sizes="(min-width: 1024px) 720px, 100vw" className="object-cover" />
            ) : (
              item.art && <ProductArt kind={item.art} className="absolute inset-0 m-auto size-[70%]" />
            )}
          </div>
          <p className="text-xl font-medium leading-relaxed text-v-fg">{item.excerpt}</p>
          <div className="text-[1.0625rem] leading-[1.8] text-v-mute [&_li]:text-v-fg/90">
            {item.content.map((b, i) => <Block key={i} block={b} />)}
          </div>
          <ul className="mt-10 flex flex-wrap gap-2">
            {item.tags.map((t) => (
              <li key={t} className="v-label bg-v-raise px-3 py-1.5 text-xs text-v-mute">{t}</li>
            ))}
          </ul>
        </div>
      </VContainer>

      {others.length > 0 && (
        <section aria-labelledby="bai-khac-title" className="bg-v-sunk py-16 md:py-24">
          <VContainer>
            <VHeading id="bai-khac-title" title="Bài viết khác" href={`${vertical.base}/tin-tuc`} />
            <div className="grid gap-x-5 gap-y-12 md:grid-cols-3">
              {others.map((n) => <VNewsCard key={n.slug} item={n} />)}
            </div>
          </VContainer>
        </section>
      )}
    </article>
  );
}
