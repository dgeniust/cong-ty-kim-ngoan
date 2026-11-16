import Link from "next/link";
import { ArrowRight, Phone } from "lucide-react";
import type { CatalogCategory, CatalogContent, CatalogProduct, NewsItem } from "@/lib/data/types";
import { telHref, type Vertical } from "@/lib/verticals";
import { ProductArt } from "./product-art";
import { VButton } from "./v-button";
import { VNewsCard } from "./v-news-card";
import { VProductCard } from "./v-product-card";

/**
 * Trang chủ sắt thép – "dụng cụ đo lúc nửa đêm": nền đen lạnh, chữ trắng nét 500 khít,
 * một điểm vàng chanh duy nhất cho hành động chính. Nội dung chính là BẢNG QUY CÁCH
 * (dữ liệu thật của sản phẩm) thay cho hình trang trí.
 * Không thẻ bo tròn, không viền thẻ, không đổ bóng: tách khối bằng bậc màu nền và kẻ mảnh.
 */

const WRAP = "mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8"; // khớp lề với header
const H2 = "v-display mt-3 text-[clamp(2rem,3.4vw,3rem)] text-white";

function Eyebrow({ children }: { children: React.ReactNode }) {
  return <p className="text-[13px] text-v-mute">{children}</p>;
}

function ArrowLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link href={href} className="group inline-flex items-center gap-1.5 text-[15px] text-[#d0d6e0] transition-colors duration-150 hover:text-white">
      {children} <ArrowRight className="size-4 text-v-mute transition-colors group-hover:text-white" aria-hidden />
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

  return (
    <>
      {/* 1. Hero: tiêu đề trái lớn – liên kết phải – khung bảng quy cách */}
      <section className="relative overflow-hidden">
        <div className={`${WRAP} pt-16 lg:pt-24`}>
          <div className="grid items-end gap-8 lg:grid-cols-[1fr_auto]">
            <h1 className="v-display max-w-4xl text-[length:var(--v-hero-size)] text-white">
              {hero.title[0]} <span className="text-v-mute">{hero.title[1]}</span>
            </h1>
            <div className="lg:max-w-xs lg:pb-2">
              <p className="text-[15px] leading-relaxed text-v-mute">{hero.description}</p>
              <div className="mt-5 flex flex-wrap items-center gap-4">
                <VButton asChild size="sm">
                  <a href={telHref(vertical.phone)}>
                    <Phone /> <span className="tabular-nums">{vertical.phone}</span>
                  </a>
                </VButton>
                <ArrowLink href={`${base}/san-pham`}>Xem sản phẩm</ArrowLink>
              </div>
            </div>
          </div>
        </div>

        {/* khung "màn hình sản phẩm": bảng quy cách thật + hình */}
        <div className={`${WRAP} relative mt-14 lg:mt-20`}>
          {/* nền sáng dần phía dưới khung – gradient duy nhất của trang */}
          <div aria-hidden className="pointer-events-none absolute inset-x-[-50vw] -bottom-px top-1/3 bg-gradient-to-b from-transparent via-[#d0d6e0]/[0.04] to-[#d0d6e0]/[0.16]" />
          <div className="relative grid bg-v-raise lg:grid-cols-[1.5fr_1fr]">
            <div className="p-5 sm:p-7">
              <div className="flex items-center justify-between">
                <p className="text-[13px] text-v-mute">Bảng quy cách · sản phẩm bán chạy</p>
                <p className="hidden text-[13px] tabular-nums text-v-mute sm:block">{categories.length} nhóm vật tư</p>
              </div>
              <table className="mt-4 w-full text-left text-sm">
                <thead className="text-[13px] text-v-mute">
                  <tr className="[&>th]:py-2.5 [&>th]:font-normal">
                    <th scope="col">Sản phẩm</th>
                    <th scope="col" className="hidden sm:table-cell">Quy cách</th>
                    <th scope="col" className="hidden md:table-cell">Hãng</th>
                    <th scope="col" className="text-right">Giá</th>
                  </tr>
                </thead>
                <tbody>
                  {featured.map((p) => (
                    <tr key={p.slug} className="group relative transition-colors duration-150 hover:bg-[#161718] [&>td]:border-t [&>td]:border-v-line [&>td]:py-3.5">
                      <td className="pr-4 font-medium text-[#f7f8f8]">
                        <Link href={`${base}/san-pham/${p.slug}`} className="after:absolute after:inset-0 after:content-['']">
                          {p.name}
                        </Link>
                      </td>
                      <td className="hidden pr-4 tabular-nums text-[#d0d6e0] sm:table-cell">{p.keySpec}</td>
                      <td className="hidden pr-4 text-v-mute md:table-cell">{p.brand}</td>
                      <td className="text-right text-v-mute">Liên hệ</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="v-art relative min-h-[260px] !rounded-none">
              <ProductArt kind="ibeam" title="Thép hình chữ I" className="absolute inset-0 m-auto !size-[72%]" />
              <p className="absolute bottom-4 left-5 text-xs tabular-nums text-v-mute">I200 × 100 × 5,5 × 8 · SS400</p>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Số liệu + thương hiệu (dải chữ xám, không thẻ) */}
      <section aria-label="Số liệu và thương hiệu" className={`${WRAP} py-16 lg:py-24`}>
        <dl className="grid gap-y-8 sm:grid-cols-3">
          {hero.stats.map((s) => (
            <div key={s.label}>
              <dt className="sr-only">{s.label}</dt>
              <dd className="v-display text-5xl text-white">{s.value}</dd>
              <dd className="mt-2 text-sm text-v-mute">{s.label}</dd>
            </div>
          ))}
        </dl>
        <div className="v-rule mt-12" />
        <ul className="flex flex-wrap items-center justify-between gap-x-12 gap-y-4 pt-8">
          {brands.map((b) => (
            <li key={b} className="text-xl font-medium tracking-tight text-v-mute">
              {b}
            </li>
          ))}
        </ul>
      </section>

      {/* 3. Nhóm vật tư: chữ trái – danh sách kẻ mảnh phải */}
      <section aria-labelledby="danh-muc-title" className={`${WRAP} grid gap-10 pb-24 lg:grid-cols-[1fr_1.6fr] lg:gap-20`}>
        <div className="lg:sticky lg:top-28 lg:self-start">
          <Eyebrow>Nhóm vật tư</Eyebrow>
          <h2 id="danh-muc-title" className={H2}>
            Đủ chủng loại cho phần thô, kết cấu và mái
          </h2>
          <div className="mt-6">
            <ArrowLink href={`${base}/san-pham`}>Toàn bộ sản phẩm</ArrowLink>
          </div>
        </div>
        <ul>
          {categories.map((c, i) => (
            <li key={c.slug} className="v-rule">
              <Link href={`${base}/san-pham?nhom=${c.slug}`} className="group grid grid-cols-[2rem_1fr_auto] items-center gap-4 py-5 transition-colors duration-150 hover:bg-v-raise sm:grid-cols-[2rem_3.5rem_1fr_auto] sm:px-3">
                <span className="text-[13px] tabular-nums text-v-mark">0{i + 1}</span>
                <ProductArt kind={c.art} className="hidden !size-12 sm:block" />
                <span>
                  <span className="block text-xl font-medium tracking-tight text-[#f7f8f8]">{c.name}</span>
                  <span className="mt-1 block text-sm text-v-mute">{c.description}</span>
                </span>
                <ArrowRight className="size-4 text-v-mark transition-colors duration-150 group-hover:text-white" aria-hidden />
              </Link>
            </li>
          ))}
          <li className="v-rule" aria-hidden />
        </ul>
      </section>

      {/* 4. Sản phẩm bán chạy */}
      <section aria-labelledby="noi-bat-title" className="bg-v-sunk py-24">
        <div className={WRAP}>
          <div className="mb-10 flex flex-wrap items-end justify-between gap-5">
            <div>
              <Eyebrow>Bán chạy</Eyebrow>
              <h2 id="noi-bat-title" className={H2}>
                Khách chọn nhiều nhất
              </h2>
            </div>
            <ArrowLink href={`${base}/san-pham`}>Xem tất cả</ArrowLink>
          </div>
          <div className="grid grid-cols-2 gap-x-3 gap-y-10 lg:grid-cols-4">
            {featured.map((p) => (
              <VProductCard key={p.slug} product={p} />
            ))}
          </div>
        </div>
      </section>

      {/* 5. Cam kết: lưới ô phẳng sát nhau (kẻ = khe hở 1px) */}
      <section aria-labelledby="cam-ket-title" className={`${WRAP} py-24`}>
        <div className="grid gap-10 lg:grid-cols-[1fr_1.6fr] lg:gap-20">
          <div>
            <Eyebrow>Vì sao chọn Kim Ngoan</Eyebrow>
            <h2 id="cam-ket-title" className={H2}>
              Cân đủ, đúng quy cách, đúng tiến độ
            </h2>
            <p className="mt-5 max-w-md text-base leading-relaxed text-v-mute">{content.about.paragraphs[1]}</p>
          </div>
          <ol className="grid gap-px bg-v-line sm:grid-cols-2">
            {content.usps.map((u, i) => (
              <li key={u.title} className="bg-v-bg p-6 sm:p-7">
                <p className="text-[13px] tabular-nums text-v-mark">0{i + 1}</p>
                <h3 className="mt-5 text-lg font-medium tracking-tight text-[#f7f8f8]">{u.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-v-mute">{u.description}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* 6. Dịch vụ */}
      <section aria-labelledby="dich-vu-title" className={`${WRAP} pb-24`}>
        <div className="v-rule" />
        <div className="grid gap-10 pt-16 lg:grid-cols-[1fr_1.6fr] lg:gap-20">
          <div>
            <Eyebrow>Dịch vụ đi kèm</Eyebrow>
            <h2 id="dich-vu-title" className={H2}>
              {content.about.title}
            </h2>
            <p className="mt-5 max-w-md text-base leading-relaxed text-v-mute">{content.about.paragraphs[0]}</p>
          </div>
          <ul>
            {content.services.map((s) => (
              <li key={s.title} className="v-rule grid gap-2 py-6 sm:grid-cols-[1fr_1.3fr] sm:gap-8">
                <h3 className="text-lg font-medium tracking-tight text-[#f7f8f8]">{s.title}</h3>
                <p className="text-sm leading-relaxed text-v-mute">{s.description}</p>
              </li>
            ))}
            <li className="v-rule" aria-hidden />
          </ul>
        </div>
      </section>

      {/* 7. Tin tức của chuyên trang */}
      {news.length > 0 && (
        <section aria-labelledby="tin-tuc-title" className="bg-v-sunk py-24">
          <div className={WRAP}>
            <div className="mb-10 flex flex-wrap items-end justify-between gap-5">
              <div>
                <Eyebrow>Tin tức</Eyebrow>
                <h2 id="tin-tuc-title" className={H2}>
                  Kiến thức chọn và dùng thép
                </h2>
              </div>
              <ArrowLink href={`${base}/tin-tuc`}>Tất cả bài viết</ArrowLink>
            </div>
            <div className="grid gap-x-4 gap-y-12 md:grid-cols-3">
              {news.map((n) => (
                <VNewsCard key={n.slug} item={n} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 8. Kêu gọi hành động */}
      <section aria-labelledby="cta-title" className={`${WRAP} py-24 lg:py-32`}>
        <div className="grid items-end gap-8 lg:grid-cols-[1fr_auto]">
          <h2 id="cta-title" className="v-display max-w-3xl text-[clamp(2.25rem,5vw,4rem)] text-white">
            Cần báo giá thép hôm nay? <span className="text-v-mute">Gửi quy cách, nhận giá theo barem trong ngày.</span>
          </h2>
          <div className="flex flex-wrap items-center gap-4">
            <VButton asChild>
              <a href={telHref(vertical.phone)}>
                <Phone /> <span className="tabular-nums">{vertical.phone}</span>
              </a>
            </VButton>
            <ArrowLink href={`${base}/lien-he`}>Gửi yêu cầu</ArrowLink>
          </div>
        </div>
      </section>
    </>
  );
}
