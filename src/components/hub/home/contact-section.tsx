import { Clock, Mail, MapPin, MessageCircle, Navigation, Phone, type LucideIcon } from "lucide-react";
import type { ReactNode } from "react";
import { Reveal } from "@/components/shared/reveal";
import { HUB_CONTACT } from "@/lib/content/hub-home";
import { formatOpeningHours } from "@/lib/format";
import type { Settings } from "@/lib/settings/server";
import { cn } from "@/lib/utils";
import { telHref } from "@/lib/verticals";
import { Eyebrow, HUB_WRAP, SectorDot, hubButton } from "./ui";

/** Khối "Liên hệ": số điện thoại từng ngành, địa chỉ, giờ mở cửa, nút gọi/Zalo và bản đồ. */
export function ContactSection({ company, verticalList, standalone }: { company: Settings["COMPANY"]; verticalList: Settings["VERTICAL_LIST"]; standalone: boolean }) {
  const directions = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(company.mapQuery)}`;
  return (
    <section id="lien-he" aria-labelledby="lien-he-title" className={cn(HUB_WRAP, "scroll-mt-24 pb-20 md:pb-28", standalone && "pt-20 md:pt-28")}>
      <div className="grid overflow-hidden rounded-[28px] bg-hub-blue-tint lg:grid-cols-12">
        <Reveal className="p-6 sm:p-10 lg:col-span-5 lg:p-12">
          <Eyebrow>{HUB_CONTACT.eyebrow}</Eyebrow>
          <h2 id="lien-he-title" className="mt-4 text-h2 font-semibold text-hub-ink">
            {HUB_CONTACT.title}
          </h2>
          <p className="mt-4 text-lead leading-relaxed text-hub-ink-soft">{HUB_CONTACT.lead}</p>

          <ul className="mt-8 space-y-1">
            {verticalList.map((v) => (
              <li key={v.id}>
                <a href={telHref(v.phone)} className="group -mx-3 flex min-h-14 items-center gap-3 rounded-xl px-3 transition-colors hover:bg-hub-paper/70">
                  <SectorDot id={v.id} className="size-2.5 shrink-0" />
                  <span className="min-w-0 flex-1">
                    <span className="block text-body font-medium text-hub-ink">{v.name}</span>
                    {v.id === "phanbon" && <span className="block text-caption text-hub-ink-soft">{HUB_CONTACT.fertilizerNote}</span>}
                  </span>
                  <span className="text-body font-semibold tabular-nums text-hub-ink group-hover:text-hub-blue">{v.phone}</span>
                </a>
              </li>
            ))}
          </ul>

          <dl className="mt-6 space-y-3.5 text-body text-hub-ink-soft">
            <ContactRow icon={MapPin} label="Địa chỉ">
              <address className="not-italic">{company.address}</address>
            </ContactRow>
            <ContactRow icon={Clock} label="Giờ mở cửa">
              {formatOpeningHours(company.openingHours)}
            </ContactRow>
            {company.email && (
              <ContactRow icon={Mail} label="Email">
                <a href={`mailto:${company.email}`} className="hover:text-hub-ink">
                  {company.email}
                </a>
              </ContactRow>
            )}
          </dl>

          <div className="mt-8 flex flex-wrap gap-3">
            <a href={telHref(company.hotline)} className={hubButton.primary}>
              <Phone className="size-4" aria-hidden /> Gọi <span className="tabular-nums">{company.hotline}</span>
            </a>
            {company.zalo && (
              <a href={company.zalo} target="_blank" rel="noopener noreferrer" className={hubButton.paper}>
                <MessageCircle className="size-4" aria-hidden /> Nhắn Zalo
              </a>
            )}
          </div>
        </Reveal>

        <div className="relative min-h-[320px] bg-[#e4ebdc] lg:col-span-7 lg:min-h-[560px]">
          <iframe
            title={`Bản đồ đường tới ${company.legalName}`}
            src={`https://www.google.com/maps?q=${encodeURIComponent(company.mapQuery)}&output=embed`}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            className="absolute inset-0 size-full border-0 grayscale-[30%]"
          />
          <a href={directions} target="_blank" rel="noopener noreferrer" className={cn(hubButton.floating, "absolute bottom-4 right-4")}>
            <Navigation className="size-4" aria-hidden /> Chỉ đường
          </a>
        </div>
      </div>
    </section>
  );
}

function ContactRow({ icon: Icon, label, children }: { icon: LucideIcon; label: string; children: ReactNode }) {
  return (
    <div className="flex gap-3">
      <dt className="sr-only">{label}</dt>
      <Icon className="mt-0.5 size-5 shrink-0 text-hub-blue" aria-hidden />
      <dd>{children}</dd>
    </div>
  );
}
