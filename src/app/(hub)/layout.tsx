import type { Viewport } from "next";
import { HubFooter } from "@/components/hub/hub-footer";
import { HubFloating } from "@/components/hub/hub-floating";
import { HubHeader } from "@/components/hub/hub-header";
import { JsonLd } from "@/components/shared/json-ld";
import { absoluteUrl } from "@/lib/site";
import { COMPANY, VERTICAL_LIST, telHref } from "@/lib/verticals";

export const viewport: Viewport = { themeColor: "#fdfcfc" };

/** Landing tổng của công ty – điều hướng về 3 chuyên trang. */
export default function HubLayout({ children }: { children: React.ReactNode }) {
  const organization = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": absoluteUrl("/#to-chuc"),
    name: COMPANY.legalName,
    slogan: COMPANY.slogan,
    url: absoluteUrl("/"),
    email: COMPANY.email,
    telephone: COMPANY.hotline,
    address: { "@type": "PostalAddress", streetAddress: COMPANY.address, addressCountry: "VN" },
    sameAs: [COMPANY.facebook, COMPANY.zalo],
    contactPoint: VERTICAL_LIST.map((v) => ({ "@type": "ContactPoint", contactType: v.name, telephone: v.phone, areaServed: "VN", availableLanguage: "vi" })),
    department: VERTICAL_LIST.map((v) => ({ "@type": "Store", name: `${COMPANY.legalName} – ${v.name}`, url: absoluteUrl(v.base), telephone: v.phone })),
  };
  const website = { "@context": "https://schema.org", "@type": "WebSite", name: COMPANY.legalName, url: absoluteUrl("/"), inLanguage: "vi" };

  return (
    <div className="theme-hub min-h-screen bg-hub-paper text-hub-ink">
      <JsonLd data={[organization, website]} />
      <HubHeader />
      <main id="noi-dung" tabIndex={-1} className="outline-none">{children}</main>
      <HubFooter />
      <HubFloating phone={COMPANY.hotline} phoneHref={telHref(COMPANY.hotline)} zalo={COMPANY.zalo} />
    </div>
  );
}
