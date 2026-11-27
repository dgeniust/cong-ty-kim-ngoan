import type { Article, Product } from "@/types/phanbon";
import { getCategory } from "./categories";

/** Lowercase + strip Vietnamese diacritics so "phan bon" matches "Phân bón". */
export function normalize(s: string) {
  return s.normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/đ/g, "d").replace(/Đ/g, "d").toLowerCase().trim();
}

/** Searches the lists the page passes in (read from the admin stores, so new products and published articles are found). */
export function search(query: string, { products, articles }: { products: Product[]; articles: Article[] }) {
  const terms = normalize(query).split(/\s+/).filter(Boolean);
  if (!terms.length) return { products: [] as Product[], articles: [] as Article[] };
  const match = (haystack: string) => {
    const h = normalize(haystack);
    return terms.every((t) => h.includes(t));
  };
  return {
    products: products.filter((p) =>
      match([p.name, p.shortDescription, getCategory(p.categorySlug)?.name, ...p.crops].join(" "))
    ),
    articles: articles.filter((a) => match([a.title, a.excerpt, ...a.tags].join(" "))),
  };
}
