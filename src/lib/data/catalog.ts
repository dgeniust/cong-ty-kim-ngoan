import type { CatalogSite } from "@/lib/verticals";
import * as lopxe from "./lopxe";
import * as satthep from "./satthep";

/**
 * Lớp truy cập dữ liệu sản phẩm cho /lopxe và /satthep.
 * Hiện đọc từ dữ liệu mẫu; khi có backend chỉ cần thay thân các hàm này bằng fetch().
 */
const SOURCES = { lopxe, satthep } as const;

export const getCatalog = (site: CatalogSite) => SOURCES[site];
export const getCategories = (site: CatalogSite) => SOURCES[site].categories;
export const getCategory = (site: CatalogSite, slug: string) => SOURCES[site].categories.find((c) => c.slug === slug);
export const getBrands = (site: CatalogSite) => [...new Set(SOURCES[site].products.map((p) => p.brand))].sort((a, b) => a.localeCompare(b, "vi"));

export function getProducts(site: CatalogSite, filter: { category?: string; brand?: string; q?: string } = {}) {
  const q = filter.q?.trim().toLowerCase();
  return SOURCES[site].products.filter(
    (p) =>
      (!filter.category || p.categorySlug === filter.category) &&
      (!filter.brand || p.brand === filter.brand) &&
      (!q || `${p.name} ${p.brand} ${p.keySpec}`.toLowerCase().includes(q)),
  );
}

export const getProduct = (site: CatalogSite, slug: string) => SOURCES[site].products.find((p) => p.slug === slug);
export const getFeatured = (site: CatalogSite, limit = 4) =>
  [...SOURCES[site].products].sort((a, b) => Number(!!b.featured) - Number(!!a.featured)).slice(0, limit);
