import Link from "next/link";
import { ArrowRight, ArrowUpRight, CheckSquare, ClipboardCheck, FileText, Phone, Ruler, Scale, Truck } from "lucide-react";
import { Reveal } from "@/components/shared/reveal";
import type { CatalogCategory, CatalogContent, CatalogProduct, NewsItem } from "@/lib/data/types";
import { formatDate } from "@/lib/format";
import { telHref, type Vertical } from "@/lib/verticals";
import { getSettings } from "@/lib/settings/server";
import { cn } from "@/lib/utils";
import { ProductArt } from "./product-art";
import { CategoryExplorer, WeightCalculator, type ExplorerGroup } from "./steel-tools";
import { VButton } from "./v-button";
import { VContainer, VHeading, VPill, VTag } from "./v-section";

/**
 * Trang chủ SẮT THÉP – phong cách Notion, nền trắng · phối xám · chữ đen.
 * Bố cục riêng (khác landing tổng và lốp xe), mang chất "tài liệu kỹ thuật / báo giá":
 * hero lệch trái + trang tài liệu báo giá → số liệu kẻ mảnh → duyệt vật tư kiểu thanh bên
 * → công cụ tính trọng lượng → cam kết 4 cột → dịch vụ xen kẽ trái/phải → thương hiệu → tin tức dạng danh sách → khối đen.
 */

const USP_ICONS = [ClipboardCheck, Scale, Ruler, Truck];

