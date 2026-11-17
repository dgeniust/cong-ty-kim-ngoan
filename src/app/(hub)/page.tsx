import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ArrowUpRight, Clock, Handshake, MapPin, MessageCircle, Phone, Share2, ShieldCheck, Truck, Users } from "lucide-react";
import { CountUp } from "@/components/hub/count-up";
import { HubHero, type HeroSector } from "@/components/hub/hub-hero";
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
 * Landing tổng – phong cách Notion ("sổ giấy dưới nắng chiều"):
 *  - nền giấy ấm #f6f5f4, thẻ trắng viền mảnh 1px, bo 12px, KHÔNG đổ bóng thẻ, KHÔNG gradient;
 *  - một màu xanh #0075de duy nhất cho hành động chính, hành động phụ dùng nền xanh nhạt;
 *  - màu sắc nằm ở các mảng phẳng (vàng, xanh trời, đào, xanh đêm) như giấy note;
 *  - chuyển động 200ms, riêng các dấu trang trí được nhún/bật cho sinh động.
 * Màu ngành giữ khớp chuyên trang: phân bón = xanh lá, lốp xe = đen + cam, sắt thép = trắng + xám + chữ đen.
 */

const WRAP = "mx-auto w-full max-w-[1440px] px-4 sm:px-6 lg:px-10"; // khớp lề với header
const H2 = "mt-3 max-w-3xl text-[clamp(2rem,4vw,3.25rem)] font-semibold leading-[1.08] tracking-[-0.035em] text-hub-ink";
const CARD = "rounded-xl border border-hub-line bg-hub-paper";
const BTN = "inline-flex h-11 items-center gap-2 rounded-lg px-5 text-[15px] font-medium transition-colors duration-200";
const BTN_PRIMARY = `${BTN} group bg-hub-blue text-white hover:bg-hub-blue-hover`;
const BTN_GHOST = `${BTN} bg-hub-blue-tint text-hub-blue hover:bg-[#d4eafd]`;
const BTN_TEXT = `${BTN} text-hub-ink/90 hover:bg-hub-ink/5`;
const DOT: Record<VerticalId, string> = { phanbon: "bg-sector-phanbon", lopxe: "bg-sector-lopxe", satthep: "bg-sector-satthep" };
const STAGE: Record<VerticalId, string> = { phanbon: "bg-brand-900", lopxe: "bg-lopxe-ink", satthep: "bg-satthep-soft" };
const ART = { lopxe: "tyre-at", satthep: "ibeam" } as const;
const AUDIENCE: Record<VerticalId, string> = { phanbon: "nhà nông", lopxe: "chủ xe", satthep: "nhà thầu" };

/** Thương hiệu phân bón lấy từ phác thảo của khách; lốp xe & sắt thép lấy từ dữ liệu sản phẩm. */
const PHANBON_BRANDS = ["Phú Mỹ", "Lâm Thao", "Mặt Trời Mới"];

type SectorData = {
  id: VerticalId;
  count: number;
  groups: { name: string; href: string }[];
  products: { name: string; meta: string; href: string }[];
};

