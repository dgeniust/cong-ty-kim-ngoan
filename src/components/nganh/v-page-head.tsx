import Link from "next/link";
import { JsonLd } from "@/components/shared/json-ld";
import { absoluteUrl } from "@/lib/site";
import type { Vertical } from "@/lib/verticals";
import { VContainer } from "./v-section";

export type VCrumb = { label: string; href?: string };

/** Đầu trang con: breadcrumb (kèm schema.org BreadcrumbList) + H1 lớn. */
export function VPageHead({ vertical, crumbs, title, lead, children }: { vertical: Vertical; crumbs: VCrumb[]; title: string; lead?: string; children?: React.ReactNode }) {
  const trail: VCrumb[] = [{ label: "Kim Ngoan", href: "/" }, { label: vertical.short, href: vertical.base }, ...crumbs];
  return (
    <div className="bg-v-raise">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: trail.map((c, i) => ({ "@type": "ListItem", position: i + 1, name: c.label, ...(c.href ? { item: absoluteUrl(c.href) } : {}) })),
        }}
      />
      <VContainer className="py-10 md:py-16">
        <nav aria-label="Đường dẫn">
          <ol className="v-label flex flex-wrap items-center gap-x-2.5 gap-y-1 text-xs text-v-mute">
            {trail.map((c, i) => (
              <li key={i} className="flex items-center gap-2.5">
                {i > 0 && <span aria-hidden className="text-v-mark">/</span>}
                {c.href && i < trail.length - 1 ? (
                  <Link href={c.href} className="transition-colors hover:text-v-fg">{c.label}</Link>
                ) : (
                  <span aria-current="page" className="max-w-[60vw] truncate text-v-fg">{c.label}</span>
                )}
              </li>
            ))}
          </ol>
        </nav>
        <h1 className="v-display animate-rise mt-5 max-w-5xl text-[clamp(2.5rem,7vw,6rem)] text-v-fg">{title}</h1>
        {lead && <p className="animate-rise mt-5 max-w-2xl text-lg leading-relaxed text-v-mute" style={{ animationDelay: "120ms" }}>{lead}</p>}
        {children}
      </VContainer>
    </div>
  );
}