export async function SatThepHome({
  vertical,
  categories,
  content,
  featured,
  allProducts,
  brands,
  news,
}: {
  vertical: Vertical;
  categories: CatalogCategory[];
  content: CatalogContent;
  featured: CatalogProduct[];
  allProducts: CatalogProduct[];
  brands: string[];
  news: NewsItem[];
}) {
  const { COMPANY } = await getSettings();
  const { hero } = content;
  const base = vertical.base;
  const groups: ExplorerGroup[] = categories.map((c) => ({
    slug: c.slug,
    name: c.name,
    description: c.description,
    art: c.art,
    href: `${base}/san-pham?nhom=${c.slug}`,
    products: allProducts
      .filter((p) => p.categorySlug === c.slug)
      .map((p) => ({ name: p.name, brand: p.brand, spec: p.keySpec, href: `${base}/san-pham/${p.slug}` })),
  }));

  return (
    <>
      {/* 1. Hero: chữ lệch trái – "trang tài liệu báo giá" bên phải */}
      {/* kéo nền xám lên nằm dưới header nổi (cao 76px / 80px) để không hở dải trắng */}
      <section className="-mt-[76px] border-b border-v-line bg-v-raise pt-[76px] md:-mt-20 md:pt-20">
        <VContainer className="grid items-center gap-12 pb-16 pt-10 md:pb-20 md:pt-14 lg:grid-cols-[1fr_1.05fr]">
          <div>
            <VTag className="bg-v-card shadow-[0_0_0_1px_var(--v-line)]">
              <FileText className="size-3.5" aria-hidden /> {hero.eyebrow}
            </VTag>
            <h1 className="v-display mt-5 text-[length:var(--v-hero-size)] leading-[1.1] text-v-fg">
              Tôn, sắt thép chính phẩm cho <VPill className="bg-v-card shadow-[0_0_0_1px_var(--v-line)]">mọi công trình</VPill>
            </h1>
            <p className="mt-6 max-w-xl text-[clamp(1.05rem,1.5vw,1.2rem)] leading-relaxed text-v-mute">{hero.description}</p>
            <div className="mt-8 flex flex-wrap gap-2.5">
              <VButton asChild size="lg">
                <a href={telHref(vertical.phone)}>
                  <Phone /> Nhận báo giá hôm nay
                </a>
              </VButton>
              <VButton asChild size="lg" variant="quiet">
                <Link href={`${base}/san-pham`}>
                  Xem quy cách <ArrowRight className="arrow" />
                </Link>
              </VButton>
            </div>
            <p className="mt-8 text-sm text-v-mute">
              Phân phối: <span className="font-medium text-v-fg">{brands.join(" · ")}</span>
            </p>
          </div>

          {/* trang tài liệu kiểu Notion */}
          <div className="rounded-xl border border-v-line bg-v-card shadow-[0_4px_12px_rgb(0_0_0/0.1)]">
            <div className="flex items-center gap-2 border-b border-v-line px-5 py-3 text-[13px] text-v-mute">
              <span>Kim Ngoan</span> <span aria-hidden>/</span> <span>Sắt thép</span> <span aria-hidden>/</span> <span className="text-v-fg">Báo giá</span>
            </div>
            <div className="p-6 sm:p-8">
              <span aria-hidden className="grid size-12 place-items-center rounded-lg bg-v-raise">
                <ProductArt kind="ibeam" className="!size-9" />
              </span>
              <p className="mt-4 text-[clamp(1.5rem,2.4vw,2rem)] font-semibold tracking-[-0.03em] text-v-fg">Báo giá thép theo ngày</p>
              <dl className="mt-4 grid grid-cols-[7.5rem_1fr] gap-y-2 text-sm">
                <dt className="text-v-mute">Trạng thái</dt>
                <dd>
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-v-pill px-2.5 py-0.5 text-[13px] font-medium text-v-on-pill">
                    <span aria-hidden className="size-1.5 rounded-full bg-v-fg" /> Đang nhận đơn
                  </span>
                </dd>
                <dt className="text-v-mute">Khu vực giao</dt>
                <dd className="text-v-fg">{COMPANY.address} và lân cận</dd>
                <dt className="text-v-mute">Chứng từ</dt>
                <dd className="text-v-fg">CO/CQ theo từng lô</dd>
              </dl>
              <table className="mt-6 w-full text-left text-sm">
                <thead className="text-[13px] text-v-mute">
                  <tr className="[&>th]:pb-2 [&>th]:font-normal">
                    <th scope="col">Vật tư</th>
                    <th scope="col" className="hidden sm:table-cell">Quy cách</th>
                    <th scope="col" className="text-right">Giá</th>
                  </tr>
                </thead>
                <tbody>
                  {featured.map((p) => (
                    <tr key={p.slug} className="relative transition-colors duration-150 hover:bg-v-raise [&>td]:border-t [&>td]:border-v-line [&>td]:py-2.5">
                      <td className="pr-3 font-medium text-v-fg">
                        <Link href={`${base}/san-pham/${p.slug}`} className="after:absolute after:inset-0 after:content-['']">{p.name}</Link>
                      </td>
                      <td className="hidden pr-3 tabular-nums text-v-mute sm:table-cell">{p.keySpec}</td>
                      <td className="text-right text-v-mute">Liên hệ</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <ul className="mt-5 space-y-1.5 text-sm text-v-fg">
                {["Cắt, uốn, cán sóng theo bản vẽ", "Giao tận chân công trình"].map((t) => (
                  <li key={t} className="flex items-center gap-2">
                    <CheckSquare className="size-4 text-v-fg" aria-hidden /> {t}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </VContainer>
      </section>

      {/* 2. Số liệu – một hàng kẻ mảnh, không thẻ */}
      <section aria-label="Số liệu" className="border-b border-v-line">
        <VContainer>
          <dl className="grid divide-y divide-v-line sm:grid-cols-3 sm:divide-x sm:divide-y-0">
            {hero.stats.map((s) => (
              <div key={s.label} className="py-8 sm:px-8 sm:first:pl-0">
                <dt className="sr-only">{s.label}</dt>
                <dd className="text-[clamp(2.25rem,4vw,3rem)] font-semibold leading-none tracking-[-0.04em] text-v-fg">{s.value}</dd>
                <dd className="mt-3 text-[15px] text-v-mute">{s.label}</dd>
              </div>
            ))}
          </dl>
        </VContainer>
      </section>

      {/* 3. Duyệt vật tư kiểu thanh bên */}
      <section aria-labelledby="vat-tu-title" className="py-20 md:py-24">
        <VContainer>
          <VHeading id="vat-tu-title" index="Vật tư" title={<>Đủ chủng loại cho <VPill>phần thô</VPill>, kết cấu và mái</>} href={`${base}/san-pham`} hrefLabel="Toàn bộ sản phẩm" />
          <CategoryExplorer groups={groups} />
        </VContainer>
      </section>

      {/* 4. Công cụ tính trọng lượng: chữ trái – mảng xám phải */}
      <section aria-labelledby="tinh-thep-title" className="border-t border-v-line py-20 md:py-24">
        <VContainer className="grid items-center gap-10 lg:grid-cols-[1fr_1.1fr] lg:gap-16">
          <Reveal>
            <VTag>Công cụ</VTag>
            <h2 id="tinh-thep-title" className="v-display mt-3 text-[clamp(2rem,4vw,3.25rem)] text-v-fg">
              Tính nhanh khối lượng thép trước khi đặt hàng
            </h2>
            <p className="mt-5 max-w-lg text-[17px] leading-relaxed text-v-mute">
              Chọn đường kính và số cây để biết tổng số ký. Cần bóc tách theo bản vẽ, gửi cho chúng tôi — {content.services[0]?.description.toLowerCase()}
            </p>
            <VButton asChild variant="tint" className="mt-7">
              <Link href={`${base}/lien-he`}>
                Gửi bản vẽ bóc tách <ArrowRight className="arrow" />
              </Link>
            </VButton>
          </Reveal>
          <Reveal delay={100} className="rounded-xl bg-v-raise p-4 sm:p-8">
            <WeightCalculator />
          </Reveal>
        </VContainer>
      </section>

      {/* 5. Cam kết – 4 cột ngăn bằng đường kẻ */}
      <section aria-labelledby="cam-ket-title" className="border-t border-v-line bg-v-raise py-20 md:py-24">
        <VContainer>
          <VHeading id="cam-ket-title" index="Cam kết" center title={<>Cân đủ, đúng quy cách, <VPill className="bg-v-card shadow-[0_0_0_1px_var(--v-line)]">đúng tiến độ</VPill></>} />
          <ul className="grid overflow-hidden rounded-xl border border-v-line bg-v-card sm:grid-cols-2 lg:grid-cols-4">
            {content.usps.map((u, i) => {
              const Icon = USP_ICONS[i % USP_ICONS.length];
              return (
                <li key={u.title} className={cn("group p-7", i > 0 && "border-t border-v-line sm:border-t-0", i % 2 === 1 && "sm:border-l sm:border-v-line", i >= 2 && "sm:border-t lg:border-t-0", i > 0 && "lg:border-l lg:border-v-line")}>
                  <span className="grid size-11 place-items-center rounded-full border-2 border-v-fg/80 transition-transform duration-300 [transition-timing-function:cubic-bezier(0.34,1.56,0.64,1)] group-hover:scale-110">
                    <Icon className="size-5 text-v-fg" strokeWidth={1.75} aria-hidden />
                  </span>
                  <h3 className="mt-6 text-lg font-semibold tracking-[-0.02em] text-v-fg">{u.title}</h3>
                  <p className="mt-2 text-[15px] leading-relaxed text-v-mute">{u.description}</p>
                </li>
              );
            })}
          </ul>
        </VContainer>
      </section>

      {/* 6. Dịch vụ – các khối xen kẽ trái/phải */}
      <section aria-labelledby="dich-vu-title" className="border-t border-v-line py-20 md:py-24">
        <VContainer>
          <VHeading id="dich-vu-title" index="Dịch vụ" title={content.about.title} subtitle={content.about.paragraphs[0]} />
          <div className="space-y-3">
            {content.services.map((s, i) => (
              <Reveal key={s.title} className={cn("grid items-center gap-6 rounded-xl border border-v-line bg-v-card p-3 md:grid-cols-2", i % 2 === 1 && "md:[&>*:first-child]:order-2")}>
                <div className={cn("relative aspect-[16/9] overflow-hidden rounded-lg", i === 1 ? "bg-v-island" : "bg-v-raise")}>
                  <ProductArt kind={(["rebar", "roofing", "plate"] as const)[i % 3]} className="absolute inset-0 m-auto !size-[58%]" />
                </div>
                <div className="p-4 md:p-8">
                  <span className="text-[13px] font-medium tabular-nums text-v-mute">0{i + 1}</span>
                  <h3 className="mt-2 text-[clamp(1.4rem,2.2vw,1.9rem)] font-semibold tracking-[-0.03em] text-v-fg">{s.title}</h3>
                  <p className="mt-2 max-w-md text-[16px] leading-relaxed text-v-mute">{s.description}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </VContainer>
      </section>

      {/* 7. Tin tức – danh sách kiểu tài liệu */}
      {news.length > 0 && (
        <section aria-labelledby="tin-tuc-title" className="border-t border-v-line bg-v-raise py-20 md:py-24">
          <VContainer className="grid gap-10 lg:grid-cols-[1fr_1.6fr]">
            <div>
              <VTag className="bg-v-card shadow-[0_0_0_1px_var(--v-line)]">Tin tức</VTag>
              <h2 id="tin-tuc-title" className="v-display mt-3 text-[clamp(2rem,4vw,3.25rem)] text-v-fg">
                Kiến thức chọn và dùng thép
              </h2>
              <VButton asChild variant="quiet" size="sm" className="mt-6">
                <Link href={`${base}/tin-tuc`}>
                  Tất cả bài viết <ArrowRight className="arrow" />
                </Link>
              </VButton>
            </div>
            <ul className="overflow-hidden rounded-xl border border-v-line bg-v-card">
              {news.map((n, i) => (
                <li key={n.slug} className={cn(i > 0 && "border-t border-v-line")}>
                  <Link href={n.href} className="group grid grid-cols-[auto_1fr_auto] items-center gap-4 p-5 transition-colors duration-150 hover:bg-v-raise sm:gap-6 sm:p-6">
                    <span className="relative size-14 overflow-hidden rounded-lg bg-v-raise">
                      {n.art && <ProductArt kind={n.art} className="absolute inset-0 m-auto !size-[80%]" />}
                    </span>
                    <span className="min-w-0">
                      <span className="text-[13px] text-v-mute">{formatDate(n.date)} · {n.readingMinutes} phút đọc</span>
                      <span className="mt-1 block text-lg font-semibold leading-snug tracking-[-0.01em] text-v-fg">{n.title}</span>
                      <span className="mt-1 line-clamp-1 text-sm text-v-mute">{n.excerpt}</span>
                    </span>
                    <ArrowUpRight className="size-5 text-v-mute transition-colors group-hover:text-v-fg" aria-hidden />
                  </Link>
                </li>
              ))}
            </ul>
          </VContainer>
        </section>
      )}

      {/* 8. Khối đen kêu gọi hành động */}
      <section aria-labelledby="cta-title" className="py-20 md:py-24">
        <VContainer>
          <div className="grid items-center gap-8 rounded-xl bg-v-island p-8 text-v-on-island sm:p-12 lg:grid-cols-[1.4fr_1fr]">
            <div>
              <h2 id="cta-title" className="v-display text-[clamp(2rem,4.4vw,3.5rem)] !text-current">
                Cần báo giá thép hôm nay?
              </h2>
              <p className="mt-4 max-w-lg text-[17px] leading-relaxed opacity-70">Gửi quy cách và khối lượng, nhận giá theo barem trong ngày. {vertical.contactLabel}.</p>
            </div>
            <div className="flex flex-col gap-2">
              <a href={telHref(vertical.phone)} className="flex items-center justify-between gap-3 rounded-lg bg-v-on-island px-5 py-4 text-v-island transition-opacity hover:opacity-90">
                <span className="text-2xl font-semibold tabular-nums tracking-[-0.02em]">{vertical.phone}</span>
                <Phone className="size-5" aria-hidden />
              </a>
              <Link href={`${base}/lien-he`} className="flex items-center justify-between gap-3 rounded-lg border border-white/15 px-5 py-3.5 font-medium transition-colors hover:bg-white/10">
                Gửi yêu cầu báo giá <ArrowRight className="size-5" aria-hidden />
              </Link>
            </div>
          </div>
        </VContainer>
      </section>
    </>
  );
}
