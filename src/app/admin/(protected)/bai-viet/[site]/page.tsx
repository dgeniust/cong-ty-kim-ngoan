import { notFound } from "next/navigation";
import { ArticleManager } from "@/components/admin/article-manager";
import { ARTICLE_SITES, type ArticleSite } from "@/lib/articles/schema";
import { getAllArticles } from "@/lib/articles/server";
import { getContent } from "@/lib/content/store";
import { getSettings } from "@/lib/settings/server";

export const dynamic = "force-dynamic";

/** Article database of one sector site – list + side-peek editor with live preview, same pattern as /admin/san-pham/[site]. */
export default async function ArticlesAdminPage({ params }: { params: Promise<{ site: string }> }) {
  const { site } = await params;
  if (!ARTICLE_SITES.includes(site as ArticleSite)) notFound();
  const s = site as ArticleSite;
  const [articles, content, settings] = await Promise.all([getAllArticles(s), getContent(), getSettings()]);
  // what the preview needs besides the article: the fertilizer call card number, or the tyre/steel site header data
  const preview = s === "phanbon" ? { phone: content.site.phone } : { phone: settings.VERTICALS[s].phone, vertical: settings.VERTICALS[s] };
  return <ArticleManager site={s} articles={articles} preview={preview} />;
}
