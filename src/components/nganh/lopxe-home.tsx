import Link from "next/link";
import { ArrowRight, ArrowUpRight, BadgeCheck, Bus, CalendarClock, Car, CarFront, Check, MessageCircle, Phone, Truck, Wrench } from "lucide-react";
import { Reveal } from "@/components/shared/reveal";
import type { CatalogCategory, CatalogContent, CatalogProduct, NewsItem } from "@/lib/data/types";
import { formatDate } from "@/lib/format";
import { COMPANY, telHref, type Vertical } from "@/lib/verticals";
import { cn } from "@/lib/utils";
import { AutoCarousel } from "./auto-carousel";
import { ProductArt } from "./product-art";
import { TyreFinder } from "./tyre-finder";
import { VButton } from "./v-button";
import { VProductCard } from "./v-product-card";
import { VContainer, VHeading, VPill, VTag } from "./v-section";

/**
 * Trang chủ LỐP XE – phong cách Notion, nền đen · chữ trắng · nhấn cam.
 * Bố cục riêng (khác landing tổng và sắt thép), xoay quanh việc "tìm đúng cỡ lốp":
 * hero chia đôi lệch trái → công cụ tra cỡ lốp → chọn theo loại xe → sản phẩm cuộn ngang
 * → quy trình thay lốp → lý do chọn (1 ô lớn + 3 ô) → tin tức (1 lớn + danh sách) → liên hệ chia đôi.
 */

const VEHICLE_ICONS = [Car, CarFront, Truck, Bus];
const USP_ICONS = [BadgeCheck, CalendarClock, Wrench, MessageCircle];

function Sparkle({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden className={className}>
      <path d="M12 0c.6 6.2 5.8 11.4 12 12-6.2.6-11.4 5.8-12 12-.6-6.2-5.8-11.4-12-12C6.2 11.4 11.4 6.2 12 0Z" fill="currentColor" />
    </svg>
  );
}

