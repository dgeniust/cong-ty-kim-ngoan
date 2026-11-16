import type { CatalogSite } from "@/lib/verticals";
import type { ArticleBlock } from "@/lib/mock/types";

/** Hình minh hoạ vector (xem components/nganh/product-art.tsx) – dùng khi chưa có ảnh chụp thật. */
export type ArtKind = "tyre" | "tyre-at" | "tyre-truck" | "rebar" | "ibeam" | "pipe" | "box" | "roofing" | "coil" | "plate";

export type CatalogCategory = { slug: string; name: string; description: string; art: ArtKind };

export type CatalogProduct = {
  site: CatalogSite;
  slug: string;
  name: string;
  brand: string;
  categorySlug: string;
  sku: string;
  shortDescription: string;
  /** Thông số chính hiển thị ngay trên thẻ sản phẩm (VD: "205/55R16", "Ø10 – CB300"). */
  keySpec: string;
  specs: { name: string; value: string }[];
  highlights: string[];
  description: string[];
  art: ArtKind;
  /** Ảnh chụp thật (đặt trong /public). Có ảnh thì ưu tiên ảnh, không thì dùng `art`. */
  images?: string[];
  featured?: boolean;
  isNew?: boolean;
};

export type CatalogContent = {
  hero: { eyebrow: string; title: string[]; description: string; stats: { value: string; label: string }[] };
  usps: { title: string; description: string }[];
  services: { title: string; description: string }[];
  about: { title: string; paragraphs: string[] };
  productNoun: string;
};

export type NewsItem = {
  site: "phanbon" | CatalogSite;
  slug: string;
  title: string;
  excerpt: string;
  cover?: string;
  art?: ArtKind;
  date: string;
  author: string;
  readingMinutes: number;
  tags: string[];
  content: ArticleBlock[];
  /** Đường dẫn chi tiết trong chuyên trang tương ứng. */
  href: string;
};
