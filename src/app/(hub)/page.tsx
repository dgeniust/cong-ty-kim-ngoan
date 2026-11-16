import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ArrowUpRight, MapPin, MessageCircle, Phone, Share2 } from "lucide-react";
import { HeroSlideshow, type HubSlide } from "@/components/hub/hero-slideshow";
import { HubNewsCard } from "@/components/hub/hub-news-card";
import { ProductBrowser, type BrowserTab } from "@/components/hub/product-browser";
import { ProductArt } from "@/components/nganh/product-art";
import { Reveal } from "@/components/shared/reveal";
import { getBrands, getProducts } from "@/lib/data/catalog";
import { getNews } from "@/lib/data/news";
import { categories as pbCategories, getCategory as getPbCategory } from "@/lib/mock/categories";
import { products as pbProducts } from "@/lib/mock/products";
import { CATALOG_SITES, COMPANY, VERTICALS, VERTICAL_LIST, telHref } from "@/lib/verticals";
import { cn } from "@/lib/utils";

const SLIDES: HubSlide[] = [
  { id: "phanbon", tone: "green", label: VERTICALS.phanbon.name, title: "Vì mùa màng bội thu", description: VERTICALS.phanbon.description, href: "/phanbon", image: "/hero-img.jpg" },
  { id: "lopxe", tone: "dark", label: VERTICALS.lopxe.name, title: "Bám đường. Bền bỉ.", description: VERTICALS.lopxe.description, href: "/lopxe", art: "tyre-at" },
  { id: "satthep", tone: "steel", label: VERTICALS.satthep.name, title: "Vững từ lõi thép.", description: VERTICALS.satthep.description, href: "/satthep", art: "ibeam" },
];

const SECTOR_STYLE = {
  phanbon: { panel: "bg-brand-900 text-white", sub: "text-white/70", chip: "bg-sun-300 text-brand-950" },
  lopxe: { panel: "bg-[#0b0b0c] text-white", sub: "text-white/65", chip: "bg-sector-lopxe text-black" },
  satthep: { panel: "bg-[#dcdcd9] text-[#0f0f10]", sub: "text-black/60", chip: "bg-[#0f0f10] text-white" },
} as const;

function browserTabs(): BrowserTab[] {
  const pbGroups = pbCategories.filter((c) => c.parent && pbProducts.some((p) => p.categorySlug === c.slug));
  const phanbon: BrowserTab = {
    id: "phanbon", label: VERTICALS.phanbon.short, href: "/phanbon", dot: "bg-sector-phanbon",
    groupLabel: "Nhóm sản phẩm", groups: pbGroups.map((c) => c.name),
    items: pbProducts.map((p) => ({ name: p.name, href: `/phanbon/san-pham/${p.slug}`, group: getPbCategory(p.categorySlug)?.name ?? "", meta: p.packing.join(" / "), image: p.images[0] })),
  };
  const catalogs = CATALOG_SITES.map<BrowserTab>((site) => ({
    id: site, label: VERTICALS[site].short, href: VERTICALS[site].base, dot: site === "lopxe" ? "bg-sector-lopxe" : "bg-sector-satthep",
    groupLabel: "Thương hiệu", groups: getBrands(site),
    items: getProducts(site).map((p) => ({ name: p.name, href: `${VERTICALS[site].base}/san-pham/${p.slug}`, group: p.brand, meta: p.keySpec, image: p.images?.[0], art: p.art })),
  }));
  return [phanbon, ...catalogs];
}

