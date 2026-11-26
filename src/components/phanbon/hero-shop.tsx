import Link from "next/link";
import { ArrowRight, BadgeCheck, HeartHandshake, Leaf, Phone, Truck } from "lucide-react";
import { HeroSearch } from "@/components/phanbon/hero-search";
import { telHref } from "@/lib/verticals";
import type { LabelProduct } from "./npk-label";
import { BrandMarquee } from "./brand-marquee";
import { HeroCropPanel, type HeroCrop } from "./hero-crop-panel";

export type { HeroCrop };

/** Icons for the four trust points (CMS "features"), in order. */
const TRUST = [BadgeCheck, Truck, HeartHandshake, Leaf];

/**
 * Shop-style fertilizer banner: what is sold is obvious at a glance.
 *  Left: headline naming the products + search + brand strip + order by phone + 4 trust points (CMS).
 *  Right (HeroCropPanel, client): real photo of the selected crop's garden, crop picker, 3 suggested products.
 * The selected crop is shared with the rest of the page (bulletin, suggestions…).
 */
export function HeroShop({ crops, products, features, phone, srCompany }: { crops: HeroCrop[]; products: LabelProduct[]; features: { title: string; description: string }[]; phone: string; srCompany: string }) {
  return (
    <div className="grid grid-cols-1 gap-8 pb-16 pt-8 md:pb-24 md:pt-10 lg:grid-cols-12 lg:items-stretch lg:gap-10 [&>*]:min-w-0">
      {/* LEFT */}
      <div className="flex flex-col justify-center lg:col-span-6">
        <h1 id="hero-title" className="text-h1 font-semibold text-brand-900">
          <span className="sr-only">{srCompany} – </span>
          Phân bón, thuốc BVTV <span className="text-brand-600">đúng cho từng vườn</span>
        </h1>
        <p className="mt-4 max-w-xl text-lead leading-relaxed text-ink-muted">Phân NPK, hữu cơ, vi sinh và thuốc bảo vệ thực vật cho cà phê, cao su, sầu riêng, tiêu, lúa, cây ăn trái và rau màu. Tư vấn đúng loại, giao tận vườn.</p>

        <div className="mt-6 max-w-xl">
          <HeroSearch quick={false} />
        </div>

        <BrandMarquee />

        <div className="mt-7 flex flex-wrap items-center gap-3">
          <a href={telHref(phone)} className="inline-flex h-12 items-center gap-2 rounded-full bg-sun-300 px-6 text-body font-semibold text-brand-900 transition-colors hover:bg-sun-400">
            <Phone className="size-4" aria-hidden /> Liên hệ · <span className="tabular-nums">{phone}</span>
          </a>
          <Link href="/phanbon/san-pham" className="group inline-flex h-12 items-center gap-2 rounded-full px-5 text-body font-semibold text-brand-900 ring-1 ring-brand-900/20 transition-colors hover:bg-brand-900 hover:text-white">
            Xem tất cả sản phẩm <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" aria-hidden />
          </Link>
        </div>

        {features.length > 0 && (
          <ul className="mt-8 grid grid-cols-2 gap-x-6 gap-y-3 border-t border-brand-900/10 pt-6 sm:grid-cols-4">
            {features.slice(0, 4).map((f, i) => {
              const Icon = TRUST[i % TRUST.length];
              return (
                <li key={f.title} className="flex items-start gap-2 text-small leading-snug text-brand-900">
                  <Icon className="mt-0.5 size-4 shrink-0 text-brand-600" aria-hidden />
                  <span className="font-medium">{f.title}</span>
                </li>
              );
            })}
          </ul>
        )}
      </div>

      <HeroCropPanel crops={crops} products={products} />
    </div>
  );
}
