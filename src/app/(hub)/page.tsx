import "@fontsource/dancing-script/vietnamese-600.css";
import "@fontsource/dancing-script/latin-600.css";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ArrowUpRight, Clock, Leaf, Mail, MapPin, MessageCircle, Navigation, Phone, ReceiptText, ShieldCheck, Truck } from "lucide-react";
import { HeroSlides, type HeroSlide } from "@/components/hub/hero-slides";
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
 * Bốn khối: Hero (ảnh đổi ngành mỗi 6s) → Danh mục sản phẩm → Tin tức → Liên hệ.
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

/** "Mo-Su 07:00-18:00" → "07:00 – 18:00, tất cả các ngày" */
function hoursText(v: string) {
  const m = /^(Mo-Su|Mo-Sa|Mo-Fr)\s+(\d\d:\d\d)-(\d\d:\d\d)$/.exec(v.trim());
  if (!m) return v;
  const days = { "Mo-Su": "tất cả các ngày", "Mo-Sa": "thứ Hai – thứ Bảy", "Mo-Fr": "thứ Hai – thứ Sáu" }[m[1]];
  return `${m[2]} – ${m[3]}, ${days}`;
}

/** 3 tin: ưu tiên 2 bài phân bón mới nhất + 1 bài mới nhất của ngành khác, xếp theo ngày. */
function pickNews(all: NewsItem[]) {
  const pb = all.filter((n) => n.site === "phanbon").slice(0, 2);
  const other = all.filter((n) => n.site !== "phanbon").slice(0, 3 - pb.length);
  const picked = [...pb, ...other];
  if (picked.length < 3) picked.push(...all.filter((n) => !picked.includes(n)).slice(0, 3 - picked.length));
  return picked.sort((a, b) => b.date.localeCompare(a.date));
}

