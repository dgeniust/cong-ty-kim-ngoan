import "server-only";
import { CalendarClock, Clock, Package, Truck, type LucideIcon } from "lucide-react";
import type { HeroSlide } from "@/components/hub/hero-carousel";
import type { ShowcaseItem, ShowcaseTab, ShowcaseVisual } from "@/components/hub/product-tabs";
import { npkOf } from "@/components/phanbon/npk-label";
import { HUB_HERO } from "@/lib/content/hub-home";
import { ZONES } from "@/lib/content/hub-extras";
import { getCategories, getProducts } from "@/lib/data/catalog";
import type { CatalogProduct, NewsItem } from "@/lib/data/types";
import { formatOpeningHours } from "@/lib/format";
import { getCategory as getFertilizerCategory } from "@/lib/mock/categories";
import type { Product } from "@/lib/mock/types";
import type { Settings } from "@/lib/settings/server";
import { SECTOR_DOT, telHref, type CatalogSite } from "@/lib/verticals";

/** Dựng dữ liệu cho landing tổng từ cài đặt + kho sản phẩm + tin tức. Chỉ chạy trên server. */

type Company = Settings["COMPANY"];
type Verticals = Settings["VERTICALS"];

const PLACEHOLDER_IMAGE = /tmp-img/;

/** Ảnh thật đầu tiên (bỏ ảnh giữ chỗ). */
const realImage = (images?: string[]) => images?.find((src) => src && !PLACEHOLDER_IMAGE.test(src));

const badgeOf = (p: { featured?: boolean; isNew?: boolean }) => (p.isNew ? "Mới" : p.featured ? "Bán chạy" : undefined);

/** Bán chạy trước, rồi hàng mới. */
const byHighlight = <T extends { featured?: boolean; isNew?: boolean }>(a: T, b: T) =>
  Number(!!b.featured) - Number(!!a.featured) || Number(!!b.isNew) - Number(!!a.isNew);

/* ------------------------------------------------------------------ hero */

export function buildHeroSlides(company: Company, verticals: Verticals): HeroSlide[] {
  return HUB_HERO.slides.map(({ id, text, ...slide }) => ({
    ...slide,
    id,
    label: verticals[id].name,
    text: text.replace("{founded}", company.founded).replace("{area}", company.area),
    href: verticals[id].base,
    phone: verticals[id].phone,
    phoneHref: telHref(verticals[id].phone),
  }));
}

/* ------------------------------------------------------------------ số liệu */

export type Stat = { icon: LucideIcon; value: string; label: string };

export function buildStats(company: Company, productCount: number): Stat[] {
  const years = new Date().getFullYear() - Number(company.founded);
  const hours = formatOpeningHours(company.openingHours).split(",")[0];
  return [
    { icon: CalendarClock, value: `${years}+ năm`, label: `Gắn bó với nhà vườn từ ${company.founded}` },
    { icon: Package, value: `${productCount}+`, label: "Sản phẩm ở 3 ngành hàng" },
    { icon: Truck, value: `${ZONES[0].radiusKm} km`, label: "Bán kính giao trong ngày" },
    { icon: Clock, value: "7 ngày", label: `${hours} mỗi ngày` },
  ];
}

/* ------------------------------------------------------------------ sản phẩm tiêu biểu */

/** Phân bón chưa có ảnh bao bì → "nhãn bao": công thức N-P-K, hoặc thành phần chính. */
function fertilizerVisual(p: Product): ShowcaseVisual {
  const image = realImage(p.images);
  if (image) return { type: "image", src: image };

  const npk = npkOf(p);
  if (npk) return { type: "label", formula: npk.formula + (npk.extra ?? ""), note: "N – P – K", bars: npk.values, tone: "npk" };

  const isDrug = p.categorySlug.startsWith("thuoc") || p.categorySlug === "kich-thich-sinh-truong";
  const tone = isDrug ? "drug" : "organic";
  const main = p.ingredients.find((i) => /\d/.test(i.value));
  if (main) return { type: "label", formula: main.value.replace(/\s+/g, " ").slice(0, 14), note: main.name.slice(0, 22), tone };

  const category = getFertilizerCategory(p.categorySlug)?.name ?? "";
  return { type: "label", formula: isDrug ? "BVTV" : "Hữu cơ", note: category.replace(/^(Phân bón|Thuốc)\s*/i, "").slice(0, 22), tone };
}

const fertilizerItem = (p: Product, base: string): ShowcaseItem => ({
  id: `pb-${p.slug}`,
  name: p.name,
  group: getFertilizerCategory(p.categorySlug)?.name ?? "Phân bón",
  desc: p.shortDescription,
  spec: p.packing[0],
  href: `${base}/san-pham/${p.slug}`,
  badge: badgeOf(p),
  visual: fertilizerVisual(p),
});

const catalogItem = (site: CatalogSite, p: CatalogProduct, base: string): ShowcaseItem => {
  const image = realImage(p.images);
  return {
    id: `${site}-${p.slug}`,
    name: p.name,
    group: getCategories(site).find((c) => c.slug === p.categorySlug)?.name ?? "",
    desc: p.shortDescription,
    spec: p.keySpec,
    href: `${base}/san-pham/${p.slug}`,
    badge: badgeOf(p),
    visual: image ? { type: "image", src: image } : { type: "art", art: p.art },
  };
};

export async function buildShowcase(verticals: Verticals, fertilizers: Product[]) {
  const [tyres, steels] = await Promise.all([getProducts("lopxe"), getProducts("satthep")]);
  const phanbon = verticals.phanbon;

  const tabs: ShowcaseTab[] = [
    {
      id: "phanbon",
      label: phanbon.short,
      dot: SECTOR_DOT.phanbon,
      allHref: `${phanbon.base}/san-pham`,
      allLabel: `Xem tất cả ${fertilizers.length} sản phẩm phân bón & thuốc`,
      total: fertilizers.length,
      items: [...fertilizers].sort(byHighlight).map((p) => fertilizerItem(p, phanbon.base)),
    },
    ...([
      ["lopxe", tyres],
      ["satthep", steels],
    ] as const).map(([site, products]) => {
      const v = verticals[site];
      return {
        id: site,
        label: v.short,
        dot: SECTOR_DOT[site],
        allHref: `${v.base}/san-pham`,
        allLabel: `Xem tất cả ${products.length} sản phẩm ${v.short.toLowerCase()}`,
        total: products.length,
        items: [...products].sort(byHighlight).map((p) => catalogItem(site, p, v.base)),
      };
    }),
  ];

  return { tabs, productCount: fertilizers.length + tyres.length + steels.length };
}

/* ------------------------------------------------------------------ tin tức */

/**
 * 1 bài phân bón nổi bật (ưu tiên bài có ảnh) + 1 bài lốp xe + 1 bài sắt thép,
 * kèm vài bài phân bón khác dạng danh sách → khối tin vẫn nghiêng về phân bón.
 */
export function pickHomeNews(all: NewsItem[]) {
  const fertilizer = all.filter((n) => n.site === "phanbon");
  const feature = fertilizer.find((n) => n.cover && !PLACEHOLDER_IMAGE.test(n.cover)) ?? fertilizer[0] ?? all[0];
  const side = (["lopxe", "satthep"] as const)
    .map((site) => all.find((n) => n.site === site && n.cover) ?? all.find((n) => n.site === site))
    .filter((n): n is NewsItem => !!n && n !== feature);
  const more = fertilizer.filter((n) => n !== feature).slice(0, 3);
  return { feature, side, more };
}
