/** Public site URL – set NEXT_PUBLIC_SITE_URL in production (e.g. https://kimngoan.com). */
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000").replace(/\/$/, "");

export const absoluteUrl = (path = "/") =>
  /^https?:\/\//.test(path) ? path : `${SITE_URL}${path.startsWith("/") ? "" : "/"}${path}`;

/** Chuyên trang phân bón sống dưới /phanbon (xem src/lib/verticals.ts). */
export const PHANBON_BASE = "/phanbon";
const PHANBON_ROUTES = /^\/(san-pham|danh-muc|dich-vu|tin-tuc|gioi-thieu|lien-he|tim-kiem)(\/|\?|#|$)/;

/**
 * Links saved in the CMS của chuyên trang phân bón:
 *  - "#san-pham"  -> "/phanbon#san-pham" (anchor chỉ có ở trang chủ chuyên trang)
 *  - "/san-pham"  -> "/phanbon/san-pham" (link cũ trước khi tách chuyên trang)
 *  - "/"          -> "/phanbon"
 */
export const resolveHref = (href: string) => {
  if (href.startsWith("#")) return `${PHANBON_BASE}${href}`;
  if (href === "/") return PHANBON_BASE;
  if (PHANBON_ROUTES.test(href)) return `${PHANBON_BASE}${href}`;
  return href;
};
