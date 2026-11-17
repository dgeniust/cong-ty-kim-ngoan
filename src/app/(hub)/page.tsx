import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ArrowUpRight, Check, Clock, Handshake, MapPin, MessageCircle, Phone, Share2, ShieldCheck, Truck, Users } from "lucide-react";
import { CountUp } from "@/components/hub/count-up";
import { HubHero, type HeroSlide } from "@/components/hub/hub-hero";
import { HubNewsCard } from "@/components/hub/hub-news-card";
import { ProductBrowser, type BrowserTab } from "@/components/hub/product-browser";
import { ProductArt } from "@/components/nganh/product-art";
import { JsonLd } from "@/components/shared/json-ld";
import { Reveal } from "@/components/shared/reveal";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { getBrands, getCategories, getFeatured, getProducts } from "@/lib/data/catalog";
import { getNews } from "@/lib/data/news";
import { categories as pbCategories, categoryGroups as pbGroups, getCategory as getPbCategory } from "@/lib/mock/categories";
import { products as pbProducts } from "@/lib/mock/products";
import { CATALOG_SITES, COMPANY, VERTICALS, VERTICAL_LIST, telHref, type VerticalId } from "@/lib/verticals";
import { cn } from "@/lib/utils";

/**
 * Landing tổng – nền trắng, bộ pastel tươi (mint · vàng · lam · trời) kiểu sổ cắt dán,
 * tiêu đề nét mảnh (300), nút viên thuốc, bóng đổ mềm nhiều lớp (--shadow-craft).
 * Màu ngành trên trang tổng: phân bón = mint, lốp xe = vàng, sắt thép = lam.
 * Thứ tự khối: Hero → số liệu → 3 chuyên trang → thương hiệu → lý do chọn → sản phẩm
 * → giới thiệu + quy trình → tin tức → hỏi đáp → liên hệ.
 * Các dải nền (trắng / kem / trời) chạy hết chiều ngang để trang không trống hai bên.
 */

const WRAP = "mx-auto w-full max-w-[1400px] px-4 sm:px-6 lg:px-10"; // khớp lề với header
const DISPLAY = "font-light leading-[1.1] tracking-[-0.02em] text-hub-ink";
const H2 = cn("mt-3 max-w-2xl text-[clamp(2rem,3.2vw,2.75rem)]", DISPLAY);
const DOT: Record<VerticalId, string> = { phanbon: "bg-sector-phanbon", lopxe: "bg-sector-lopxe", satthep: "bg-sector-satthep" };
const PILL = "inline-flex h-11 items-center gap-2 rounded-full px-5 text-sm font-medium";
const PILL_INK = `${PILL} group bg-hub-ink text-white`;
const PILL_OUTLINE = `${PILL} bg-hub-paper text-hub-ink shadow-[inset_0_0_0_1px_var(--color-hub-stone)] transition-colors duration-200 hover:bg-hub-stone`;
const WHISPER = "shadow-[var(--shadow-craft)]";
/** Nền nhạt theo ngành + chuỗi pastel xoay vòng cho các khối liệt kê. */
const SOFT: Record<VerticalId, string> = { phanbon: "bg-hub-mint-soft", lopxe: "bg-hub-marigold-soft", satthep: "bg-hub-peri-soft" };
const PASTELS = ["bg-hub-mint", "bg-hub-marigold", "bg-hub-peri", "bg-hub-sky"];
const PASTELS_SOFT = ["bg-hub-mint-soft", "bg-hub-marigold-soft", "bg-hub-peri-soft", "bg-hub-sky-soft"];

/** Thương hiệu phân bón lấy từ phác thảo của khách; lốp xe & sắt thép lấy từ dữ liệu sản phẩm. */
const PHANBON_BRANDS = ["Phú Mỹ", "Lâm Thao", "Mặt Trời Mới"];

