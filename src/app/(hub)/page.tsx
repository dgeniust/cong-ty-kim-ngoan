import "@fontsource/dancing-script/vietnamese-600.css";
import "@fontsource/dancing-script/latin-600.css";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ArrowUpRight, Clock, Leaf, Mail, MapPin, MessageCircle, Navigation, Phone, ReceiptText, ShieldCheck, Truck } from "lucide-react";
import { ProductArt } from "@/components/nganh/product-art";
import { Reveal } from "@/components/shared/reveal";
import { getCategories } from "@/lib/data/catalog";
import { getNews } from "@/lib/data/news";
import type { NewsItem } from "@/lib/data/types";
import { formatDate } from "@/lib/format";
import { categoryGroups as pbGroups } from "@/lib/mock/categories";
import { getFertilizerProducts } from "@/lib/products/server";
import { getSettings } from "@/lib/settings/server";
import { BUTTON_SIZES } from "@/lib/ui";
import { cn } from "@/lib/utils";
import { telHref, type VerticalId } from "@/lib/verticals";

/**
 * Landing tổng – v1.2 (nhánh fe/notion-style-v1.2).
 * Giữ theme của landing tổng (nền giấy ấm, chữ Be Vietnam Pro, bo góc mềm, không gradient), đổi:
 *  - màu hành động chính sang xanh rừng (token hub-blue, xem globals.css) cho chất nông nghiệp;
 *  - hạn chế viền: tách khối bằng nền trắng / nền lá nhạt và khoảng trắng;
 *  - phân bón là ngành chính (khối lớn, đứng đầu), lốp xe & sắt thép là ngành bổ trợ.
 * Bốn khối: Hero (ảnh nền ba ngành, nội dung bên phải) → Danh mục sản phẩm → Tin tức → Liên hệ.
 */

const WRAP = "mx-auto w-full max-w-[1320px] px-4 sm:px-6 lg:px-10";
const BTN = `inline-flex items-center justify-center gap-2 rounded-xl font-medium transition-colors duration-200 ${BUTTON_SIZES.md}`;
const BTN_PRIMARY = `${BTN} group bg-hub-blue text-white hover:bg-hub-blue-hover`;
const BTN_SOFT = `${BTN} bg-hub-blue-tint text-hub-blue hover:bg-[#e0eed3]`;
const DOT: Record<VerticalId, string> = { phanbon: "bg-sector-phanbon", lopxe: "bg-sector-lopxe", satthep: "bg-sector-satthep" };

/** Nhãn nhỏ đầu khối: gạch ngắn + chữ xanh (không viết hoa toàn bộ). */
function Eyebrow({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <p className={cn("flex items-center gap-2.5 text-small font-semibold text-hub-blue", className)}>
      <span aria-hidden className="h-[2px] w-6 rounded-full bg-current" />
      {children}
    </p>
  );
}

function NewsMeta({ item, label }: { item: NewsItem; label: string }) {
  return (
    <p className="flex flex-wrap items-center gap-x-3 text-caption text-hub-ink-soft">
      <span className="inline-flex items-center gap-1.5 font-medium text-hub-ink">
        <span aria-hidden className={cn("size-2 rounded-full", DOT[item.site])} /> {label}
      </span>
      <time dateTime={item.date}>{formatDate(item.date)}</time>
    </p>
  );
}

/** "Mo-Su 07:00-18:00" → "07:00 – 18:00, tất cả các ngày" */
function hoursText(v: string) {
  const m = /^(Mo-Su|Mo-Sa|Mo-Fr)\s+(\d\d:\d\d)-(\d\d:\d\d)$/.exec(v.trim());
  if (!m) return v;
  const days = { "Mo-Su": "tất cả các ngày", "Mo-Sa": "thứ Hai – thứ Bảy", "Mo-Fr": "thứ Hai – thứ Sáu" }[m[1]];
  return `${m[2]} – ${m[3]}, ${days}`;
}

