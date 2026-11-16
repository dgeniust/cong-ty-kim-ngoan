import Link from "next/link";
import { ArrowRight, MapPin, MessageCircle, Phone, Share2 } from "lucide-react";
import { HubNewsCard } from "@/components/hub/hub-news-card";
import { ProductBrowser, type BrowserTab } from "@/components/hub/product-browser";
import { SectorShowcase, type ShowcaseSector } from "@/components/hub/sector-showcase";
import { Reveal } from "@/components/shared/reveal";
import { getBrands, getCategories, getFeatured, getProducts } from "@/lib/data/catalog";
import { getNews } from "@/lib/data/news";
import { categories as pbCategories, categoryGroups as pbGroups, getCategory as getPbCategory } from "@/lib/mock/categories";
import { products as pbProducts } from "@/lib/mock/products";
import { CATALOG_SITES, COMPANY, VERTICALS, VERTICAL_LIST, telHref } from "@/lib/verticals";
import { cn } from "@/lib/utils";

/**
 * Landing tổng – giấy kem ấm, mực đen, tiêu đề nét mảnh (300), nút viên thuốc.
 * Mục tiêu: trong màn hình đầu tiên người xem biết Kim Ngoan là ai, bán 3 ngành gì,
 * và gọi số nào. Màu chỉ xuất hiện trong hình sản phẩm của từng ngành.
 */

const WRAP = "mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8"; // khớp lề với header
const DISPLAY = "font-light leading-[1.08] tracking-[-0.02em] text-hub-ink";
const DOT = { phanbon: "bg-sector-phanbon", lopxe: "bg-sector-lopxe", satthep: "bg-sector-satthep" } as const;
const PILL = "inline-flex h-11 items-center gap-2 rounded-full px-5 text-sm font-medium";
const PILL_OUTLINE = `${PILL} bg-hub-paper text-hub-ink shadow-[inset_0_0_0_1px_var(--color-hub-stone)] transition-colors duration-200 hover:bg-hub-stone`;

function showcaseSectors(): ShowcaseSector[] {
  const featuredPb = [...pbProducts].sort((a, b) => Number(!!b.featured) - Number(!!a.featured)).slice(0, 3);
  const phanbon: ShowcaseSector = {
    id: "phanbon",
    label: VERTICALS.phanbon.short,
    name: VERTICALS.phanbon.name,
    tagline: VERTICALS.phanbon.tagline,
    description: VERTICALS.phanbon.description,
    href: "/phanbon",
    url: "kimngoan.com/phanbon",
    phone: VERTICALS.phanbon.phone,
    image: "/hero-img.jpg",
    groups: pbGroups.flatMap((g) => g.children.slice(0, 3)).map((c) => ({ name: c.name, href: `/phanbon/danh-muc/${c.slug}` })),
    products: featuredPb.map((p) => ({ name: p.name, meta: p.packing[0] ?? "", href: `/phanbon/san-pham/${p.slug}` })),
  };
  const catalogs = CATALOG_SITES.map<ShowcaseSector>((site) => {
    const v = VERTICALS[site];
    return {
      id: site,
      label: v.short,
      name: v.name,
      tagline: v.tagline,
      description: v.description,
      href: v.base,
      url: `kimngoan.com${v.base}`,
      phone: v.phone,
      art: site === "lopxe" ? "tyre-at" : "ibeam",
      groups: getCategories(site).map((c) => ({ name: c.name, href: `${v.base}/san-pham?nhom=${c.slug}` })),
      products: getFeatured(site, 3).map((p) => ({ name: p.name, meta: p.keySpec, href: `${v.base}/san-pham/${p.slug}` })),
    };
  });
  return [phanbon, ...catalogs];
}

