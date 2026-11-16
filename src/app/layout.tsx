import type { Metadata } from "next";
import "@fontsource/be-vietnam-pro/vietnamese-400.css";
import "@fontsource/be-vietnam-pro/vietnamese-500.css";
import "@fontsource/be-vietnam-pro/vietnamese-600.css";
import "@fontsource/be-vietnam-pro/vietnamese-700.css";
import "@fontsource/be-vietnam-pro/latin-400.css";
import "@fontsource/be-vietnam-pro/latin-500.css";
import "@fontsource/be-vietnam-pro/latin-600.css";
import "@fontsource/be-vietnam-pro/latin-700.css";
// Phân bón: chữ viết tay cho trích dẫn
import "@fontsource/dancing-script/vietnamese-600.css";
import "@fontsource/dancing-script/latin-600.css";
// Lốp xe: Barlow Condensed (tiêu đề)
import "@fontsource/barlow-condensed/vietnamese-700-italic.css";
import "@fontsource/barlow-condensed/vietnamese-800-italic.css";
import "@fontsource/barlow-condensed/latin-700-italic.css";
import "@fontsource/barlow-condensed/latin-800-italic.css";
// Sắt thép: Archivo (tiêu đề)
import "@fontsource/archivo/vietnamese-700.css";
import "@fontsource/archivo/vietnamese-900.css";
import "@fontsource/archivo/latin-700.css";
import "@fontsource/archivo/latin-900.css";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import { SITE_URL } from "@/lib/site";
import { COMPANY } from "@/lib/verticals";

const TITLE = "Công ty TNHH Kim Ngoan – Phân bón, lốp xe ô tô, tôn sắt thép";
const DESCRIPTION =
  "Kim Ngoan kinh doanh phân bón & thuốc BVTV, lốp xe ô tô và tôn – sắt thép tại Chơn Thành. Hàng chính hãng, giá minh bạch, giao tận nơi.";

/** Metadata gốc (landing tổng). Mỗi chuyên trang ghi đè title/description trong layout riêng. */
export const metadata: Metadata = {
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