export default async function HubHome() {
  const { COMPANY, VERTICALS, VERTICAL_LIST } = await getSettings();
  const pbProducts = await getFertilizerProducts();
  const news = pickNews(await getNews());
  const tyreGroups = getCategories("lopxe").slice(0, 3);
  const steelGroups = getCategories("satthep").slice(0, 3);

  const slides: HeroSlide[] = [
    {
      id: "phanbon",
      label: VERTICALS.phanbon.short,
      hint: "Ngành hàng chính",
      title: "Dinh dưỡng đúng lúc cho cà phê, sầu riêng, hồ tiêu",
      href: VERTICALS.phanbon.base,
      cta: "Xem phân bón & thuốc BVTV",
      image: "/hero/phan-bon.jpg",
      alt: "Vườn cây ăn trái xanh tốt trên đất đỏ",
      focus: "60% 50%",
    },
    {
      id: "lopxe",
      label: VERTICALS.lopxe.short,
      hint: "Xe con, xe tải nhẹ",
      title: "Lốp chính hãng, thay và cân bằng ngay tại cửa hàng",
      href: VERTICALS.lopxe.base,
      cta: "Xem lốp xe ô tô",
      image: "/hero/lop-xe.jpg",
      alt: "Lốp xe ô tô mới xếp trên kệ",
      focus: "60% 50%",
    },
    {
      id: "satthep",
      label: VERTICALS.satthep.short,
      hint: "Thép, tôn cho công trình",
      title: "Đủ quy cách cho nhà ở, nhà kho, chuồng trại",
      href: VERTICALS.satthep.base,
      cta: "Xem tôn & sắt thép",
      image: "/hero/sat-thep.jpg",
      alt: "Thép ống và thép hộp xếp gọn trong kho",
      focus: "65% 50%",
    },
  ];

  const promises = [
    { icon: ShieldCheck, text: "Chính hãng, có hoá đơn" },
    { icon: ReceiptText, text: "Báo giá theo ngày" },
    { icon: Truck, text: "Giao tận vườn" },
  ];

  const mapsDir = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(COMPANY.mapQuery)}`;

  return (
    <>
      {/* ------------------------------------------------------------------ HERO */}
      <section id="top" aria-labelledby="hero-title" className={cn(WRAP, "pb-16 pt-6 md:pb-24 md:pt-10")}>
        <div className="grid items-center gap-10 lg:grid-cols-12 lg:gap-12">
          <div className="lg:col-span-5">
            <Eyebrow>
              {COMPANY.legalName} · từ năm {COMPANY.founded}
            </Eyebrow>
            <h1 id="hero-title" className="mt-5 text-[clamp(2.4rem,3.7vw,3.35rem)] font-semibold leading-[1.08] tracking-[-0.03em] text-hub-ink">
              <span className="block">Chăm từ gốc rễ,</span> <span className="block text-hub-blue">cho mùa trĩu quả.</span>
            </h1>
            <p className="mt-6 max-w-[34rem] text-lead leading-relaxed text-hub-ink-soft">
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

            <ul className="mt-9 flex flex-wrap gap-x-6 gap-y-3 text-small text-hub-ink-soft">
              {promises.map(({ icon: Icon, text }) => (
                <li key={text} className="flex items-center gap-2">
                  <Icon className="size-4 shrink-0 text-hub-blue" aria-hidden />
                  {text}
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-7">
            <HeroSlides slides={slides} />
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

      {/* ------------------------------------------------------------------ TIN TỨC */}
      {news.length > 0 && (
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

          <div className="grid gap-5 md:grid-cols-3">
            {news.map((item, i) => (
              <Reveal key={`${item.site}-${item.slug}`} delay={i * 80}>
                <article className="group relative flex h-full flex-col overflow-hidden rounded-[22px] bg-hub-paper">
                  <div className={cn("relative aspect-[16/10] overflow-hidden", item.site === "lopxe" ? "bg-lopxe-ink" : item.site === "satthep" ? "bg-satthep-soft" : "bg-hub-blue-tint")}>
                    {item.cover ? (
                      <Image src={item.cover} alt="" fill sizes="(min-width: 768px) 33vw, 100vw" className="object-cover transition-transform duration-700 ease-soft group-hover:scale-[1.04]" />
                    ) : (
                      item.art && <ProductArt kind={item.art} className="absolute inset-0 m-auto !size-[58%] transition-transform duration-500 ease-soft group-hover:scale-105" />
                    )}
                  </div>
                  <div className="flex flex-1 flex-col p-5 sm:p-6">
                    <p className="flex flex-wrap items-center gap-x-3 text-caption text-hub-ink-soft">
                      <span className="inline-flex items-center gap-1.5 font-medium text-hub-ink">
                        <span aria-hidden className={cn("size-2 rounded-full", DOT[item.site])} /> {VERTICALS[item.site].short}
                      </span>
                      <time dateTime={item.date}>{formatDate(item.date)}</time>
                    </p>
                    <h3 className="mt-2.5 text-title font-semibold leading-snug text-hub-ink">
                      <Link href={item.href} className="after:absolute after:inset-0 after:content-[''] group-hover:text-hub-blue">
                        {item.title}
                      </Link>
                    </h3>
                    <p className="mt-2 line-clamp-2 text-body leading-relaxed text-hub-ink-soft">{item.excerpt}</p>
                    <span className="mt-auto inline-flex items-center gap-1.5 pt-5 text-small font-semibold text-hub-ink transition-colors group-hover:text-hub-blue">
                      Đọc tiếp <ArrowRight className="size-4 transition-transform duration-200 group-hover:translate-x-0.5" aria-hidden />
                    </span>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
        </section>
      )}

      {/* ------------------------------------------------------------------ LIÊN HỆ */}
      <section id="lien-he" aria-labelledby="lien-he-title" className={cn(WRAP, "scroll-mt-24 pb-20 md:pb-28", news.length === 0 && "pt-20 md:pt-28")}>
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
