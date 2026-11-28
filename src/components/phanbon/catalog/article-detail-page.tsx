import Link from "next/link";
import { notFound } from "next/navigation";
import { Container } from "@/components/shared/container";
import { JsonLd } from "@/components/shared/json-ld";
import { SmartImage } from "@/components/shared/smart-image";
import { SectionHeading } from "@/components/phanbon/section-heading";
import { getContent } from "@/lib/content/store";
import { formatDate } from "@/lib/format";
import { articleSections } from "@/lib/mock/articles";
import { getFertilizerArticle, getFertilizerArticles } from "@/lib/articles/server";
import type { ArticleSection } from "@/types/phanbon";
import { absoluteUrl } from "@/lib/site";
import { ArticleCard } from "./article-card";
import { PbArticleCallCard, PbArticleView } from "./pb-article-view";

export async function ArticleDetailPage({ section, slug }: { section: ArticleSection; slug: string }) {
  const article = await getFertilizerArticle(section, slug);
  if (!article) notFound();
  const { site } = await getContent();
  const meta = articleSections[section];
  const [inSection, news] = await Promise.all([getFertilizerArticles(section), getFertilizerArticles("tin-tuc")]);
  const others = inSection.filter((a) => a.slug !== slug);
  const latest = news.filter((a) => a.slug !== slug).slice(0, 4);
  const url = absoluteUrl(`/phanbon/${section}/${slug}`);

  const structured = {
    "@context": "https://schema.org",
    "@type": section === "tin-tuc" ? "NewsArticle" : "Article",
    headline: article.title,
    description: article.excerpt,
    image: [absoluteUrl(article.cover)],
    datePublished: article.date,
    dateModified: article.date,
    author: { "@type": "Organization", name: article.author },
    publisher: { "@type": "Organization", name: `${site.companyPrefix} ${site.companyName}`.trim(), url: absoluteUrl("/phanbon") },
    mainEntityOfPage: url,
    keywords: article.tags.join(", "),
    inLanguage: "vi-VN",
  };

  return (
    <>
      <JsonLd data={structured} />
      <PbArticleView
        article={article}
        sectionTitle={meta.title}
        aside={
          <>
            <PbArticleCallCard phone={site.phone} />

            {latest.length > 0 && (
              <div>
                <h2 className="text-h4 font-semibold text-brand-900">Bài viết mới</h2>
                <ul className="mt-5 space-y-5">
                  {latest.map((a) => (
                    <li key={a.slug}>
                      <Link href={`/phanbon/${a.section}/${a.slug}`} className="group flex gap-4">
                        <div className="relative size-[72px] shrink-0 overflow-hidden rounded-xl bg-surface">
                          <SmartImage src={a.cover} alt={a.title} fill sizes="72px" className="object-cover" />
                        </div>
                        <div className="min-w-0">
                          <p className="line-clamp-2 text-body font-medium leading-snug text-brand-900 group-hover:text-brand-700">{a.title}</p>
                          <time dateTime={a.date} className="mt-1.5 block text-caption text-ink-subtle">
                            {formatDate(a.date)}
                          </time>
                        </div>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </>
        }
      />

      {others.length > 0 && (
        <section aria-labelledby="lien-quan-title" className="bg-surface py-20 md:py-28">
          <Container>
            <SectionHeading id="lien-quan-title" title="Bài viết cùng chuyên mục" />
            <div className="grid gap-x-6 gap-y-12 md:grid-cols-2 lg:grid-cols-3">
              {others.slice(0, 3).map((a) => (
                <ArticleCard key={a.slug} article={a} />
              ))}
            </div>
          </Container>
        </section>
      )}
    </>
  );
}