/**
 * Tin tức: 1 bài phân bón lớn (ưu tiên bài có ảnh) + 1 bài lốp xe + 1 bài sắt thép,
 * kèm vài bài phân bón khác dạng danh sách ngắn → vẫn nghiêng về phân bón.
 */
function pickNews(all: NewsItem[]) {
  const pb = all.filter((n) => n.site === "phanbon");
  const feature = pb.find((n) => n.cover && !/tmp-img/.test(n.cover)) ?? pb[0] ?? all[0];
  const side = (["lopxe", "satthep"] as const).map((site) => all.find((n) => n.site === site && n.cover) ?? all.find((n) => n.site === site)).filter((n): n is NewsItem => !!n && n !== feature);
  const more = pb.filter((n) => n !== feature).slice(0, 3);
  return { feature, side, more };
}

export default async function HubHome() {
  const { COMPANY, VERTICALS, VERTICAL_LIST } = await getSettings();
  const pbProducts = await getFertilizerProducts();
  const news = pickNews(await getNews());
  const tyreGroups = getCategories("lopxe").slice(0, 3);
  const steelGroups = getCategories("satthep").slice(0, 3);

  const promises = [
    { icon: ShieldCheck, text: "Chính hãng, có hoá đơn" },
    { icon: ReceiptText, text: "Báo giá theo ngày" },
    { icon: Truck, text: "Giao tận vườn" },
  ];

  const mapsDir = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(COMPANY.mapQuery)}`;

  return (
    <>
      {/* ------------------------------------------------------------------ HERO
          Ảnh nền ba ngành (bên trái ảnh), nội dung đặt bên phải trên nền giấy mờ để luôn dễ đọc. */}
      <section id="top" aria-labelledby="hero-title" className="relative isolate pb-16 md:pb-24 lg:px-6 lg:pt-2 xl:px-8">
        <div className="relative mx-auto max-w-[1600px] overflow-hidden lg:min-h-[clamp(600px,80vh,780px)] lg:rounded-[32px]">
          {/* ảnh */}
          <div className="relative aspect-[16/11] sm:aspect-[16/9] lg:absolute lg:inset-0 lg:aspect-auto">
            <Image src="/hero/hero-bg.jpg" alt="Bao phân bón, thép và lốp xe bên vườn cây trên đất đỏ Chơn Thành" fill loading="eager" fetchPriority="high" sizes="100vw" className="object-cover object-[22%_60%] lg:object-[30%_55%]" />
          </div>

          {/* ba ngành hàng – nằm trên ảnh, góc trái dưới */}
          <nav aria-label="Ba ngành hàng" className={cn(WRAP, "relative z-10 mt-4 lg:absolute lg:bottom-8 lg:left-0 lg:mt-0 lg:max-w-none lg:px-8 xl:px-10")}>
            <ul className="flex flex-wrap gap-2">
              {VERTICAL_LIST.map((v) => {
                const main = v.id === "phanbon";
                return (
                  <li key={v.id} className="shrink-0">
                    <Link
                      href={v.base}
                      className={cn(
                        "group inline-flex min-h-11 items-center gap-2 rounded-full py-1.5 pl-2 pr-3.5 text-small font-semibold backdrop-blur-md transition-colors duration-200 lg:min-h-12 lg:gap-2.5 lg:py-2 lg:pl-3 lg:pr-4 lg:shadow-[var(--shadow-hub-ui)]",
                        main ? "bg-hub-blue text-white hover:bg-hub-blue-hover" : "bg-hub-paper text-hub-ink hover:bg-hub-stone lg:bg-hub-paper/90 lg:hover:bg-hub-paper"
                      )}
                    >
                      <span aria-hidden className={cn("grid size-6 place-items-center rounded-full lg:size-7", main ? "bg-white/15" : "bg-hub-canvas")}>
                        <span className={cn("size-2 rounded-full", main ? "bg-white" : DOT[v.id])} />
                      </span>
                      {v.name}
                      <ArrowUpRight className="size-4 opacity-70 transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden />
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* nội dung */}
          <div className={cn(WRAP, "relative z-10 lg:flex lg:min-h-[clamp(600px,80vh,780px)] lg:items-center lg:justify-end lg:px-8 lg:py-12 xl:px-10")}>
            <div className="pt-8 lg:w-[min(560px,46%)] lg:rounded-[28px] lg:bg-hub-canvas/85 lg:p-10 lg:pt-10 lg:shadow-[var(--shadow-hub-ui)] lg:backdrop-blur-md xl:p-12">
              <Eyebrow>
                {COMPANY.legalName} · từ năm {COMPANY.founded}
              </Eyebrow>
              <h1 id="hero-title" className="mt-5 text-[clamp(2.4rem,3.9vw,3.5rem)] font-semibold leading-[1.08] tracking-[-0.03em] text-hub-ink">
                <span className="block">Chăm từ gốc rễ,</span> <span className="block text-hub-blue">cho mùa trĩu quả.</span>
              </h1>
              <p className="mt-5 text-lead leading-relaxed text-hub-ink-soft">
                Từ năm {COMPANY.founded}, Kim Ngoan đi cùng những vườn cà phê, sầu riêng, hồ tiêu quanh {COMPANY.area}. Chúng tôi mang đến phân bón, thuốc bảo vệ thực vật chính hãng và lời khuyên thật lòng của người hiểu đất, hiểu cây.
              </p>
              <p className="mt-5 font-script text-[1.75rem] leading-none text-hub-blue sm:text-[2rem]">{COMPANY.slogan}</p>

              <div className="mt-8 flex flex-wrap gap-3">
                <Link href={VERTICALS.phanbon.base} className={BTN_PRIMARY}>
                  Xem phân bón & thuốc
                  <ArrowRight className="size-4 transition-transform duration-200 group-hover:translate-x-0.5" aria-hidden />
                </Link>
                <a href={telHref(COMPANY.hotline)} className={BTN_SOFT} aria-label={`Gọi tư vấn ${COMPANY.hotline}`}>
                  <Phone className="size-4" aria-hidden /> <span className="tabular-nums">{COMPANY.hotline}</span>
                </a>
              </div>

              <ul className="mt-8 flex flex-wrap gap-x-6 gap-y-3 text-small text-hub-ink-soft">
                {promises.map(({ icon: Icon, text }) => (
                  <li key={text} className="flex items-center gap-2">
                    <Icon className="size-4 shrink-0 text-hub-blue" aria-hidden />
                    {text}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------------ DANH MỤC SẢN PHẨM */}
      <section id="san-pham" aria-labelledby="san-pham-title" className="scroll-mt-24 bg-hub-paper py-20 md:py-28">
        <div className={WRAP}>
          <Reveal className="mb-10 grid gap-5 md:mb-14 lg:grid-cols-12 lg:items-end lg:gap-8">
            <div className="lg:col-span-7">
              <Eyebrow>Danh mục sản phẩm</Eyebrow>
              <h2 id="san-pham-title" className="mt-4 text-h1 font-semibold text-hub-ink">
                Từ gốc cây đến mái nhà
              </h2>
            </div>
            <p className="text-lead leading-relaxed text-hub-ink-soft lg:col-span-5">
              Phân bón là nghề chính, là cái tâm của Kim Ngoan. Lốp xe và sắt thép đi kèm để phục vụ chính bà con nhà vườn: lốp cho xe chở nông sản, thép cho nhà kho, chuồng trại, mái nhà.
            </p>
          </Reveal>

          <div className="grid gap-4 lg:grid-cols-12 lg:gap-5">
            {/* Ngành chính: phân bón */}
            <Reveal className="lg:col-span-7 lg:row-span-2">
              <article className="group relative flex h-full flex-col overflow-hidden rounded-[22px] bg-hub-blue-tint">
                <div className="relative aspect-[16/9] overflow-hidden sm:aspect-[2/1] lg:aspect-[16/8]">
                  <Image src="/coffee.jpg" alt="Cành cà phê chín đỏ" fill sizes="(min-width: 1024px) 56vw, 100vw" className="object-cover transition-transform duration-700 ease-soft group-hover:scale-[1.03]" />
                  <span className="absolute left-4 top-4 inline-flex items-center gap-1.5 rounded-full bg-hub-paper/95 px-3 py-1.5 text-caption font-semibold text-hub-blue backdrop-blur-sm">
                    <Leaf className="size-3.5" aria-hidden /> Ngành hàng chính
                  </span>
                </div>
                <div className="flex flex-1 flex-col p-6 sm:p-8">
                  <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2">
                    <h3 className="text-h2 font-semibold text-hub-ink">{VERTICALS.phanbon.name}</h3>
                    <p className="text-small text-hub-ink-soft">
                      <span className="font-semibold tabular-nums text-hub-ink">{pbProducts.length}+</span> sản phẩm đang bán
                    </p>
                  </div>
                  <p className="mt-3 max-w-[40rem] text-body leading-relaxed text-hub-ink-soft">
                    Đủ các dòng phân hữu cơ, vô cơ, NPK, vi sinh và thuốc bảo vệ thực vật chính hãng. Mỗi bao phân bán ra đều kèm hướng dẫn liều lượng theo tuổi cây và thời điểm trong mùa.
                  </p>
                  <div className="mt-6 grid gap-6 sm:grid-cols-2">
                    {pbGroups.map((g) => (
                      <div key={g.slug}>
                        <h4 className="text-small font-semibold text-hub-ink">{g.name}</h4>
                        <ul className="mt-2.5 space-y-1">
                          {g.children.map((c) => (
                            <li key={c.slug}>
                              <Link href={`${VERTICALS.phanbon.base}/danh-muc/${c.slug}`} className="group/l -mx-2 flex min-h-9 items-center justify-between rounded-lg px-2 text-body text-hub-ink-soft transition-colors hover:bg-hub-paper hover:text-hub-ink">
                                {c.name}
                                <ArrowRight className="size-4 opacity-0 transition-[opacity,transform] duration-200 group-hover/l:translate-x-0.5 group-hover/l:opacity-100" aria-hidden />
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                  <div className="mt-auto flex flex-wrap gap-3 pt-8">
                    <Link href={VERTICALS.phanbon.base} className={BTN_PRIMARY}>
                      Vào trang phân bón
                      <ArrowRight className="size-4 transition-transform duration-200 group-hover:translate-x-0.5" aria-hidden />
                    </Link>
                    <a href={telHref(VERTICALS.phanbon.phone)} className={cn(BTN, "bg-hub-paper text-hub-ink hover:bg-hub-paper/70")}>
                      <Phone className="size-4" aria-hidden /> <span className="tabular-nums">{VERTICALS.phanbon.phone}</span>
                    </a>
                  </div>
                </div>
              </article>
            </Reveal>

            {/* Ngành bổ trợ */}
            {[
              { v: VERTICALS.lopxe, image: "/item-tyre.jpg", alt: "Lốp xe ô tô", text: "Lốp chính hãng cho xe con, bán tải và xe tải nhẹ. Thay, cân bằng động và đảo lốp tại chỗ.", groups: tyreGroups },
              { v: VERTICALS.satthep, image: "/item-steel.jpg", alt: "Thép ống mạ kẽm", text: "Thép cây, thép hình, ống hộp và tôn lợp đủ quy cách, cắt theo yêu cầu, báo giá theo ngày.", groups: steelGroups },
            ].map(({ v, image, alt, text, groups }, i) => (
              <Reveal key={v.id} delay={(i + 1) * 80} className="lg:col-span-5">
                <article className="group relative grid h-full gap-5 rounded-[22px] bg-hub-canvas p-5 sm:grid-cols-[minmax(0,1fr)_10rem] sm:p-6 lg:grid-cols-[minmax(0,1fr)_9rem] xl:grid-cols-[minmax(0,1fr)_11rem]">
                  <div className="flex flex-col">
                    <p className="inline-flex items-center gap-2 text-caption text-hub-ink-soft">
                      <span aria-hidden className={cn("size-2 rounded-full", DOT[v.id])} /> Ngành bổ trợ
                    </p>
                    <h3 className="mt-2 text-h3 font-semibold text-hub-ink">
                      <Link href={v.base} className="after:absolute after:inset-0 after:rounded-[22px] after:content-[''] focus-visible:outline-none">
                        {v.name}
                      </Link>
                    </h3>
                    <p className="mt-2 text-body leading-relaxed text-hub-ink-soft">{text}</p>
                    <p className="mt-3 text-small text-hub-ink-soft">{groups.map((g) => g.name).join(" · ")}</p>
                    <span className="mt-auto inline-flex items-center gap-1.5 pt-5 text-small font-semibold text-hub-ink transition-colors group-hover:text-hub-blue">
                      Xem {v.short.toLowerCase()} <ArrowUpRight className="size-4 transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden />
                    </span>
                  </div>
                  <div className="relative order-first aspect-[16/9] overflow-hidden rounded-2xl bg-hub-paper sm:order-none sm:aspect-auto">
                    <Image src={image} alt={alt} fill sizes="(min-width: 640px) 12rem, 100vw" className="object-contain p-3 transition-transform duration-500 ease-soft group-hover:scale-105" />
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------------ TIN TỨC
          Bài phân bón lớn bên trái; lốp xe, sắt thép bên phải; thêm vài bài phân bón dạng danh sách. */}
      {news.feature && (
        <section id="tin-tuc" aria-labelledby="tin-tuc-title" className={cn(WRAP, "scroll-mt-24 py-20 md:py-28")}>
          <Reveal className="mb-10 flex flex-wrap items-end justify-between gap-x-8 gap-y-5 md:mb-14">
            <div className="max-w-3xl">
              <Eyebrow>Tin tức & kiến thức</Eyebrow>
              <h2 id="tin-tuc-title" className="mt-4 text-h1 font-semibold text-hub-ink">
                Chuyện vườn, chuyện nghề
              </h2>
              <p className="mt-4 text-lead leading-relaxed text-hub-ink-soft">Kinh nghiệm bón phân theo mùa, cách chăm cây qua nắng hạn, và vài điều nên biết trước khi thay lốp hay mua thép.</p>
            </div>
            <Link href="/tin-tuc" className="group inline-flex min-h-11 items-center gap-1.5 text-body font-semibold text-hub-blue">
              Xem tất cả bài viết <ArrowRight className="size-4 transition-transform duration-200 group-hover:translate-x-0.5" aria-hidden />
            </Link>
          </Reveal>

          <div className="grid gap-5 lg:grid-cols-12">
            {/* bài nổi bật – phân bón */}
            <Reveal className="lg:col-span-7">
              <article className="group relative flex h-full flex-col overflow-hidden rounded-[22px] bg-hub-paper">
                <div className="relative aspect-[16/9] overflow-hidden bg-hub-blue-tint">
                  {news.feature.cover && <Image src={news.feature.cover} alt="" fill sizes="(min-width: 1024px) 56vw, 100vw" className="object-cover transition-transform duration-700 ease-soft group-hover:scale-[1.03]" />}
                  <span className="absolute left-4 top-4 inline-flex items-center gap-1.5 rounded-full bg-hub-paper/95 px-3 py-1.5 text-caption font-semibold text-hub-blue backdrop-blur-sm">
                    <Leaf className="size-3.5" aria-hidden /> Kỹ thuật canh tác
                  </span>
                </div>
                <div className="flex flex-1 flex-col p-6 sm:p-8">
                  <NewsMeta item={news.feature} label={VERTICALS[news.feature.site].short} />
                  <h3 className="mt-3 text-h3 font-semibold leading-snug text-hub-ink">
                    <Link href={news.feature.href} className="after:absolute after:inset-0 after:content-[''] group-hover:text-hub-blue">
                      {news.feature.title}
                    </Link>
                  </h3>
                  <p className="mt-3 max-w-[40rem] text-body leading-relaxed text-hub-ink-soft">{news.feature.excerpt}</p>
                  <span className="mt-auto inline-flex items-center gap-1.5 pt-6 text-small font-semibold text-hub-ink transition-colors group-hover:text-hub-blue">
                    Đọc bài viết <ArrowRight className="size-4 transition-transform duration-200 group-hover:translate-x-0.5" aria-hidden />
                  </span>
                </div>
              </article>
            </Reveal>

            {/* lốp xe, sắt thép + thêm bài phân bón */}
            <div className="flex flex-col gap-5 lg:col-span-5">
              {news.side.map((item, i) => (
                <Reveal key={`${item.site}-${item.slug}`} delay={(i + 1) * 80}>
                  <article className="group relative grid grid-cols-[minmax(0,9rem)_minmax(0,1fr)] gap-4 overflow-hidden rounded-[22px] bg-hub-paper p-3 sm:grid-cols-[minmax(0,12rem)_minmax(0,1fr)] sm:gap-5">
                    <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-hub-canvas">
                      {item.cover ? (
                        <Image src={item.cover} alt="" fill sizes="12rem" className="object-cover transition-transform duration-700 ease-soft group-hover:scale-[1.05]" />
                      ) : (
                        item.art && <ProductArt kind={item.art} className="absolute inset-0 m-auto !size-[70%]" />
                      )}
                    </div>
                    <div className="flex min-w-0 flex-col py-1 pr-2">
                      <NewsMeta item={item} label={VERTICALS[item.site].short} />
                      <h3 className="mt-2 line-clamp-3 text-body font-semibold leading-snug text-hub-ink sm:text-title">
                        <Link href={item.href} className="after:absolute after:inset-0 after:content-[''] group-hover:text-hub-blue">
                          {item.title}
                        </Link>
                      </h3>
                      <span className="mt-auto inline-flex items-center gap-1.5 pt-3 text-small font-semibold text-hub-ink transition-colors group-hover:text-hub-blue">
                        Đọc tiếp <ArrowRight className="size-4 transition-transform duration-200 group-hover:translate-x-0.5" aria-hidden />
                      </span>
                    </div>
                  </article>
                </Reveal>
              ))}

              {news.more.length > 0 && (
                <Reveal delay={240} className="flex-1">
                  <div className="flex h-full flex-col rounded-[22px] bg-hub-blue-tint p-5 sm:p-6">
                    <p className="flex items-center gap-2 text-small font-semibold text-hub-blue">
                      <Leaf className="size-4" aria-hidden /> Thêm về phân bón & chăm cây
                    </p>
                    <ul className="mt-3">
                      {news.more.map((n) => (
                        <li key={n.slug}>
                          <Link href={n.href} className="group/l -mx-2 flex min-h-12 items-center justify-between gap-4 rounded-lg px-2 py-2 text-body text-hub-ink transition-colors hover:bg-hub-paper">
                            <span className="line-clamp-2">{n.title}</span>
                            <ArrowRight className="size-4 shrink-0 text-hub-ink-soft transition-transform duration-200 group-hover/l:translate-x-0.5 group-hover/l:text-hub-blue" aria-hidden />
                          </Link>
                        </li>
                      ))}
                    </ul>
                    <Link href={`${VERTICALS.phanbon.base}/tin-tuc`} className="group mt-auto inline-flex min-h-11 items-center gap-1.5 pt-4 text-small font-semibold text-hub-blue">
                      Tất cả bài viết về phân bón <ArrowRight className="size-4 transition-transform duration-200 group-hover:translate-x-0.5" aria-hidden />
                    </Link>
                  </div>
                </Reveal>
              )}
            </div>
          </div>
        </section>
      )}

      {/* ------------------------------------------------------------------ LIÊN HỆ */}
      <section id="lien-he" aria-labelledby="lien-he-title" className={cn(WRAP, "scroll-mt-24 pb-20 md:pb-28", !news.feature && "pt-20 md:pt-28")}>
        <div className="grid overflow-hidden rounded-[28px] bg-hub-blue-tint lg:grid-cols-12">
          <Reveal className="p-6 sm:p-10 lg:col-span-5 lg:p-12">
            <Eyebrow>Liên hệ</Eyebrow>
            <h2 id="lien-he-title" className="mt-4 text-h2 font-semibold text-hub-ink">
              Ghé cửa hàng, hay gọi một cuộc là đủ.
            </h2>
            <p className="mt-4 text-lead leading-relaxed text-hub-ink-soft">Cây có dấu hiệu lạ, cần báo giá cho công trình hay muốn thay bộ lốp mới, cứ gọi. Mỗi ngành có người phụ trách riêng, trả lời đúng chuyên môn.</p>

            <ul className="mt-8 space-y-1">
              {VERTICAL_LIST.map((v) => (
                <li key={v.id}>
                  <a href={telHref(v.phone)} className="group -mx-3 flex min-h-14 items-center gap-3 rounded-xl px-3 transition-colors hover:bg-hub-paper/70">
                    <span aria-hidden className={cn("size-2.5 shrink-0 rounded-full", DOT[v.id])} />
                    <span className="min-w-0 flex-1">
                      <span className="block text-body font-medium text-hub-ink">{v.name}</span>
                      {v.id === "phanbon" && <span className="block text-caption text-hub-ink-soft">Tư vấn kỹ thuật canh tác miễn phí</span>}
                    </span>
                    <span className="text-body font-semibold tabular-nums text-hub-ink group-hover:text-hub-blue">{v.phone}</span>
                  </a>
                </li>
              ))}
            </ul>

            <dl className="mt-6 space-y-3.5 text-body text-hub-ink-soft">
              <div className="flex gap-3">
                <dt className="sr-only">Địa chỉ</dt>
                <MapPin className="mt-0.5 size-5 shrink-0 text-hub-blue" aria-hidden />
                <dd>
                  <address className="not-italic">{COMPANY.address}</address>
                </dd>
              </div>
              <div className="flex gap-3">
                <dt className="sr-only">Giờ mở cửa</dt>
                <Clock className="mt-0.5 size-5 shrink-0 text-hub-blue" aria-hidden />
                <dd>{hoursText(COMPANY.openingHours)}</dd>
              </div>
              {COMPANY.email && (
                <div className="flex gap-3">
                  <dt className="sr-only">Email</dt>
                  <Mail className="mt-0.5 size-5 shrink-0 text-hub-blue" aria-hidden />
                  <dd>
                    <a href={`mailto:${COMPANY.email}`} className="hover:text-hub-ink">
                      {COMPANY.email}
                    </a>
                  </dd>
                </div>
              )}
            </dl>

            <div className="mt-8 flex flex-wrap gap-3">
              <a href={telHref(COMPANY.hotline)} className={BTN_PRIMARY}>
                <Phone className="size-4" aria-hidden /> Gọi <span className="tabular-nums">{COMPANY.hotline}</span>
              </a>
              {COMPANY.zalo && (
                <a href={COMPANY.zalo} target="_blank" rel="noopener noreferrer" className={cn(BTN, "bg-hub-paper text-hub-ink hover:bg-hub-paper/70")}>
                  <MessageCircle className="size-4" aria-hidden /> Nhắn Zalo
                </a>
              )}
            </div>
          </Reveal>

          <div className="relative min-h-[320px] bg-[#e4ebdc] lg:col-span-7 lg:min-h-[560px]">
            <iframe
              title={`Bản đồ đường tới ${COMPANY.legalName}`}
              src={`https://www.google.com/maps?q=${encodeURIComponent(COMPANY.mapQuery)}&output=embed`}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="absolute inset-0 size-full border-0 grayscale-[30%]"
            />
            <a href={mapsDir} target="_blank" rel="noopener noreferrer" className={cn(BTN, "absolute bottom-4 right-4 bg-hub-paper text-hub-ink shadow-[var(--shadow-hub-ui)] hover:bg-hub-canvas")}>
              <Navigation className="size-4" aria-hidden /> Chỉ đường
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
