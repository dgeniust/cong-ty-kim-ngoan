import { BUTTON_SIZES } from "@/lib/ui";
import { SITE_HOST } from "@/lib/site";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ArrowUpRight, Clock, MapPin, MessageCircle, Phone, Share2 } from "lucide-react";
import { DeliveryMap } from "@/components/hub/delivery-map";
import { HubDoors, type Door } from "@/components/hub/hub-doors";
import { HubNewsCard } from "@/components/hub/hub-news-card";
import { ProductBrowser, type BrowserTab } from "@/components/hub/product-browser";
import { SeasonCalendar } from "@/components/hub/season-calendar";
import { JsonLd } from "@/components/shared/json-ld";
import { Reveal } from "@/components/shared/reveal";
import { Wordmark } from "@/components/shared/wordmark";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { getBrands, getCategories, getProducts } from "@/lib/data/catalog";
import { formatDate } from "@/lib/format";
import { getNews } from "@/lib/data/news";
import { categories as pbCategories, categoryGroups as pbGroups, getCategory as getPbCategory } from "@/lib/mock/categories";
import type { Product } from "@/lib/mock/types";
import { getFertilizerProducts } from "@/lib/products/server";
import { getSettings, type Settings } from "@/lib/settings/server";
import { CATALOG_SITES, telHref, type VerticalId } from "@/lib/verticals";
import { cn } from "@/lib/utils";

/**
 * Landing tổng – phong cách Notion ("sổ giấy dưới nắng chiều"):
 *  - nền giấy ấm #f6f5f4, thẻ trắng viền mảnh 1px, bo 12px, KHÔNG đổ bóng thẻ, KHÔNG gradient;
 *  - một màu xanh #0075de duy nhất cho hành động chính, hành động phụ dùng nền xanh nhạt;
 *  - màu sắc nằm ở các mảng phẳng (vàng, xanh trời, đào, xanh đêm) như giấy note;
 *  - chuyển động 200ms, riêng các dấu trang trí được nhún/bật cho sinh động.
 * Bố cục v1.1 – kiểu tạp chí: masthead logo chữ lớn → “ba cánh cửa” vào 3 chuyên trang → các khối
 * mở đầu bằng đường kẻ + số thứ tự (không dùng nhãn viên màu, không tô nền chữ trong tiêu đề).
 * Màu ngành giữ khớp chuyên trang: phân bón = xanh lá, lốp xe = đen + cam, sắt thép = trắng + xám + chữ đen.
 */

const WRAP = "mx-auto w-full max-w-[1440px] px-4 sm:px-6 lg:px-10"; // khớp lề với header
const CARD = "rounded-xl border border-hub-line bg-hub-paper";
const BTN = `inline-flex items-center gap-2 rounded-lg font-medium transition-colors duration-200 ${BUTTON_SIZES.md}`;
const BTN_PRIMARY = `${BTN} group bg-hub-blue text-white hover:bg-hub-blue-hover`;
const BTN_GHOST = `${BTN} bg-hub-blue-tint text-hub-blue hover:bg-[#d4eafd]`;
const BTN_TEXT = `${BTN} text-hub-ink/90 hover:bg-hub-ink/5`;
const DOT: Record<VerticalId, string> = { phanbon: "bg-sector-phanbon", lopxe: "bg-sector-lopxe", satthep: "bg-sector-satthep" };
const DOOR_IMAGE: Record<VerticalId, string> = { phanbon: "/hero-img.jpg", lopxe: "/hero-tyre.jpg", satthep: "/hero-steel.png" };
const AUDIENCE: Record<VerticalId, string> = { phanbon: "nhà nông", lopxe: "chủ xe", satthep: "nhà thầu" };

/** Thương hiệu phân bón lấy từ phác thảo của khách; lốp xe & sắt thép lấy từ dữ liệu sản phẩm. */
const PHANBON_BRANDS = ["Phú Mỹ", "Lâm Thao", "Mặt Trời Mới"];

type SectorData = {
  id: VerticalId;
  count: number;
  groups: { name: string; href: string }[];
};

