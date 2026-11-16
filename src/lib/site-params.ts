import { notFound } from "next/navigation";
import { CATALOG_SITES, VERTICALS, isCatalogSite } from "@/lib/verticals";

/** Dùng trong mọi route `[site]`: xác thực tham số và trả về cấu hình chuyên trang. */
export function resolveSite(site: string) {
  if (!isCatalogSite(site)) notFound();
  return { site, vertical: VERTICALS[site] };
}

export const siteStaticParams = () => CATALOG_SITES.map((site) => ({ site }));
