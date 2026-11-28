import { z } from "zod";
import { ART_KINDS } from "@/lib/products/schema";

const text = z.string().trim();
const imagePath = text.refine((v) => v.startsWith("/") || /^https?:\/\//.test(v), "Ảnh phải là /đường-dẫn hoặc https://");

export const ARTICLE_SITES = ["phanbon", "lopxe", "satthep"] as const;
export type ArticleSite = (typeof ARTICLE_SITES)[number];

/** Fertilizer has three article sections; tyres and steel only have news. */
export const ARTICLE_SECTIONS = ["tin-tuc", "dich-vu", "gioi-thieu"] as const;
export const SECTIONS_BY_SITE: Record<ArticleSite, readonly (typeof ARTICLE_SECTIONS)[number][]> = {
  phanbon: ARTICLE_SECTIONS,
  lopxe: ["tin-tuc"],
  satthep: ["tin-tuc"],
};

/** Content blocks – the same five kinds the article pages already render (types/phanbon.ts → ArticleBlock). */
export const articleBlockSchema = z.discriminatedUnion("type", [
  z.object({ type: z.literal("p"), text: text.min(1, "Đoạn văn đang trống") }),
  z.object({ type: z.literal("h2"), text: text.min(1, "Tiêu đề phụ đang trống") }),
  z.object({ type: z.literal("ul"), items: z.array(text.min(1)).min(1, "Danh sách cần ít nhất 1 dòng") }),
  z.object({ type: z.literal("quote"), text: text.min(1, "Trích dẫn đang trống") }),
  z.object({ type: z.literal("img"), src: imagePath, caption: text.optional() }),
]);

/** One article of any sector site. `readingMinutes` is recomputed on the server at every save. */
export const articleSchema = z
  .object({
    site: z.enum(ARTICLE_SITES),
    section: z.enum(ARTICLE_SECTIONS),
    slug: text.min(2, "Tối thiểu 2 ký tự").regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Chỉ gồm chữ thường không dấu, số và dấu gạch ngang"),
    title: text.min(5, "Tiêu đề tối thiểu 5 ký tự").max(140, "Tiêu đề tối đa 140 ký tự"),
    excerpt: text.min(10, "Tóm tắt tối thiểu 10 ký tự").max(300, "Tóm tắt tối đa 300 ký tự"),
    cover: imagePath.optional(),
    art: z.enum(ART_KINDS).optional(),
    date: text.regex(/^\d{4}-\d{2}-\d{2}$/, "Ngày không hợp lệ"),
    author: text.min(1, "Bắt buộc"),
    readingMinutes: z.number().int().min(1).default(1),
    tags: z.array(text.min(1)).max(6, "Tối đa 6 thẻ").default([]),
    content: z.array(articleBlockSchema).min(1, "Bài viết cần ít nhất 1 khối nội dung"),
    /** Draft: saved but not shown on the website. */
    draft: z.boolean().optional(),
  })
  .superRefine((a, ctx) => {
    if (!SECTIONS_BY_SITE[a.site].includes(a.section)) ctx.addIssue({ code: "custom", path: ["section"], message: "Chuyên mục không thuộc chuyên trang này" });
    // fertilizer cards and article heads always show a photo
    if (a.site === "phanbon" && !a.cover) ctx.addIssue({ code: "custom", path: ["cover"], message: "Cần ảnh bìa" });
  });

export type StoredArticle = z.infer<typeof articleSchema>;

/** ~200 words per minute, never less than 1. */
export function readingMinutes(content: StoredArticle["content"]) {
  const words = content
    .map((b) => (b.type === "ul" ? b.items.join(" ") : b.type === "img" ? (b.caption ?? "") : b.text))
    .join(" ")
    .split(/\s+/)
    .filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
}
