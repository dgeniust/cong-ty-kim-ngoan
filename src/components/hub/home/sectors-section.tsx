import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ArrowUpRight, Leaf, Phone } from "lucide-react";
import { Reveal } from "@/components/shared/reveal";
import { HUB_COMMITMENTS, HUB_SECTORS } from "@/lib/content/hub-home";
import { getCategories } from "@/lib/data/catalog";
import { categoryGroups } from "@/lib/mock/categories";
import type { Settings } from "@/lib/settings/server";
import { telHref, type CatalogSite, type Vertical } from "@/lib/verticals";
import { ArrowIcon, CardCue, HUB_WRAP, SectorDot, SplitSectionHeader, hubButton } from "./ui";

/** Khối "Danh mục sản phẩm": phân bón là thẻ lớn, lốp xe & sắt thép là ngành bổ trợ, cuối khối là 4 cam kết. */
export function SectorsSection({ verticals, fertilizerCount }: { verticals: Settings["VERTICALS"]; fertilizerCount: number }) {
  return (
    <section id="danh-muc" aria-labelledby="san-pham-title" className="relative isolate scroll-mt-24 pb-20 pt-20 md:pb-28 md:pt-24">
      {/* hoạ tiết nền: chấm lá rất nhạt, mờ dần về hai mép */}
      <div aria-hidden className="absolute inset-0 -z-10 bg-[radial-gradient(rgba(34,102,42,0.10)_1px,transparent_1.2px)] [background-size:22px_22px] [mask-image:radial-gradient(ellipse_at_center,black_35%,transparent_75%)]" />
      <div className={HUB_WRAP}>
        <SplitSectionHeader id="san-pham-title" eyebrow={HUB_SECTORS.eyebrow} title={HUB_SECTORS.title} lead={HUB_SECTORS.lead} className="md:mb-14" />

        <div className="grid gap-4 lg:grid-cols-12 lg:gap-5">
          <Reveal className="lg:col-span-7 lg:row-span-2">
            <MainSectorCard vertical={verticals.phanbon} productCount={fertilizerCount} />
          </Reveal>
          {HUB_SECTORS.support.map((sector, i) => (
            <Reveal key={sector.id} delay={(i + 1) * 80} className="lg:col-span-5">
              <SupportSectorCard site={sector.id} vertical={verticals[sector.id]} image={sector.image} alt={sector.alt} text={sector.text} />
            </Reveal>
          ))}
        </div>

        <Reveal className="mt-14 md:mt-20">
          <Commitments />
        </Reveal>
      </div>
    </section>
  );
}

function MainSectorCard({ vertical, productCount }: { vertical: Vertical; productCount: number }) {
  const { main } = HUB_SECTORS;
  return (
    <article className="group relative flex h-full flex-col overflow-hidden rounded-[22px] bg-hub-blue-tint">
      <div className="relative aspect-[16/9] overflow-hidden sm:aspect-[2/1] lg:aspect-[16/8]">
        <Image src={main.image} alt={main.alt} fill sizes="(min-width: 1024px) 56vw, 100vw" className="object-cover transition-transform duration-700 ease-soft group-hover:scale-[1.03]" />
        <span className="absolute left-4 top-4 inline-flex items-center gap-1.5 rounded-full bg-hub-paper/95 px-3 py-1.5 text-caption font-semibold text-hub-blue backdrop-blur-sm">
          <Leaf className="size-3.5" aria-hidden /> {main.badge}
        </span>
      </div>
      <div className="flex flex-1 flex-col p-6 sm:p-8">
        <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2">
          <h3 className="text-h2 font-semibold text-hub-ink">{vertical.name}</h3>
          <p className="text-small text-hub-ink-soft">
            <span className="font-semibold tabular-nums text-hub-ink">{productCount}+</span> sản phẩm đang bán
          </p>
        </div>
        <p className="mt-3 max-w-[40rem] text-body leading-relaxed text-hub-ink-soft">{main.text}</p>
        <div className="mt-6 grid gap-6 sm:grid-cols-2">
          {categoryGroups.map((group) => (
            <div key={group.slug}>
              <h4 className="text-small font-semibold text-hub-ink">{group.name}</h4>
              <ul className="mt-2.5 space-y-1">
                {group.children.map((c) => (
                  <li key={c.slug}>
                    <Link href={`${vertical.base}/danh-muc/${c.slug}`} className="group/l -mx-2 flex min-h-9 items-center justify-between rounded-lg px-2 text-body text-hub-ink-soft transition-colors hover:bg-hub-paper hover:text-hub-ink">
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
          <Link href={vertical.base} className={hubButton.primary}>
            {main.cta}
            <ArrowIcon />
          </Link>
          <a href={telHref(vertical.phone)} className={hubButton.paper}>
            <Phone className="size-4" aria-hidden /> <span className="tabular-nums">{vertical.phone}</span>
          </a>
        </div>
      </div>
    </article>
  );
}

function SupportSectorCard({ site, vertical, image, alt, text }: { site: CatalogSite; vertical: Vertical; image: string; alt: string; text: string }) {
  const groups = getCategories(site).slice(0, 3);
  return (
    <article className="group relative grid h-full gap-5 rounded-[22px] bg-hub-paper p-5 shadow-sm sm:grid-cols-[minmax(0,1fr)_10rem] sm:p-6 lg:grid-cols-[minmax(0,1fr)_9rem] xl:grid-cols-[minmax(0,1fr)_11rem]">
      <div className="flex flex-col">
        <p className="inline-flex items-center gap-2 text-caption text-hub-ink-soft">
          <SectorDot id={site} /> {HUB_SECTORS.supportBadge}
        </p>
        <h3 className="mt-2 text-h3 font-semibold text-hub-ink">
          <Link href={vertical.base} className="after:absolute after:inset-0 after:rounded-[22px] after:content-[''] focus-visible:outline-none">
            {vertical.name}
          </Link>
        </h3>
        <p className="mt-2 text-body leading-relaxed text-hub-ink-soft">{text}</p>
        <p className="mt-3 text-small text-hub-ink-soft">{groups.map((g) => g.name).join(" · ")}</p>
        <CardCue className="pt-5" icon={<ArrowIcon icon={ArrowUpRight} className="group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />}>
          Xem {vertical.short.toLowerCase()}
        </CardCue>
      </div>
      <div className="relative order-first aspect-[16/9] overflow-hidden rounded-2xl bg-white sm:order-none sm:aspect-auto">
        <Image src={image} alt={alt} fill sizes="(min-width: 640px) 12rem, 100vw" className="object-contain p-3 transition-transform duration-500 ease-soft group-hover:scale-105" />
      </div>
    </article>
  );
}

function Commitments() {
  return (
    <ul className="grid gap-x-8 gap-y-8 sm:grid-cols-2 lg:grid-cols-4">
      {HUB_COMMITMENTS.map(({ icon: Icon, title, text }) => (
        <li key={title} className="flex gap-4">
          <span className="grid size-12 shrink-0 place-items-center rounded-2xl bg-hub-paper text-hub-blue shadow-sm">
            <Icon className="size-6" aria-hidden />
          </span>
          <span>
            <span className="block text-body font-semibold text-hub-ink">{title}</span>
            <span className="mt-1 block text-small leading-relaxed text-hub-ink-soft">{text}</span>
          </span>
        </li>
      ))}
    </ul>
  );
}