export function LopXeHome({
  vertical,
  categories,
  content,
  featured,
  allProducts,
  news,
}: {
  vertical: Vertical;
  categories: CatalogCategory[];
  content: CatalogContent;
  featured: CatalogProduct[];
  allProducts: CatalogProduct[];
  news: NewsItem[];
}) {
  const { hero } = content;
  const base = vertical.base;
  const spot = featured[0];
  const popular = [...new Set(allProducts.map((p) => p.keySpec).filter((k) => /^\d{3}\/\d{2}R\d{2}$/.test(k)))].slice(0, 5);
  const countBy = (slug: string) => allProducts.filter((p) => p.categorySlug === slug).length;
  const [lead, ...restNews] = news;

  return (
    <>
      {/* 1. Hero chia đôi: chữ trái – lốp & thẻ thông số phải */}
      <section className="overflow-hidden">
        <VContainer className="grid items-center gap-12 pb-16 pt-10 md:pb-24 md:pt-14 lg:grid-cols-[1.05fr_1fr]">
          <div>
            <VTag>
              <span aria-hidden className="size-1.5 rounded-full bg-v-accent" /> {hero.eyebrow}
            </VTag>
            <h1 className="v-display mt-5 text-[length:var(--v-hero-size)] leading-[1.1] text-v-fg">
              Lốp chính hãng cho <VPill>mọi hành trình</VPill>
            </h1>
            <p className="mt-6 max-w-xl text-[clamp(1.05rem,1.5vw,1.2rem)] leading-relaxed text-v-mute">{hero.description}</p>
            <div className="mt-8 flex flex-wrap gap-2.5">
              <VButton asChild size="lg">
                <a href="#tra-co-lop">
                  Tra cỡ lốp <ArrowRight className="arrow" />
                </a>
              </VButton>
              <VButton asChild size="lg" variant="tint">
                <a href={telHref(vertical.phone)}>
                  <Phone /> <span className="tabular-nums">{vertical.phone}</span>
                </a>
              </VButton>
            </div>
            <ul className="mt-8 grid gap-2 text-[15px] text-v-fg/80 sm:grid-cols-3">
              {hero.stats.map((s) => (
                <li key={s.label} className="flex items-start gap-2">
                  <Check className="mt-1 size-4 shrink-0 text-v-accent" strokeWidth={3} aria-hidden />
                  <span>
                    <strong className="font-semibold text-v-fg">{s.value}</strong> {s.label.toLowerCase()}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <div className="relative">
            <Sparkle className="absolute -left-2 top-4 z-10 size-7 text-v-accent" />
            <div className="relative aspect-square overflow-hidden rounded-xl bg-v-accent">
              <div aria-hidden className="hub-dots absolute inset-0 opacity-25" />
              <ProductArt kind="tyre-at" title="Lốp ô tô" className="absolute inset-0 m-auto !size-[82%]" />
            </div>
            {spot && (
              <Link
                href={`${base}/san-pham/${spot.slug}`}
                className="group absolute -bottom-6 left-4 w-[min(17rem,80%)] rounded-xl border border-v-line bg-v-card p-4 shadow-[0_4px_12px_rgb(0_0_0/0.25)] transition-transform duration-300 [transition-timing-function:cubic-bezier(0.34,1.56,0.64,1)] hover:-translate-y-1 sm:-left-6"
              >
                <span className="flex items-center justify-between">
                  <span className="rounded-full bg-v-tint px-2 py-0.5 text-[12px] font-medium text-v-on-tint">Bán chạy</span>
                  <ArrowUpRight className="size-4 text-v-mute group-hover:text-v-accent" aria-hidden />
                </span>
                <span className="mt-2 block text-[15px] font-semibold leading-snug text-v-fg">{spot.name}</span>
                <span className="mt-2 flex flex-wrap gap-1">
                  {spot.specs.slice(1, 3).map((s) => (
                    <span key={s.name} className="rounded-md bg-v-chip px-2 py-0.5 text-[12px] text-v-fg/80">
                      {s.name}: {s.value}
                    </span>
                  ))}
                </span>
              </Link>
            )}
          </div>
        </VContainer>
      </section>

      {/* 2. Công cụ tra cỡ lốp */}
      <section id="tra-co-lop" aria-labelledby="tra-co-lop-title" className="scroll-mt-28 border-t border-v-line bg-v-sunk py-20 md:py-24">
        <VContainer>
          <VHeading id="tra-co-lop-title" index="Công cụ" title={<>Tìm lốp theo <VPill>đúng cỡ</VPill> xe bạn</>} subtitle="Không cần nhớ tên mẫu lốp — chỉ cần dãy số in trên hông lốp đang dùng." />
          <TyreFinder base={base} popular={popular} />
        </VContainer>
      </section>

      {/* 3. Chọn theo loại xe */}
      <section aria-labelledby="loai-xe-title" className="border-t border-v-line py-20 md:py-24">
        <VContainer>
          <VHeading id="loai-xe-title" index="Loại xe" title="Mỗi dòng xe một loại lốp" href={`${base}/san-pham`} hrefLabel="Tất cả lốp" />
          <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {categories.map((c, i) => {
              const Icon = VEHICLE_ICONS[i % VEHICLE_ICONS.length];
              return (
                <Reveal as="li" key={c.slug} delay={i * 70} className="h-full">
                  <Link href={`${base}/san-pham?nhom=${c.slug}`} className="group flex h-full flex-col rounded-xl border border-v-line bg-v-card p-6 transition-colors duration-200 hover:border-v-accent">
                    <span className={cn("grid size-12 place-items-center rounded-full border-2 transition-transform duration-300 [transition-timing-function:cubic-bezier(0.34,1.56,0.64,1)] group-hover:-rotate-6 group-hover:scale-110", i % 2 ? "border-v-fg/40 text-v-fg" : "border-v-accent text-v-accent")}>
                      <Icon className="size-5" aria-hidden />
                    </span>
                    <span className="mt-8 text-[13px] tabular-nums text-v-mute">{countBy(c.slug)} sản phẩm</span>
                    <span className="mt-1 text-xl font-semibold tracking-[-0.02em] text-v-fg">{c.name}</span>
                    <span className="mt-2 text-sm leading-relaxed text-v-mute">{c.description}</span>
                    <span className="mt-auto inline-flex items-center gap-1 pt-6 text-sm font-medium text-v-accent">
                      Xem lốp <ArrowRight className="size-4 transition-transform duration-200 group-hover:translate-x-0.5" aria-hidden />
                    </span>
                  </Link>
                </Reveal>
              );
            })}
          </ul>
        </VContainer>
      </section>

      {/* 4. Sản phẩm – dải cuộn ngang */}
      <section aria-labelledby="noi-bat-title" className="border-t border-v-line bg-v-sunk py-20 md:py-24">
        <VContainer>
          <VHeading id="noi-bat-title" index="Bán chạy" title="Lốp được chọn nhiều nhất" subtitle="Rê chuột để dừng, kéo ngang để xem nhanh." href={`${base}/san-pham`} hrefLabel="Xem tất cả" />
        </VContainer>
        {/* carousel tự cuộn vòng lặp – xem components/nganh/auto-carousel.tsx */}
        <AutoCarousel label="Lốp bán chạy" itemClassName="w-[260px] sm:w-[280px]">
          {allProducts.map((p) => (
            <VProductCard key={p.slug} product={p} />
          ))}
        </AutoCarousel>
      </section>

      {/* 5. Quy trình thay lốp */}
      <section aria-labelledby="quy-trinh-title" className="border-t border-v-line py-20 md:py-24">
        <VContainer>
          <VHeading id="quy-trinh-title" index="Tại cửa hàng" title={<>Thay lốp trọn bộ trong <VPill>30 phút</VPill></>} />
          <ol className="grid gap-3 md:grid-cols-3">
            {content.services.map((s, i) => (
              <Reveal as="li" key={s.title} delay={i * 90} className="relative">
                <div className="flex items-center gap-3">
                  <span className="grid size-11 shrink-0 place-items-center rounded-full border-2 border-v-accent bg-v-card text-[15px] font-semibold tabular-nums text-v-fg">{i + 1}</span>
                  {i < content.services.length - 1 && <span aria-hidden className="hidden h-0 flex-1 border-t-2 border-dashed border-v-line md:block" />}
                </div>
                <h3 className="mt-5 text-lg font-semibold tracking-[-0.02em] text-v-fg">{s.title}</h3>
                <p className="mt-1.5 max-w-sm text-[15px] leading-relaxed text-v-mute">{s.description}</p>
              </Reveal>
            ))}
          </ol>
        </VContainer>
      </section>

      {/* 6. Lý do chọn: 1 ô cam lớn + 3 ô */}
      <section aria-labelledby="ly-do-title" className="border-t border-v-line bg-v-sunk py-20 md:py-24">
        <VContainer>
          <VHeading id="ly-do-title" index="Cam kết" title={content.about.title} />
          {content.usps[0] && (
            <Reveal className="relative overflow-hidden rounded-xl bg-v-accent p-8 text-v-on-accent sm:p-10">
              <BadgeCheck className="size-9" strokeWidth={1.75} aria-hidden />
              <h3 className="mt-10 max-w-lg text-[clamp(1.75rem,3vw,2.5rem)] font-semibold leading-tight tracking-[-0.03em] !text-current">{content.usps[0].title}</h3>
              <p className="mt-3 max-w-lg text-[17px] leading-relaxed opacity-80">{content.usps[0].description} {content.about.paragraphs[1]}</p>
              <ProductArt kind="tyre" className="absolute -bottom-16 -right-10 hidden !size-80 md:block" />
            </Reveal>
          )}
          <ul className="mt-3 grid gap-3 md:grid-cols-3">
            {content.usps.slice(1).map((u, i) => {
              const Icon = USP_ICONS[(i + 1) % USP_ICONS.length];
              return (
                <Reveal as="li" key={u.title} delay={i * 80} className={cn("rounded-xl p-7", i === 1 ? "bg-v-island text-v-on-island" : "border border-v-line bg-v-card text-v-fg")}>
                  <Icon className="size-7" strokeWidth={1.75} aria-hidden />
                  <h3 className="mt-8 text-xl font-semibold tracking-[-0.02em] !text-current">{u.title}</h3>
                  <p className={cn("mt-2 text-[15px] leading-relaxed", i === 1 ? "opacity-70" : "text-v-mute")}>{u.description}</p>
                </Reveal>
              );
            })}
          </ul>
        </VContainer>
      </section>

      {/* 7. Tin tức: 1 bài lớn + danh sách */}
      {lead && (
        <section aria-labelledby="tin-tuc-title" className="border-t border-v-line py-20 md:py-24">
          <VContainer>
            <VHeading id="tin-tuc-title" index="Tin tức" title="Kiến thức về lốp" href={`${base}/tin-tuc`} hrefLabel="Tất cả bài viết" />
            <div className="grid gap-3 lg:grid-cols-[1.2fr_1fr]">
              <Link href={lead.href} className="group relative overflow-hidden rounded-xl border border-v-line bg-v-card transition-colors hover:border-v-accent">
                <span className="relative m-1.5 mb-0 block aspect-[16/9] overflow-hidden rounded-lg bg-v-raise">
                  {lead.art && <ProductArt kind={lead.art} className="absolute inset-0 m-auto !size-[56%] v-hover-zoom" />}
                </span>
                <span className="block p-6">
                  <span className="text-[13px] text-v-mute">{formatDate(lead.date)} · {lead.readingMinutes} phút đọc</span>
                  <span className="mt-2 block text-2xl font-semibold tracking-[-0.025em] text-v-fg group-hover:text-v-accent">{lead.title}</span>
                  <span className="mt-2 block text-[15px] leading-relaxed text-v-mute">{lead.excerpt}</span>
                </span>
              </Link>
              <ul className="flex flex-col gap-3">
                {restNews.map((n) => (
                  <li key={n.slug} className="flex-1">
                    <Link href={n.href} className="group flex h-full items-center gap-4 rounded-xl border border-v-line bg-v-card p-4 transition-colors hover:border-v-accent">
                      <span className="relative size-24 shrink-0 overflow-hidden rounded-lg bg-v-raise">
                        {n.art && <ProductArt kind={n.art} className="absolute inset-0 m-auto !size-[78%]" />}
                      </span>
                      <span className="min-w-0">
                        <span className="text-[13px] text-v-mute">{formatDate(n.date)}</span>
                        <span className="mt-1 block font-semibold leading-snug text-v-fg group-hover:text-v-accent">{n.title}</span>
                        <span className="mt-1 line-clamp-2 text-sm text-v-mute">{n.excerpt}</span>
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </VContainer>
        </section>
      )}

      {/* 8. Liên hệ chia đôi: mảng cam trái – thẻ liên hệ phải */}
      <section aria-labelledby="cta-title" className="border-t border-v-line py-20 md:py-24">
        <VContainer className="grid gap-3 lg:grid-cols-[1.3fr_1fr]">
          <div className="relative overflow-hidden rounded-xl bg-v-accent p-8 text-v-on-accent sm:p-12">
            <h2 id="cta-title" className="v-display text-[clamp(2rem,4.4vw,3.5rem)] !text-current">Chưa biết chọn lốp nào?</h2>
            <p className="mt-4 max-w-md text-[17px] leading-relaxed opacity-80">Gửi cỡ lốp hoặc đời xe qua Zalo, hoặc gọi trực tiếp — chúng tôi báo giá và hẹn lịch lắp.</p>
            <ProductArt kind="tyre-truck" className="absolute -bottom-12 -right-8 !size-56 opacity-90" />
          </div>
          <div className="flex flex-col gap-2 rounded-xl border border-v-line bg-v-card p-6 sm:p-8">
            <p className="text-sm font-semibold text-v-fg">{vertical.contactLabel}</p>
            <a href={telHref(vertical.phone)} className="mt-2 flex items-center justify-between gap-3 rounded-lg bg-v-accent px-4 py-4 text-v-on-accent transition-colors hover:bg-v-accent-hover">
              <span className="text-2xl font-semibold tabular-nums tracking-[-0.02em]">{vertical.phone}</span>
              <Phone className="size-5" aria-hidden />
            </a>
            <a href={COMPANY.zalo} target="_blank" rel="noopener noreferrer" className="flex items-center justify-between gap-3 rounded-lg bg-v-tint px-4 py-3.5 font-medium text-v-on-tint">
              Nhắn Zalo báo giá <MessageCircle className="size-5" aria-hidden />
            </a>
            <Link href={`${base}/lien-he`} className="flex items-center justify-between gap-3 rounded-lg border border-v-line px-4 py-3.5 font-medium text-v-fg transition-colors hover:bg-v-raise">
              Gửi yêu cầu báo giá <ArrowRight className="size-5" aria-hidden />
            </Link>
            <p className="mt-auto pt-4 text-sm text-v-mute">{COMPANY.address} · 07:00 – 18:00 mỗi ngày</p>
          </div>
        </VContainer>
      </section>
    </>
  );
}
