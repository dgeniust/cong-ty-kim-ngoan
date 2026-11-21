import Image from "next/image";
import { Reveal } from "@/components/shared/reveal";
import { HUB_ABOUT, HUB_COMMITMENTS } from "@/lib/content/hub-home";
import type { Settings } from "@/lib/settings/server";
import { cn } from "@/lib/utils";
import { BIZ_WRAP, Eyebrow, SectionTitle } from "./ui";

/** Giới thiệu kiểu tạp chí: câu chuyện + trích dẫn bên trái, ảnh thật bên phải, 4 cam kết bên dưới. */
export function AboutSection({ company }: { company: Settings["COMPANY"] }) {
  const fill = (t: string) => t.replace("{area}", company.area);
  return (
    <section id="gioi-thieu" aria-labelledby="gioi-thieu-title" className="scroll-mt-20 bg-hub-canvas py-24 md:py-32">
      <div className={cn(BIZ_WRAP, "grid gap-12 lg:grid-cols-12 lg:gap-16")}>
        <Reveal className="lg:col-span-6">
          <Eyebrow>{HUB_ABOUT.eyebrow}</Eyebrow>
          <SectionTitle id="gioi-thieu-title">{HUB_ABOUT.title}</SectionTitle>
          <div className="mt-8 space-y-5 text-lead leading-relaxed text-hub-ink-soft">
            {HUB_ABOUT.paragraphs.map((p) => (
              <p key={p.slice(0, 20)}>{fill(p)}</p>
            ))}
          </div>
          <figure className="mt-10 border-l-[3px] border-biz-moss pl-6">
            <blockquote className="text-[1.375rem] font-semibold leading-snug tracking-[-0.01em] text-hub-ink">“{HUB_ABOUT.quote}”</blockquote>
            <figcaption className="mt-3 text-small text-hub-ink-soft">— {HUB_ABOUT.quoteBy}</figcaption>
          </figure>
        </Reveal>

        <Reveal delay={100} className="lg:col-span-6">
          <figure className="lg:sticky lg:top-28">
            <div className="relative aspect-[4/3] overflow-hidden rounded-[4px] bg-hub-stone lg:aspect-[5/6]">
              <Image src={HUB_ABOUT.image} alt={HUB_ABOUT.alt} fill sizes="(min-width: 1024px) 45vw, 100vw" className="object-cover" />
            </div>
            <figcaption className="mt-3 flex justify-between gap-4 text-caption text-hub-ink-soft">
              <span>Vườn cây trong vùng {company.area}</span>
              <span className="tabular-nums">Từ {company.founded}</span>
            </figcaption>
          </figure>
        </Reveal>
      </div>

      {/* cam kết: lưới phẳng, ngăn bằng kẻ mảnh phía trên */}
      <Reveal className={cn(BIZ_WRAP, "mt-20 md:mt-24")}>
        <ul className="grid gap-x-10 sm:grid-cols-2 lg:grid-cols-4">
          {HUB_COMMITMENTS.map(({ icon: Icon, title, text }) => (
            <li key={title} className="border-t border-hub-ink/10 py-6">
              <Icon className="size-6 text-biz-moss" strokeWidth={1.75} aria-hidden />
              <h3 className="mt-4 text-body font-semibold text-hub-ink">{title}</h3>
              <p className="mt-1.5 text-small leading-relaxed text-hub-ink-soft">{text}</p>
            </li>
          ))}
        </ul>
      </Reveal>
    </section>
  );
}
