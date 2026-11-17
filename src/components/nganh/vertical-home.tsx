import Link from "next/link";
import { ArrowRight, ArrowUpRight, BadgeCheck, CalendarClock, Phone, Truck, Wrench } from "lucide-react";
import { Reveal } from "@/components/shared/reveal";
import type { ArtKind, CatalogCategory, CatalogContent, CatalogProduct, NewsItem } from "@/lib/data/types";
import { COMPANY, telHref, type CatalogSite, type Vertical } from "@/lib/verticals";
import { cn } from "@/lib/utils";
import { ProductArt } from "./product-art";
import { VButton } from "./v-button";
import { VNewsCard } from "./v-news-card";
import { VProductCard } from "./v-product-card";
import { VContainer, VHeading, VPill, VTag } from "./v-section";

/**
 * Trang chủ chuyên trang theo phong cách Notion – DÙNG CHUNG cho /lopxe và /satthep.
 * Màu lấy hoàn toàn từ token theme (.theme-lopxe: đen + trắng + cam; .theme-satthep: trắng + xám + chữ đen),
 * nên hai trang cùng bố cục nhưng mỗi trang một bộ màu.
 * Bố cục: dấu tròn → tiêu đề có viên màu → 2 nút → "cửa sổ" sản phẩm → số liệu → danh mục → thương hiệu
 * → bán chạy → lý do chọn (bento) → giới thiệu + dịch vụ → tin tức → kêu gọi hành động.
 */

type SiteCopy = {
  before: string;
  pill: string;
  heroArt: ArtKind;
  marks: ArtKind[];
  path: string;
};

const COPY: Record<CatalogSite, SiteCopy> = {
  lopxe: { before: "Lốp chính hãng cho", pill: "mọi hành trình", heroArt: "tyre-at", marks: ["tyre", "tyre-at", "tyre-truck", "tyre", "tyre-at", "tyre-truck", "tyre"], path: "san-pham" },
  satthep: { before: "Tôn, sắt thép chính phẩm cho", pill: "mọi công trình", heroArt: "ibeam", marks: ["rebar", "ibeam", "pipe", "box", "roofing", "coil", "plate"], path: "san-pham" },
};

const USP_ICONS = [BadgeCheck, CalendarClock, Wrench, Truck];
/** Bento: 4 ô, mỗi ô một mảng màu phẳng lấy từ token theme. */
const BENTO = [
  { tone: "bg-v-pill text-v-on-pill", sub: "opacity-75", span: "lg:col-span-2" },
  { tone: "border border-v-line bg-v-card text-v-fg", sub: "text-v-mute" },
  { tone: "bg-v-tint text-v-fg", sub: "text-v-mute" },
  { tone: "bg-v-island text-v-on-island", sub: "opacity-70", span: "lg:col-span-2" },
];