async function sectorData(pbProducts: Product[]): Promise<SectorData[]> {
  const phanbon: SectorData = {
    id: "phanbon",
    count: pbProducts.length,
    groups: pbGroups.flatMap((g) => g.children.slice(0, 2)).map((c) => ({ name: c.name, href: `/phanbon/danh-muc/${c.slug}` })),
  };
  const catalogs = await Promise.all(
    CATALOG_SITES.map(async (site): Promise<SectorData> => {
      const base = `/${site}`;
      return {
        id: site,
        count: (await getProducts(site)).length,
        groups: getCategories(site).slice(0, 4).map((c) => ({ name: c.name, href: `${base}/san-pham?nhom=${c.slug}` })),
      };
    }),
  );
  return [phanbon, ...catalogs];
}

async function browserTabs(pbProducts: Product[], VERTICALS: Settings["VERTICALS"]): Promise<BrowserTab[]> {
  const groups = pbCategories.filter((c) => c.parent && pbProducts.some((p) => p.categorySlug === c.slug));
  const phanbon: BrowserTab = {
    id: "phanbon", label: VERTICALS.phanbon.short, href: "/phanbon", dot: DOT.phanbon,
    groupLabel: "Nhóm sản phẩm", groups: groups.map((c) => c.name),
    items: pbProducts.map((p) => ({ name: p.name, href: `/phanbon/san-pham/${p.slug}`, group: getPbCategory(p.categorySlug)?.name ?? "", meta: p.packing.join(" / "), image: p.images[0] })),
  };
  const catalogs = await Promise.all(
    CATALOG_SITES.map(async (site): Promise<BrowserTab> => ({
      id: site, label: VERTICALS[site].short, href: VERTICALS[site].base, dot: DOT[site],
      groupLabel: "Thương hiệu", groups: await getBrands(site),
      items: (await getProducts(site)).map((p) => ({ name: p.name, href: `${VERTICALS[site].base}/san-pham/${p.slug}`, group: p.brand, meta: p.keySpec, image: p.images?.[0], art: p.art })),
    })),
  );
  return [phanbon, ...catalogs];
}

/** Đầu khối kiểu tạp chí: đường kẻ đậm + số thứ tự + tên mục, rồi tiêu đề lớn (trái) và lời dẫn (phải). */
function Kicker({ no, children, tone = "text-hub-ink" }: { no: string; children: React.ReactNode; tone?: string }) {
  return (
    <p className={cn("flex items-center justify-between gap-4 border-t border-current pt-3 text-caption", tone)}>
      <span className="font-semibold tabular-nums">{no}</span>
      <span className="opacity-70">{children}</span>
    </p>
  );
}

function SectionHead({ id, no, kicker, title, lead, action }: { id: string; no: string; kicker: string; title: React.ReactNode; lead?: React.ReactNode; action?: React.ReactNode }) {
  return (
    <Reveal className="mb-10 md:mb-14">
      <Kicker no={no}>{kicker}</Kicker>
      <div className="mt-7 grid gap-5 lg:mt-9 lg:grid-cols-12 lg:items-end lg:gap-8">
        <h2 id={id} className="text-h1 font-semibold text-hub-ink lg:col-span-7">{title}</h2>
        {(lead || action) && (
          <div className="lg:col-span-4 lg:col-start-9">
            {lead && <p className="text-lead leading-relaxed text-hub-ink-soft">{lead}</p>}
            {action && <div className={cn(lead && "mt-5")}>{action}</div>}
          </div>
        )}
      </div>
    </Reveal>
  );
}

