import "@fontsource/dancing-script/vietnamese-600.css";
import "@fontsource/dancing-script/latin-600.css";
import { HeroCarousel } from "@/components/hub/hero-carousel";
import { ContactSection } from "@/components/hub/home/contact-section";
import { NewsSection } from "@/components/hub/home/news-section";
import { ProductsSection } from "@/components/hub/home/products-section";
import { SectorsSection } from "@/components/hub/home/sectors-section";
import { StatsBar } from "@/components/hub/home/stats-bar";
import { Eyebrow } from "@/components/hub/home/ui";
import { HUB_HERO } from "@/lib/content/hub-home";
import { getNews } from "@/lib/data/news";
import { buildHeroSlides, buildShowcase, buildStats, pickHomeNews } from "@/lib/hub/home";
import { getFertilizerProducts } from "@/lib/products/server";
import { getSettings } from "@/lib/settings/server";

/**
 * Landing tổng `/` (nhánh fe/notion-style-v1.2) – xem design.md §15.
 * Hero (ảnh nền 3 ngành, đổi mỗi 6s) → Số liệu → Danh mục + cam kết → Sản phẩm tiêu biểu → Tin tức → Liên hệ.
 * Trang là Server Component; chỉ HeroCarousel và ProductTabs chạy phía trình duyệt.
 * Chữ tĩnh nằm ở `lib/content/hub-home.ts`, phần dựng dữ liệu ở `lib/hub/home.ts`.
 */
export default async function HubHome() {
  const [{ COMPANY, VERTICALS, VERTICAL_LIST }, fertilizers, allNews] = await Promise.all([getSettings(), getFertilizerProducts(), getNews()]);
  const { tabs, productCount } = await buildShowcase(VERTICALS, fertilizers);
  const news = pickHomeNews(allNews);
  const [firstLine, secondLine] = HUB_HERO.titleLines;

  return (
    <>
      <HeroCarousel
        slides={buildHeroSlides(COMPANY, VERTICALS)}
        slogan={COMPANY.slogan}
        eyebrow={
          <Eyebrow>
            {COMPANY.legalName} · từ năm {COMPANY.founded}
          </Eyebrow>
        }
        title={
          <>
            <span className="block">{firstLine}</span> <span className="block text-hub-blue">{secondLine}</span>
          </>
        }
      />
      <StatsBar stats={buildStats(COMPANY, productCount)} />
      <SectorsSection verticals={VERTICALS} fertilizerCount={fertilizers.length} />
      <ProductsSection tabs={tabs} />
      <NewsSection news={news} verticals={VERTICALS} />
      <ContactSection company={COMPANY} verticalList={VERTICAL_LIST} standalone={!news.feature} />
    </>
  );
}
