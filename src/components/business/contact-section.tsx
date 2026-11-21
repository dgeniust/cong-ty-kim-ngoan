import { Clock, Mail, MapPin, MessageCircle, Phone, type LucideIcon } from "lucide-react";
import type { ReactNode } from "react";
import { Reveal } from "@/components/shared/reveal";
import { HUB_CONTACT } from "@/lib/content/hub-home";
import { formatOpeningHours } from "@/lib/format";
import type { Settings } from "@/lib/settings/server";
import { SECTOR_DOT, telHref } from "@/lib/verticals";
import { MapEmbed } from "./map-embed";
import { QuoteForm } from "./quote-form";
import { Eyebrow, SectionTitle } from "./ui";

/** Liên hệ chia đôi màn hình: thông tin + form gạch chân bên trái, bản đồ tràn chiều cao bên phải. */
export function ContactSection({ company, verticalList }: { company: Settings["COMPANY"]; verticalList: Settings["VERTICAL_LIST"] }) {
  return (
    <section id="lien-he" aria-labelledby="lien-he-title" className="scroll-mt-20 bg-white">
      <div className="grid lg:grid-cols-2">
        <Reveal className="px-5 py-20 sm:px-8 md:py-28 lg:py-32 lg:pl-[max(3rem,calc((100vw-1280px)/2+3rem))] lg:pr-16">
          <Eyebrow>{HUB_CONTACT.eyebrow}</Eyebrow>
          <SectionTitle id="lien-he-title">{HUB_CONTACT.title}</SectionTitle>
          <p className="mt-5 max-w-[34rem] text-lead leading-relaxed text-hub-ink-soft">{HUB_CONTACT.lead}</p>

          <ul className="mt-10 grid gap-x-8 gap-y-6 sm:grid-cols-2">
            <Info icon={Phone} label="Hotline">
              <a href={telHref(company.hotline)} className="text-title font-bold tabular-nums text-hub-ink transition-colors hover:text-hub-blue">
                {company.hotline}
              </a>
              {company.zalo && (
                <a href={company.zalo} target="_blank" rel="noopener noreferrer" className="mt-1 flex items-center gap-1.5 text-small font-medium text-hub-ink-soft hover:text-hub-ink">
                  <MessageCircle className="size-3.5" aria-hidden /> Nhắn Zalo
                </a>
              )}
            </Info>
            <Info icon={Clock} label="Giờ làm việc">
              {formatOpeningHours(company.openingHours)}
            </Info>
            <Info icon={MapPin} label="Cửa hàng & kho">
              <address className="not-italic">{company.address}</address>
            </Info>
            {company.email && (
              <Info icon={Mail} label="Email">
                <a href={`mailto:${company.email}`} className="hover:text-hub-ink">
                  {company.email}
                </a>
              </Info>
            )}
          </ul>

          <ul className="mt-8 grid gap-x-6 border-t border-hub-ink/10 sm:grid-cols-3">
            {verticalList.map((v) => (
              <li key={v.id} className="border-b border-hub-ink/10 py-3.5 sm:border-b-0">
                <a href={telHref(v.phone)} className="group block">
                  <span className="flex items-center gap-1.5 text-caption text-hub-ink-soft">
                    <span aria-hidden className={`size-1.5 rounded-full ${SECTOR_DOT[v.id]}`} /> {v.short}
                  </span>
                  <span className="mt-1 block text-body font-semibold tabular-nums text-hub-ink transition-colors group-hover:text-hub-blue">{v.phone}</span>
                </a>
              </li>
            ))}
          </ul>

          <h3 className="mt-14 text-title font-bold text-hub-ink">{HUB_CONTACT.formTitle}</h3>
          <div className="mt-6">
            <QuoteForm sectors={verticalList.map((v) => ({ id: v.id, name: v.name }))} />
          </div>
        </Reveal>

        <MapEmbed query={company.mapQuery} title={`Bản đồ đường tới ${company.legalName}`} hint={HUB_CONTACT.mapHint} directionsLabel={HUB_CONTACT.directions} />
      </div>
    </section>
  );
}

function Info({ icon: Icon, label, children }: { icon: LucideIcon; label: string; children: ReactNode }) {
  return (
    <li className="flex gap-3.5">
      <Icon className="mt-0.5 size-5 shrink-0 text-hub-blue" strokeWidth={1.75} aria-hidden />
      <div className="min-w-0">
        <p className="text-[12px] font-semibold uppercase tracking-[0.12em] text-hub-ink-soft">{label}</p>
        <div className="mt-1.5 text-body text-hub-ink">{children}</div>
      </div>
    </li>
  );
}
