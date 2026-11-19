"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Phone } from "lucide-react";
import { telHref, type VerticalId } from "@/lib/verticals";
import { cn } from "@/lib/utils";

export type Door = {
  id: VerticalId;
  name: string;
  audience: string;
  description: string;
  href: string;
  host: string;
  phone: string;
  image: string;
  count: number;
  groups: { name: string; href: string }[];
};

/** Tấm chữ dưới mỗi cửa: mảng màu phẳng của ngành (không gradient), khớp theme chuyên trang. */
const PLATE: Record<VerticalId, { plate: string; mute: string; chip: string; dot: string; cta: string }> = {
  phanbon: { plate: "bg-brand-900 text-white", mute: "text-white/70", chip: "bg-white/10 text-white hover:bg-white/20", dot: "bg-sector-phanbon", cta: "text-sun-300" },
  lopxe: { plate: "bg-lopxe-ink text-white", mute: "text-white/65", chip: "bg-white/10 text-white hover:bg-white/20", dot: "bg-sector-lopxe", cta: "text-lopxe-orange" },
  satthep: { plate: "bg-hub-paper text-hub-ink", mute: "text-hub-ink-soft", chip: "bg-hub-canvas text-hub-ink hover:bg-hub-stone", dot: "bg-sector-satthep", cta: "text-hub-ink" },
};

/**
 * “Ba cánh cửa”: ba tấm ảnh dọc đứng cạnh nhau, mỗi tấm dẫn vào một chuyên trang.
 * Desktop: rê chuột / tab tới tấm nào thì tấm đó nở rộng và hiện nhóm hàng; hai tấm kia co lại, tối đi.
 * Di động: ba dải ngang xếp chồng, chạm là vào thẳng chuyên trang.
 */
export function HubDoors({ doors }: { doors: Door[] }) {
  const [active, setActive] = useState(0);

  return (
    <ul className="flex flex-col gap-2 lg:h-[clamp(500px,68vh,640px)] lg:flex-row">
      {doors.map((d, i) => {
        const on = active === i;
        const T = PLATE[d.id];
        return (
          <li
            key={d.id}
            onMouseEnter={() => setActive(i)}
            onFocus={() => setActive(i)}
            data-active={on || undefined}
            className="group relative flex h-[19rem] min-w-0 flex-col justify-between overflow-hidden shrink-0 rounded-xl bg-hub-stone transition-[flex-grow] lg:shrink lg:basis-0 duration-500 ease-soft sm:h-[22rem] lg:h-auto"
            style={{ flexGrow: on ? 2.4 : 1 }}
          >
            <Image
              src={d.image}
              alt=""
              fill
              loading={i === 0 ? "eager" : undefined}
              sizes="(min-width: 1024px) 55vw, 100vw"
              className={cn("object-cover transition-[transform,filter] duration-700 ease-soft", on ? "lg:scale-100" : "lg:scale-[1.06] lg:brightness-[0.72] lg:saturate-[0.85]")}
            />

            {/* hàng trên: địa chỉ chuyên trang + số thứ tự */}
            <div className="relative flex items-start justify-between gap-3 p-3">
              <p className="inline-flex items-center gap-2 rounded-md bg-hub-paper px-2.5 py-1 text-micro text-hub-ink">
                <span aria-hidden className={cn("size-2 rounded-full", T.dot)} /> {d.host}
              </p>
              <span aria-hidden className="rounded-md bg-hub-paper px-2 py-1 text-micro font-semibold tabular-nums text-hub-ink">0{i + 1}</span>
            </div>

            {/* tấm chữ */}
            <div className={cn("relative m-2 rounded-lg p-5 sm:p-6", T.plate)}>
              <p className={cn("text-caption", T.mute)}>
                Cho {d.audience} · <span className="tabular-nums">{d.count}</span> sản phẩm
              </p>
              <h2 className="text-h3 mt-1.5 font-semibold !text-current">
                <Link href={d.href} className="rounded-sm after:absolute after:inset-0 after:content-['']">
                  {d.name}
                </Link>
              </h2>

              {/* phần mở rộng – chỉ desktop, chỉ cửa đang mở */}
              <div className={cn("hidden transition-[grid-template-rows,opacity] duration-500 ease-soft lg:grid", on ? "grid-rows-[1fr] opacity-100 delay-150" : "grid-rows-[0fr] opacity-0")} aria-hidden={!on}>
                <div className="min-h-0 overflow-hidden">
                  <p className={cn("mt-3 max-w-lg text-body leading-relaxed", T.mute)}>{d.description}</p>
                  <ul className="relative z-10 mt-4 flex flex-wrap gap-1.5">
                    {d.groups.map((g) => (
                      <li key={g.href}>
                        <Link href={g.href} tabIndex={on ? 0 : -1} className={cn("inline-flex h-8 items-center rounded-full px-3 text-caption transition-colors duration-200", T.chip)}>
                          {g.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="relative z-10 mt-5 flex flex-wrap items-center justify-between gap-x-4 gap-y-2">
                <a href={telHref(d.phone)} className="inline-flex min-h-11 items-center gap-2 text-body font-medium tabular-nums hover:underline">
                  <Phone className="size-4" aria-hidden /> {d.phone}
                </a>
                <span aria-hidden className={cn("inline-flex items-center gap-1 text-small font-semibold", T.cta)}>
                  Vào chuyên trang <ArrowUpRight className="size-4 transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                </span>
              </div>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
