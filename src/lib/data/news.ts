import "server-only";
import { getPublishedArticles } from "@/lib/articles/server";
import { ARTICLE_SITES } from "@/lib/articles/schema";
import { VERTICALS, type VerticalId } from "@/lib/verticals";
import type { NewsItem } from "@/types/catalog";

type NewsQuery = { site?: VerticalId; limit?: number };

/**
 * Single news source for the whole system.
 *  - Landing hub:  getNews()          -> every sector site
 *  - Sector site:  getNews({ site })  -> filtered to that site
 * Reads the article store (lib/articles/server.ts): published "tin-tuc" articles only, drafts are hidden.
 * Also exposed through the route handler GET /api/tin-tuc?site=lopxe&limit=3.
 */
export async function getNews({ site, limit }: NewsQuery = {}): Promise<NewsItem[]> {
  const sites = site ? [site] : ARTICLE_SITES;
  const lists = await Promise.all(sites.map((s) => getPublishedArticles(s, "tin-tuc")));
  const all = lists
    .flat()
    .sort((a, b) => b.date.localeCompare(a.date))
    .map(({ site: s, slug, title, excerpt, cover, art, date, author, readingMinutes, tags, content }) => ({
      site: s, slug, title, excerpt, cover, art, date, author, readingMinutes, tags, content,
      href: `${VERTICALS[s].base}/tin-tuc/${slug}`,
    }));
  return limit ? all.slice(0, limit) : all;
}

export async function getNewsItem(site: VerticalId, slug: string) {
  return (await getNews({ site })).find((n) => n.slug === slug);
}
