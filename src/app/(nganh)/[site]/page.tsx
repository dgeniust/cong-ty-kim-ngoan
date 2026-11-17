import { LopXeHome } from "@/components/nganh/lopxe-home";
import { SatThepHome } from "@/components/nganh/satthep-home";
import { getBrands, getCatalog, getFeatured, getProducts } from "@/lib/data/catalog";
import { getNews } from "@/lib/data/news";
import { resolveSite } from "@/lib/site-params";

/**
 * Trang chủ chuyên trang: cùng ngôn ngữ Notion nhưng MỖI NGÀNH MỘT BỐ CỤC RIÊNG
 * (lốp xe xoay quanh việc tra cỡ lốp; sắt thép mang chất tài liệu báo giá & công cụ tính thép).
 */
export default async function VerticalHomePage({ params }: { params: Promise<{ site: string }> }) {
  const { site, vertical } = await resolveSite((await params).site);
  const { categories, content } = getCatalog(site);
  const props = {
    vertical,
    categories,
    content,
    featured: await getFeatured(site, 4),
    allProducts: await getProducts(site),
    brands: await getBrands(site),
    news: await getNews({ site, limit: 3 }), // tin tức lọc theo chuyên trang
  };
  return site === "lopxe" ? <LopXeHome {...props} /> : <SatThepHome {...props} />;
}
