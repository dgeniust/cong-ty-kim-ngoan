# Công ty TNHH Kim Ngoan – website đa chuyên trang

Next.js (App Router) + TypeScript + Tailwind CSS v4 + shadcn/ui.

| URL | Nội dung | Theme |
| --- | --- | --- |
| `/` | Landing tổng: hero (tiêu đề đồng bộ với slideshow 3 ngành, 5 giây/hình), số liệu, 3 chuyên trang, thương hiệu, lý do chọn, sản phẩm theo ngành, giới thiệu + quy trình, tin mới nhất (tất cả ngành), hỏi đáp, liên hệ + bản đồ | Phong cách Notion (nhánh `fe/notion-style-v1`): nền giấy ấm, thẻ trắng viền mảnh, một nút xanh chính, mảng màu phẳng |
| `/phanbon` | Chuyên trang phân bón & thuốc BVTV – giữ nguyên từ nhánh `fe/vuon-xanh-v1` của repo `cong-ty-phan-bon` | "Vườn Xanh" xanh lá + vàng |
| `/lopxe` | Chuyên trang lốp xe ô tô | Nâu-đen ấm + chữ kem IN HOA, kẻ đứt mảnh, thẻ vuông, gần như không animation |
| `/satthep` | Chuyên trang tôn – sắt thép | Đen lạnh + trắng + một điểm vàng chanh, bảng quy cách, thẻ vuông, gần như không animation |
| `/tin-tuc` | Tất cả tin tức, lọc `?nganh=phanbon|lopxe|satthep` | |
| `/admin` | CMS nội dung chuyên trang phân bón (như cũ) | |

## Cấu trúc

```
src/app/(hub)/                 landing tổng + /tin-tuc
src/app/(phanbon)/phanbon/     chuyên trang phân bón (code cũ, chỉ đổi tiền tố link)
src/app/(nganh)/[site]/        route dùng chung cho lopxe & satthep (generateStaticParams)
src/app/api/tin-tuc/route.ts   GET /api/tin-tuc?site=&limit=
src/lib/verticals.ts           thông tin công ty + 3 chuyên trang (SĐT, SEO, địa chỉ)  ← SỬA Ở ĐÂY
src/lib/data/news.ts           getNews({ site?, limit? }) – nguồn tin duy nhất
src/lib/data/{lopxe,satthep}.ts  dữ liệu mẫu sản phẩm
src/components/nganh/          component theo theme (token CSS --v-*)
src/components/hub/            component landing tổng
```

### Tin tức
- Landing tổng gọi `getNews()` → không lọc.
- Chuyên trang gọi `getNews({ site })` → lọc theo chuyên trang.
- Khi có backend: thay thân hàm `getNews` bằng `fetch`, giữ nguyên chữ ký.

### Theme lốp xe / sắt thép
Hai theme dùng chung component, khác nhau qua biến CSS trong `globals.css`
(`.theme-lopxe`, `.theme-satthep`): màu, cỡ/kiểu chữ tiêu đề, bo góc, kiểu kẻ phân cách.
Toàn hệ thống dùng một font: Be Vietnam Pro (phân bón có thêm Dancing Script cho trích dẫn).
Nguyên tắc: không viền card – tách khối bằng mảng màu và khoảng trắng.

### Hình sản phẩm
Lốp xe và sắt thép đang dùng **hình minh hoạ vector** (`components/nganh/product-art.tsx`).
Khi có ảnh chụp thật: đặt vào `/public`, điền `images: ["/ten-anh.jpg"]` cho sản phẩm – ảnh sẽ tự thay hình minh hoạ.

## SEO
- `metadataBase`, title template, canonical cho mọi trang; Open Graph theo từng chuyên trang.
- `sitemap.xml`, `robots.txt` sinh tự động.
- JSON-LD: `Organization` + `WebSite` (landing tổng), `Store`/`TireShop`/`HardwareStore`, `Product`, `Article`, `BreadcrumbList`.
- Trang sản phẩm/tin tức được prerender tĩnh (SSG).

## Trước khi go-live
1. `NEXT_PUBLIC_SITE_URL=https://kimngoan.com`
2. Sửa SĐT, địa chỉ, Zalo, Facebook, năm thành lập, `mapQuery` trong `src/lib/verticals.ts` (đang là số mẫu).
3. Thay dữ liệu mẫu sản phẩm/tin tức, thêm ảnh thật.
4. Thêm mã xác minh Google Search Console vào `metadata.verification` (`src/app/layout.tsx`) và submit sitemap.

## Chạy
```bash
npm install
npm run dev     # http://localhost:3000
npm run build && npm start
```
