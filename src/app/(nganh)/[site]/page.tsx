import { LopXeHome } from "@/components/nganh/lopxe-home";
import { SatThepHome } from "@/components/nganh/satthep-home";
import { getBrands, getCatalog, getFeatured } from "@/lib/data/catalog";
import { getNews } from "@/lib/data/news";
import { resolveSite } from "@/lib/site-params";

/** Trang chủ chuyên trang: mỗi ngành một bố cục riêng, dùng chung nguồn dữ liệu. */
export default async function VerticalHome({ params }: { params: Promise<{ site: string }> }) {
  const { site, vertical } = resolveSite((await params).site);
  const { categories, content } = getCatalog(site);
  const props = {
    vertical,
    categories,
    content,
    featured: getFeatured(site, 4),
    brands: getBrands(site),
    news: await getNews({ site, limit: 3 }), // tin tức lọc theo chuyên trang
  };
  return site === "lopxe" ? <LopXeHome {...props} /> : <SatThepHome {...props} />;
}
