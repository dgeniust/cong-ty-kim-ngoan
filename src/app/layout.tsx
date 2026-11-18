import type { Metadata } from "next";
import "@fontsource/be-vietnam-pro/vietnamese-400.css";
import "@fontsource/be-vietnam-pro/vietnamese-500.css";
import "@fontsource/be-vietnam-pro/vietnamese-600.css";
import "@fontsource/be-vietnam-pro/vietnamese-700.css";
import "@fontsource/be-vietnam-pro/latin-400.css";
import "@fontsource/be-vietnam-pro/latin-500.css";
import "@fontsource/be-vietnam-pro/latin-600.css";
import "@fontsource/be-vietnam-pro/latin-700.css";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import { SITE_URL } from "@/lib/site";
import { getSettings } from "@/lib/settings/server";


/** Metadata gốc (landing tổng). Mỗi chuyên trang ghi đè title/description trong layout riêng. */
export async function generateMetadata(): Promise<Metadata> {
  const { COMPANY } = await getSettings();
  const TITLE = `${COMPANY.legalName} – Phân bón, lốp xe ô tô, tôn sắt thép`;
  const DESCRIPTION = `${COMPANY.legalName} kinh doanh phân bón & thuốc BVTV, lốp xe ô tô và tôn – sắt thép tại ${COMPANY.area}. Hàng chính hãng, giá minh bạch, giao tận nơi.`;
  return {
  metadataBase: new URL(SITE_URL),
  title: { default: TITLE, template: "%s | Kim Ngoan" },
  description: DESCRIPTION,
  applicationName: COMPANY.legalName,
  alternates: { canonical: "/" },
  openGraph: { type: "website", locale: "vi_VN", siteName: COMPANY.legalName, title: TITLE, description: DESCRIPTION, url: "/" },
  twitter: { card: "summary_large_image", title: TITLE, description: DESCRIPTION },
  formatDetection: { telephone: false },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 } },
  // Sau khi xác minh Search Console: verification: { google: "..." },
  };
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="vi">
      <body>
        {/* Không có JS thì nội dung .reveal vẫn hiện đầy đủ */}
        <noscript>
          <style>{".reveal{opacity:1!important;transform:none!important}"}</style>
        </noscript>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