function Squiggle({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 24" aria-hidden className={className} fill="none">
      <path d="M2 16c6-10 10-10 14 0s8 10 14 0 8-10 14 0 8 10 14 0" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}
function Sparkle({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden className={className}>
      <path d="M12 0c.6 6.2 5.8 11.4 12 12-6.2.6-11.4 5.8-12 12-.6-6.2-5.8-11.4-12-12C6.2 11.4 11.4 6.2 12 0Z" fill="currentColor" />
    </svg>
  );
}

export function VerticalHome({
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
  const site = vertical.id as CatalogSite;
  const copy = COPY[site];
  const { hero } = content;
  const base = vertical.base;

  return (
    <>
      {/* 1. Hero căn giữa */}
      <section className="relative overflow-hidden">
        <VContainer className="pb-16 pt-12 text-center md:pb-24 md:pt-16">
          <ul aria-hidden className="flex flex-wrap items-center justify-center gap-2.5">
            {copy.marks.map((m, i) => (
              <li
                key={i}
                style={{ animationDelay: `${i * 0.35}s`, borderColor: i % 2 ? "var(--v-ring-2)" : "var(--v-ring-1)" }}
                className={cn("grid size-11 animate-bob place-items-center rounded-full border-2 bg-v-card transition-transform duration-300 [transition-timing-function:cubic-bezier(0.34,1.56,0.64,1)] hover:scale-125", i > 4 && "max-sm:hidden")}
              >
                <ProductArt kind={m} className="!size-7" />
              </li>
            ))}
          </ul>

          <p className="mt-8 text-sm font-medium text-v-mute">{hero.eyebrow} · {COMPANY.address}</p>
          <div className="relative mx-auto mt-3 max-w-5xl">
            <Squiggle className="absolute -left-2 top-3 hidden w-14 -rotate-12 text-v-accent md:block lg:-left-10" />
            <Sparkle className="absolute -right-1 -top-2 hidden size-7 text-v-mark md:block lg:-right-8" />
            <h1 className="v-display text-[length:var(--v-hero-size)] leading-[1.12] text-v-fg">
              {copy.before} <VPill>{copy.pill}</VPill>
            </h1>
          </div>
          <p className="mx-auto mt-6 max-w-2xl text-[clamp(1.05rem,1.6vw,1.25rem)] leading-relaxed text-v-mute">{hero.description}</p>
          <div className="mt-8 flex flex-wrap justify-center gap-2.5">
            <VButton asChild>
              <Link href={`${base}/san-pham`}>
                Xem sản phẩm <ArrowRight className="arrow" />
              </Link>
            </VButton>
            <VButton asChild variant="tint">
              <a href={telHref(vertical.phone)}>
                <Phone /> <span className="tabular-nums">{vertical.phone}</span>
              </a>
            </VButton>
          </div>

          {/* "cửa sổ" sản phẩm – như ảnh chụp giao diện trong trang Notion */}
          <div className="mx-auto mt-14 max-w-6xl overflow-hidden rounded-xl border border-v-line bg-v-card text-left shadow-[0_4px_12px_rgb(0_0_0/0.1)]">
            <div className="flex items-center gap-3 border-b border-v-line px-4 py-3">
              <span aria-hidden className="flex gap-1.5">
                <span className="size-3 rounded-full bg-v-accent" />
                <span className="size-3 rounded-full bg-v-mark/60" />
                <span className="size-3 rounded-full bg-v-mark/30" />
              </span>
              <span className="mx-auto flex h-7 max-w-sm flex-1 items-center justify-center rounded-md bg-v-raise px-3 text-[13px] text-v-mute">
                kimngoan.com{base}/{copy.path}
              </span>
              <span aria-hidden className="w-[46px]" />
            </div>
            <div className="grid md:grid-cols-[1.1fr_1fr]">
              <div className="p-5 sm:p-7">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold text-v-fg">Bán chạy tuần này</p>
                  <span className="rounded-full bg-v-chip px-2.5 py-0.5 text-[12px] text-v-mute">{featured.length} sản phẩm</span>
                </div>
                <ul className="mt-4 space-y-2">
                  {featured.map((p) => (
                    <li key={p.slug}>
                      <Link href={`${base}/san-pham/${p.slug}`} className="group flex items-center gap-3 rounded-lg border border-v-line bg-v-bg px-3 py-2.5 transition-colors duration-200 hover:border-v-mark/60">
                        <span className="relative size-11 shrink-0 overflow-hidden rounded-md bg-v-raise">
                          <ProductArt kind={p.art} className="absolute inset-0 m-auto !size-[86%]" />
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className="block truncate text-sm font-medium text-v-fg">{p.name}</span>
                          <span className="block text-[12px] text-v-mute">{p.brand}</span>
                        </span>
                        <span className="hidden shrink-0 rounded-full bg-v-pill px-2.5 py-0.5 text-[12px] font-medium tabular-nums text-v-on-pill sm:inline">{p.keySpec}</span>
                        <ArrowUpRight className="size-4 shrink-0 text-v-mute transition-colors group-hover:text-v-accent" aria-hidden />
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="relative min-h-[260px] bg-v-raise md:min-h-0">
                <div aria-hidden className="absolute left-[18%] top-[12%] size-[56%] rounded-full bg-v-pill opacity-90" />
                <ProductArt kind={copy.heroArt} title={vertical.name} className="absolute inset-0 m-auto !size-[74%]" />
              </div>
            </div>
          </div>
        </VContainer>
      </section>

      {/* 2. Số liệu */}
      <section aria-label="Số liệu" className="pb-16 md:pb-24">
        <VContainer>
          <dl className="grid gap-3 sm:grid-cols-3">
            {hero.stats.map((s, i) => (
              <Reveal key={s.label} delay={i * 70} className="rounded-xl border border-v-line bg-v-card p-6 sm:p-7">
                <dt className="sr-only">{s.label}</dt>
                <dd className="text-[clamp(2.5rem,4.4vw,3.5rem)] font-semibold leading-none tracking-[-0.04em] text-v-fg">{s.value}</dd>
                <dd className="mt-4 text-[15px] text-v-mute">{s.label}</dd>
              </Reveal>
            ))}
          </dl>
        </VContainer>
      </section>

      {/* 3. Danh mục */}
      <section aria-labelledby="danh-muc-title" className="border-y border-v-line bg-v-sunk py-20 md:py-28">
        <VContainer>
          <VHeading id="danh-muc-title" index="Danh mục" title={<>Chọn theo <VPill>nhu cầu</VPill> của bạn</>} href={`${base}/san-pham`} hrefLabel="Toàn bộ sản phẩm" />
          <ul className={cn("grid gap-3 sm:grid-cols-2", categories.length === 5 ? "sm:grid-cols-3 lg:grid-cols-5" : "lg:grid-cols-4")}>
            {categories.map((c, i) => (
              <Reveal as="li" key={c.slug} delay={i * 70} className="h-full">
                <Link href={`${base}/san-pham?nhom=${c.slug}`} className="group flex h-full flex-col overflow-hidden rounded-xl border border-v-line bg-v-card transition-colors duration-200 hover:border-v-mark/60">
                  <span className="relative m-1.5 mb-0 block aspect-[4/3] overflow-hidden rounded-lg bg-v-raise">
                    <ProductArt kind={c.art} className="absolute inset-0 m-auto !size-[64%] transition-transform duration-300 [transition-timing-function:cubic-bezier(0.34,1.56,0.64,1)] group-hover:-rotate-6 group-hover:scale-110" />
                  </span>
                  <span className="flex flex-1 flex-col p-5">
                    <span className="flex items-start justify-between gap-3">
                      <span className="text-lg font-semibold tracking-[-0.02em] text-v-fg">{c.name}</span>
                      <ArrowUpRight className="mt-1 size-4 shrink-0 text-v-mute transition-colors group-hover:text-v-accent" aria-hidden />
                    </span>
                    <span className="mt-1.5 text-sm leading-relaxed text-v-mute">{c.description}</span>
                  </span>
                </Link>
              </Reveal>
            ))}
          </ul>
        </VContainer>
      </section>

      {/* 4. Thương hiệu – tường chữ xám */}
      <section aria-labelledby="thuong-hieu-title" className="py-12">
        <VContainer>
          <p id="thuong-hieu-title" className="text-center text-sm text-v-mute">Phân phối chính hãng</p>
          <ul className="mt-6 flex flex-wrap items-center justify-center gap-x-12 gap-y-4">
            {brands.map((b) => (
              <li key={b} className="text-[22px] font-semibold tracking-[-0.03em] text-v-fg/45 transition-colors duration-200 hover:text-v-fg">
                {b}
              </li>
            ))}
          </ul>
        </VContainer>
      </section>

      {/* 5. Bán chạy */}
      <section aria-labelledby="noi-bat-title" className="border-t border-v-line py-20 md:py-28">
        <VContainer>
          <VHeading id="noi-bat-title" index="Bán chạy" title="Khách của Kim Ngoan chọn nhiều nhất" href={`${base}/san-pham`} hrefLabel="Xem tất cả" />
          <div className="grid grid-cols-2 gap-3 md:gap-4 lg:grid-cols-4">
            {featured.map((p, i) => (
              <Reveal key={p.slug} delay={i * 70} className="h-full">
                <VProductCard product={p} />
              </Reveal>
            ))}
          </div>
        </VContainer>
      </section>

      {/* 6. Lý do chọn – bento mảng màu phẳng */}
      <section aria-labelledby="ly-do-title" className="border-t border-v-line bg-v-sunk py-20 md:py-28">
        <VContainer>
          <VHeading id="ly-do-title" index="Vì sao chọn Kim Ngoan" center title={<>Mua một lần, <VPill>yên tâm</VPill> lâu dài</>} />
          <ul className="grid gap-3 md:gap-4 lg:grid-cols-3">
            {content.usps.map((u, i) => {
              const Icon = USP_ICONS[i % USP_ICONS.length];
              const b = BENTO[i % BENTO.length];
              return (
                <Reveal as="li" key={u.title} delay={i * 80} className={cn("h-full", b.span)}>
                  <div className={cn("group relative flex h-full min-h-[220px] flex-col overflow-hidden rounded-xl p-7 sm:p-8", b.tone)}>
                    <Icon className="size-8 transition-transform duration-300 [transition-timing-function:cubic-bezier(0.34,1.56,0.64,1)] group-hover:-rotate-12 group-hover:scale-110" strokeWidth={1.75} aria-hidden />
                    <h3 className="mt-auto pt-10 text-[clamp(1.35rem,2vw,1.75rem)] font-semibold tracking-[-0.025em] !text-current">{u.title}</h3>
                    <p className={cn("mt-2 max-w-md text-[15px] leading-relaxed", b.sub)}>{u.description}</p>
                    {b.span && <ProductArt kind={i === 0 ? copy.marks[0] : copy.marks[1]} className="absolute -bottom-8 -right-6 hidden !size-44 sm:block" />}
                  </div>
                </Reveal>
              );
            })}
          </ul>
        </VContainer>
      </section>

      {/* 7. Giới thiệu + dịch vụ: chữ trái – mảng màu phải */}
      <section aria-labelledby="gioi-thieu-title" className="border-t border-v-line py-20 md:py-28">
        <VContainer className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
          <Reveal>
            <VTag>Về chúng tôi</VTag>
            <h2 id="gioi-thieu-title" className="v-display mt-3 text-[clamp(2rem,4vw,3.25rem)] text-v-fg">
              {content.about.title}
            </h2>
            {content.about.paragraphs.map((t) => (
              <p key={t} className="mt-5 max-w-xl text-[17px] leading-relaxed text-v-mute">{t}</p>
            ))}
            <VButton asChild variant="tint" className="mt-7">
              <Link href={`${base}/lien-he`}>
                Nhận báo giá <ArrowRight className="arrow" />
              </Link>
            </VButton>
          </Reveal>
          <Reveal delay={100} className="rounded-xl bg-v-pill p-5 sm:p-8">
            <div className="rounded-lg border border-v-line bg-v-card p-5 shadow-[0_4px_12px_rgb(0_0_0/0.1)] sm:p-6">
              <p className="text-sm font-semibold text-v-fg">Dịch vụ tại Kim Ngoan</p>
              <ul className="mt-4 space-y-2">
                {content.services.map((s, i) => (
                  <li key={s.title} className="flex gap-3 rounded-lg border border-v-line bg-v-bg p-3.5">
                    <span className="grid size-7 shrink-0 place-items-center rounded-full bg-v-tint text-[13px] font-semibold text-v-on-tint">{i + 1}</span>
                    <span>
                      <span className="block text-[15px] font-medium text-v-fg">{s.title}</span>
                      <span className="mt-0.5 block text-sm leading-relaxed text-v-mute">{s.description}</span>
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        </VContainer>
      </section>

      {/* 8. Tin tức của chuyên trang */}
      {news.length > 0 && (
        <section aria-labelledby="tin-tuc-title" className="border-t border-v-line bg-v-sunk py-20 md:py-28">
          <VContainer>
            <VHeading id="tin-tuc-title" index="Tin tức" title="Kiến thức & kinh nghiệm" href={`${base}/tin-tuc`} hrefLabel="Tất cả bài viết" />
            <div className="grid gap-3 md:grid-cols-3 md:gap-4">
              {news.map((n, i) => (
                <Reveal key={n.slug} delay={i * 70} className="h-full">
                  <VNewsCard item={n} />
                </Reveal>
              ))}
            </div>
          </VContainer>
        </section>
      )}

      {/* 9. Kêu gọi hành động – "đảo" màu đảo ngược của theme */}
      <section aria-labelledby="cta-title" className="py-20 md:py-28">
        <VContainer>
          <div className="relative overflow-hidden rounded-xl bg-v-island px-6 py-14 text-center text-v-on-island sm:px-10 md:py-20">
            <Sparkle className="absolute left-[8%] top-8 size-6 text-v-pill" />
            <Squiggle className="absolute bottom-8 right-[8%] w-16 text-v-pill" />
            <h2 id="cta-title" className="v-display mx-auto max-w-3xl text-[clamp(2rem,4.4vw,3.5rem)] !text-current">
              Cần báo giá? <span className="rounded-full bg-v-pill px-[0.35em] text-v-on-pill">Gọi ngay</span>
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-[17px] leading-relaxed opacity-70">{vertical.contactLabel} — gửi quy cách qua Zalo hoặc gọi trực tiếp, chúng tôi phản hồi trong giờ làm việc.</p>
            <div className="mt-8 flex flex-wrap justify-center gap-2.5">
              <a href={telHref(vertical.phone)} className="inline-flex h-12 items-center gap-2 rounded-lg bg-v-on-island px-6 font-medium text-v-island transition-opacity duration-200 hover:opacity-90">
                <Phone className="size-4" aria-hidden /> <span className="tabular-nums">{vertical.phone}</span>
              </a>
              <Link href={`${base}/lien-he`} className="inline-flex h-12 items-center gap-2 rounded-lg px-6 font-medium underline-offset-4 transition-opacity duration-200 hover:underline">
                Gửi yêu cầu <ArrowRight className="size-4" aria-hidden />
              </Link>
            </div>
          </div>
        </VContainer>
      </section>
    </>
  );
}
