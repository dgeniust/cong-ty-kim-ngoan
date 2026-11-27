import "server-only";
import { cache } from "react";
import { z } from "zod";
import { articles as fertilizerSeed } from "@/lib/mock/articles";
import { readJson, writeJson } from "@/lib/store/json-file";
import type { Article, ArticleSection } from "@/types/phanbon";
import { articleSchema, type ArticleSite, type StoredArticle } from "./schema";
import { CATALOG_NEWS_SEED } from "./seed";

/**
 * Article store for the three sector sites: data/articles-{phanbon|lopxe|satthep}.json – same pattern as
 * lib/products/server.ts. No file yet → the sample articles in code are used; the admin overwrites a
 * site's whole list. Moving to a database later only changes this file (see README › Lưu trữ bài viết).
 */
const file = (site: ArticleSite) => `articles-${site}.json`;

const SEED: Record<ArticleSite, StoredArticle[]> = {
  phanbon: fertilizerSeed.map((a) => ({ ...a, site: "phanbon" as const })),
  lopxe: CATALOG_NEWS_SEED.filter((n) => n.site === "lopxe").map((n) => ({ ...n, site: "lopxe" as const, section: "tin-tuc" as const })),
  satthep: CATALOG_NEWS_SEED.filter((n) => n.site === "satthep").map((n) => ({ ...n, site: "satthep" as const, section: "tin-tuc" as const })),
};

const newestFirst = (a: StoredArticle, b: StoredArticle) => b.date.localeCompare(a.date);

/** Every article of a site, drafts included (admin). */
export const getAllArticles = cache(async (site: ArticleSite): Promise<StoredArticle[]> => {
  const raw = await readJson(file(site));
  if (raw === undefined) return SEED[site];
  const parsed = z.array(articleSchema).safeParse(raw);
  if (parsed.success) return parsed.data;
  console.warn(`[articles] articles-${site}.json không hợp lệ, dùng dữ liệu mẫu`, parsed.error.issues[0]);
  return SEED[site];
});

/** Published articles of a site (optionally one section), newest first – what the website shows. */
export async function getPublishedArticles(site: ArticleSite, section?: ArticleSection) {
  return (await getAllArticles(site)).filter((a) => !a.draft && (!section || a.section === section)).sort(newestFirst);
}

export async function getPublishedArticle(site: ArticleSite, section: ArticleSection, slug: string) {
  return (await getAllArticles(site)).find((a) => !a.draft && a.section === section && a.slug === slug);
}

/* ---- fertilizer helpers: same shape as the old lib/mock/articles getters (cover is required there) ---- */

export const getFertilizerArticles = async (section: ArticleSection) => (await getPublishedArticles("phanbon", section)) as Article[];
export const getFertilizerArticle = async (section: ArticleSection, slug: string) => (await getPublishedArticle("phanbon", section, slug)) as Article | undefined;

export const saveArticles = (site: ArticleSite, list: StoredArticle[]) => writeJson(file(site), list);
