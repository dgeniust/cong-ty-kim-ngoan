import Link from "next/link";
import { ArrowUpRight, Phone, Search } from "lucide-react";
import type { CatalogCategory, CatalogContent, CatalogProduct, NewsItem } from "@/lib/data/types";
import { telHref, type Vertical } from "@/lib/verticals";
import { ProductArt } from "./product-art";
import { VButton } from "./v-button";
import { VNewsCard } from "./v-news-card";
import { VProductCard } from "./v-product-card";
import { VContainer } from "./v-section";

/**
 * Trang chủ chuyên trang lốp xe – nền đen sâu, ánh xám mềm, điểm nhấn tím-xanh.
 * Thẻ là mảng nền phẳng bo góc (.v-panel), KHÔNG dùng viền.
 * Cố ý gần như tĩnh: không bánh xe quay, không dải chữ chạy, không hiện dần khi cuộn.
 */

function Heading({ id, title, subtitle, center, action }: { id: string; title: string; subtitle?: string; center?: boolean; action?: React.ReactNode }) {
  return (
    <div className={center ? "mx-auto mb-10 max-w-2xl text-center md:mb-12" : "mb-8 flex flex-wrap items-end justify-between gap-5 md:mb-10"}>
      <div>
        <h2 id={id} className="v-display text-[clamp(1.75rem,2.8vw,2.5rem)] text-v-fg">
          {title}
        </h2>
        {subtitle && <p className="mt-3 text-base leading-relaxed text-v-mute">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}

function TextLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link href={href} className="inline-flex items-center gap-1.5 text-[15px] font-medium text-v-mark transition-colors duration-200 hover:text-v-fg">
      {children} <ArrowUpRight className="size-4" aria-hidden />
    </Link>
  );
}