export default async function HubHome() {
  const { COMPANY, VERTICALS, VERTICAL_LIST } = await getSettings();
  const pbProducts = await getFertilizerProducts();
  const news = await getNews({ limit: 5 }); // landing tổng: tất cả chuyên trang, không lọc
  const data = await sectorData(pbProducts);
  const tabs = await browserTabs(pbProducts, VERTICALS);
  const brands = [...PHANBON_BRANDS, ...(await Promise.all(CATALOG_SITES.map((s) => getBrands(s)))).flat()].filter((b, i, a) => a.indexOf(b) === i);
  const productCount = data.reduce((n, c) => n + c.count, 0);
  const month = Number(new Intl.DateTimeFormat("en", { month: "numeric", timeZone: "Asia/Ho_Chi_Minh" }).format(new Date()));

  const doors: Door[] = VERTICAL_LIST.map((v) => {
    const d = data.find((x) => x.id === v.id)!;
    return { id: v.id, name: v.name, audience: AUDIENCE[v.id], description: v.description, href: v.base, host: `${SITE_HOST}${v.base}`, phone: v.phone, image: DOOR_IMAGE[v.id], count: d.count, groups: d.groups };
  });

  /** số thứ tự các khối – tự đánh lại khi một khối bị ẩn (ví dụ chưa có tin tức) */
  let n = 0;
  const no = () => String(++n).padStart(2, "0");

  const steps = [
    { title: "Gọi hoặc nhắn Zalo", text: "Chọn đúng số của ngành hàng bạn cần, gửi nhu cầu hoặc quy cách." },
    { title: "Nhận tư vấn, báo giá", text: "Nhân viên tư vấn loại hàng phù hợp và báo giá theo ngày, theo số lượng." },
    { title: "Giao tận nơi", text: "Xếp xe theo vòng giao hàng ở trên, báo trước giờ đến." },
    { title: "Đồng hành sau bán", text: "Hỗ trợ kỹ thuật và bảo hành theo chính sách của từng hãng." },
  ];

  const promises = [
    { title: "Hàng chính hãng", text: "Nguồn gốc rõ ràng, có tem bảo hành và chứng chỉ theo từng ngành hàng. Không bán hàng trôi nổi." },
    { title: "Giá minh bạch", text: "Báo giá rõ ràng theo ngày và theo số lượng, trước khi giao hàng." },
    { title: "Gọi đúng người", text: "Mỗi ngành một bộ phận chuyên trách và một số điện thoại riêng, trả lời đúng chuyên môn." },
  ];

  const facts = [
    { label: "Thành lập", value: COMPANY.founded },
    { label: "Địa bàn", value: COMPANY.address },
    { label: "Ngành hàng", value: "Phân bón & thuốc BVTV, lốp xe ô tô, tôn – sắt thép" },
    { label: "Khách hàng", value: "Nhà nông, chủ xe, đội xe vận tải, nhà thầu" },
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

  const [lead, ...rest] = news;
  const B = "font-semibold text-hub-ink"; // chữ nhấn trong câu số liệu

  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: faqs.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
        }}
      />

      {/* 1. Masthead: dòng thông tin như đầu tờ báo → logo chữ cỡ lớn → tiêu đề + lời dẫn */}
      <section id="top" aria-labelledby="hero-title" className={cn(WRAP, "pt-4 md:pt-6")}>
        <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-1 border-b border-hub-ink pb-3 text-caption text-hub-ink">
          <span className="font-semibold">{COMPANY.legalName}</span>
          <span className="hidden text-hub-ink-soft sm:inline">{COMPANY.area} · Từ năm {COMPANY.founded}</span>
          <a href={telHref(COMPANY.hotline)} className="inline-flex min-h-8 items-center gap-1.5 font-medium tabular-nums hover:text-hub-blue">
            <Phone className="size-3.5" aria-hidden /> {COMPANY.hotline}
          </a>
        </div>
        <Wordmark animate delay={120} className="mt-6 h-auto w-full text-hub-ink md:mt-10" />
        <div className="mt-8 grid gap-6 border-t border-hub-line pt-6 md:mt-12 lg:grid-cols-12 lg:items-end lg:gap-8 lg:pt-8">
          <h1 id="hero-title" className="text-display font-semibold text-hub-ink lg:col-span-8">
            <span className="sr-only">{COMPANY.legalName}: </span>
            Phân bón cho rẫy, lốp cho xe, thép cho công trình.
          </h1>
          <div className="lg:col-span-4">
            <p className="text-lead leading-relaxed text-hub-ink-soft">
              Ba ngành hàng thiết yếu của bà con {COMPANY.area}, chung một địa chỉ. Hàng chính hãng, báo giá theo ngày, giao tận nơi.
            </p>
            <div className="mt-5 flex flex-wrap gap-2">
              <Link href="#san-pham" className={BTN_PRIMARY}>
                Xem sản phẩm <ArrowRight className="size-4 transition-transform duration-200 group-hover:translate-x-0.5" aria-hidden />
              </Link>
              <a href={telHref(COMPANY.hotline)} className={BTN_GHOST}>
                <Phone className="size-4" aria-hidden /> Gọi hotline
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Ba cánh cửa vào 3 chuyên trang */}
      <section id="linh-vuc" aria-label="Ba chuyên trang của Kim Ngoan" className={cn(WRAP, "scroll-mt-24 pt-8 md:pt-12")}>
        <HubDoors doors={doors} />
      </section>

      {/* 3. Số liệu viết thành câu + thương hiệu */}
      <section aria-label="Kim Ngoan qua các con số" className={cn(WRAP, "py-20 md:py-28")}>
        <Reveal>
          <p className="max-w-4xl text-h2 font-medium text-hub-ink/45">
            Từ <span className={cn(B, "tabular-nums")}>{COMPANY.founded}</span>, Kim Ngoan phân phối <span className={cn(B, "tabular-nums")}>{productCount}+ sản phẩm</span> của{" "}
            <span className={cn(B, "tabular-nums")}>{brands.length} thương hiệu</span> trong <span className={B}>{VERTICAL_LIST.length} ngành hàng</span>, giao tận vườn, tận xe, tận công trình quanh{" "}
            <span className={B}>{COMPANY.area}</span>.
          </p>
        </Reveal>
        <Reveal delay={100} className="mt-10 grid gap-3 border-t border-hub-line pt-5 md:grid-cols-[12rem_1fr] md:gap-8">
          <p className="text-caption text-hub-ink-soft">Phân phối chính hãng</p>
          <ul className="flex flex-wrap gap-x-2 gap-y-1 text-title font-semibold text-hub-ink/70">
            {brands.map((b, i) => (
              <li key={b} className="after:ml-2 after:text-hub-ink/25 after:content-['·'] last:after:content-none">
                <span className={cn("transition-colors duration-200 hover:text-hub-ink", i < 3 && "text-hub-ink")}>{b}</span>
              </li>
            ))}
          </ul>
        </Reveal>
      </section>

      {/* 4. Sản phẩm: chọn ngành → hãng/nhóm → sản phẩm */}
      <section id="san-pham" aria-labelledby="san-pham-title" className="scroll-mt-24 border-y border-hub-line bg-hub-paper py-20 md:py-28">
        <div className={WRAP}>
          <SectionHead id="san-pham-title" no={no()} kicker="Sản phẩm" title="Tìm đúng hàng, theo ngành và thương hiệu" lead="Lọc theo nhóm hàng hoặc thương hiệu, bấm vào sản phẩm để xem thông số và liên hệ báo giá." />
          <ProductBrowser tabs={tabs} />
        </div>
      </section>

      {/* 5. Lịch mùa vụ */}
      <section id="mua-vu" aria-labelledby="mua-vu-title" className={cn(WRAP, "scroll-mt-24 py-20 md:py-28")}>
        <SectionHead
          id="mua-vu-title"
          no={no()}
          kicker="Lịch mùa vụ"
          title="Tháng này, vườn của bạn cần gì?"
          lead="Chọn cây trồng để xem lịch bón phân, phòng bệnh và thu hoạch cả năm, kèm loại phân, thuốc phù hợp cho từng việc."
        />
        <Reveal>
          <SeasonCalendar serverMonth={month} />
        </Reveal>
      </section>

      {/* 6. Vùng giao hàng + quy trình */}
      <section id="giao-hang" aria-labelledby="giao-hang-title" className={cn(WRAP, "scroll-mt-24 pb-20 md:pb-28")}>
        <SectionHead
          id="giao-hang-title"
          no={no()}
          kicker="Giao hàng"
          title="Giao tận vườn, tận xe, tận công trình"
          lead={`Ba vòng giao hàng tính từ cửa hàng ở ${COMPANY.area}. Chọn từng vòng để xem khu vực và thời gian nhận hàng.`}
        />
        <Reveal>
          <DeliveryMap storeLabel={COMPANY.area} />
        </Reveal>
        <div className="mt-16 md:mt-20">
          <h3 className="text-h4 font-semibold text-hub-ink">Mua hàng trong bốn bước</h3>
          <ol className="mt-6 grid gap-x-8 gap-y-8 sm:grid-cols-2 lg:grid-cols-4">
            {steps.map((s, i) => (
              <Reveal as="li" key={s.title} delay={i * 80} className="border-t-2 border-hub-ink pt-4">
                <p className="text-caption font-semibold tabular-nums text-hub-ink-soft">Bước {i + 1}</p>
                <p className="text-title mt-2 font-semibold text-hub-ink">{s.title}</p>
                <p className="mt-1.5 text-body leading-relaxed text-hub-ink-soft">{s.text}</p>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      {/* 7. Về Kim Ngoan: ảnh lớn có chú thích – câu chuyện, thông tin, cam kết */}
      <section id="gioi-thieu" aria-labelledby="gioi-thieu-title" className="scroll-mt-24 border-y border-hub-line bg-hub-paper py-20 md:py-28">
        <div className={cn(WRAP, "grid gap-12 lg:grid-cols-12 lg:gap-8")}>
          <Reveal className="lg:col-span-6">
            <figure className="lg:sticky lg:top-28">
              <div className="relative aspect-[4/3] overflow-hidden rounded-xl bg-hub-stone lg:aspect-[5/6]">
                <Image src="/garden.jpg" alt="Vườn cây trong vùng Chơn Thành" fill sizes="(min-width: 1024px) 45vw, 100vw" className="object-cover" />
              </div>
              <figcaption className="mt-3 flex justify-between gap-4 text-caption text-hub-ink-soft">
                <span>Vườn cây trong vùng {COMPANY.area}</span>
                <span className="tabular-nums">Từ {COMPANY.founded}</span>
              </figcaption>
            </figure>
          </Reveal>
          <div className="lg:col-span-5 lg:col-start-8">
            <Reveal>
              <Kicker no={no()}>Về Kim Ngoan</Kicker>
              <h2 id="gioi-thieu-title" className="mt-7 text-h1 font-semibold text-hub-ink">Từ đại lý vật tư nông nghiệp đến ba ngành hàng</h2>
              <p className="mt-6 text-lead leading-relaxed text-hub-ink-soft">
                Khởi đầu là đại lý vật tư nông nghiệp, Kim Ngoan mở rộng sang lốp xe ô tô và tôn – sắt thép để phục vụ trọn nhu cầu sản xuất, vận tải và xây dựng của bà con trong vùng.
              </p>
              <dl className="mt-8 grid grid-cols-2 gap-x-6 gap-y-5 border-t border-hub-line pt-6">
                {facts.map((f) => (
                  <div key={f.label}>
                    <dt className="text-caption text-hub-ink-soft">{f.label}</dt>
                    <dd className="mt-1 text-body font-medium text-hub-ink">{f.value}</dd>
                  </div>
                ))}
              </dl>
            </Reveal>
            <h3 className="mt-14 text-h4 font-semibold text-hub-ink">Ba điều Kim Ngoan giữ</h3>
            <ol className="mt-4">
              {promises.map((p, i) => (
                <Reveal as="li" key={p.title} delay={i * 80} className="grid grid-cols-[2.5rem_1fr] gap-3 border-t border-hub-line py-5">
                  <span className="text-caption font-semibold tabular-nums text-hub-ink-soft">0{i + 1}</span>
                  <span>
                    <span className="text-title block font-semibold text-hub-ink">{p.title}</span>
                    <span className="mt-1 block text-body leading-relaxed text-hub-ink-soft">{p.text}</span>
                  </span>
                </Reveal>
              ))}
            </ol>
          </div>
        </div>
      </section>

      {/* 8. Tin tức: bài chính lớn bên trái, các bài khác dạng mục lục bên phải */}
      {lead && (
        <section id="tin-tuc" aria-labelledby="tin-tuc-title" className={cn(WRAP, "scroll-mt-24 py-20 md:py-28")}>
          <SectionHead
            id="tin-tuc-title"
            no={no()}
            kicker="Tin tức"
            title="Mới nhất từ Kim Ngoan"
            action={
              <Link href="/tin-tuc" className={cn(BTN_TEXT, "group border border-hub-line")}>
                Tất cả tin tức <ArrowRight className="size-4 transition-transform duration-200 group-hover:translate-x-0.5" aria-hidden />
              </Link>
            }
          />
          <div className="grid gap-8 lg:grid-cols-12">
            <Reveal className="flex lg:col-span-7">
              <HubNewsCard item={lead} large />
            </Reveal>
            <ol className="lg:col-span-5">
              {rest.map((item, i) => (
                <Reveal as="li" key={item.href} delay={i * 60} className="group relative border-t border-hub-line py-5 first:border-t-hub-ink first:pt-4 lg:first:pt-0 lg:first:border-t-0">
                  <p className="flex items-center gap-2.5 text-caption text-hub-ink-soft">
                    <span className="inline-flex items-center gap-1.5 font-medium text-hub-ink">
                      <span aria-hidden className={cn("size-2 rounded-full", DOT[item.site])} /> {VERTICALS[item.site].short}
                    </span>
                    <time dateTime={item.date}>{formatDate(item.date)}</time>
                  </p>
                  <h3 className="text-title mt-1.5 font-semibold leading-snug text-hub-ink">
                    <Link href={item.href} className="after:absolute after:inset-0 after:content-[''] group-hover:text-hub-blue">
                      {item.title}
                    </Link>
                  </h3>
                  <p className="mt-1 line-clamp-2 text-small leading-relaxed text-hub-ink-soft">{item.excerpt}</p>
                </Reveal>
              ))}
            </ol>
          </div>
        </section>
      )}

      {/* 9. Hỏi đáp */}
      <section aria-labelledby="hoi-dap-title" className={cn(WRAP, lead ? "pb-20 md:pb-28" : "py-20 md:py-28")}>
        <SectionHead
          id="hoi-dap-title"
          no={no()}
          kicker="Hỏi đáp"
          title="Những điều khách thường hỏi"
          lead="Chưa thấy câu trả lời bạn cần? Gọi hotline, chúng tôi trả lời ngay."
          action={
            <a href={telHref(COMPANY.hotline)} className={BTN_GHOST}>
              <Phone className="size-4" aria-hidden /> <span className="tabular-nums">{COMPANY.hotline}</span>
            </a>
          }
        />
        <Reveal className={cn(CARD, "px-6 sm:px-8 lg:ml-auto lg:w-[calc(100%*8/12)]")}>
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

      {/* 10. Liên hệ – “đảo tối” xanh đêm duy nhất của trang */}
      <section id="lien-he" aria-labelledby="lien-he-title" className={cn(WRAP, "scroll-mt-24 pb-20 md:pb-28")}>
        <div className="grid gap-10 overflow-hidden rounded-xl bg-hub-midnight p-6 text-white sm:p-10 lg:grid-cols-[1fr_1.1fr] lg:gap-14 lg:p-14">
          <Reveal>
            <Kicker no={no()} tone="text-white">Liên hệ</Kicker>
            <h2 id="lien-he-title" className="text-h1 mt-7 font-semibold !text-white">Gọi đúng bộ phận, được tư vấn ngay.</h2>
            <ul className="mt-8 space-y-2">
              {VERTICAL_LIST.map((v) => (
                <li key={v.id}>
                  <a href={telHref(v.phone)} className="group flex items-center justify-between gap-4 rounded-lg bg-white/[0.07] px-4 py-3.5 transition-colors duration-200 hover:bg-white/[0.13]">
                    <span className="flex min-w-0 items-center gap-3">
                      <span aria-hidden className={cn("size-2.5 shrink-0 rounded-full", v.id === "satthep" ? "bg-white" : DOT[v.id])} />
                      <span className="min-w-0">
                        <span className="block truncate text-caption text-white/60">{v.contactLabel}</span>
                        <span className="block text-h4 font-semibold tabular-nums tracking-[-0.02em]">{v.phone}</span>
                      </span>
                    </span>
                    <span className="grid size-10 shrink-0 place-items-center rounded-lg bg-hub-blue transition-transform duration-200 group-hover:scale-105">
                      <Phone className="size-4" aria-hidden />
                    </span>
                  </a>
                </li>
              ))}
            </ul>
            <ul className="mt-6 grid gap-3 text-body text-white/70 sm:grid-cols-2">
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
                <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer" className={cn(BTN, "bg-white/[0.07] text-white hover:bg-white/[0.13]")}>
                  <s.icon className="size-4" aria-hidden /> {s.label}
                </a>
              ))}
              <a href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(COMPANY.mapQuery)}`} target="_blank" rel="noopener noreferrer" className={cn(BTN, "group bg-white/[0.07] text-white hover:bg-white/[0.13]")}>
                Chỉ đường <ArrowUpRight className="size-4 transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden />
              </a>
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