function sectorData(): SectorData[] {
  const pbTop = [...pbProducts].sort((a, b) => Number(!!b.featured) - Number(!!a.featured)).slice(0, 3);
  const phanbon: SectorData = {
    id: "phanbon",
    count: pbProducts.length,
    groups: pbGroups.flatMap((g) => g.children.slice(0, 2)).map((c) => ({ name: c.name, href: `/phanbon/danh-muc/${c.slug}` })),
    products: pbTop.map((p) => ({ name: p.name, meta: p.packing.join(" / "), href: `/phanbon/san-pham/${p.slug}` })),
  };
  const catalogs = CATALOG_SITES.map<SectorData>((site) => {
    const base = VERTICALS[site].base;
    return {
      id: site,
      count: getProducts(site).length,
      groups: getCategories(site).slice(0, 4).map((c) => ({ name: c.name, href: `${base}/san-pham?nhom=${c.slug}` })),
      products: getFeatured(site, 3).map((p) => ({ name: p.name, meta: p.keySpec, href: `${base}/san-pham/${p.slug}` })),
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

/** Nhãn đầu khối: viên màu nhỏ (kiểu tag Notion). */
function Tag({ children, tone = "bg-hub-marigold-soft" }: { children: React.ReactNode; tone?: string }) {
  return <p className={cn("inline-flex items-center rounded-full px-3 py-1 text-[13px] font-medium text-hub-ink", tone)}>{children}</p>;
}

function SectionHead({ id, tag, tone, title, lead, action, center }: { id: string; tag: string; tone?: string; title: React.ReactNode; lead?: string; action?: React.ReactNode; center?: boolean }) {
  return (
    <Reveal className={cn("mb-10 flex flex-wrap items-end gap-6 md:mb-14", center ? "flex-col items-center text-center" : "justify-between")}>
      <div className={cn(center && "flex flex-col items-center")}>
        <Tag tone={tone}>{tag}</Tag>
        <h2 id={id} className={H2}>{title}</h2>
        {lead && <p className="mt-4 max-w-xl text-[17px] leading-relaxed text-hub-ink-soft">{lead}</p>}
      </div>
      {action}
    </Reveal>
  );
}

/** Từ được bọc trong viên màu – dấu hiệu chữ ký của phong cách Notion. */
function Pill({ children, tone }: { children: React.ReactNode; tone: string }) {
  return <span className={cn("inline-block rounded-full px-[0.35em] leading-[1.15]", tone)}>{children}</span>;
}

export default async function HubHome() {
  const news = await getNews({ limit: 5 }); // landing tổng: tất cả chuyên trang, không lọc
  const data = sectorData();
  const brands = [...PHANBON_BRANDS, ...CATALOG_SITES.flatMap((s) => getBrands(s))].filter((b, i, a) => a.indexOf(b) === i);
  const productCount = data.reduce((n, c) => n + c.count, 0);
  const years = new Date().getFullYear() - Number(COMPANY.founded);

  const heroSectors: HeroSector[] = VERTICAL_LIST.map((v) => {
    const d = data.find((x) => x.id === v.id)!;
    return {
      id: v.id,
      audience: AUDIENCE[v.id],
      short: v.short,
      name: v.name,
      tagline: v.tagline,
      description: v.description,
      href: v.base,
      url: `kimngoan.com${v.base}`,
      phone: v.phone,
      image: v.id === "phanbon" ? "/hero-img.jpg" : undefined,
      art: v.id === "phanbon" ? undefined : ART[v.id],
      groups: d.groups,
      products: d.products,
    };
  });

  const stats = [
    { value: VERTICAL_LIST.length, suffix: "", label: "Ngành hàng thiết yếu", tone: "bg-hub-mint-soft" },
    { value: productCount, suffix: "+", label: "Sản phẩm trên website", tone: "bg-hub-marigold-soft" },
    { value: brands.length, suffix: "", label: "Thương hiệu phân phối", tone: "bg-hub-sky-soft" },
    { value: years, suffix: "+", label: `Năm đồng hành, từ ${COMPANY.founded}`, tone: "bg-hub-coral-soft" },
  ];

  /** Bento 2 hàng: ô rộng – ô hẹp / ô hẹp – ô rộng; mỗi ô một mảng màu phẳng. */
  const reasons = [
    { icon: ShieldCheck, title: "Hàng chính hãng", text: "Nguồn gốc rõ ràng, có tem bảo hành và chứng chỉ theo từng ngành hàng. Không bán hàng trôi nổi, không bán hàng tồn kho lâu năm.", tone: "bg-hub-marigold text-hub-ink", span: "lg:col-span-2", art: "rebar" as const },
    { icon: Handshake, title: "Giá minh bạch", text: "Báo giá rõ ràng theo ngày và theo số lượng, trước khi giao hàng.", tone: "bg-hub-sky text-hub-ink" },
    { icon: Truck, title: "Giao tận nơi", text: "Tận vườn, tận xe, tận công trình trong khu vực Chơn Thành.", tone: "bg-hub-peach text-hub-ink" },
    { icon: Users, title: "Tư vấn đúng nhu cầu", text: "Mỗi ngành một bộ phận chuyên trách và một số điện thoại riêng — gọi đúng người, được trả lời đúng chuyên môn.", tone: "bg-hub-midnight text-white", span: "lg:col-span-2", art: "tyre" as const },
  ];

  const steps = [
    { title: "Gọi hoặc nhắn Zalo", text: "Chọn đúng số của ngành hàng bạn cần, gửi nhu cầu hoặc quy cách.", ring: "border-hub-signal" },
    { title: "Nhận tư vấn và báo giá", text: "Nhân viên tư vấn loại hàng phù hợp và báo giá theo ngày.", ring: "border-hub-coral" },
    { title: "Giao hàng tận nơi", text: "Giao tận vườn, tận xe, tận công trình trong khu vực.", ring: "border-hub-marigold" },
    { title: "Đồng hành sau bán", text: "Hỗ trợ kỹ thuật và bảo hành theo chính sách của từng hãng.", ring: "border-sector-phanbon" },
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

      {/* 1. Hero – căn giữa: dấu tròn → tiêu đề có viên màu → 2 nút → cửa sổ xem trước chuyên trang */}
      <section id="top" aria-labelledby="hero-title" className={cn(WRAP, "pb-16 pt-12 md:pb-24 md:pt-16")}>
        <HubHero
          sectors={heroSectors}
          lead={
            <p className="text-[clamp(1.05rem,1.6vw,1.25rem)] leading-relaxed text-hub-ink-soft">
              {COMPANY.legalName} kinh doanh <strong className="font-medium text-hub-ink">phân bón & thuốc BVTV</strong>, <strong className="font-medium text-hub-ink">lốp xe ô tô</strong> và{" "}
              <strong className="font-medium text-hub-ink">tôn – sắt thép</strong> tại {COMPANY.address}. Hàng chính hãng, giá minh bạch, giao tận nơi.
            </p>
          }
          actions={
            <>
              <Link href="#san-pham" className={BTN_PRIMARY}>
                Xem sản phẩm <ArrowRight className="size-4 transition-transform duration-200 group-hover:translate-x-0.5" aria-hidden />
              </Link>
              <a href={telHref(COMPANY.hotline)} className={BTN_GHOST}>
                <Phone className="size-4" aria-hidden /> <span className="tabular-nums">{COMPANY.hotline}</span>
              </a>
            </>
          }
        />
      </section>

      {/* 2. Số liệu */}
      <section aria-label="Kim Ngoan qua các con số" className={WRAP}>
        <dl className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          {stats.map((s, i) => (
            <Reveal key={s.label} delay={i * 70} className={cn(CARD, "p-6 sm:p-7")}>
              <dt className="sr-only">{s.label}</dt>
              <dd className="text-[clamp(2.5rem,4.4vw,3.75rem)] font-semibold leading-none tracking-[-0.04em] text-hub-ink">
                <CountUp value={s.value} suffix={s.suffix} />
              </dd>
              <dd className="mt-4">
                <span className={cn("inline-block rounded-full px-2.5 py-1 text-[13px] font-medium text-hub-ink", s.tone)}>{s.label}</span>
              </dd>
            </Reveal>
          ))}
        </dl>
      </section>

      {/* 3. Ba chuyên trang */}
      <section id="linh-vuc" aria-labelledby="linh-vuc-title" className={cn(WRAP, "scroll-mt-24 py-20 md:py-28")}>
        <SectionHead
          id="linh-vuc-title"
          tag="Lĩnh vực kinh doanh"
          tone="bg-hub-mint-soft"
          title={
            <>
              Ba chuyên trang, <Pill tone="bg-hub-peach">một</Pill> Kim Ngoan
            </>
          }
          lead="Mỗi ngành có website, đội ngũ và số điện thoại riêng để bạn được phục vụ đúng chuyên môn."
        />
        <ul className="grid gap-4 lg:grid-cols-3">
          {data.map((c, i) => {
            const v = VERTICALS[c.id];
            return (
              <Reveal as="li" key={c.id} delay={i * 90} className="h-full">
                <article className={cn(CARD, "group relative flex h-full flex-col overflow-hidden transition-colors duration-200 hover:border-hub-ink/20")}>
                  <div className={cn("relative m-2 mb-0 aspect-[16/10] overflow-hidden rounded-lg", STAGE[c.id])}>
                    {c.id === "phanbon" ? (
                      <Image src="/fertilize-img.jpg" alt="" fill sizes="(min-width: 1024px) 33vw, 100vw" className="object-cover transition-transform duration-500 ease-soft group-hover:scale-[1.03]" />
                    ) : (
                      <>
                        {c.id === "satthep" && (
                          <>
                            <div aria-hidden className="hub-dots absolute inset-0 opacity-60" />
                            <div aria-hidden className="absolute right-[14%] top-[14%] h-[42%] w-[40%] rotate-6 rounded-xl bg-satthep-ink" />
                          </>
                        )}
                        {c.id === "lopxe" && <div aria-hidden className="absolute left-[18%] top-[10%] size-[64%] rounded-full bg-lopxe-orange" />}
                        <ProductArt kind={ART[c.id]} className="absolute inset-0 m-auto !size-[70%] transition-transform duration-500 ease-soft group-hover:-rotate-6 group-hover:scale-105" />
                      </>
                    )}
                    <p className="absolute left-3 top-3 inline-flex items-center gap-2 rounded-md bg-hub-paper px-2.5 py-1 text-[12px] text-hub-ink">
                      <span aria-hidden className={cn("size-2 rounded-full", DOT[c.id])} /> kimngoan.com{v.base}
                    </p>
                  </div>
                  <div className="flex flex-1 flex-col p-6">
                    <p className="text-[13px] tabular-nums text-hub-ink/50">0{i + 1} · {c.count} sản phẩm</p>
                    <h3 className="mt-1.5 text-[22px] font-semibold tracking-[-0.02em] text-hub-ink">
                      <Link href={v.base} className="after:absolute after:inset-0 after:content-['']">{v.name}</Link>
                    </h3>
                    <p className="mt-2 text-[15px] leading-relaxed text-hub-ink-soft">{v.description}</p>
                    <ul className="relative z-10 mb-6 mt-5 flex flex-wrap gap-1.5">
                      {c.groups.map((g) => (
                        <li key={g.href}>
                          <Link href={g.href} className="inline-flex h-7 items-center rounded-md bg-hub-canvas px-2.5 text-[13px] text-hub-ink/80 transition-colors duration-200 hover:bg-hub-stone hover:text-hub-ink">
                            {g.name}
                          </Link>
                        </li>
                      ))}
                    </ul>
                    <div className="relative z-10 mt-auto flex items-center justify-between gap-4 border-t border-hub-line pt-4">
                      <a href={telHref(v.phone)} className="flex items-center gap-2 text-[15px] font-medium tabular-nums text-hub-ink hover:text-hub-blue">
                        <Phone className="size-4" aria-hidden /> {v.phone}
                      </a>
                      <span className="inline-flex items-center gap-1 text-sm font-medium text-hub-blue">
                        Vào chuyên trang <ArrowUpRight className="size-4 transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden />
                      </span>
                    </div>
                  </div>
                </article>
              </Reveal>
            );
          })}
        </ul>
      </section>

      {/* 4. Thương hiệu – "tường logo" chữ xám, nền trắng hết chiều ngang */}
      <section aria-labelledby="thuong-hieu-title" className="border-y border-hub-line bg-hub-paper py-12">
        <div className={WRAP}>
          <p id="thuong-hieu-title" className="text-center text-sm text-hub-ink/55">Phân phối chính hãng các thương hiệu</p>
          <ul className="mt-7 flex flex-wrap items-center justify-center gap-x-12 gap-y-5">
            {brands.map((b, i) => (
              <Reveal as="li" key={b} delay={i * 40} className="text-[22px] font-semibold tracking-[-0.03em] text-hub-ink/45 transition-colors duration-200 hover:text-hub-ink">
                {b}
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      {/* 5. Lý do chọn – bento mảng màu phẳng */}
      <section aria-labelledby="ly-do-title" className={cn(WRAP, "py-20 md:py-28")}>
        <SectionHead
          id="ly-do-title"
          tag="Vì sao chọn Kim Ngoan"
          tone="bg-hub-sky-soft"
          center
          title={
            <>
              Mua một lần, <Pill tone="bg-hub-marigold">yên tâm</Pill> lâu dài
            </>
          }
        />
        <ul className="grid gap-4 lg:grid-cols-3">
          {reasons.map((r, i) => (
            <Reveal as="li" key={r.title} delay={i * 80} className={cn("h-full", r.span)}>
              <div className={cn("group relative flex h-full min-h-[240px] flex-col overflow-hidden rounded-xl p-7 sm:p-8", r.tone)}>
                <r.icon className="size-8 transition-transform duration-300 [transition-timing-function:cubic-bezier(0.34,1.56,0.64,1)] group-hover:-rotate-12 group-hover:scale-110" strokeWidth={1.75} aria-hidden />
                <h3 className="mt-auto pt-10 text-[clamp(1.4rem,2vw,1.75rem)] font-semibold tracking-[-0.025em] !text-current">{r.title}</h3>
                <p className={cn("mt-2 max-w-md text-[15px] leading-relaxed", r.tone.includes("text-white") ? "text-white/75" : "text-hub-ink/75")}>{r.text}</p>
                {r.art && <ProductArt kind={r.art} className="absolute -bottom-8 -right-6 hidden !size-48 opacity-90 transition-transform duration-500 ease-soft group-hover:-rotate-12 sm:block" />}
              </div>
            </Reveal>
          ))}
        </ul>
      </section>

      {/* 6. Sản phẩm: chọn ngành → hãng/nhóm → sản phẩm */}
      <section id="san-pham" aria-labelledby="san-pham-title" className="scroll-mt-24 border-y border-hub-line bg-hub-paper py-20 md:py-28">
        <div className={WRAP}>
          <SectionHead
            id="san-pham-title"
            tag="Sản phẩm"
            tone="bg-hub-marigold-soft"
            title={
              <>
                Chọn ngành hàng, <Pill tone="bg-hub-sky-soft">xem ngay</Pill> sản phẩm
              </>
            }
            lead="Lọc theo nhóm hàng hoặc thương hiệu, bấm vào sản phẩm để xem thông số và liên hệ báo giá."
          />
          <ProductBrowser tabs={browserTabs()} />
        </div>
      </section>

      {/* 7. Giới thiệu (chữ trái – mảng màu chứa ảnh phải) + quy trình */}
      <section id="gioi-thieu" aria-labelledby="gioi-thieu-title" className={cn(WRAP, "scroll-mt-24 py-20 md:py-28")}>
        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
          <Reveal>
            <Tag tone="bg-hub-coral-soft">Về chúng tôi</Tag>
            <h2 id="gioi-thieu-title" className={H2}>
              Từ đại lý vật tư nông nghiệp đến <Pill tone="bg-hub-peach">ba ngành hàng</Pill>
            </h2>
            <p className="mt-6 max-w-xl text-[17px] leading-relaxed text-hub-ink-soft">
              Khởi đầu là đại lý vật tư nông nghiệp, Kim Ngoan mở rộng sang lốp xe ô tô và tôn – sắt thép để phục vụ trọn nhu cầu sản xuất, vận tải và xây dựng của bà con trong vùng.
            </p>
            <dl className={cn(CARD, "mt-8 divide-y divide-hub-line")}>
              {facts.map((f) => (
                <div key={f.label} className="grid grid-cols-[7.5rem_1fr] gap-4 px-5 py-3.5">
                  <dt className="text-sm text-hub-ink/55">{f.label}</dt>
                  <dd className="text-[15px] font-medium text-hub-ink">{f.value}</dd>
                </div>
              ))}
            </dl>
          </Reveal>
          <Reveal delay={100} className="relative rounded-xl bg-hub-marigold p-6 sm:p-10">
            <div className="relative aspect-[4/3] overflow-hidden rounded-lg shadow-[var(--shadow-hub-ui)]">
              <Image src="/garden.jpg" alt="Vườn cây của bà con trong vùng" fill sizes="(min-width: 1024px) 45vw, 100vw" className="object-cover" />
            </div>
            <div className="absolute -bottom-5 left-6 rounded-lg border border-hub-line bg-hub-paper px-5 py-4 shadow-[var(--shadow-hub-ui)] sm:left-10">
              <p className="text-4xl font-semibold leading-none tracking-[-0.04em] text-hub-ink">{COMPANY.founded}</p>
              <p className="mt-1.5 text-[13px] text-hub-ink-soft">Năm thành lập · {COMPANY.address}</p>
            </div>
          </Reveal>
        </div>

        <div className="mt-24 md:mt-28">
          <SectionHead id="quy-trinh-title" tag="Quy trình mua hàng" tone="bg-hub-mint-soft" title="Bốn bước, từ cuộc gọi đến khi nhận hàng" />
          <ol className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {steps.map((s, i) => (
              <Reveal as="li" key={s.title} delay={i * 90} className={cn(CARD, "group p-6")}>
                <span className={cn("grid size-11 place-items-center rounded-full border-2 bg-hub-paper text-sm font-semibold tabular-nums text-hub-ink transition-transform duration-300 [transition-timing-function:cubic-bezier(0.34,1.56,0.64,1)] group-hover:scale-110", s.ring)}>
                  {i + 1}
                </span>
                <h3 className="mt-6 text-lg font-semibold tracking-[-0.02em] text-hub-ink">{s.title}</h3>
                <p className="mt-2 text-[15px] leading-relaxed text-hub-ink-soft">{s.text}</p>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      {/* 8. Tin tức mới nhất của cả 3 chuyên trang */}
      {news.length > 0 && (
        <section id="tin-tuc" aria-labelledby="tin-tuc-title" className="scroll-mt-24 border-y border-hub-line bg-hub-paper py-20 md:py-28">
          <div className={WRAP}>
            <SectionHead
              id="tin-tuc-title"
              tag="Tin tức"
              tone="bg-hub-sky-soft"
              title="Mới nhất từ Kim Ngoan"
              action={
                <Link href="/tin-tuc" className={cn(BTN_TEXT, "group border border-hub-line")}>
                  Tất cả tin tức <ArrowRight className="size-4 transition-transform duration-200 group-hover:translate-x-0.5" aria-hidden />
                </Link>
              }
            />
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-[1.3fr_1fr_1fr]">
              {news.map((n, i) => (
                <Reveal key={n.href} delay={i * 60} className={cn("flex", i === 0 && "md:col-span-2 lg:col-span-1 lg:row-span-2")}>
                  <HubNewsCard item={n} large={i === 0} />
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 9. Hỏi đáp */}
      <section aria-labelledby="hoi-dap-title" className={cn(WRAP, "grid gap-10 py-20 md:py-28 lg:grid-cols-[1fr_1.4fr] lg:gap-16")}>
        <Reveal>
          <Tag tone="bg-hub-marigold-soft">Hỏi đáp</Tag>
          <h2 id="hoi-dap-title" className={H2}>
            Những điều khách <Pill tone="bg-hub-mint-soft">thường hỏi</Pill>
          </h2>
          <p className="mt-4 max-w-sm text-[17px] leading-relaxed text-hub-ink-soft">Chưa thấy câu trả lời bạn cần? Gọi hotline, chúng tôi trả lời ngay.</p>
          <a href={telHref(COMPANY.hotline)} className={cn(BTN_GHOST, "mt-6")}>
            <Phone className="size-4" aria-hidden /> <span className="tabular-nums">{COMPANY.hotline}</span>
          </a>
        </Reveal>
        <Reveal delay={100} className={cn(CARD, "px-6 sm:px-8")}>
          <Accordion type="single" collapsible defaultValue="faq-0">
            {faqs.map((f, i) => (
              <AccordionItem key={f.q} value={`faq-${i}`} className="last:border-b-0">
                <AccordionTrigger>{f.q}</AccordionTrigger>
                <AccordionContent>{f.a}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </Reveal>
      </section>

      {/* 10. Liên hệ – "đảo tối" xanh đêm duy nhất của trang */}
      <section id="lien-he" aria-labelledby="lien-he-title" className={cn(WRAP, "scroll-mt-24 pb-20 md:pb-28")}>
        <div className="grid gap-10 overflow-hidden rounded-xl bg-hub-midnight p-6 text-white sm:p-10 lg:grid-cols-[1fr_1.1fr] lg:gap-14 lg:p-14">
          <Reveal>
            <Tag tone="bg-hub-marigold">Liên hệ</Tag>
            <h2 id="lien-he-title" className="mt-3 text-[clamp(2rem,4vw,3.25rem)] font-semibold leading-[1.08] tracking-[-0.035em] !text-white">
              Gọi đúng bộ phận, được tư vấn ngay.
            </h2>
            <ul className="mt-8 space-y-2">
              {VERTICAL_LIST.map((v) => (
                <li key={v.id}>
                  <a href={telHref(v.phone)} className="group flex items-center justify-between gap-4 rounded-lg bg-white/[0.07] px-4 py-3.5 transition-colors duration-200 hover:bg-white/[0.13]">
                    <span className="flex min-w-0 items-center gap-3">
                      <span aria-hidden className={cn("size-2.5 shrink-0 rounded-full", v.id === "satthep" ? "bg-white" : DOT[v.id])} />
                      <span className="min-w-0">
                        <span className="block truncate text-[13px] text-white/60">{v.contactLabel}</span>
                        <span className="block text-xl font-semibold tabular-nums tracking-[-0.02em]">{v.phone}</span>
                      </span>
                    </span>
                    <span className="grid size-10 shrink-0 place-items-center rounded-lg bg-hub-blue transition-transform duration-200 group-hover:scale-105">
                      <Phone className="size-4" aria-hidden />
                    </span>
                  </a>
                </li>
              ))}
            </ul>
            <ul className="mt-6 grid gap-3 text-[15px] text-white/70 sm:grid-cols-2">
              <li className="flex items-start gap-3">
                <MapPin className="mt-0.5 size-[18px] shrink-0 text-hub-marigold" aria-hidden />
                <address className="not-italic">{COMPANY.address}</address>
              </li>
              <li className="flex items-start gap-3">
                <Clock className="mt-0.5 size-[18px] shrink-0 text-hub-marigold" aria-hidden /> 07:00 – 18:00, tất cả các ngày
              </li>
            </ul>
            <div className="mt-7 flex flex-wrap gap-2">
              {socials.map((s) => (
                <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer" className={cn(BTN, "h-10 bg-white/[0.07] text-white hover:bg-white/[0.13]")}>
                  <s.icon className="size-4" aria-hidden /> {s.label}
                </a>
              ))}
            </div>
          </Reveal>
          <Reveal delay={120} className="min-h-[360px] overflow-hidden rounded-lg bg-white/10">
            <iframe
              title={`Bản đồ ${COMPANY.legalName}`}
              src={`https://www.google.com/maps?q=${encodeURIComponent(COMPANY.mapQuery)}&output=embed`}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="block size-full min-h-[360px] border-0"
            />
          </Reveal>
        </div>
      </section>
    </>
  );
}
