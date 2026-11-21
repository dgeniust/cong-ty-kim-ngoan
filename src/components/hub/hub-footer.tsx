import Link from "next/link";
import { telHref } from "@/lib/verticals";
import { Wordmark } from "@/components/shared/wordmark";
import { getSettings } from "@/lib/settings/server";

export async function HubFooter() {
  const { COMPANY, VERTICAL_LIST } = await getSettings();
  return (
    <footer className="bg-hub-ink text-white/65">
      <div className="mx-auto grid max-w-[1280px] gap-12 px-5 py-16 sm:px-8 md:grid-cols-[1.4fr_1fr_1fr] lg:px-12 lg:py-20">
        <div>
          <p className="flex items-center gap-3 text-white">
            <Wordmark label={COMPANY.legalName} className="h-7 w-auto" />
            <span aria-hidden className="flex gap-1">
              <span className="size-2 rounded-full bg-sector-phanbon" />
              <span className="size-2 rounded-full bg-sector-lopxe" />
              <span className="size-2 rounded-full bg-sector-satthep" />
            </span>
          </p>
          <p className="mt-5 text-title font-semibold text-white">{COMPANY.slogan}</p>
          <p className="mt-3 max-w-sm text-body leading-relaxed">
            {COMPANY.legalName}. Phân bón, lốp xe ô tô, tôn sắt thép tại {COMPANY.address}.
          </p>
        </div>
        <nav aria-label="Chuyên trang">
          <p className="text-[12px] font-semibold uppercase tracking-[0.14em] text-white">Chuyên trang</p>
          <ul className="mt-4 space-y-2.5 text-body">
            {VERTICAL_LIST.map((v) => (
              <li key={v.id}>
                <Link href={v.base} className="transition-colors hover:text-white">{v.name}</Link>
              </li>
            ))}
            <li>
              <Link href="/tin-tuc" className="transition-colors hover:text-white">Tin tức</Link>
            </li>
          </ul>
        </nav>
        <address className="not-italic">
          <p className="text-[12px] font-semibold uppercase tracking-[0.14em] text-white">Liên hệ</p>
          <ul className="mt-4 space-y-2.5 text-body">
            <li>
              <a href={telHref(COMPANY.hotline)} className="font-semibold tabular-nums text-white hover:underline">{COMPANY.hotline}</a>
            </li>
            <li>
              <a href={`mailto:${COMPANY.email}`} className="hover:text-white">{COMPANY.email}</a>
            </li>
            <li>{COMPANY.address}</li>
          </ul>
        </address>
      </div>
      <div className="mx-auto max-w-[1280px] px-5 sm:px-8 lg:px-12">
        <p className="border-t border-white/10 py-6 text-caption text-white/50">
          © {new Date().getFullYear()} {COMPANY.legalName}. Bảo lưu mọi quyền.
        </p>
      </div>
    </footer>
  );
}
