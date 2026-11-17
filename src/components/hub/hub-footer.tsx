import Link from "next/link";
import { COMPANY, VERTICAL_LIST, telHref } from "@/lib/verticals";

export function HubFooter() {
  return (
    <footer className="border-t border-hub-line bg-hub-paper text-hub-ink-soft">
      <div className="mx-auto grid max-w-[1400px] gap-10 px-4 py-14 sm:px-6 md:grid-cols-[1.4fr_1fr_1fr] lg:px-10">
        <div>
          <p className="flex items-center gap-2 text-2xl font-semibold tracking-tight text-hub-ink">
            {COMPANY.name}
            <span aria-hidden className="flex gap-1">
              <span className="size-2 rounded-full bg-sector-phanbon" />
              <span className="size-2 rounded-full bg-sector-lopxe" />
              <span className="size-2 rounded-full bg-sector-satthep" />
            </span>
          </p>
          <p className="mt-3 max-w-sm text-[15px] leading-relaxed">
            {COMPANY.legalName}. Phân bón, lốp xe ô tô, tôn sắt thép tại {COMPANY.address}.
          </p>
        </div>
        <nav aria-label="Chuyên trang">
          <p className="text-sm text-hub-ink">Chuyên trang</p>
          <ul className="mt-3 space-y-2 text-[15px]">
            {VERTICAL_LIST.map((v) => (
              <li key={v.id}>
                <Link href={v.base} className="transition-colors hover:text-hub-ink">{v.name}</Link>
              </li>
            ))}
            <li>
              <Link href="/tin-tuc" className="transition-colors hover:text-hub-ink">Tin tức</Link>
            </li>
          </ul>
        </nav>
        <address className="not-italic">
          <p className="text-sm text-hub-ink">Liên hệ</p>
          <ul className="mt-3 space-y-2 text-[15px]">
            <li>
              <a href={telHref(COMPANY.hotline)} className="font-medium tabular-nums text-hub-ink hover:underline">{COMPANY.hotline}</a>
            </li>
            <li>
              <a href={`mailto:${COMPANY.email}`} className="hover:text-hub-ink">{COMPANY.email}</a>
            </li>
            <li>{COMPANY.address}</li>
          </ul>
        </address>
      </div>
      <p className="mx-auto max-w-[1400px] border-t border-hub-line px-4 py-6 text-[13px] sm:px-6 lg:px-10">
        © {new Date().getFullYear()} {COMPANY.legalName}. Bảo lưu mọi quyền.
      </p>
    </footer>
  );
}
