import Link from "next/link";
import { ArrowUpRight, Phone } from "lucide-react";
import { ProductArt } from "@/components/nganh/product-art";
import { VButton } from "@/components/nganh/v-button";
import { LopXeHero, SatThepHero } from "@/components/nganh/v-hero";
import { VNewsCard } from "@/components/nganh/v-news-card";
import { VProductCard } from "@/components/nganh/v-product-card";
import { VContainer, VHeading } from "@/components/nganh/v-section";
import { Reveal } from "@/components/shared/reveal";
import { getBrands, getCatalog, getFeatured } from "@/lib/data/catalog";
import { getNews } from "@/lib/data/news";
import { resolveSite } from "@/lib/site-params";
import { telHref } from "@/lib/verticals";
import { cn } from "@/lib/utils";

export default async function VerticalHome({ params }: { params: Promise<{ site: string }> }) {
  const { site, vertical } = resolveSite((await params).site);
  const { categories, content } = getCatalog(site);
  const featured = getFeatured(site, 4);
  const brands = getBrands(site);
  const news = await getNews({ site, limit: 3 }); // tin tức lọc theo chuyên trang
  const Hero = site === "lopxe" ? LopXeHero : SatThepHero;
  const tiles = site === "lopxe";

  return (
    <>
      <Hero vertical={vertical} hero={content.hero} />

      {/* Thương hiệu – dải chữ chạy */}
      <section aria-label="Thương hiệu phân phối" className="overflow-hidden bg-v-invert py-5 text-v-on-invert">
        <div className="marquee-mask flex">
          <ul className="flex shrink-0 animate-marquee items-center gap-12 pr-12 hover:[animation-play-state:paused]">
            {[...brands, ...brands, ...brands, ...brands].map((b, i) => (
              <li key={i} aria-hidden={i >= brands.length || undefined} className="v-display flex items-center gap-12 text-3xl md:text-4xl">
                {b}
                <span aria-hidden className="size-2.5 rotate-45 bg-current opacity-50" />
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Danh mục */}
      <section aria-labelledby="danh-muc-title" className="py-20 md:py-28">
        <VContainer>
          <VHeading
            id="danh-muc-title"
            index="01"
            title={site === "lopxe" ? "Chọn lốp theo loại xe" : "Nhóm vật tư"}
            subtitle={site === "lopxe" ? "Mỗi dòng xe một yêu cầu khác nhau về tải trọng, độ êm và độ bám." : "Đủ chủng loại cho phần thô, kết cấu và hoàn thiện mái."}
          />
          {tiles ? (
            <ul className="grid grid-cols-2 gap-3 lg:grid-cols-4">
              {categories.map((c, i) => (
                <Reveal as="li" key={c.slug} delay={i * 80}>
                  <Link href={`${vertical.base}/san-pham?nhom=${c.slug}`} className="group relative flex aspect-[3/4] flex-col justify-end overflow-hidden bg-v-raise p-5 transition-colors duration-500 hover:bg-v-accent md:p-7">
                    <ProductArt kind={c.art} className="absolute -right-[22%] -top-[8%] size-[105%] transition-transform duration-700 ease-soft group-hover:-rotate-45 group-hover:scale-105" />
                    <div aria-hidden className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black/85 to-transparent transition-opacity duration-500 group-hover:opacity-0" />
                    <h3 className="v-display relative text-3xl text-v-fg transition-colors duration-500 group-hover:text-v-on-accent md:text-4xl">{c.name.replace("Lốp ", "")}</h3>
                    <p className="relative mt-2 hidden text-sm leading-snug text-v-mute transition-colors duration-500 group-hover:text-v-on-accent sm:block">{c.description}</p>
                  </Link>
                </Reveal>
              ))}
            </ul>
          ) : (
            <ul>
              {categories.map((c, i) => (
                <Reveal as="li" key={c.slug} delay={i * 60}>
                  <Link
                    href={`${vertical.base}/san-pham?nhom=${c.slug}`}
                    className={cn("group grid grid-cols-[auto_1fr_auto] items-center gap-5 px-4 py-6 transition-colors duration-500 hover:bg-v-invert md:grid-cols-[5rem_1.1fr_1.4fr_7rem_auto] md:gap-8 md:px-8 md:py-7", i % 2 === 0 && "bg-v-raise")}
                  >
                    <span className="v-display text-2xl text-v-mark">0{i + 1}</span>
                    <h3 className="v-display text-2xl text-v-fg transition-colors duration-500 group-hover:text-v-on-invert md:text-4xl">{c.name}</h3>
                    <p className="hidden text-[15px] leading-relaxed text-v-mute transition-colors duration-500 group-hover:text-white/70 md:block">{c.description}</p>
                    <ProductArt kind={c.art} className="hidden size-24 transition-transform duration-700 ease-soft group-hover:scale-110 md:block" />
                    <ArrowUpRight aria-hidden className="size-7 text-v-fg transition-all duration-500 ease-soft group-hover:translate-x-1 group-hover:-translate-y-1 group-hover:text-v-on-invert" />
                  </Link>
                </Reveal>
              ))}
            </ul>
          )}
        </VContainer>
      </section>

      {/* Sản phẩm nổi bật */}
      <section aria-labelledby="noi-bat-title" className="bg-v-sunk py-20 md:py-28">
        <VContainer>
          <VHeading id="noi-bat-title" index="02" title="Bán chạy nhất" subtitle={`Những dòng ${content.productNoun} khách hàng của Kim Ngoan chọn nhiều nhất.`} href={`${vertical.base}/san-pham`} hrefLabel="Toàn bộ sản phẩm" />
          <div className="grid grid-cols-2 gap-x-3 gap-y-10 md:gap-x-5 lg:grid-cols-4">
            {featured.map((p, i) => (
              <Reveal key={p.slug} delay={i * 80}>
                <VProductCard product={p} />
              </Reveal>
            ))}
          </div>
        </VContainer>
      </section>

      {/* Cam kết */}
      <section aria-labelledby="cam-ket-title" className="bg-v-invert py-20 text-v-on-invert md:py-28">
        <VContainer>
          <Reveal>
            <h2 id="cam-ket-title" className="v-display max-w-4xl text-[clamp(2.5rem,6vw,5.5rem)] !text-v-on-invert">
              Vì sao chọn Kim Ngoan?
            </h2>
          </Reveal>
          <ol className="mt-14 grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
            {content.usps.map((u, i) => (
              <Reveal as="li" key={u.title} delay={i * 90}>
                <p className="v-display text-6xl opacity-30">0{i + 1}</p>
                <h3 className="v-display mt-4 text-2xl !text-v-on-invert">{u.title}</h3>
                <p className="mt-2 text-[15px] leading-relaxed opacity-80">{u.description}</p>
              </Reveal>
            ))}
          </ol>
        </VContainer>
      </section>

      {/* Giới thiệu + dịch vụ */}
      <section aria-labelledby="gioi-thieu-title" className="py-20 md:py-28">
        <VContainer className="grid gap-14 lg:grid-cols-2 lg:gap-20">
          <Reveal>
            <p className="v-label mb-3 flex items-center gap-3 text-sm text-v-mute">
              <span className="text-v-mark">03</span>
              <span aria-hidden className="h-px w-10 bg-current opacity-40" />
            </p>
            <h2 id="gioi-thieu-title" className="v-display text-[clamp(2.25rem,4.6vw,4rem)] text-v-fg">{content.about.title}</h2>
            {content.about.paragraphs.map((t) => (
              <p key={t} className="mt-6 max-w-xl text-[17px] leading-[1.75] text-v-mute">{t}</p>
            ))}
            <VButton asChild variant="solid" className="mt-9">
              <Link href={`${vertical.base}/lien-he`}>Nhận báo giá</Link>
            </VButton>
          </Reveal>
          <ul className="space-y-3 self-end">
            {content.services.map((s, i) => (
              <Reveal as="li" key={s.title} delay={i * 90} className="bg-v-raise p-7 md:p-9">
                <h3 className="v-display text-2xl text-v-fg md:text-3xl">{s.title}</h3>
                <p className="mt-2 text-[15px] leading-relaxed text-v-mute">{s.description}</p>
              </Reveal>
            ))}
          </ul>
        </VContainer>
      </section>

      {/* Tin tức của chuyên trang */}
      {news.length > 0 && (
        <section aria-labelledby="tin-tuc-title" className="bg-v-sunk py-20 md:py-28">
          <VContainer>
            <VHeading id="tin-tuc-title" index="04" title="Tin tức & kiến thức" href={`${vertical.base}/tin-tuc`} hrefLabel="Tất cả bài viết" />
            <div className="grid gap-x-5 gap-y-12 md:grid-cols-3">
              {news.map((n, i) => (
                <Reveal key={n.slug} delay={i * 80}>
                  <VNewsCard item={n} />
                </Reveal>
              ))}
            </div>
          </VContainer>
        </section>
      )}

      {/* Kêu gọi hành động */}
      <section aria-labelledby="cta-title" className="py-20 md:py-28">
        <VContainer>
          <Reveal className="flex flex-col items-start gap-8 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <h2 id="cta-title" className="v-display text-[clamp(2.75rem,8vw,7.5rem)] text-v-fg">
                Cần báo giá? <span className="text-v-mark">Gọi ngay.</span>
              </h2>
              <p className="mt-5 max-w-xl text-lg text-v-mute">{vertical.contactLabel} — gửi quy cách qua Zalo hoặc gọi trực tiếp, chúng tôi phản hồi trong giờ làm việc.</p>
            </div>
            <VButton asChild size="lg" className="h-20 px-12 text-2xl">
              <a href={telHref(vertical.phone)}>
                <Phone className="!size-6" /> <span className="tabular-nums">{vertical.phone}</span>
              </a>
            </VButton>
          </Reveal>
        </VContainer>
      </section>
    </>
  );
}
