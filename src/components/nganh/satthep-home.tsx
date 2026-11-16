import Link from "next/link";
import { ArrowUpRight, Phone } from "lucide-react";
import type { CatalogCategory, CatalogContent, CatalogProduct, NewsItem } from "@/lib/data/types";
import { telHref, type Vertical } from "@/lib/verticals";
import { cn } from "@/lib/utils";
import { ProductArt } from "./product-art";
import { VButton } from "./v-button";
import { VNewsCard } from "./v-news-card";
import { VProductCard } from "./v-product-card";
import { VContainer } from "./v-section";

/**
 * Trang chủ chuyên trang sắt thép – xám ấm + cam, khối xếp lớp, chữ thường.
 * Cố ý gần như tĩnh: không marquee, không hiện dần khi cuộn; chỉ đổi màu khi hover.
 * Các ô `.v-art` là CHỖ ĐẶT ẢNH CHỤP: truyền ảnh thật vào là thay được hình minh hoạ.
 */

/** Nét bút cam gạch dưới từ khoá trong tiêu đề. */
function Scribble({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 220 28" aria-hidden preserveAspectRatio="none" className={className}>
      <path d="M4 20 C40 6 58 24 92 12 S150 22 176 9 S206 18 216 8" fill="none" stroke="var(--v-mark)" strokeWidth="7" strokeLinecap="round" />
    </svg>
  );
}

function Heading({ id, eyebrow, title, action }: { id: string; eyebrow?: string; title: string; action?: React.ReactNode }) {
  return (
    <div className="mb-10 flex flex-wrap items-end justify-between gap-5 md:mb-12">
      <div>
        {eyebrow && <p className="v-label mb-3 text-v-mark">{eyebrow}</p>}
        <h2 id={id} className="v-display max-w-2xl text-[clamp(2rem,3.6vw,3.25rem)] text-v-fg">
          {title}
        </h2>
      </div>
      {action}
    </div>
  );
}

function TextLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link href={href} className="group inline-flex items-center gap-2 text-[15px] font-semibold text-v-fg underline decoration-v-mark decoration-2 underline-offset-[6px]">
      {children} <ArrowUpRight className="size-4 text-v-mark" aria-hidden />
    </Link>
  );
}

