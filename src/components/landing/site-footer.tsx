import { telHref } from "@/lib/verticals";
import Link from "next/link";
import { Container } from "@/components/shared/container";
import { Logo } from "@/components/shared/logo";
import type { SiteContent } from "@/lib/content/schema";
import { categories } from "@/lib/mock/categories";
import { resolveHref } from "@/lib/site";

const FOOTER_CATEGORIES = categories.filter((c) => c.parent).slice(0, 6);
const linkCls = "text-body text-ink-muted transition-colors hover:text-brand-900";

function Column({ title, children, label }: { title: string; children: React.ReactNode; label?: string }) {
  return (
    <nav aria-label={label ?? title}>
      <h2 className="text-h4 font-semibold text-brand-900">{title}</h2>
      <ul className="mt-5 space-y-3">{children}</ul>
    </nav>
  );
}

/** Light footer, four columns (design.md §5.10). */
export function SiteFooter({ site, footer }: { site: SiteContent["site"]; footer: SiteContent["footer"] }) {
  return (
    <footer className="bg-surface-strong">
      <Container className="grid gap-12 py-16 sm:grid-cols-2 lg:grid-cols-[1.5fr_1fr_1fr_1.3fr] lg:gap-10 lg:py-20">
        <div className="max-w-sm">
          <Logo prefix={site.companyPrefix} name={site.companyName} slogan="" logo={site.logo} />
          <p className="mt-6 text-body leading-relaxed text-ink-muted">{site.seoDescription}</p>
          <p className="mt-5 text-body font-medium text-brand-700">
            {footer.sloganLine1} – {footer.sloganLine2}
          </p>
        </div>

        <Column title="Sản phẩm" label="Danh mục sản phẩm">
          {FOOTER_CATEGORIES.map((c) => (
            <li key={c.slug}>
              <Link href={`/phanbon/danh-muc/${c.slug}`} className={linkCls}>
                {c.name}
              </Link>
            </li>
          ))}
          <li>
            <Link href="/phanbon/san-pham" className={linkCls}>
              Tất cả sản phẩm
            </Link>
          </li>
        </Column>

        <Column title="Kim Ngoan" label="Liên kết">
          {footer.links.map((l, i) => (
            <li key={i}>
              <Link href={resolveHref(l.href)} className={linkCls}>
                {l.label}
              </Link>
            </li>
          ))}
          <li>
            <Link href="/phanbon/tim-kiem" className={linkCls}>
              Tìm kiếm
            </Link>
          </li>
        </Column>

        <div>
          <h2 className="text-h4 font-semibold text-brand-900">Liên hệ</h2>
          <address className="mt-5 space-y-3 not-italic">
            <a href={telHref(site.phone)} className="block text-h3 font-medium tabular-nums text-brand-900 hover:text-brand-700">
              {site.phone}
            </a>
            <a href={`mailto:${site.email}`} className={`block ${linkCls}`}>
              {site.email}
            </a>
            <p className="text-body text-ink-muted">{site.address}</p>
            <p className="text-body text-ink-muted">Thứ 2 – Chủ nhật, 7:00 – 18:00</p>
          </address>
          {site.facebook && (
            <a
              href={site.facebook}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 inline-flex h-9 items-center gap-2 rounded-full bg-white px-4 text-small font-medium text-brand-900 transition-shadow hover:shadow-soft"
            >
              <svg viewBox="0 0 24 24" className="size-4" fill="currentColor" aria-hidden>
                <path d="M13.5 21v-7.5h2.5l.4-3h-2.9V8.6c0-.9.3-1.5 1.5-1.5h1.5V4.4c-.3 0-1.2-.1-2.2-.1-2.2 0-3.7 1.3-3.7 3.8v2.4H8v3h2.6V21h2.9Z" />
              </svg>
              Facebook Kim Ngoan
            </a>
          )}
        </div>
      </Container>

      <Container className="flex flex-col gap-2 pb-8 pt-2 text-caption text-ink-subtle sm:flex-row sm:justify-between">
        <p>{footer.copyright}</p>
        <p>{site.slogan}</p>
      </Container>
    </footer>
  );
}
