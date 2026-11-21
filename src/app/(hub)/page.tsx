import { AboutSection } from "@/components/business/about-section";
import { ContactSection } from "@/components/business/contact-section";
import { BizHero } from "@/components/business/hero";
import { NewsSection } from "@/components/business/news-section";
import { ProductsSection } from "@/components/business/products-section";
import { ArrowLink, Eyebrow, SlideArrow, bizButton } from "@/components/business/ui";
import { HUB_HERO } from "@/lib/content/hub-home";
import { getNews } from "@/lib/data/news";
import { buildHeroSlides, buildSpotlights, buildStats, heroLead, pickHomeNews } from "@/lib/hub/home";
import { getFertilizerProducts } from "@/lib/products/server";
import { getSettings } from "@/lib/settings/server";

/**
 * Landing tổng `/` – phong cách Business / Editorial Industrial (nhánh fe/bussiness-style-v1), xem design.md §16.
 * Hero (ảnh nền 3 ngành + thanh chỉ số) → Giới thiệu → Sản phẩm (tab trưng bày) → Tin tức → Liên hệ (form + bản đồ).
 * Server Component; chỉ hero, tab sản phẩm, form và bản đồ chạy phía trình duyệt.
 */
export default async function HubHome() {
  const [{ COMPANY, VERTICALS, VERTICAL_LIST }, fertilizers, allNews] = await Promise.all([getSettings(), getFertilizerProducts(), getNews()]);
  const { spotlights, productCount } = await buildSpotlights(VERTICALS, fertilizers);
  const [firstLine, secondLine] = HUB_HERO.titleLines;

  return (
    <>
      <BizHero slides={buildHeroSlides(VERTICALS)} stats={buildStats(COMPANY, productCount)}>
        <Eyebrow className="text-hub-ink-soft">{HUB_HERO.eyebrow}</Eyebrow>
        <h1 id="hero-title" className="mt-6 text-[clamp(2.6rem,5.2vw,4.75rem)] font-bold leading-[1.02] tracking-[-0.03em] text-hub-ink">
          <span className="block">{firstLine}</span> <span className="block text-biz-moss">{secondLine}</span>
        </h1>
        <p className="mt-6 max-w-[34rem] text-lead leading-relaxed text-hub-ink-soft">{heroLead(COMPANY)}</p>
        <div className="mt-9 flex flex-wrap items-center gap-x-7 gap-y-3">
          <a href={HUB_HERO.primaryCta.href} className={bizButton.solid}>
            {HUB_HERO.primaryCta.label} <SlideArrow />
          </a>
          <ArrowLink href={HUB_HERO.secondaryCta.href}>{HUB_HERO.secondaryCta.label}</ArrowLink>
        </div>
      </BizHero>
      {/* nền chung “vườn xanh nhẹ”: một lớp màu loang + nhành lá hai mép, mỗi khối đổi vị trí lá (design.md §6) */}
      <div className="biz-garden relative isolate overflow-x-clip">
        <AboutSection company={COMPANY} />
        <ProductsSection spotlights={spotlights} />
        <NewsSection news={pickHomeNews(allNews)} verticals={VERTICALS} />
        <ContactSection company={COMPANY} verticalList={VERTICAL_LIST} />
      </div>
    </>
  );
}
