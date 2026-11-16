import Link from "next/link";
import { ArrowUpRight, Phone, Search } from "lucide-react";
import type { CatalogCategory, CatalogContent, CatalogProduct, NewsItem } from "@/lib/data/types";
import { COMPANY, telHref, type Vertical } from "@/lib/verticals";
import { ProductArt } from "./product-art";
import { VButton } from "./v-button";
import { VNewsCard } from "./v-news-card";
import { VProductCard } from "./v-product-card";

/**
 * Trang chủ lốp xe – "phòng tối trưng bày": nền nâu-đen ấm, chữ kem IN HOA nét 500,
 * chiếc lốp nổi giữa khoảng tối. Chỉ đoạn mô tả lớn dùng chữ thường nét 400.
 * Không thẻ bo góc, không viền thẻ, không đổ bóng: tách khối bằng kẻ đứt mảnh (.v-rule)
 * và một bậc màu nền. Cam chỉ dùng cho dòng chú thích nhỏ. Gần như tĩnh.
 */

const WRAP = "mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8"; // khớp lề với header
const H2 = "v-display mt-3 text-[clamp(1.9rem,3vw,2.6rem)] text-v-fg";

function Kicker({ children }: { children: React.ReactNode }) {
  return <p className="v-label text-xs text-v-spark">{children}</p>;
}

function UnderlineLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link href={href} className="v-label inline-flex items-center gap-2 text-sm text-v-fg underline decoration-v-line decoration-1 underline-offset-[7px] transition-colors duration-200 hover:decoration-v-fg">
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

  return (
    <>
      {/* 1. Hero: chữ lớn góc trái, lốp giữa khoảng tối, thẻ thông tin góc dưới */}
      <section className="relative overflow-hidden">
        <div className={`${WRAP} relative grid min-h-[min(88vh,820px)] grid-rows-[auto_1fr_auto] pb-8 pt-10 lg:pt-14`}>
          <div className="relative z-10 max-w-3xl">
            <p className="v-label text-xs text-v-fg">
              {hero.eyebrow} · {COMPANY.address}
            </p>
            <h1 className="v-display mt-4 text-[length:var(--v-hero-size)] text-v-fg">
              {hero.title.map((line) => (
                <span key={line} className="block">
                  {line}
                </span>
              ))}
            </h1>
          </div>

          {/* vật thể */}
          <div className="relative -my-6 flex items-center justify-center lg:-my-24 lg:justify-end lg:pr-[8%]">
            <div aria-hidden className="absolute left-1/2 top-1/2 size-[min(90vw,640px)] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#3a2414] opacity-60 blur-[90px] lg:left-[62%]" />
            <ProductArt kind="tyre-at" title="Lốp ô tô gai địa hình" className="relative !size-[min(78vw,560px)]" />
          </div>

          <div className="relative z-10 grid items-end gap-6 lg:grid-cols-[minmax(0,26rem)_1fr_auto]">
            {/* thẻ thông tin bán trong suốt, vuông cạnh */}
            <div className="bg-v-invert/70 p-6 backdrop-blur-md">
              <p className="v-label text-sm leading-snug text-v-fg">Lốp xe du lịch, SUV – bán tải, xe tải và xe khách.</p>
              <div className="v-rule my-4" />
              <p className="text-[15px] leading-relaxed text-v-mute">Tư vấn đúng cỡ lốp, thay lắp và cân bằng động ngay tại cửa hàng.</p>
              <div className="mt-5 flex flex-wrap gap-2.5">
                <VButton asChild size="sm">
                  <Link href={`${base}/san-pham`}>Xem sản phẩm</Link>
                </VButton>
                <VButton asChild size="sm" variant="quiet" className="bg-v-invert">
                  <a href={telHref(vertical.phone)}>
                    <Phone /> <span className="tabular-nums">{vertical.phone}</span>
                  </a>
                </VButton>
              </div>
            </div>
            <span aria-hidden />
            {spotlight && (
              <Link href={`${base}/san-pham/${spotlight.slug}`} className="group hidden items-center gap-4 bg-v-raise p-3 pr-5 transition-colors duration-200 hover:bg-v-invert sm:flex">
                <span className="relative size-16 shrink-0 bg-v-sunk">
                  <ProductArt kind={spotlight.art} className="absolute inset-0 m-auto !size-[84%]" />
                </span>
                <span>
                  <span className="v-label block text-[11px] text-v-spark">Bán chạy</span>
                  <span className="v-label mt-0.5 block text-sm text-v-fg">{spotlight.name}</span>
                </span>
                <ArrowUpRight className="size-4 text-v-mute transition-colors group-hover:text-v-fg" aria-hidden />
              </Link>
            )}
          </div>

          {/* nhãn dọc mép phải – như số sê-ri sản phẩm */}
          <p aria-hidden className="v-label absolute -right-10 top-1/2 hidden -translate-y-1/2 rotate-90 whitespace-nowrap text-[11px] text-v-mute xl:block">
            Kim Ngoan · Lốp xe ô tô
          </p>
        </div>
      </section>

      {/* 2. Giới thiệu kiểu "trưng bày": tiêu đề trái – vật thể giữa – mô tả phải */}
      <section aria-labelledby="gioi-thieu-title" className={WRAP}>
        <div className="v-rule" />
        <div className="grid items-center gap-8 py-20 lg:grid-cols-[1fr_minmax(0,22rem)_1fr] lg:py-32">
          <h2 id="gioi-thieu-title" className={H2}>
            Không chỉ là
            <br />
            bán lốp.
          </h2>
          <ProductArt kind="tyre" className="mx-auto !size-56 lg:!size-full" />
          <p className="text-[clamp(1.25rem,2vw,1.8rem)] font-normal leading-[1.3] text-v-fg">{content.about.paragraphs[0]}</p>
        </div>
        <div className="v-rule" />
        <dl className="grid sm:grid-cols-3">
          {hero.stats.map((s, i) => (
            <div key={s.label} className={`py-8 sm:px-8 ${i > 0 ? "sm:border-l sm:border-dashed sm:border-v-line" : "sm:pl-0"}`}>
              <dt className="sr-only">{s.label}</dt>
              <dd className="v-display text-5xl text-v-fg md:text-6xl">{s.value}</dd>
              <dd className="v-label mt-3 text-xs text-v-mute">{s.label}</dd>
            </div>
          ))}
        </dl>
        <div className="v-rule" />
      </section>

      {/* 3. Danh mục: danh sách kẻ đứt, không thẻ */}
      <section aria-labelledby="danh-muc-title" className={`${WRAP} py-20 lg:py-28`}>
        <div className="mb-10 flex flex-wrap items-end justify-between gap-6">
          <div>
            <Kicker>Danh mục</Kicker>
            <h2 id="danh-muc-title" className={H2}>
              Chọn lốp theo loại xe
            </h2>
          </div>
          {/* ô nhập chỉ có gạch chân */}
          <form action={`${base}/san-pham`} role="search" className="relative w-full sm:w-80">
            <label htmlFor="tim-co-lop" className="sr-only">
              Tìm theo cỡ lốp hoặc thương hiệu
            </label>
            <input
              id="tim-co-lop"
              name="q"
              type="search"
              placeholder="TÌM CỠ LỐP, VD: 205/55R16"
              className="v-label h-11 w-full border-b border-v-fg bg-transparent pr-10 text-sm text-v-fg outline-none placeholder:text-v-mute focus:border-b-2"
            />
            <button type="submit" aria-label="Tìm" className="absolute right-0 top-1/2 grid size-9 -translate-y-1/2 place-items-center text-v-fg">
              <Search className="size-4" aria-hidden />
            </button>
          </form>
        </div>
        <ul>
          {categories.map((c, i) => (
            <li key={c.slug} className="v-rule">
              <Link
                href={`${base}/san-pham?nhom=${c.slug}`}
                className="group grid grid-cols-[2.5rem_1fr_auto] items-center gap-4 py-6 transition-colors duration-200 hover:bg-v-raise md:grid-cols-[4rem_1.2fr_1.6fr_5rem_auto] md:gap-8 md:px-4 md:py-7"
              >
                <span className="v-label text-xs text-v-mute">0{i + 1}</span>
                <h3 className="v-display text-2xl text-v-fg md:text-[2rem]">{c.name}</h3>
                <p className="hidden text-base leading-relaxed text-v-mute md:block">{c.description}</p>
                <ProductArt kind={c.art} className="hidden !size-16 md:block" />
                <ArrowUpRight className="size-5 text-v-mute transition-colors duration-200 group-hover:text-v-fg" aria-hidden />
              </Link>
            </li>
          ))}
          <li className="v-rule" aria-hidden />
        </ul>
      </section>

      {/* 4. Sản phẩm bán chạy */}
      <section aria-labelledby="noi-bat-title" className={`${WRAP} pb-20 lg:pb-28`}>
        <div className="mb-10 flex flex-wrap items-end justify-between gap-6">
          <div>
            <Kicker>Bán chạy</Kicker>
            <h2 id="noi-bat-title" className={H2}>
              Lốp được chọn nhiều nhất
            </h2>
          </div>
          <UnderlineLink href={`${base}/san-pham`}>Toàn bộ sản phẩm</UnderlineLink>
        </div>
        <div className="grid grid-cols-2 gap-x-4 gap-y-10 lg:grid-cols-4">
          {featured.map((p) => (
            <VProductCard key={p.slug} product={p} />
          ))}
        </div>
      </section>

      {/* 5. Cam kết + dịch vụ: hàng chia bằng kẻ đứt */}
      <section aria-labelledby="cam-ket-title" className="bg-v-sunk">
        <div className={`${WRAP} py-20 lg:py-28`}>
          <div className="grid gap-10 lg:grid-cols-[1fr_1.2fr] lg:gap-20">
            <div>
              <Kicker>Cam kết</Kicker>
              <h2 id="cam-ket-title" className={H2}>
                Chính hãng.
                <br />
                Date mới.
                <br />
                Lắp tại chỗ.
              </h2>
              <p className="mt-8 max-w-md text-[clamp(1.15rem,1.6vw,1.45rem)] leading-[1.35] text-v-fg">{content.about.paragraphs[1]}</p>
              <p className="v-label mt-8 text-xs text-v-mute">
                Thương hiệu: <span className="text-v-fg">{brands.join(" · ")}</span>
              </p>
            </div>
            <ol>
              {content.usps.map((u, i) => (
                <li key={u.title} className="v-rule grid grid-cols-[3rem_1fr] gap-x-4 gap-y-2 py-6 md:grid-cols-[3rem_1fr_1.4fr] md:gap-8">
                  <span className="v-label text-xs text-v-mute">0{i + 1}</span>
                  <h3 className="v-label text-lg text-v-fg">{u.title}</h3>
                  <p className="col-start-2 text-[15px] leading-relaxed text-v-mute md:col-start-3">{u.description}</p>
                </li>
              ))}
              <li className="v-rule" aria-hidden />
            </ol>
          </div>

          <ul className="mt-16 grid gap-px md:grid-cols-3">
            {content.services.map((s) => (
              <li key={s.title} className="bg-v-raise p-7">
                <h3 className="v-label text-base text-v-fg">{s.title}</h3>
                <p className="mt-3 text-[15px] leading-relaxed text-v-mute">{s.description}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* 6. Tin tức của chuyên trang */}
      {news.length > 0 && (
        <section aria-labelledby="tin-tuc-title" className={`${WRAP} py-20 lg:py-28`}>
          <div className="mb-10 flex flex-wrap items-end justify-between gap-6">
            <div>
              <Kicker>Tin tức</Kicker>
              <h2 id="tin-tuc-title" className={H2}>
                Kiến thức về lốp
              </h2>
            </div>
            <UnderlineLink href={`${base}/tin-tuc`}>Tất cả bài viết</UnderlineLink>
          </div>
          <div className="grid gap-x-4 gap-y-12 md:grid-cols-3">
            {news.map((n) => (
              <VNewsCard key={n.slug} item={n} />
            ))}
          </div>
        </section>
      )}

      {/* 7. Kêu gọi hành động */}
      <section aria-labelledby="cta-title" className={WRAP}>
        <div className="v-rule" />
        <div className="grid items-end gap-8 py-20 lg:grid-cols-[1fr_auto] lg:py-28">
          <div>
            <Kicker>{vertical.contactLabel}</Kicker>
            <h2 id="cta-title" className="v-display mt-4 text-[clamp(2.25rem,6vw,5.25rem)] text-v-fg">
              Chưa biết chọn lốp nào?
              <br />
              Gọi cho chúng tôi.
            </h2>
          </div>
          <VButton asChild size="lg">
            <a href={telHref(vertical.phone)}>
              <Phone /> <span className="tabular-nums">{vertical.phone}</span>
            </a>
          </VButton>
        </div>
      </section>
    </>
  );
}
