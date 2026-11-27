import { notFound } from "next/navigation";
import { ArticleManager } from "@/components/admin/article-manager";
import { ARTICLE_SITES, type ArticleSite } from "@/lib/articles/schema";
import { getAllArticles } from "@/lib/articles/server";

export const dynamic = "force-dynamic";

/** Article database of one sector site – list + side-peek editor, same pattern as /admin/san-pham/[site]. */
export default async function ArticlesAdminPage({ params }: { params: Promise<{ site: string }> }) {
  const { site } = await params;
  if (!ARTICLE_SITES.includes(site as ArticleSite)) notFound();
  const s = site as ArticleSite;
  return <ArticleManager site={s} articles={await getAllArticles(s)} />;
}
