import { VerticalHome } from "@/components/nganh/vertical-home";
import { getBrands, getCatalog, getFeatured } from "@/lib/data/catalog";
import { getNews } from "@/lib/data/news";
import { resolveSite } from "@/lib/site-params";

/** Trang chủ chuyên trang: cùng bố cục Notion, màu theo theme của từng ngành (.theme-lopxe / .theme-satthep). */
export default async function VerticalHomePage({ params }: { params: Promise<{ site: string }> }) {
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
  return <VerticalHome {...props} />;
}