export function LopXeHome({
  vertical,
  categories,
  content,
  featured,
  brands,
  news,
}: {
  vertical: Vertical;
  categories: CatalogCategory[];
  content: CatalogContent;
  featured: CatalogProduct[];
  brands: string[];
  news: NewsItem[];
}) {
  const { hero } = content;
  const base = vertical.base;
  const spotlight = featured[0];
  const [uspLeft, uspRight] = [content.usps.slice(0, 2), content.usps.slice(2, 4)];

  return (
    <>
      {/* 1. Hero: chữ trái – lốp lớn + thẻ thông số nổi */}
      <section className="relative overflow-hidden">
        {/* vệt sáng xám chéo phía sau */}
        <div aria-hidden className="absolute -top-1/3 left-[28%] h-[170%] w-[34%] rotate-[24deg] bg-gradient-to-b from-white/[0.13] via-white/[0.05] to-transparent blur-3xl" />
        <VContainer className="relative grid items-center gap-10 pb-14 pt-10 lg:grid-cols-[1fr_1.1fr] lg:pb-20 lg:pt-16">
          <div>
            <p className="text-sm font-medium text-v-mark">{hero.eyebrow}</p>
            <h1 className="v-display mt-4 text-[length:var(--v-hero-size)] text-v-fg">
              {hero.title.map((line) => (
                <span key={line} className="block">
                  {line}
                </span>
              ))}
            </h1>
            <p className="mt-5 max-w-md text-base leading-relaxed text-v-mute">{hero.description}</p>
            <div className="mt-7 flex flex-wrap gap-3">
              <VButton asChild>
                <Link href={`${base}/san-pham`}>Xem sản phẩm</Link>
              </VButton>
              <VButton asChild variant="quiet">
                <a href={telHref(vertical.phone)}>
                  <Phone /> <span className="tabular-nums">{vertical.phone}</span>
                </a>
              </VButton>
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-[540px] pb-8">
            <div aria-hidden className="absolute inset-x-[12%] top-[8%] aspect-square rounded-full bg-white/[0.07] blur-3xl" />
            <ProductArt kind="tyre-at" title="Lốp ô tô gai địa hình" className="relative mx-auto !size-[86%] drop-shadow-[0_30px_50px_rgb(0_0_0/0.6)]" />
            {spotlight && (
              <Link
                href={`${base}/san-pham/${spotlight.slug}`}
                className="group absolute bottom-0 right-0 w-[min(15rem,62%)] rounded-2xl bg-white/[0.09] p-4 backdrop-blur-xl transition-colors duration-200 hover:bg-white/[0.14]"
              >
                <p className="text-xs text-v-mute">Bán chạy · {spotlight.brand}</p>
                <p className="mt-1 text-[15px] font-semibold leading-snug text-v-fg">{spotlight.name}</p>
                <ul className="mt-2.5 hidden space-y-1 text-[13px] leading-snug text-v-mute sm:block">
                  {spotlight.highlights.slice(0, 3).map((h) => (
                    <li key={h} className="flex gap-2">
                      <span aria-hidden className="mt-[7px] size-1 shrink-0 rounded-full bg-v-mark" />
                      {h}
                    </li>
                  ))}
                </ul>
                <span className="mt-3 inline-flex items-center gap-1 text-[13px] font-medium text-v-mark">
                  Chi tiết <ArrowUpRight className="size-3.5" aria-hidden />
                </span>
              </Link>
            )}
          </div>
        </VContainer>
      </section>

      {/* 2. Danh mục + ô tìm theo cỡ lốp */}
      <section aria-labelledby="danh-muc-title" className="py-14 md:py-20">
        <VContainer>
          <Heading
            id="danh-muc-title"
            title="Danh mục"
            subtitle="Chọn lốp theo loại xe bạn đang chạy."
            action={
              <form action={`${base}/san-pham`} role="search" className="relative w-full sm:w-80">
                <label htmlFor="tim-co-lop" className="sr-only">
                  Tìm theo cỡ lốp hoặc thương hiệu
                </label>
                <Search aria-hidden className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-v-mute" />
                <input
                  id="tim-co-lop"
                  name="q"
                  type="search"
                  placeholder="Tìm cỡ lốp, VD: 205/55R16"
                  className="h-12 w-full rounded-[10px] bg-v-raise pl-11 pr-4 text-[15px] text-v-fg outline-none placeholder:text-v-mute/70 focus:bg-[#1c1c21] focus:shadow-[0_0_0_2px_var(--v-mark)]"
                />
              </form>
            }
          />
          <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {categories.map((c) => (
              <li key={c.slug}>
                <Link href={`${base}/san-pham?nhom=${c.slug}`} className="v-panel group flex h-full flex-col p-5 transition-colors duration-200 hover:bg-[#1c1c21]">
                  <div className="flex items-start justify-between">
                    <span className="grid size-14 place-items-center rounded-full bg-white/[0.07]">
                      <ProductArt kind={c.art} className="!size-11" />
                    </span>
                    <ArrowUpRight aria-hidden className="size-6 text-v-mute transition-colors duration-200 group-hover:text-v-fg" strokeWidth={1.5} />
                  </div>
                  <h3 className="v-display mt-8 text-2xl text-v-fg">{c.name.replace("Lốp ", "").replace(/^./, (ch) => ch.toUpperCase())}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-v-mute">{c.description}</p>
                </Link>
              </li>
            ))}
          </ul>
        </VContainer>
      </section>

      {/* 3. Lời giới thiệu + số liệu */}
      <section aria-labelledby="gioi-thieu-title" className="py-14 md:py-20">
        <VContainer className="text-center">
          <h2 id="gioi-thieu-title" className="v-display mx-auto max-w-3xl text-[clamp(1.75rem,3vw,2.5rem)] text-v-fg">
            {content.about.title}
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-v-mute">{content.about.paragraphs[0]}</p>
          <dl className="mx-auto mt-12 grid max-w-4xl gap-3 sm:grid-cols-3">
            {hero.stats.map((s) => (
              <div key={s.label} className="v-panel px-5 py-8">
                <dt className="sr-only">{s.label}</dt>
                <dd className="text-5xl font-semibold tracking-tight text-v-fg md:text-6xl">{s.value}</dd>
                <dd className="mt-3 text-sm text-v-mute">{s.label}</dd>
              </div>
            ))}
          </dl>
        </VContainer>
      </section>

      {/* 4. Cam kết: lốp ở giữa, 4 thẻ hai bên */}
      <section aria-labelledby="cam-ket-title" className="bg-v-sunk py-14 md:py-20">
        <VContainer>
          <Heading id="cam-ket-title" center title="Chính hãng, date mới, lắp tại chỗ" subtitle="Bốn điều khách mua lốp ở Kim Ngoan luôn được đảm bảo." />
          <div className="grid items-center gap-3 lg:grid-cols-[1fr_minmax(0,300px)_1fr]">
            <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
              {uspLeft.map((u) => (
                <li key={u.title} className="v-panel p-5">
                  <h3 className="text-[17px] font-semibold text-v-fg">{u.title}</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-v-mute">{u.description}</p>
                </li>
              ))}
            </ul>
            <div className="relative order-first mx-auto aspect-square w-56 lg:order-none lg:w-full">
              <div aria-hidden className="absolute inset-[10%] rounded-full bg-v-accent/25 blur-3xl" />
              <ProductArt kind="tyre" className="relative" />
            </div>
            <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
              {uspRight.map((u) => (
                <li key={u.title} className="v-panel p-5">
                  <h3 className="text-[17px] font-semibold text-v-fg">{u.title}</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-v-mute">{u.description}</p>
                </li>
              ))}
            </ul>
          </div>
          <p className="mt-9 text-center text-sm text-v-mute">
            Thương hiệu phân phối: <span className="text-v-fg">{brands.join(" · ")}</span>
          </p>
          <div className="mt-6 text-center">
            <VButton asChild size="sm">
              <Link href={`${base}/san-pham`}>Tìm lốp phù hợp</Link>
            </VButton>
          </div>
        </VContainer>
      </section>

      {/* 5. Sản phẩm bán chạy */}
      <section aria-labelledby="noi-bat-title" className="py-14 md:py-20">
        <VContainer>
          <Heading id="noi-bat-title" title="Lốp bán chạy" subtitle="Những cỡ lốp khách của Kim Ngoan chọn nhiều nhất." action={<TextLink href={`${base}/san-pham`}>Toàn bộ sản phẩm</TextLink>} />
          <div className="grid grid-cols-2 gap-x-3 gap-y-9 md:gap-x-4 lg:grid-cols-4">
            {featured.map((p) => (
              <VProductCard key={p.slug} product={p} />
            ))}
          </div>
        </VContainer>
      </section>

      {/* 6. Dịch vụ */}
      <section aria-labelledby="dich-vu-title" className="py-14 md:py-20">
        <VContainer>
          <Heading id="dich-vu-title" title="Dịch vụ tại cửa hàng" subtitle={content.about.paragraphs[1]} />
          <ul className="grid gap-3 md:grid-cols-3">
            {content.services.map((s, i) => (
              <li key={s.title} className="v-panel p-6">
                <p className="text-sm font-medium text-v-mark">0{i + 1}</p>
                <h3 className="mt-6 text-xl font-semibold text-v-fg">{s.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-v-mute">{s.description}</p>
              </li>
            ))}
          </ul>
        </VContainer>
      </section>

      {/* 7. Tin tức của chuyên trang */}
      {news.length > 0 && (
        <section aria-labelledby="tin-tuc-title" className="py-14 md:py-20">
          <VContainer>
            <Heading id="tin-tuc-title" title="Kiến thức về lốp" action={<TextLink href={`${base}/tin-tuc`}>Tất cả bài viết</TextLink>} />
            <div className="grid gap-x-4 gap-y-10 md:grid-cols-3">
              {news.map((n) => (
                <VNewsCard key={n.slug} item={n} />
              ))}
            </div>
          </VContainer>
        </section>
      )}

      {/* 8. Kêu gọi hành động: thẻ lớn, mâm lốp mờ phía sau */}
      <section aria-labelledby="cta-title" className="pb-16 md:pb-24">
        <VContainer>
          <div className="v-panel relative overflow-hidden px-6 py-14 text-center md:py-20">
            <ProductArt kind="tyre" className="absolute -left-16 top-1/2 !size-72 -translate-y-1/2 opacity-25" />
            <ProductArt kind="tyre-truck" className="absolute -right-20 -top-10 !size-80 opacity-20" />
            <div className="relative">
              <h2 id="cta-title" className="v-display text-[clamp(1.75rem,3.2vw,2.75rem)] text-v-fg">
                Chưa biết chọn lốp nào?
                <br />
                Gọi để được tư vấn.
              </h2>
              <p className="mx-auto mt-4 max-w-md text-[15px] leading-relaxed text-v-mute">Gửi cỡ lốp hoặc đời xe qua Zalo, hoặc gọi trực tiếp — chúng tôi báo giá và hẹn lịch lắp.</p>
              <VButton asChild className="mt-7">
                <a href={telHref(vertical.phone)}>
                  <Phone /> <span className="tabular-nums">{vertical.phone}</span>
                </a>
              </VButton>
            </div>
          </div>
        </VContainer>
      </section>
    </>
  );
}