function browserTabs(): BrowserTab[] {
  const groups = pbCategories.filter((c) => c.parent && pbProducts.some((p) => p.categorySlug === c.slug));
  const phanbon: BrowserTab = {
    id: "phanbon", label: VERTICALS.phanbon.short, href: "/phanbon", dot: DOT.phanbon,
    groupLabel: "Nhóm sản phẩm", groups: groups.map((c) => c.name),
    items: pbProducts.map((p) => ({ name: p.name, href: `/phanbon/san-pham/${p.slug}`, group: getPbCategory(p.categorySlug)?.name ?? "", meta: p.packing.join(" / "), image: p.images[0] })),
  };
  const catalogs = CATALOG_SITES.map<BrowserTab>((site) => ({
    id: site, label: VERTICALS[site].short, href: VERTICALS[site].base, dot: DOT[site],
    groupLabel: "Thương hiệu", groups: getBrands(site),
    items: getProducts(site).map((p) => ({ name: p.name, href: `${VERTICALS[site].base}/san-pham/${p.slug}`, group: p.brand, meta: p.keySpec, image: p.images?.[0], art: p.art })),
  }));
  return [phanbon, ...catalogs];
}

function SectionHead({ id, eyebrow, title, action }: { id: string; eyebrow: string; title: string; action?: React.ReactNode }) {
  return (
    <Reveal className="mb-10 flex flex-wrap items-end justify-between gap-5 md:mb-12">
      <div>
        <p className="text-sm text-hub-ink-soft">{eyebrow}</p>
        <h2 id={id} className={cn("mt-2 max-w-2xl text-[clamp(2rem,3.2vw,2.5rem)]", DISPLAY)}>{title}</h2>
      </div>
      {action}
    </Reveal>
  );
}