const HEADLINE: Record<VerticalId, string> = {
  phanbon: "Phân bón cho vườn.",
  lopxe: "Lốp xe cho đường dài.",
  satthep: "Sắt thép cho công trình.",
};
const STAGE: Record<VerticalId, string> = { phanbon: "bg-brand-900", lopxe: "bg-gradient-to-br from-hub-marigold to-[#ffd7a8]", satthep: "bg-gradient-to-br from-hub-peri to-hub-sky-soft" };
const ART = { lopxe: "tyre-at", satthep: "ibeam" } as const;

type SectorCard = { id: VerticalId; groups: { name: string; href: string }[]; count: number; spot?: { name: string; meta: string; href: string } };

function sectorCards(): SectorCard[] {
  const pbTop = [...pbProducts].sort((a, b) => Number(!!b.featured) - Number(!!a.featured))[0];
  const phanbon: SectorCard = {
    id: "phanbon",
    count: pbProducts.length,
    groups: pbGroups.flatMap((g) => g.children.slice(0, 2)).map((c) => ({ name: c.name, href: `/phanbon/danh-muc/${c.slug}` })),
    spot: pbTop && { name: pbTop.name, meta: pbTop.packing.join(" / "), href: `/phanbon/san-pham/${pbTop.slug}` },
  };
  const catalogs = CATALOG_SITES.map<SectorCard>((site) => {
    const base = VERTICALS[site].base;
    const top = getFeatured(site, 1)[0];
    return {
      id: site,
      count: getProducts(site).length,
      groups: getCategories(site).slice(0, 4).map((c) => ({ name: c.name, href: `${base}/san-pham?nhom=${c.slug}` })),
      spot: top && { name: top.name, meta: top.keySpec, href: `${base}/san-pham/${top.slug}` },
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

function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <p className="flex items-center gap-2.5 text-sm text-hub-graphite">
      <span aria-hidden className="flex gap-1">
        <span className="size-2 rounded-full bg-hub-mint" />
        <span className="size-2 rounded-full bg-hub-marigold" />
        <span className="size-2 rounded-full bg-hub-peri" />
      </span>
      {children}
    </p>
  );
}

function SectionHead({ id, eyebrow, title, lead, action }: { id: string; eyebrow: string; title: string; lead?: string; action?: React.ReactNode }) {
  return (
    <Reveal className="mb-10 flex flex-wrap items-end justify-between gap-6 md:mb-14">
      <div>
        <Eyebrow>{eyebrow}</Eyebrow>
        <h2 id={id} className={H2}>{title}</h2>
        {lead && <p className="mt-4 max-w-xl text-base leading-relaxed text-hub-ink-soft">{lead}</p>}
      </div>
      {action}
    </Reveal>
  );
}

export default async function HubHome() {
  const news = await getNews({ limit: 5 }); // landing tổng: tất cả chuyên trang, không lọc
  const cards = sectorCards();
  const brands = [...PHANBON_BRANDS, ...CATALOG_SITES.flatMap((s) => getBrands(s))].filter((b, i, a) => a.indexOf(b) === i);
  const productCount = cards.reduce((n, c) => n + c.count, 0);
  const years = new Date().getFullYear() - Number(COMPANY.founded);

  const slides: HeroSlide[] = VERTICAL_LIST.map((v) => ({
    id: v.id,
    line: HEADLINE[v.id],
    label: v.name,
    tagline: v.tagline,
    href: v.base,
    url: `kimngoan.com${v.base}`,
    image: v.id === "phanbon" ? "/hero-img.jpg" : undefined,
    art: v.id === "phanbon" ? undefined : ART[v.id],
    spot: cards.find((c) => c.id === v.id)?.spot,
  }));

  const stats = [
    { value: VERTICAL_LIST.length, suffix: "", label: "Ngành hàng thiết yếu", note: "Phân bón · Lốp xe · Sắt thép" },
    { value: productCount, suffix: "+", label: "Sản phẩm trên website", note: "Cập nhật theo từng chuyên trang" },
    { value: brands.length, suffix: "", label: "Thương hiệu phân phối", note: "Hàng chính hãng, rõ nguồn gốc" },
    { value: years, suffix: "+", label: "Năm đồng hành", note: `Thành lập ${COMPANY.founded} tại ${COMPANY.address}` },
  ];

  const reasons = [
    { icon: ShieldCheck, title: "Hàng chính hãng", text: "Nguồn gốc rõ ràng, có tem bảo hành và chứng chỉ theo từng ngành hàng." },
    { icon: Handshake, title: "Giá minh bạch", text: "Báo giá rõ ràng theo ngày và theo số lượng, trước khi giao hàng." },
    { icon: Truck, title: "Giao tận nơi", text: "Tận vườn, tận xe, tận công trình trong khu vực Chơn Thành." },
    { icon: Users, title: "Tư vấn đúng nhu cầu", text: "Mỗi ngành một bộ phận chuyên trách và một số điện thoại riêng." },
  ];

  const steps = [
    { title: "Gọi hoặc nhắn Zalo", text: "Chọn đúng số của ngành hàng bạn cần, gửi nhu cầu hoặc quy cách." },
    { title: "Nhận tư vấn và báo giá", text: "Nhân viên tư vấn loại hàng phù hợp và báo giá theo ngày." },
    { title: "Giao hàng tận nơi", text: "Giao tận vườn, tận xe, tận công trình trong khu vực." },
    { title: "Đồng hành sau bán", text: "Hỗ trợ kỹ thuật và bảo hành theo chính sách của từng hãng." },
  ];

  const facts = [
    { label: "Thành lập", value: COMPANY.founded },
    { label: "Lĩnh vực", value: "Phân bón & thuốc BVTV, lốp xe ô tô, tôn – sắt thép" },
    { label: "Địa bàn", value: COMPANY.address },
    { label: "Khách hàng", value: "Nhà nông, chủ xe, đội xe vận tải, nhà thầu và chủ công trình" },
  ];

  const faqs = [
    {
      q: "Kim Ngoan kinh doanh những mặt hàng nào?",
      a: `Ba ngành hàng: ${VERTICAL_LIST.map((v) => v.name.toLowerCase()).join(", ")}. Mỗi ngành có một chuyên trang riêng với đầy đủ sản phẩm và tin tức.`,
    },
    {
      q: "Tôi nên gọi số nào để được báo giá?",
      a: `${VERTICAL_LIST.map((v) => `${v.short}: ${v.phone}`).join(". ")}. Nếu chưa rõ, gọi hotline ${COMPANY.hotline} để được chuyển đúng bộ phận.`,
    },
    {
      q: "Vì sao website không ghi giá sản phẩm?",
      a: "Giá phân bón, lốp xe và sắt thép thay đổi theo ngày và theo số lượng. Kim Ngoan báo giá trực tiếp qua điện thoại hoặc Zalo để bạn luôn nhận được giá mới nhất.",
    },
    {
      q: "Cửa hàng ở đâu và mở cửa giờ nào?",
      a: `Địa chỉ: ${COMPANY.address}. Mở cửa 07:00 – 18:00, tất cả các ngày trong tuần.`,
    },
  ];

  const socials = [
    { icon: MessageCircle, label: "Zalo", href: COMPANY.zalo },
    { icon: Share2, label: "Facebook", href: COMPANY.facebook },
  ];

  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: faqs.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
        }}
      />

      {/* 1. Hero – dải taupe hết chiều ngang */}
      <section id="top" aria-labelledby="hero-title" className="relative overflow-hidden bg-hub-paper">
        <div aria-hidden className="hub-dots absolute inset-0 [mask-image:linear-gradient(to_bottom,#000,transparent_85%)]" />
        <div aria-hidden className="absolute -left-40 -top-40 size-[520px] rounded-full bg-hub-sky-soft blur-3xl" />
        <div aria-hidden className="absolute -bottom-10 left-1/3 size-[380px] rounded-full bg-hub-marigold-soft blur-3xl" />
        <div className={cn(WRAP, "relative pb-16 pt-10 md:pb-24 md:pt-14")}>
          <HubHero
            slides={slides}
            eyebrow={
              <p className={cn("inline-flex items-center gap-2.5 rounded-full bg-hub-paper py-1.5 pl-3 pr-4 text-[13px] text-hub-graphite", WHISPER)}>
                <span className="relative flex size-2">
                  <span aria-hidden className="absolute inline-flex size-full animate-ping rounded-full bg-sector-phanbon opacity-60" />
                  <span aria-hidden className="relative inline-flex size-2 rounded-full bg-sector-phanbon" />
                </span>
                {COMPANY.legalName} · {COMPANY.address}
              </p>
            }
          >
            <p className="mt-7 max-w-lg text-lg leading-relaxed text-hub-ink-soft">
              Một địa chỉ, ba ngành hàng thiết yếu cho sản xuất, vận tải và xây dựng. Hàng chính hãng, giá minh bạch, giao tận nơi.
            </p>
            <div className="mt-7 flex flex-wrap gap-2.5">
              <Link href="#san-pham" className={PILL_INK}>
                Xem sản phẩm <ArrowRight className="size-4 transition-transform duration-300 ease-soft group-hover:translate-x-1" aria-hidden />
              </Link>
              <a href={telHref(COMPANY.hotline)} className={PILL_OUTLINE}>
                <Phone className="size-4" aria-hidden /> <span className="tabular-nums">{COMPANY.hotline}</span>
              </a>
            </div>
            <ul className="mt-9 flex flex-wrap gap-x-6 gap-y-2 text-sm text-hub-graphite">
              {["Hàng chính hãng", "Báo giá trong ngày", "Giao tận nơi"].map((t, i) => (
                <li key={t} className="flex items-center gap-2">
                  <span className={cn("grid size-5 place-items-center rounded-full text-hub-ink", PASTELS[i])}>
                    <Check className="size-3" strokeWidth={3} aria-hidden />
                  </span>
                  {t}
                </li>
              ))}
            </ul>
          </HubHero>
        </div>
      </section>

      {/* 2. Số liệu – ô pastel, đếm tăng khi cuộn tới */}
      <section aria-label="Kim Ngoan qua các con số" className={cn(WRAP, "relative pt-2")}>
        <dl className="grid grid-cols-2 gap-3 lg:grid-cols-4 lg:gap-4">
          {stats.map((s, i) => (
            <Reveal key={s.label} delay={i * 80} className={cn("rounded-3xl p-6 sm:p-8", PASTELS_SOFT[i])}>
              <dt className="sr-only">{s.label}</dt>
              <dd className={cn("text-[clamp(2.5rem,4.6vw,4rem)] leading-none", DISPLAY)}>
                <CountUp value={s.value} suffix={s.suffix} />
              </dd>
              <dd className="mt-4 flex items-center gap-2 text-[15px] font-medium text-hub-ink">
                <span aria-hidden className={cn("size-2 rounded-full", PASTELS[i], "brightness-90")} />
                {s.label}
              </dd>
              <dd className="mt-1 text-sm text-hub-ink-soft">{s.note}</dd>
            </Reveal>
          ))}
        </dl>
      </section>

      {/* 3. Ba chuyên trang */}
      <section id="linh-vuc" aria-labelledby="linh-vuc-title" className={cn(WRAP, "scroll-mt-24 py-20 md:py-28")}>
        <SectionHead id="linh-vuc-title" eyebrow="Lĩnh vực kinh doanh" title="Ba chuyên trang, một Kim Ngoan" lead="Mỗi ngành có website, đội ngũ và số điện thoại riêng để bạn được phục vụ đúng chuyên môn." />
        <ul className="grid gap-5 lg:grid-cols-3">
          {cards.map((c, i) => {
            const v = VERTICALS[c.id];
            return (
              <Reveal as="li" key={c.id} delay={i * 110} className="h-full">
                <article className={cn("group relative flex h-full flex-col overflow-hidden rounded-3xl shadow-[var(--shadow-craft)] transition-[transform,box-shadow] duration-500 ease-soft hover:-translate-y-1.5 hover:shadow-[var(--shadow-craft-hover)]", SOFT[c.id])}>
                  <div className={cn("relative aspect-[16/11] overflow-hidden", STAGE[c.id])}>
                    {c.id === "phanbon" ? (
                      <Image src="/fertilize-img.jpg" alt="" fill sizes="(min-width: 1024px) 33vw, 100vw" className="object-cover transition-transform duration-[1200ms] ease-soft group-hover:scale-105" />
                    ) : (
                      <>
                        <div aria-hidden className="hub-dots absolute inset-0 opacity-70" />
                        <ProductArt kind={ART[c.id]} className="absolute inset-0 m-auto !size-[70%] transition-transform duration-[1200ms] ease-soft group-hover:scale-110 group-hover:-rotate-6" />
                      </>
                    )}
                    <p className="absolute left-5 top-5 inline-flex items-center gap-2 rounded-full bg-white/85 px-3 py-1.5 text-[13px] text-hub-ink backdrop-blur-md">
                      <span aria-hidden className={cn("size-2 rounded-full", DOT[c.id])} /> kimngoan.com{v.base}
                    </p>
                    <span aria-hidden className="absolute bottom-5 right-5 grid size-11 place-items-center rounded-full bg-hub-ink text-white transition-transform duration-500 ease-soft group-hover:rotate-45">
                      <ArrowUpRight className="size-5" />
                    </span>
                  </div>
                  <div className="flex flex-1 flex-col p-7">
                    <p className="text-sm tabular-nums text-hub-ink-soft">0{i + 1} · {c.count} sản phẩm</p>
                    <h3 className={cn("mt-2 text-[1.75rem]", DISPLAY)}>
                      <Link href={v.base} className="after:absolute after:inset-0 after:content-['']">{v.name}</Link>
                    </h3>
                    <p className="mt-3 text-[15px] leading-relaxed text-hub-ink-soft">{v.description}</p>
                    <ul className="relative z-10 mb-7 mt-5 flex flex-wrap gap-1.5">
                      {c.groups.map((g) => (
                        <li key={g.href}>
                          <Link href={g.href} className="inline-flex h-8 items-center rounded-full bg-hub-paper px-3.5 text-[13px] text-hub-ink transition-colors duration-200 hover:bg-hub-marigold">
                            {g.name}
                          </Link>
                        </li>
                      ))}
                    </ul>
                    <div className="relative z-10 mt-auto flex items-center justify-between gap-4 border-t border-hub-ink/10 pt-5">
                      <a href={telHref(v.phone)} className="flex items-center gap-2 text-[15px] font-medium tabular-nums text-hub-ink hover:underline underline-offset-4">
                        <Phone className="size-4" aria-hidden /> {v.phone}
                      </a>
                      <span className="text-sm font-medium text-hub-ink">Vào chuyên trang</span>
                    </div>
                  </div>
                </article>
              </Reveal>
            );
          })}
        </ul>
      </section>

      {/* 4. Thương hiệu – dải chữ chạy chậm, dừng khi rê chuột */}
      <section aria-label="Thương hiệu phân phối" className="hub-sky py-7">
        <div className={cn(WRAP, "flex items-center gap-8")}>
          <p className="hidden shrink-0 rounded-full bg-white/80 px-4 py-2 text-sm text-hub-ink md:block">Thương hiệu phân phối</p>
          <div className="marquee-mask flex min-w-0 flex-1 overflow-hidden">
            <ul className="flex shrink-0 animate-marquee items-center gap-14 pr-14 hover:[animation-play-state:paused]">
              {[...brands, ...brands].map((b, i) => (
                <li key={i} aria-hidden={i >= brands.length || undefined} className="flex items-center gap-14 whitespace-nowrap text-2xl font-light tracking-[-0.02em] text-hub-ink">
                  {b}
                  <span aria-hidden className="size-2 rotate-45 rounded-[2px] bg-white" />
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* 5. Lý do chọn – dải kem */}
      <section aria-labelledby="ly-do-title" className="bg-hub-sand py-20 md:py-28">
        <div className={WRAP}>
          <SectionHead id="ly-do-title" eyebrow="Vì sao chọn Kim Ngoan" title="Mua một lần, yên tâm lâu dài" />
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {reasons.map((r, i) => (
              <Reveal as="li" key={r.title} delay={i * 90} className="h-full">
                <div className={cn("group h-full rounded-3xl bg-hub-paper p-7 transition-[transform,box-shadow] duration-500 ease-soft hover:-translate-y-1 hover:shadow-[var(--shadow-craft-hover)]", WHISPER)}>
                  <span className={cn("grid size-14 place-items-center rounded-2xl text-hub-ink transition-transform duration-500 ease-soft group-hover:-rotate-6 group-hover:scale-110", PASTELS[i])}>
                    <r.icon className="size-[22px]" strokeWidth={1.6} aria-hidden />
                  </span>
                  <h3 className="mt-8 text-xl font-medium tracking-tight text-hub-ink">{r.title}</h3>
                  <p className="mt-2 text-[15px] leading-relaxed text-hub-ink-soft">{r.text}</p>
                </div>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      {/* 6. Sản phẩm: chọn ngành → hãng/nhóm → sản phẩm */}
      <section id="san-pham" aria-labelledby="san-pham-title" className={cn(WRAP, "scroll-mt-24 py-20 md:py-28")}>
        <SectionHead id="san-pham-title" eyebrow="Sản phẩm" title="Chọn ngành hàng, xem ngay sản phẩm" lead="Lọc theo nhóm hàng hoặc thương hiệu, bấm Chi tiết để xem thông số và liên hệ báo giá." />
        <ProductBrowser tabs={browserTabs()} />
      </section>

      {/* 7. Giới thiệu + quy trình – dải taupe */}
      <section id="gioi-thieu" aria-labelledby="gioi-thieu-title" className="scroll-mt-24 bg-hub-sand py-20 md:py-28">
        <div className={WRAP}>
          <div className="grid items-center gap-10 lg:grid-cols-[1fr_1.15fr] lg:gap-20">
            <Reveal className="relative">
              <div aria-hidden className="hub-torn absolute -left-5 -top-5 h-1/3 w-1/2 -rotate-3 bg-hub-mint" />
              <div aria-hidden className="hub-torn hub-dots absolute -right-4 top-1/3 h-1/4 w-1/3 rotate-6 bg-hub-peri" />
              <div className="relative aspect-[4/5] overflow-hidden rounded-3xl shadow-[var(--shadow-craft)] sm:aspect-[5/4] lg:aspect-[4/5]">
                <Image src="/garden.jpg" alt="Vườn cây của bà con trong vùng" fill sizes="(min-width: 1024px) 42vw, 100vw" className="object-cover" />
              </div>
              <div className={cn("absolute -bottom-6 right-4 w-56 rotate-2 rounded-[20px] bg-hub-marigold p-5 sm:right-8", WHISPER)}>
                <p className={cn("text-5xl leading-none", DISPLAY)}>{COMPANY.founded}</p>
                <p className="mt-2 text-sm leading-snug text-hub-graphite">Năm thành lập tại {COMPANY.address}</p>
              </div>
            </Reveal>
            <Reveal delay={100}>
              <Eyebrow>Về chúng tôi</Eyebrow>
              <h2 id="gioi-thieu-title" className={cn("mt-3 text-[clamp(1.75rem,2.8vw,2.375rem)] leading-[1.18]", DISPLAY)}>
                Khởi đầu là đại lý vật tư nông nghiệp, Kim Ngoan mở rộng sang lốp xe ô tô và tôn – sắt thép để phục vụ trọn nhu cầu sản xuất, vận tải và xây dựng của bà con trong vùng.
              </h2>
              <dl className="mt-10">
                {facts.map((f) => (
                  <div key={f.label} className="grid grid-cols-[7.5rem_1fr] gap-4 border-t border-hub-ink/10 py-4">
                    <dt className="text-sm text-hub-ink-soft">{f.label}</dt>
                    <dd className="text-[15px] font-medium text-hub-ink">{f.value}</dd>
                  </div>
                ))}
              </dl>
            </Reveal>
          </div>

          <div className="mt-24 md:mt-28">
            <Reveal>
              <Eyebrow>Quy trình mua hàng</Eyebrow>
              <h3 className={cn("mt-3 text-[clamp(1.75rem,2.6vw,2.25rem)]", DISPLAY)}>Bốn bước, từ cuộc gọi đến khi nhận hàng</h3>
            </Reveal>
            <ol className="mt-10 grid gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
              {steps.map((s, i) => (
                <Reveal as="li" key={s.title} delay={i * 110} className="relative">
                  <div className="flex items-center gap-4">
                    <span className={cn("grid size-12 shrink-0 place-items-center rounded-2xl text-sm font-medium tabular-nums text-hub-ink shadow-[var(--shadow-craft)]", PASTELS[i])}>0{i + 1}</span>
                    <span aria-hidden className={cn("h-0 flex-1 border-t-2 border-dashed border-hub-ink/15", i === steps.length - 1 && "lg:hidden")} />
                  </div>
                  <h4 className="mt-6 text-lg font-medium tracking-tight text-hub-ink">{s.title}</h4>
                  <p className="mt-2 max-w-[28ch] text-[15px] leading-relaxed text-hub-ink-soft">{s.text}</p>
                </Reveal>
              ))}
            </ol>
          </div>
        </div>
      </section>

      {/* 8. Tin tức mới nhất của cả 3 chuyên trang */}
      {news.length > 0 && (
        <section id="tin-tuc" aria-labelledby="tin-tuc-title" className={cn(WRAP, "scroll-mt-24 py-20 md:py-28")}>
          <SectionHead
            id="tin-tuc-title"
            eyebrow="Tin tức"
            title="Mới nhất từ Kim Ngoan"
            action={
              <Link href="/tin-tuc" className={cn(PILL_OUTLINE, "group")}>
                Tất cả tin tức <ArrowRight className="size-4 transition-transform duration-300 ease-soft group-hover:translate-x-1" aria-hidden />
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

      {/* 9. Hỏi đáp */}
      <section aria-labelledby="hoi-dap-title" className="bg-hub-paper">
        <div className={cn(WRAP, "grid gap-10 py-20 md:py-28 lg:grid-cols-[1fr_1.4fr] lg:gap-20")}>
          <Reveal>
            <Eyebrow>Hỏi đáp</Eyebrow>
            <h2 id="hoi-dap-title" className={H2}>Những điều khách thường hỏi</h2>
            <p className="mt-4 max-w-sm text-base leading-relaxed text-hub-ink-soft">Chưa thấy câu trả lời bạn cần? Gọi hotline, chúng tôi trả lời ngay.</p>
            <a href={telHref(COMPANY.hotline)} className={cn(PILL_INK, "mt-6")}>
              <Phone className="size-4" aria-hidden /> <span className="tabular-nums">{COMPANY.hotline}</span>
            </a>
          </Reveal>
          <Reveal delay={100}>
            <Accordion type="single" collapsible defaultValue="faq-0" className="border-t border-hub-stone">
              {faqs.map((f, i) => (
                <AccordionItem key={f.q} value={`faq-${i}`}>
                  <AccordionTrigger>{f.q}</AccordionTrigger>
                  <AccordionContent>{f.a}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </Reveal>
        </div>
      </section>

      {/* 10. Liên hệ – dải xanh trời hết chiều ngang */}
      <section id="lien-he" aria-labelledby="lien-he-title" className="hub-sky relative scroll-mt-24 overflow-hidden py-20 md:py-28">
        <div aria-hidden className="hub-dots absolute inset-0 opacity-60" />
        <div aria-hidden className="hub-torn absolute -right-10 top-10 h-40 w-64 rotate-6 bg-hub-marigold/80" />
        <div className={cn(WRAP, "relative grid gap-12 lg:grid-cols-[1fr_1.1fr] lg:gap-16")}>
          <Reveal>
            <Eyebrow>Liên hệ</Eyebrow>
            <h2 id="lien-he-title" className={cn("mt-3 text-[clamp(2rem,3.4vw,3rem)]", DISPLAY)}>
              Gọi đúng bộ phận,
              <br />
              được tư vấn ngay.
            </h2>
            <ul className="mt-10 space-y-3">
              {VERTICAL_LIST.map((v) => (
                <li key={v.id}>
                  <a href={telHref(v.phone)} className={cn("group flex items-center justify-between gap-4 rounded-3xl bg-white/90 p-4 pl-5 transition-[transform,box-shadow] duration-300 ease-soft hover:-translate-y-0.5 hover:shadow-[var(--shadow-craft-hover)]", WHISPER)}>
                    <span className="flex min-w-0 items-center gap-3">
                      <span aria-hidden className={cn("h-10 w-1.5 shrink-0 rounded-full", DOT[v.id])} />
                      <span className="min-w-0">
                        <span className="block truncate text-sm text-hub-ink-soft">{v.contactLabel}</span>
                        <span className="block text-2xl font-light tabular-nums tracking-tight text-hub-ink">{v.phone}</span>
                      </span>
                    </span>
                    <span className={cn("grid size-11 shrink-0 place-items-center rounded-full text-hub-ink transition-transform duration-300 group-hover:rotate-12", SOFT[v.id])}>
                      <Phone className="size-4" aria-hidden />
                    </span>
                  </a>
                </li>
              ))}
            </ul>
            <ul className="mt-6 grid gap-3 text-[15px] text-hub-graphite sm:grid-cols-2">
              <li className="flex items-start gap-3">
                <MapPin className="mt-0.5 size-[18px] shrink-0 text-hub-ink" aria-hidden />
                <address className="not-italic">{COMPANY.address}</address>
              </li>
              <li className="flex items-start gap-3">
                <Clock className="mt-0.5 size-[18px] shrink-0 text-hub-ink" aria-hidden /> 07:00 – 18:00, tất cả các ngày
              </li>
            </ul>
            <div className="mt-8 flex flex-wrap gap-2.5">
              {socials.map((s) => (
                <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer" className={cn(PILL, "bg-white text-hub-ink transition-colors duration-300 hover:bg-hub-marigold")}>
                  <s.icon className="size-4" aria-hidden /> {s.label}
                </a>
              ))}
            </div>
          </Reveal>
          <Reveal delay={120} className={cn("min-h-[380px] overflow-hidden rounded-3xl bg-white p-2", WHISPER)}>
            <iframe
              title={`Bản đồ ${COMPANY.legalName}`}
              src={`https://www.google.com/maps?q=${encodeURIComponent(COMPANY.mapQuery)}&output=embed`}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="block size-full min-h-[364px] rounded-[18px] border-0 bg-hub-sky-soft"
            />
          </Reveal>
        </div>
      </section>
    </>
  );
}
