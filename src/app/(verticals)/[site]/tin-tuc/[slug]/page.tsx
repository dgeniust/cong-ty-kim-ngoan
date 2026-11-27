import { fitTitle, metaDescription, socialMeta } from "@/lib/seo";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { VNewsCard } from "@/components/verticals/v-news-card";
import { VArticleView } from "@/components/verticals/v-article-view";
import { VHeading } from "@/components/verticals/v-section";
import { JsonLd } from "@/components/shared/json-ld";
import { getNews, getNewsItem } from "@/lib/data/news";
import { absoluteUrl } from "@/lib/site";
import { resolveSite } from "@/lib/site-params";
import { CATALOG_SITES, isCatalogSite } from "@/lib/verticals";
import { getSettings } from "@/lib/settings/server";
import { Container } from "@/components/shared/container";
import { siteNameFor } from "@/lib/site-name";

type Params = Promise<{ site: string; slug: string }>;

/** Products / articles added from the admin after the build still resolve. */
export const dynamicParams = true;

export async function generateStaticParams() {
  const all = await Promise.all(CATALOG_SITES.map((site) => getNews({ site })));
  return all.flat().map((n) => ({ site: n.site, slug: n.slug }));
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { site, slug } = await params;
  if (!isCatalogSite(site)) return {};
  const { VERTICALS, COMPANY } = await getSettings();
  const n = await getNewsItem(site, slug);
  if (!n) return {};
  return {
    title: fitTitle(n.title, `${VERTICALS[site].name} Kim Ngoan`),
    description: metaDescription([n.excerpt, `${VERTICALS[site].name} Kim Ngoan – ${COMPANY.area}`]),
    ...socialMeta({
      title: n.title,
      description: n.excerpt,
      path: n.href,
      siteName: await siteNameFor(site),
      type: "article",
      image: n.cover || undefined,
      publishedTime: n.date,
      authors: [n.author],
    }),
  };
}

export default async function NewsDetail({ params }: { params: Params }) {
  const { COMPANY } = await getSettings();
  const { site: rawSite, slug } = await params;
  const { site, vertical } = await resolveSite(rawSite);
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
      <VArticleView vertical={vertical} item={item} />

      {others.length > 0 && (
        <section aria-labelledby="bai-khac-title" className="border-t border-v-line bg-v-sunk py-16 md:py-24">
          <Container>
            <VHeading id="bai-khac-title" title="Bài viết khác" href={`${vertical.base}/tin-tuc`} />
            <div className="grid gap-x-5 gap-y-12 md:grid-cols-3">
              {others.map((n) => <VNewsCard key={n.slug} item={n} />)}
            </div>
          </Container>
        </section>
      )}
    </article>
  );
}