export default async function HubHome() {
  const news = await getNews({ limit: 5 }); // landing tổng: tất cả chuyên trang, không lọc

  const facts = [
    { label: "Thành lập", value: COMPANY.founded },
    { label: "Lĩnh vực", value: "Phân bón & thuốc BVTV, lốp xe ô tô, tôn – sắt thép" },
    { label: "Địa bàn", value: COMPANY.address },
    { label: "Khách hàng", value: "Nhà nông, chủ xe, đội xe vận tải, nhà thầu và chủ công trình" },
    { label: "Phương châm", value: "Hàng chính hãng – giá minh bạch – phục vụ tận nơi" },
    { label: "Giờ làm việc", value: "07:00 – 18:00, tất cả các ngày" },
  ];
  const links = [
    { icon: MessageCircle, label: "Zalo", value: "Nhắn Zalo", href: COMPANY.zalo, external: true },
    { icon: Phone, label: "SĐT", value: COMPANY.hotline, href: telHref(COMPANY.hotline) },
    { icon: Share2, label: "Facebook", value: "Fanpage Kim Ngoan", href: COMPANY.facebook, external: true },
  ];

  return (
    <>
      {/* 1. Hero: tiêu đề nét mảnh bên trái – mô tả + nút bên phải */}
      <section aria-labelledby="hero-title" className={cn(WRAP, "pb-10 pt-12 md:pt-20")}>
        <div className="grid items-end gap-8 lg:grid-cols-[1.5fr_1fr] lg:gap-12">
          <div>
            <p className="animate-rise text-sm text-hub-ink-soft">
              {COMPANY.legalName} · {COMPANY.address}
            </p>
            <h1 id="hero-title" className={cn("animate-rise mt-4 text-[clamp(2.25rem,4.4vw,3.5rem)] leading-[1.08] xl:whitespace-nowrap", DISPLAY)} style={{ animationDelay: "80ms" }}>
              Phân bón cho vườn.
              <br />
              Lốp xe cho đường dài.
              <br />
              Sắt thép cho công trình.
            </h1>
          </div>
          <div className="animate-rise lg:pb-2" style={{ animationDelay: "160ms" }}>
            <p className="max-w-md text-lg leading-relaxed text-hub-ink-soft">
              Một địa chỉ, ba ngành hàng thiết yếu. Hàng chính hãng, giá minh bạch, giao tận vườn, tận xe, tận công trình.
            </p>
            <div className="mt-6 flex flex-wrap gap-2.5">
              <Link href="#san-pham" className={`${PILL} bg-hub-ink text-white`}>
                Xem sản phẩm
              </Link>
              <a href={telHref(COMPANY.hotline)} className={PILL_OUTLINE}>
                <Phone className="size-4" aria-hidden /> <span className="tabular-nums">{COMPANY.hotline}</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Ba chuyên trang: bảng tab lớn, tự chuyển 5 giây */}
      <section id="linh-vuc" aria-label="Ba lĩnh vực kinh doanh" className={cn(WRAP, "scroll-mt-28 pb-20 md:pb-28")}>
        <SectorShowcase sectors={showcaseSectors()} />

        {/* gọi đúng bộ phận – 3 dòng, kẻ mảnh */}
        <ul className="mt-10 grid border-t border-hub-stone sm:grid-cols-3">
          {VERTICAL_LIST.map((v, i) => (
            <li key={v.id} className={cn("border-b border-hub-stone sm:border-b-0", i > 0 && "sm:border-l sm:border-hub-stone")}>
              <a href={telHref(v.phone)} className="group flex items-center justify-between gap-4 py-5 sm:px-6 sm:first:pl-0">
                <span>
                  <span className="flex items-center gap-2 text-sm text-hub-ink-soft">
                    <span aria-hidden className={cn("size-2 rounded-full", DOT[v.id])} /> {v.contactLabel}
                  </span>
                  <span className="mt-1 block text-xl font-medium tabular-nums tracking-tight text-hub-ink group-hover:underline underline-offset-4">{v.phone}</span>
                </span>
                <Phone className="size-4 shrink-0 text-hub-ink-soft" aria-hidden />
              </a>
            </li>
          ))}
        </ul>
      </section>

      {/* 3. Sản phẩm: chọn ngành → hãng/nhóm → sản phẩm */}
      <section id="san-pham" aria-labelledby="san-pham-title" className={cn(WRAP, "scroll-mt-28 pb-20 md:pb-28")}>
        <SectionHead id="san-pham-title" eyebrow="Sản phẩm" title="Chọn ngành hàng, xem ngay sản phẩm" />
        <ProductBrowser tabs={browserTabs()} />
      </section>

      {/* 4. Về chúng tôi + Liên kết – dải nền taupe */}
      <section id="gioi-thieu" aria-labelledby="gioi-thieu-title" className="scroll-mt-28 bg-hub-sand py-20 md:py-28">
        <div className={cn(WRAP, "grid gap-12 lg:grid-cols-[1fr_320px] lg:gap-20")}>
          <Reveal>
            <p className="text-sm text-hub-ink-soft">Về chúng tôi</p>
            <h2 id="gioi-thieu-title" className={cn("mt-2 max-w-3xl text-[clamp(1.75rem,3vw,2.25rem)] leading-[1.17]", DISPLAY)}>
              Khởi đầu là đại lý vật tư nông nghiệp, Kim Ngoan mở rộng sang lốp xe ô tô và tôn – sắt thép để phục vụ trọn nhu cầu sản xuất, vận tải và xây dựng của bà con trong vùng.
            </h2>
            <dl className="mt-12 grid gap-x-12 sm:grid-cols-2">
              {facts.map((f) => (
                <div key={f.label} className="grid grid-cols-[7.5rem_1fr] gap-4 border-t border-hub-stone py-4">
                  <dt className="text-sm text-hub-ink-soft">{f.label}</dt>
                  <dd className="text-[15px] font-medium text-hub-ink">{f.value}</dd>
                </div>
              ))}
            </dl>
          </Reveal>
          <Reveal delay={100} className="self-start rounded-[20px] bg-hub-paper p-6 shadow-[0_0_1px_rgb(0_0_0/0.4),0_1px_1px_rgb(0_0_0/0.04),0_2px_4px_rgb(0_0_0/0.04)]">
            <h3 className="text-sm text-hub-ink-soft">Liên kết</h3>
            <ul className="mt-2">
              {links.map((l, i) => (
                <li key={l.label} className={cn(i > 0 && "border-t border-hub-stone")}>
                  <a href={l.href} {...(l.external ? { target: "_blank", rel: "noopener noreferrer" } : {})} className="group flex items-center gap-4 py-4">
                    <span className="grid size-10 place-items-center rounded-full bg-hub-stone text-hub-ink">
                      <l.icon className="size-[18px]" aria-hidden />
                    </span>
                    <span>
                      <span className="block text-[13px] text-hub-ink-soft">{l.label}</span>
                      <span className="block text-[15px] font-medium tabular-nums text-hub-ink group-hover:underline underline-offset-4">{l.value}</span>
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </section>

      {/* 5. Tin tức mới nhất của cả 3 chuyên trang */}
      {news.length > 0 && (
        <section id="tin-tuc" aria-labelledby="tin-tuc-title" className={cn(WRAP, "scroll-mt-28 py-20 md:py-28")}>
          <SectionHead
            id="tin-tuc-title"
            eyebrow="Tin tức"
            title="Mới nhất từ Kim Ngoan"
            action={
              <Link href="/tin-tuc" className={PILL_OUTLINE}>
                Tất cả tin tức <ArrowRight className="size-4" aria-hidden />
              </Link>
            }
          />
          <div className="grid gap-x-6 gap-y-10 md:grid-cols-2 lg:grid-cols-[1.3fr_1fr_1fr]">
            {news.map((n, i) => (
              <Reveal key={n.href} delay={i * 60} className={cn("flex", i === 0 && "md:col-span-2 lg:col-span-1 lg:row-span-2")}>
                <HubNewsCard item={n} large={i === 0} />
              </Reveal>
            ))}
          </div>
        </section>
      )}

      {/* 6. Liên hệ: địa chỉ + bản đồ */}
      <section id="lien-he" aria-labelledby="lien-he-title" className={cn(WRAP, "scroll-mt-28 pb-20 md:pb-28")}>
        <div className="grid overflow-hidden rounded-3xl bg-hub-sand lg:grid-cols-[1fr_1.2fr]">
          <div className="p-7 sm:p-10 lg:p-12">
            <p className="text-sm text-hub-ink-soft">Liên hệ</p>
            <h2 id="lien-he-title" className={cn("mt-2 text-[clamp(2rem,3.2vw,2.5rem)]", DISPLAY)}>
              Gọi đúng bộ phận, được tư vấn ngay
            </h2>
            <ul className="mt-8">
              {VERTICAL_LIST.map((v) => (
                <li key={v.id} className="border-t border-hub-stone">
                  <a href={telHref(v.phone)} className="group flex items-center justify-between gap-4 py-4">
                    <span className="flex items-center gap-2.5 text-[15px] text-hub-ink-soft">
                      <span aria-hidden className={cn("size-2 rounded-full", DOT[v.id])} /> {v.contactLabel}
                    </span>
                    <span className="text-lg font-medium tabular-nums text-hub-ink group-hover:underline underline-offset-4">{v.phone}</span>
                  </a>
                </li>
              ))}
              <li className="flex items-start gap-3 border-t border-hub-stone pt-5 text-[15px] text-hub-ink-soft">
                <MapPin className="mt-0.5 size-[18px] shrink-0 text-hub-ink" aria-hidden />
                <address className="not-italic">
                  <span className="font-medium text-hub-ink">Địa chỉ:</span> {COMPANY.address}
                </address>
              </li>
            </ul>
          </div>
          <iframe
            title={`Bản đồ ${COMPANY.legalName}`}
            src={`https://www.google.com/maps?q=${encodeURIComponent(COMPANY.mapQuery)}&output=embed`}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            className="block size-full min-h-[340px] border-0 bg-hub-stone"
          />
        </div>
      </section>
    </>
  );
}
