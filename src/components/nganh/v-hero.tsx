import Link from "next/link";
import { ArrowRight, Phone } from "lucide-react";
import type { CatalogContent } from "@/lib/data/types";
import { telHref, type Vertical } from "@/lib/verticals";
import { ProductArt } from "./product-art";
import { VButton } from "./v-button";
import { VContainer } from "./v-section";

type HeroProps = { vertical: Vertical; hero: CatalogContent["hero"] };

function HeroCopy({ vertical, hero }: HeroProps) {
  return (
    <>
      <p className="v-label animate-rise flex items-center gap-3 text-sm text-v-mute">
        <span aria-hidden className="h-[3px] w-10 bg-v-mark" />
        {hero.eyebrow}
      </p>
      <h1 className="v-display mt-6 text-[length:var(--v-hero-size)] text-v-fg">
        {hero.title.map((line, i) => (
          <span key={line} className="block overflow-hidden pb-[0.06em]">
            <span className="animate-rise block" style={{ animationDelay: `${120 + i * 110}ms` }}>
              {i === hero.title.length - 1 ? <span className="text-v-mark">{line}</span> : line}
            </span>
          </span>
        ))}
      </h1>
      <p className="animate-rise mt-7 max-w-xl text-lg leading-relaxed text-v-mute" style={{ animationDelay: "480ms" }}>
        {hero.description}
      </p>
      <div className="animate-rise mt-9 flex flex-wrap gap-3" style={{ animationDelay: "580ms" }}>
        <VButton asChild size="lg">
          <Link href={`${vertical.base}/san-pham`}>
            Xem sản phẩm <ArrowRight className="arrow" />
          </Link>
        </VButton>
        <VButton asChild size="lg" variant="quiet">
          <a href={telHref(vertical.phone)}>
            <Phone /> <span className="tabular-nums">{vertical.phone}</span>
          </a>
        </VButton>
      </div>
    </>
  );
}

function Stats({ stats, className }: { stats: CatalogContent["hero"]["stats"]; className?: string }) {
  return (
    <dl className={className}>
      {stats.map((s, i) => (
        <div key={s.label} className="animate-rise" style={{ animationDelay: `${700 + i * 90}ms` }}>
          <dt className="sr-only">{s.label}</dt>
          <dd className="v-display text-5xl md:text-6xl">{s.value}</dd>
          <dd className="mt-2 max-w-[18ch] text-sm leading-snug opacity-70">{s.label}</dd>
        </div>
      ))}
    </dl>
  );
}

/** Lốp xe: nền đen, mảng cam vát chéo, bánh xe lớn quay chậm. */
export function LopXeHero({ vertical, hero }: HeroProps) {
  return (
    <section className="relative overflow-hidden bg-v-bg">
      <div aria-hidden className="absolute -right-[18%] top-0 hidden h-full w-[62%] -skew-x-12 bg-v-accent lg:block" />
      <div aria-hidden className="absolute -right-[10%] top-0 hidden h-full w-[40%] -skew-x-12 bg-black/15 lg:block" />
      <VContainer className="relative grid items-center gap-8 pb-16 pt-12 lg:grid-cols-[1.15fr_1fr] lg:pb-24 lg:pt-20">
        <div>
          <HeroCopy vertical={vertical} hero={hero} />
        </div>
        <div className="relative mx-auto aspect-square w-[78%] max-w-[560px] animate-rise lg:w-full" style={{ animationDelay: "250ms" }}>
          <div aria-hidden className="absolute inset-[6%] rounded-full bg-v-accent/25 blur-3xl lg:hidden" />
          <ProductArt kind="tyre-at" className="relative animate-spin-slow drop-shadow-[0_40px_60px_rgb(0_0_0/0.55)]" />
        </div>
      </VContainer>
      <div className="relative bg-v-raise">
        <VContainer>
          <Stats stats={hero.stats} className="grid grid-cols-3 gap-6 py-9 text-v-fg md:py-11" />
        </VContainer>
      </div>
    </section>
  );
}

/** Sắt thép: nền trắng, chữ đen khổ lớn, khối đen vuông chứa thép hình. */
export function SatThepHero({ vertical, hero }: HeroProps) {
  return (
    <section className="bg-v-bg">
      <VContainer className="grid gap-10 pb-0 pt-12 lg:grid-cols-12 lg:gap-0 lg:pt-20">
        <div className="lg:col-span-7 lg:pb-24 lg:pr-12">
          <HeroCopy vertical={vertical} hero={hero} />
        </div>
        <div className="relative lg:col-span-5">
          <div className="animate-rise relative aspect-[4/3] bg-v-invert lg:absolute lg:inset-0 lg:aspect-auto" style={{ animationDelay: "250ms" }}>
            <div aria-hidden className="absolute inset-0 opacity-[0.07] [background-image:linear-gradient(#fff_1px,transparent_1px),linear-gradient(90deg,#fff_1px,transparent_1px)] [background-size:44px_44px]" />
            <ProductArt kind="ibeam" className="absolute inset-0 m-auto size-[82%] drop-shadow-[0_30px_40px_rgb(0_0_0/0.6)]" />
            <p className="v-label absolute bottom-5 left-6 text-xs text-white/50">I200 × 100 · SS400</p>
          </div>
        </div>
      </VContainer>
      <div className="bg-v-sunk">
        <VContainer>
          <Stats stats={hero.stats} className="grid grid-cols-3 gap-6 py-9 text-v-fg md:py-11" />
        </VContainer>
      </div>
    </section>
  );
}
