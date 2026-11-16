import Link from "next/link";
import { COMPANY, VERTICAL_LIST, telHref } from "@/lib/verticals";

export function HubFooter() {
  return (
    <footer className="bg-hub-ink text-white/70">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-[1.4fr_1fr_1fr] lg:px-8">
        <div>
          <p className="text-[11px] font-semibold tracking-[0.2em] text-white/50">{COMPANY.prefix}</p>
          <p className="mt-1 text-3xl font-bold tracking-tight text-white">{COMPANY.name}</p>
          <p className="mt-3 max-w-sm text-[15px] leading-relaxed">{COMPANY.slogan}. Phân bón – lốp xe ô tô – tôn sắt thép tại {COMPANY.address}.</p>
        </div>
        <nav aria-label="Chuyên trang">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-white/50">Chuyên trang</p>
          <ul className="mt-3 space-y-2 text-[15px]">
            {VERTICAL_LIST.map((v) => (
              <li key={v.id}><Link href={v.base} className="transition-colors hover:text-white">{v.name}</Link></li>
            ))}
            <li><Link href="/tin-tuc" className="transition-colors hover:text-white">Tin tức</Link></li>
          </ul>
        </nav>
        <address className="not-italic">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-white/50">Liên hệ</p>
          <ul className="mt-3 space-y-2 text-[15px]">
            <li><a href={telHref(COMPANY.hotline)} className="font-semibold tabular-nums text-white hover:underline">{COMPANY.hotline}</a></li>
            <li><a href={`mailto:${COMPANY.email}`} className="hover:text-white">{COMPANY.email}</a></li>
            <li>{COMPANY.address}</li>
          </ul>
        </address>
      </div>
      <p className="mx-auto max-w-7xl px-4 pb-8 text-[13px] text-white/45 sm:px-6 lg:px-8">© {new Date().getFullYear()} {COMPANY.legalName}. Bảo lưu mọi quyền.</p>
    </footer>
  );
}