export function SatThepHome({
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
  const lastLine = hero.title.length - 1;

  return (
    <>
      {/* 1. Hero: chữ trái – khối hình xếp lớp phải */}
      <section className="relative overflow-hidden">
        <div aria-hidden className="v-glow absolute -left-40 -top-24 size-[460px]" />
        <div aria-hidden className="v-glow absolute -right-32 bottom-10 size-[380px] opacity-70" />
        <VContainer className="relative grid items-center gap-12 pb-16 pt-10 lg:grid-cols-[1.05fr_1fr] lg:gap-10 lg:pb-24 lg:pt-16">
          <div>
            <p className="v-label text-v-mute">{hero.eyebrow}</p>
            <h1 className="v-display mt-5 text-[length:var(--v-hero-size)] text-v-fg">
              {hero.title.map((line, i) => (
                <span key={line} className="block">
                  {i === lastLine ? (
                    <span className="relative inline-block">
                      <Scribble className="absolute -bottom-2 left-0 h-[0.32em] w-full" />
                      <span className="relative">{line}</span>
                    </span>
                  ) : (
                    line
                  )}
                </span>
              ))}
            </h1>
            <p className="mt-8 max-w-md text-[17px] leading-relaxed text-v-mute">{hero.description}</p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <VButton asChild>
                <Link href={`${base}/san-pham`}>Xem sản phẩm</Link>
              </VButton>
              <VButton asChild variant="solid">
                <a href={telHref(vertical.phone)}>
                  <Phone /> <span className="tabular-nums">{vertical.phone}</span>
                </a>
              </VButton>
            </div>
          </div>

          <div className="relative pb-10 pl-10 sm:pl-16">
            <div className="v-art relative aspect-[4/5] sm:aspect-[5/6]">
              <ProductArt kind="ibeam" title="Thép hình chữ I" className="absolute inset-0 m-auto size-[80%]" />
            </div>
            <div className="absolute bottom-0 left-0 aspect-square w-[34%] bg-v-sunk">
              <ProductArt kind="roofing" className="absolute inset-0 m-auto size-[78%]" />
            </div>
            <Link
              href={`${base}/lien-he`}
              className="group absolute bottom-16 left-[26%] flex items-center gap-4 bg-v-bg py-3 pl-5 pr-3 shadow-[0_18px_40px_-22px_rgb(40_25_18/0.55)] transition-colors duration-300 hover:bg-white"
            >
              <span className="text-[15px] font-semibold text-v-fg">Liên hệ báo giá</span>
              <span className="grid size-9 place-items-center rounded-full bg-v-accent text-v-on-accent">
                <ArrowUpRight className="size-4" aria-hidden />
              </span>
            </Link>
          </div>
        </VContainer>
      </section>

      {/* 2. Về chúng tôi: đoạn văn lớn + dải hình nhóm hàng */}
      <section aria-labelledby="gioi-thieu-title" className="relative overflow-hidden bg-v-raise py-16 md:py-24">
        <div aria-hidden className="v-glow absolute -right-40 top-1/3 size-[420px] opacity-60" />
        <VContainer className="relative">
          <h2 id="gioi-thieu-title" className="v-display text-[clamp(2rem,3.6vw,3.25rem)] text-v-fg">
            Về chúng tôi
          </h2>
          <p className="mt-6 max-w-4xl text-[clamp(1.25rem,2.1vw,1.75rem)] font-light leading-snug text-v-fg">{content.about.paragraphs[0]}</p>
          <VButton asChild size="sm" className="mt-7">
            <Link href={`${base}/lien-he`}>Nhận báo giá</Link>
          </VButton>

          <dl className="mt-12 grid max-w-3xl grid-cols-3 gap-4 sm:gap-6">
            {hero.stats.map((s) => (
              <div key={s.label}>
                <dt className="sr-only">{s.label}</dt>
                <dd className="v-display text-[1.75rem] text-v-fg sm:text-4xl md:text-5xl">{s.value}</dd>
                <dd className="mt-2 text-sm leading-snug text-v-mute">{s.label}</dd>
              </div>
            ))}
          </dl>
        </VContainer>
      </section>

      {/* 3. Nhóm vật tư: thẻ so le, hình tràn khỏi khối nền */}
      <section aria-labelledby="danh-muc-title" className="py-16 md:py-24">
        <VContainer>
          <Heading id="danh-muc-title" eyebrow="Nhóm vật tư" title="Đủ chủng loại cho phần thô, kết cấu và mái" action={<TextLink href={`${base}/san-pham`}>Toàn bộ sản phẩm</TextLink>} />
          <ul className="grid gap-x-5 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
            {categories.map((c, i) => (
              <li key={c.slug} className={cn(i % 3 === 1 && "lg:mt-12")}>
                <Link href={`${base}/san-pham?nhom=${c.slug}`} className="group block">
                  <div className="v-art relative aspect-[4/3]">
                    <ProductArt kind={c.art} className="absolute inset-0 m-auto size-[62%]" />
                  </div>
                  <div className="relative -mt-8 ml-6 bg-v-bg p-6 transition-colors duration-300 group-hover:bg-white">
                    <h3 className="v-display text-2xl text-v-fg">{c.name}</h3>
                    <p className="mt-2 text-[15px] leading-relaxed text-v-mute">{c.description}</p>
                    <span className="v-label mt-4 inline-block bg-v-accent px-3.5 py-2 text-v-on-accent">Xem sản phẩm</span>
                  </div>
                </Link>
              </li>
            ))}
            {/* Ô cuối: thương hiệu phân phối (thay cho dải chữ chạy) */}
            <li className="flex flex-col justify-center bg-v-invert p-8 text-v-on-invert">
              <p className="v-label opacity-70">Thương hiệu phân phối</p>
              <ul className="mt-4 flex flex-wrap gap-x-5 gap-y-2">
                {brands.map((b) => (
                  <li key={b} className="v-display text-2xl">
                    {b}
                  </li>
                ))}
              </ul>
            </li>
          </ul>
        </VContainer>
      </section>

      {/* 4. Sản phẩm bán chạy */}
      <section aria-labelledby="noi-bat-title" className="bg-v-raise py-16 md:py-24">
        <VContainer>
          <Heading id="noi-bat-title" eyebrow="Bán chạy" title="Khách của Kim Ngoan chọn nhiều nhất" action={<TextLink href={`${base}/san-pham`}>Xem tất cả</TextLink>} />
          <div className="grid grid-cols-2 gap-x-4 gap-y-10 md:gap-x-5 lg:grid-cols-4">
            {featured.map((p) => (
              <VProductCard key={p.slug} product={p} />
            ))}
          </div>
        </VContainer>
      </section>

      {/* 5. Cam kết: khối cam chồng lên khối nâu */}
      <section aria-labelledby="cam-ket-title" className="py-16 md:py-24">
        <VContainer className="grid lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]">
          <div className="relative z-10 bg-v-accent p-8 text-v-on-accent md:p-12 lg:-mr-10 lg:my-10">
            <h2 id="cam-ket-title" className="v-display text-[clamp(2rem,3.4vw,3rem)] !text-v-on-accent">
              {content.usps.length} lý do chủ thầu chọn Kim Ngoan
            </h2>
            <p className="mt-5 text-[17px] leading-relaxed opacity-90">{content.about.paragraphs[1]}</p>
          </div>
          <ol className="grid gap-x-10 gap-y-9 bg-v-invert p-8 text-v-on-invert sm:grid-cols-2 md:p-12 lg:pl-20">
            {content.usps.map((u, i) => (
              <li key={u.title}>
                <p className="v-label opacity-60">0{i + 1}</p>
                <h3 className="v-display mt-2 text-xl !text-v-on-invert">{u.title}</h3>
                <p className="mt-2 text-[15px] leading-relaxed opacity-80">{u.description}</p>
              </li>
            ))}
          </ol>
        </VContainer>
      </section>

      {/* 6. Dịch vụ */}
      <section aria-labelledby="dich-vu-title" className="bg-v-raise py-16 md:py-24">
        <VContainer className="grid gap-10 lg:grid-cols-[1fr_1.4fr] lg:gap-16">
          <div>
            <p className="v-label mb-3 text-v-mark">Dịch vụ đi kèm</p>
            <h2 id="dich-vu-title" className="v-display text-[clamp(2rem,3.6vw,3.25rem)] text-v-fg">
              {content.about.title}
            </h2>
          </div>
          <ul className="grid gap-4 sm:grid-cols-3 lg:grid-cols-1">
            {content.services.map((s, i) => (
              <li key={s.title} className="grid gap-x-6 gap-y-2 bg-v-bg p-6 md:p-7 lg:grid-cols-[3rem_1fr_1.3fr] lg:items-baseline">
                <span className="v-label text-v-mark">0{i + 1}</span>
                <h3 className="v-display text-xl text-v-fg">{s.title}</h3>
                <p className="text-[15px] leading-relaxed text-v-mute">{s.description}</p>
              </li>
            ))}
          </ul>
        </VContainer>
      </section>

      {/* 7. Tin tức của chuyên trang */}
      {news.length > 0 && (
        <section aria-labelledby="tin-tuc-title" className="py-16 md:py-24">
          <VContainer>
            <Heading id="tin-tuc-title" eyebrow="Tin tức" title="Kiến thức chọn và dùng thép" action={<TextLink href={`${base}/tin-tuc`}>Tất cả bài viết</TextLink>} />
            <div className="grid gap-x-5 gap-y-12 md:grid-cols-3">
              {news.map((n) => (
                <VNewsCard key={n.slug} item={n} />
              ))}
            </div>
          </VContainer>
        </section>
      )}

      {/* 8. Kêu gọi hành động */}
      <section aria-labelledby="cta-title" className="relative overflow-hidden pb-16 md:pb-24">
        <VContainer>
          <div className="relative overflow-hidden bg-v-raise p-8 md:p-14">
            <div aria-hidden className="v-glow absolute -bottom-40 -right-24 size-[420px]" />
            <div className="relative flex flex-col items-start gap-7 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <h2 id="cta-title" className="v-display text-[clamp(2rem,4vw,3.5rem)] text-v-fg">
                  Cần báo giá thép hôm nay?
                </h2>
                <p className="mt-4 max-w-xl text-[17px] leading-relaxed text-v-mute">Gửi quy cách và khối lượng qua Zalo hoặc gọi trực tiếp — chúng tôi báo giá theo barem trong ngày.</p>
              </div>
              <VButton asChild size="lg">
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