function SectionTitle({ id, eyebrow, title, action }: { id: string; eyebrow: string; title: string; action?: React.ReactNode }) {
  return (
    <Reveal className="mb-10 flex flex-wrap items-end justify-between gap-5 md:mb-12">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-hub-gold">{eyebrow}</p>
        <h2 id={id} className="mt-2 text-4xl font-bold tracking-tight text-hub-ink md:text-5xl">{title}</h2>
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
      {/* 1. Hero: trái giới thiệu công ty – phải slideshow 5s/hình */}
      <section aria-labelledby="hero-title" className="mx-auto max-w-7xl px-4 pb-6 pt-4 sm:px-6 lg:px-8">
        <div className="grid gap-4 lg:grid-cols-[5fr_7fr]">
          <div className="relative flex min-h-[440px] flex-col justify-between overflow-hidden rounded-[2rem] bg-hub-ink p-7 text-white md:p-10 lg:min-h-[560px]">
            <Image src="/garden.jpg" alt="" fill priority sizes="(min-width: 1024px) 42vw, 100vw" className="object-cover opacity-30" />
            <div aria-hidden className="absolute inset-0 bg-gradient-to-b from-hub-ink/40 to-hub-ink" />
            <p className="animate-rise relative text-xs font-semibold uppercase tracking-[0.2em] text-white/70">{COMPANY.slogan}</p>
            <div className="relative">
              <h1 id="hero-title" className="animate-rise text-[clamp(2.5rem,5vw,4.25rem)] font-bold leading-[1.02] tracking-tight !text-white" style={{ animationDelay: "100ms" }}>
                Công ty TNHH
                <br />
                Kim Ngoan
              </h1>
              <p className="animate-rise mt-5 max-w-md text-[17px] leading-relaxed text-white/80" style={{ animationDelay: "200ms" }}>
                Một địa chỉ cho ba nhu cầu: <strong className="font-semibold text-white">phân bón</strong> cho vườn,{" "}
                <strong className="font-semibold text-white">lốp xe</strong> cho mọi hành trình và{" "}
                <strong className="font-semibold text-white">sắt thép</strong> cho công trình.
              </p>
              <ul className="animate-rise mt-7 flex flex-wrap gap-2" style={{ animationDelay: "300ms" }}>
                {VERTICAL_LIST.map((v) => (
                  <li key={v.id}>
                    <Link href={v.base} className="group inline-flex h-11 items-center gap-2 rounded-full bg-white px-5 text-sm font-semibold text-hub-ink transition-transform duration-300 ease-soft hover:scale-[1.04]">
                      {v.short} <ArrowUpRight className="size-4 transition-transform duration-300 group-hover:rotate-45" aria-hidden />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <HeroSlideshow slides={SLIDES} />
        </div>
      </section>

      {/* 2. Ba chuyên trang */}
      <section aria-labelledby="linh-vuc-title" className="mx-auto max-w-7xl px-4 py-16 sm:px-6 md:py-24 lg:px-8">
        <SectionTitle id="linh-vuc-title" eyebrow="Lĩnh vực hoạt động" title="Ba chuyên trang, một Kim Ngoan" />
        <ul className="grid gap-4 lg:grid-cols-3">
          {VERTICAL_LIST.map((v, i) => {
            const s = SECTOR_STYLE[v.id];
            return (
              <Reveal as="li" key={v.id} delay={i * 100}>
                <Link href={v.base} className={cn("group relative flex min-h-[420px] flex-col justify-end overflow-hidden rounded-[2rem] p-7 md:p-8", s.panel)}>
                  {v.id === "phanbon" ? (
                    <>
                      <Image src="/fertilize-img.jpg" alt="" fill sizes="(min-width: 1024px) 33vw, 100vw" className="object-cover opacity-55 transition-transform duration-[1200ms] ease-soft group-hover:scale-105" />
                      <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-brand-950 via-brand-950/50 to-transparent" />
                    </>
                  ) : (
                    <ProductArt kind={v.id === "lopxe" ? "tyre" : "rebar"} className="absolute -right-[14%] -top-[10%] !size-[88%] transition-transform duration-[1200ms] ease-soft group-hover:-rotate-12 group-hover:scale-105" />
                  )}
                  <span className={cn("relative self-start rounded-full px-3 py-1 text-xs font-semibold", s.chip)}>kimngoan.com{v.base}</span>
                  <h3 className="relative mt-4 text-3xl font-bold tracking-tight !text-current">{v.name}</h3>
                  <p className={cn("relative mt-2 text-[15px] leading-relaxed", s.sub)}>{v.description}</p>
                  <span className="relative mt-6 inline-flex items-center gap-2 text-[15px] font-semibold">
                    Vào chuyên trang <ArrowRight className="size-4 transition-transform duration-300 ease-soft group-hover:translate-x-2" aria-hidden />
                  </span>
                </Link>
              </Reveal>
            );
          })}
        </ul>
      </section>

      {/* 3. Sản phẩm: chọn ngành → hãng/nhóm → sản phẩm */}
      <section id="san-pham" aria-labelledby="san-pham-title" className="scroll-mt-24 bg-hub-sand py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionTitle id="san-pham-title" eyebrow="Sản phẩm" title="Chọn ngành hàng bạn cần" />
          <ProductBrowser tabs={browserTabs()} />
        </div>
      </section>

      {/* 4. Tin tức mới nhất của cả 3 chuyên trang */}
      {news.length > 0 && (
        <section id="tin-tuc" aria-labelledby="tin-tuc-title" className="mx-auto max-w-7xl scroll-mt-24 px-4 py-16 sm:px-6 md:py-24 lg:px-8">
          <SectionTitle
            id="tin-tuc-title"
            eyebrow="Tin tức"
            title="Mới nhất từ Kim Ngoan"
            action={
              <Link href="/tin-tuc" className="group inline-flex items-center gap-2 text-[15px] font-semibold text-hub-ink underline decoration-2 underline-offset-[6px]">
                Tất cả tin tức <ArrowRight className="size-4 transition-transform duration-300 ease-soft group-hover:translate-x-1.5" aria-hidden />
              </Link>
            }
          />
          <div className="grid gap-x-6 gap-y-10 md:grid-cols-2 lg:grid-cols-[1.3fr_1fr_1fr]">
            {news.map((n, i) => (
              <Reveal key={n.href} delay={i * 70} className={cn("flex", i === 0 && "md:col-span-2 lg:col-span-1 lg:row-span-2")}>
                <HubNewsCard item={n} large={i === 0} />
              </Reveal>
            ))}
          </div>
        </section>
      )}

      {/* 5. Về chúng tôi + Liên kết */}
      <section id="gioi-thieu" aria-labelledby="gioi-thieu-title" className="scroll-mt-24 bg-white py-16 md:py-24">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-[1fr_320px] lg:gap-16 lg:px-8">
          <div>
            <SectionTitle id="gioi-thieu-title" eyebrow="Về chúng tôi" title={COMPANY.legalName} />
            <Reveal>
              <p className="max-w-3xl text-lg leading-relaxed text-hub-ink-soft">
                Khởi đầu là đại lý vật tư nông nghiệp, Kim Ngoan mở rộng sang lốp xe ô tô và tôn – sắt thép để phục vụ trọn vẹn nhu cầu sản xuất, vận tải và xây dựng của bà con trong vùng.
              </p>
              <dl className="mt-10 grid gap-x-12 sm:grid-cols-2">
                {facts.map((f) => (
                  <div key={f.label} className="grid grid-cols-[7.5rem_1fr] gap-4 py-4 shadow-[inset_0_1px_0_var(--color-hub-sand)]">
                    <dt className="text-sm text-hub-ink-soft">{f.label}</dt>
                    <dd className="text-[15px] font-semibold text-hub-ink">{f.value}</dd>
                  </div>
                ))}
              </dl>
            </Reveal>
          </div>
          <Reveal delay={120} className="self-start rounded-[2rem] bg-hub-paper p-7 lg:sticky lg:top-32">
            <h3 className="text-xs font-semibold uppercase tracking-[0.16em] text-hub-gold">Liên kết</h3>
            <ul className="mt-4 space-y-2">
              {links.map((l) => (
                <li key={l.label}>
                  <a href={l.href} {...(l.external ? { target: "_blank", rel: "noopener noreferrer" } : {})} className="group flex items-center gap-4 rounded-2xl bg-white p-4 transition-transform duration-300 ease-soft hover:translate-x-1">
                    <span className="grid size-11 place-items-center rounded-full bg-hub-ink text-white"><l.icon className="size-5" aria-hidden /></span>
                    <span>
                      <span className="block text-xs text-hub-ink-soft">{l.label}</span>
                      <span className="block text-[15px] font-semibold tabular-nums text-hub-ink">{l.value}</span>
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </section>

      {/* 6. Liên hệ: mỗi ngành một số + địa chỉ + bản đồ */}
      <section id="lien-he" aria-labelledby="lien-he-title" className="mx-auto max-w-7xl scroll-mt-24 px-4 py-16 sm:px-6 md:py-24 lg:px-8">
        <SectionTitle id="lien-he-title" eyebrow="Liên hệ" title="Gọi đúng bộ phận, được tư vấn ngay" />
        <div className="grid gap-4 lg:grid-cols-2">
          <ul className="grid gap-3">
            {VERTICAL_LIST.map((v, i) => (
              <Reveal as="li" key={v.id} delay={i * 80}>
                <a href={telHref(v.phone)} className="group flex items-center justify-between gap-4 rounded-2xl bg-white p-5 transition-shadow duration-500 hover:shadow-[0_24px_48px_-28px_rgb(20_23_26/0.45)] md:p-6">
                  <span className="flex items-center gap-4">
                    <span aria-hidden className={cn("h-12 w-1.5 rounded-full", v.id === "phanbon" ? "bg-sector-phanbon" : v.id === "lopxe" ? "bg-sector-lopxe" : "bg-sector-satthep")} />
                    <span>
                      <span className="block text-sm text-hub-ink-soft">{v.contactLabel}</span>
                      <span className="mt-0.5 block text-2xl font-bold tabular-nums tracking-tight text-hub-ink md:text-3xl">{v.phone}</span>
                    </span>
                  </span>
                  <span className="grid size-12 shrink-0 place-items-center rounded-full bg-hub-ink text-white transition-transform duration-300 ease-soft group-hover:scale-110"><Phone className="size-5" aria-hidden /></span>
                </a>
              </Reveal>
            ))}
            <li className="flex items-start gap-3 px-2 pt-3 text-[15px] text-hub-ink-soft">
              <MapPin className="mt-0.5 size-5 shrink-0 text-hub-ink" aria-hidden />
              <address className="not-italic"><span className="font-semibold text-hub-ink">Địa chỉ:</span> {COMPANY.address}</address>
            </li>
          </ul>
          <Reveal delay={150} className="min-h-[340px] overflow-hidden rounded-[2rem] bg-hub-sand">
            <iframe
              title={`Bản đồ ${COMPANY.legalName}`}
              src={`https://www.google.com/maps?q=${encodeURIComponent(COMPANY.mapQuery)}&output=embed`}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="block size-full min-h-[340px] border-0"
            />
          </Reveal>
        </div>
      </section>
    </>
  );
}
