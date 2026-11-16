import Link from "next/link";
import { Mail, MapPin, Phone } from "lucide-react";
import type { CatalogCategory } from "@/lib/data/types";
import { COMPANY, VERTICAL_LIST, telHref, type Vertical } from "@/lib/verticals";

export function VFooter({ vertical, categories }: { vertical: Vertical; categories: CatalogCategory[] }) {
  return (
    <footer className="bg-v-invert pb-24 text-v-on-invert lg:pb-0">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
        <p className="v-display text-[clamp(3rem,11vw,9rem)] opacity-95">{COMPANY.name}</p>
        <div className="mt-12 grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <p className="v-label text-sm opacity-60">{vertical.name}</p>
            <p className="mt-3 max-w-xs text-[15px] leading-relaxed opacity-80">{vertical.description}</p>
          </div>
          <nav aria-label="Danh mục sản phẩm">
            <p className="v-label text-sm opacity-60">Sản phẩm</p>
            <ul className="mt-3 space-y-2 text-[15px]">
              {categories.map((c) => (
                <li key={c.slug}>
                  <Link href={`${vertical.base}/san-pham?nhom=${c.slug}`} className="opacity-85 transition-opacity hover:opacity-100 hover:underline underline-offset-4">
                    {c.name}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <nav aria-label="Lĩnh vực khác của Kim Ngoan">
            <p className="v-label text-sm opacity-60">Kim Ngoan</p>
            <ul className="mt-3 space-y-2 text-[15px]">
              <li>
                <Link href="/" className="opacity-85 hover:opacity-100 hover:underline underline-offset-4">Trang chủ công ty</Link>
              </li>
              {VERTICAL_LIST.filter((v) => v.id !== vertical.id).map((v) => (
                <li key={v.id}>
                  <Link href={v.base} className="opacity-85 hover:opacity-100 hover:underline underline-offset-4">{v.name}</Link>
                </li>
              ))}
              <li>
                <Link href={`${vertical.base}/tin-tuc`} className="opacity-85 hover:opacity-100 hover:underline underline-offset-4">Tin tức</Link>
              </li>
            </ul>
          </nav>
          <address className="not-italic">
            <p className="v-label text-sm opacity-60">Liên hệ</p>
            <ul className="mt-3 space-y-2.5 text-[15px]">
              <li className="flex gap-2.5"><Phone className="mt-1 size-4 shrink-0" aria-hidden /><a href={telHref(vertical.phone)} className="font-semibold tabular-nums hover:underline underline-offset-4">{vertical.phone}</a></li>
              <li className="flex gap-2.5"><Mail className="mt-1 size-4 shrink-0" aria-hidden /><a href={`mailto:${COMPANY.email}`} className="opacity-85 hover:underline underline-offset-4">{COMPANY.email}</a></li>
              <li className="flex gap-2.5"><MapPin className="mt-1 size-4 shrink-0" aria-hidden /><span className="opacity-85">{COMPANY.address}</span></li>
            </ul>
          </address>
        </div>
        <p className="mt-14 text-[13px] opacity-60">© {new Date().getFullYear()} {COMPANY.legalName}. Bảo lưu mọi quyền.</p>
      </div>
    </footer>
  );
}
