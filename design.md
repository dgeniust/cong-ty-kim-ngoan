# Design – "Vườn Xanh" v1

Tài liệu thiết kế cho landing page Kim Ngoan theo phong cách tham chiếu (Earthmade / Aromacup), chuyển thể cho một đại lý phân bón & thuốc BVTV.

- Nhánh: `fe/vuon-xanh-v1` (tách từ `fe/uiux`)
- Stack: Next.js (App Router) · Tailwind CSS v4 · TypeScript · shadcn/ui
- Phạm vi: trang chủ `/` + header, footer dùng chung. Trang con giữ bố cục của `fe/uiux`, chỉ nhận token mới.

---

## 1. Phân tích ảnh tham chiếu

| Đặc điểm trong ảnh mẫu | Vai trò | Có dùng không |
|---|---|---|
| Nền trắng ngả xám rất nhạt, nhiều khoảng trống | Cảm giác sạch, cao cấp | **Có** – đổi sang trắng ngả xanh lá |
| Tiêu đề sans cỡ lớn, nét vừa (500), không in hoa | Thanh lịch, dễ đọc | **Có** |
| Sản phẩm đặt trong khối **vòm** (arch) màu nhạt | Điểm nhấn nhận diện | **Có** – vòm xanh lá non |
| Nút **viên thuốc** (pill) màu tối + nút viền | Hành động chính/phụ rõ ràng | **Có** – nút xanh rừng đậm |
| Menu nằm trong một **thanh bo tròn nổi** | Gọn, hiện đại | **Có** |
| Bộ số liệu lớn (40k+ / 100%) | Tạo niềm tin nhanh | **Có** – số năm, số nhà vườn, số sản phẩm |
| "Colors available" – các chấm tròn | Cho người xem lựa chọn | **Có, chuyển nghĩa** → "Bạn trồng cây gì?" (ảnh tròn cây trồng) |
| Khối ảnh – chữ xen kẽ trái/phải | Kể chuyện từng tính năng | **Có** – mỗi nhóm sản phẩm một khối |
| Hàng ảnh tròn (các loại nắp) | Trình bày biến thể | **Có** – hàng cây trồng tiêu biểu |
| Form đăng ký với ô gạch chân | Thu lead nhẹ nhàng | **Có** – form "Gọi lại tư vấn" |
| Nét vẽ tay (mũi tên, xoắn, ngôi sao) | Thân thiện, có cá tính | **Có, tiết chế** – tối đa 1 nét/section, chỉ ở desktop |
| Giá bán to ($59.00) + Order now | Mua ngay | **Không** – phân bón bán theo báo giá/số lượng → thay bằng số điện thoại + "Gọi đặt hàng" |
| Avatar khách hàng "37k reviews" | Bằng chứng xã hội | **Không** – không có ảnh khách thật; không dùng ảnh giả. Thay bằng số liệu nhà vườn |
| Nút play video | Xem video | **Không** – chưa có video |

### Kết luận về độ phù hợp

Style này **phù hợp có điều kiện**:

- ✅ Bố cục thoáng, khối vòm, nút pill và tiêu đề nét vừa làm thương hiệu trông **chuyên nghiệp, đáng tin** hơn hẳn một trang đại lý thông thường.
- ✅ Ảnh mẫu được thiết kế cho **một sản phẩm** – Kim Ngoan có **nhiều nhóm sản phẩm**, nên phần hero không "khoe" một sản phẩm mà khoe **khả năng tìm đúng sản phẩm cho đúng cây**.
- ⚠️ Ảnh mẫu dựa vào **ảnh sản phẩm tách nền** (packshot). Ảnh bao phân hiện tại là ảnh chụp có nền → cần chụp/tách nền bao bì để khối vòm đạt hiệu quả cao nhất (xem §9).
- ⚠️ Nét vẽ tay rất dễ thành "trang trí thừa". Chỉ giữ ở những chỗ có ý nghĩa dẫn mắt (mũi tên chỉ vào ô tìm kiếm, chỉ vào nút gọi).

---

## 2. Nguyên tắc

1. **Tìm được sản phẩm trong 1 thao tác.** Ô tìm kiếm có trong hero, không ẩn sau icon. Gợi ý nhanh theo cây trồng ngay bên dưới.
2. **Người mới không phải đoán.** Mỗi khối chỉ có một hành động chính. Nhãn nút nói rõ việc sẽ xảy ra: "Gọi đặt hàng", "Xem phân bón", "Gọi lại cho tôi".
3. **Gọi điện luôn trong tầm tay.** Header (desktop) và thanh hành động dưới đáy (mobile) luôn có nút gọi.
4. **Một điểm nhấn.** Khối vòm xanh ở hero là thứ người xem nhớ. Phần còn lại tĩnh và gọn.
5. **Không viền khung.** Tách khối bằng nền, khoảng trắng, bo góc. Chỉ ô nhập liệu có đường gạch chân (bắt buộc để nhận ra ô nhập).

---

## 3. Màu

Chủ đạo là **xanh lá tươi của cây** (giữ từ theme cũ), chữ và nút dùng xanh rừng đậm thay cho màu đen của ảnh mẫu.

| Token | Hex | Dùng cho |
|---|---|---|
| `paper` | `#f7f9f4` | Nền trang (thay cho trắng xám của ảnh mẫu) |
| `leaf-100` (`brand-100`) | `#e4f0d5` | Khối vòm, nền ảnh tròn |
| `leaf-500` (`brand-500`) | `#3e9b37` | Xanh lá tươi: icon, chấm nhấn, liên kết hover |
| `forest` (`brand-900`) | `#143f1b` | Tiêu đề, nút chính, chữ đậm |
| `sage` (`surface`) | `#f4f7f1` → `#e9efe3` | Nền khối phụ, panel ảnh |
| `sun` (`sun-300`) | `#f6e27a` | Chỉ cho nút **gọi điện** – một màu, một ý nghĩa |
| `ink-muted` | `#56645a` | Chữ phụ |

Độ tương phản: chữ `forest` trên `paper` ≈ 12:1; `ink-muted` trên `paper` ≈ 5.8:1 (đạt AA).

---

## 4. Chữ

Một họ chữ: **Be Vietnam Pro** – được thiết kế cho tiếng Việt, dấu không bị dính/chồng.

| Vai trò | Cỡ (mobile → desktop) | Độ đậm | Ghi chú |
|---|---|---|---|
| Display (hero) | 40 → 64px | 500 | tracking −0.03em, line-height 1.05 |
| H2 section | 30 → 44px | 500 | tracking −0.02em |
| H3 khối | 20 → 24px | 600 | |
| Số liệu | 36 → 48px | 500 | `tabular-nums` |
| Thân | 15 → 16px | 400 | line-height 1.65, tối đa ~65 ký tự/dòng |
| Nhãn nhỏ | 13px | 500 | không in hoa toàn bộ |

Dancing Script (theme cũ) chỉ giữ cho câu slogan trong form tư vấn – không dùng ở tiêu đề.

---

## 5. Bố cục trang chủ

Lưới: container 1280px, lề 16/24/32px. Căn **trái** cho mọi section, trừ hàng cây trồng (căn giữa như hàng nắp trong ảnh mẫu).

### 5.1 Header – thanh nổi bo tròn

```
┌──────────────────────────────────────────────────────────────┐
│ (🌿 KIM NGOAN)   Trang chủ  Sản phẩm  Dịch vụ  Tin tức …   [🔍] [☎ 0123…] │
└──────────────────────────────────────────────────────────────┘
```
- Thanh trắng `rounded-full`, đổ bóng nhẹ khi cuộn, cách mép trên 12px.
- Mobile: logo + nút menu; nút gọi chuyển xuống thanh hành động dưới đáy.

### 5.2 Hero – 3 cột (tương ứng ảnh mẫu)

```
┌───────────────────────┬──────────────────┬───────────────────┐
│ Đồng hành cùng        │      ╭──────╮    │  ╭────╮           │
│ nhà nông vì mùa       │     ╱        ╲   │  │ảnh │  (vòm nhỏ) │
│ màng bội thu          │    │  ẢNH BAO │   │  ╰────╯           │
│ lead…                 │    │   PHÂN   ◉ ← │  Tư vấn miễn phí  │
│ [🔍 Bạn cần tìm…  ][Tìm]│   │ (vòm lớn) │  │  0123 456 789     │
│ NPK · Cà phê · …      │    ╰──────────╯   │  [Gọi đặt hàng]   │
│                       │                  │                   │
│ 10+      5.000+       │                  │  Bạn trồng cây gì?│
│ năm      nhà vườn     │                  │  ◯ ◯ ◯ ◯ ◯        │
└───────────────────────┴──────────────────┴───────────────────┘
```
- Cột trái: H1 thật (SEO), lead, **ô tìm kiếm** (điểm khác biệt so với ảnh mẫu, phục vụ "tìm kiếm nhanh"), gợi ý nhanh, số liệu.
- Cột giữa: ảnh trong khối vòm `rounded-t-full`, huy hiệu tròn tối "Xem sản phẩm" đè mép phải.
- Cột phải: vòm nhỏ (slide thứ 2 của CMS), khối liên hệ, **ảnh tròn cây trồng** thay cho chấm màu – bấm là lọc sản phẩm theo cây.
- Mobile: xếp dọc theo thứ tự trái → giữa → phải; ô tìm kiếm luôn nằm trong màn hình đầu tiên.

### 5.3 Dải cam kết

4 cam kết (CMS `features`) trên một hàng, icon xanh trong vòng tròn `leaf-100`, không có khung bao.

### 5.4 Nhóm sản phẩm – khối xen kẽ (tương ứng "Stylish body…")

```
┌────────────────────────┬──────────────────────────┐
│                        │ Phân bón                 │
│  ẢNH (panel sage,      │ mô tả 1–2 dòng           │
│  bo góc lớn, tràn      │ • Phân bón hữu cơ  →     │
│  lề trái)              │ • Phân bón NPK     →     │
│                        │ [Xem phân bón]           │
└────────────────────────┴──────────────────────────┘
          (khối sau đảo chiều: chữ trái – ảnh phải)
```
- Mỗi dòng gạch đầu dòng là **liên kết thẳng tới danh mục con** (người mới bấm đúng thứ mình cần, không phải đọc).

### 5.5 "Bạn trồng cây gì?" – hàng ảnh tròn (tương ứng hàng nắp)

Tiêu đề căn giữa, 5 ảnh tròn lớn, tên cây bên dưới, bấm → trang tìm kiếm theo cây.

### 5.6 Sản phẩm được tin dùng

Lưới 4 cột (2 cột mobile), thẻ không viền: ảnh nền sage bo 24px → danh mục → tên → quy cách.

### 5.7 Về chúng tôi (tương ứng "A good cup of coffee…")

Chữ trái + 2 nút (pill tối "Câu chuyện Kim Ngoan" + pill viền "Liên hệ"), ảnh phải tràn lề, một nét vẽ tay xoắn.

### 5.8 Kiến thức canh tác

3 bài mới nhất, thẻ ảnh 16:10.

### 5.9 Form "Gọi lại tư vấn" (tương ứng "Subscribe now…")

```
Để lại số điện thoại,            Họ tên ________   Số điện thoại ________
kỹ thuật viên gọi lại            Cây trồng ________          [Gọi lại cho tôi]
trong 24 giờ.
```
- Chỉ 2 ô bắt buộc (tên, SĐT). Ô gạch chân như ảnh mẫu, nhãn luôn hiển thị (không dùng placeholder thay nhãn).

### 5.10 Footer – nền sáng, 4 cột

Thương hiệu + mô tả | Sản phẩm | Kim Ngoan | Liên hệ (địa chỉ, giờ làm việc). Dải bản quyền cuối.

### 5.11 Thanh hành động mobile (mới, không có trong ảnh mẫu)

Cố định đáy màn hình < 1024px: **Gọi ngay** · **Tìm sản phẩm** · **Nhận tư vấn**. Chiều cao 64px, tôn trọng `safe-area-inset-bottom`.

---

## 6. Thành phần (shadcn + Tailwind)

| Thành phần | File | Ghi chú |
|---|---|---|
| `Button` | `ui/button.tsx` | `default` = pill forest; `outline` = pill viền forest; `sun` = gọi điện |
| `ArchFrame` | `shared/arch-frame.tsx` | Khung vòm `rounded-t-full`, kích thước theo tỉ lệ |
| `Doodle` | `shared/doodle.tsx` | 4 nét SVG vẽ tay (`arrow`, `swirl`, `spark`, `smile`), `aria-hidden`, ẩn trên mobile |
| `HeroSearch` | `landing/hero-search.tsx` | Form GET tới `/tim-kiem`, không cần JS |
| `QuickConsult` | `landing/quick-consult.tsx` | Form client, kiểm tra bằng zod |
| `MobileActionBar` | `site/mobile-action-bar.tsx` | |

---

## 7. UX cho người mua & người mới

- **3 lối vào sản phẩm** ngay màn hình đầu: gõ tìm kiếm, bấm cây trồng, bấm danh mục.
- **Tìm kiếm không dấu**: "phan bon" vẫn ra "Phân bón" (đã có `normalize()`).
- **Vùng chạm ≥ 44px** cho mọi nút/liên kết chính.
- **Không carousel tự chạy ở hero** – nội dung đứng yên, người đọc chậm vẫn kịp đọc. Slide thứ 2 trong CMS hiển thị thành vòm nhỏ cột phải.
- **Số điện thoại hiển thị dạng chữ**, không chỉ là icon.
- Thông báo lỗi form nói rõ cách sửa: "Số điện thoại cần 10 số, ví dụ 0909 123 456".

## 8. Khả năng truy cập & SEO

- Một `h1` thật ở hero; các section dùng `h2` + `aria-labelledby`.
- Ảnh trang trí `alt=""`; nét vẽ tay `aria-hidden`.
- Focus ring xanh 2px; `prefers-reduced-motion` tắt mọi chuyển động.
- Giữ toàn bộ JSON-LD, sitemap, canonical từ `fe/uiux`.

## 9. Việc cần làm thêm (ngoài code)

1. **Ảnh bao bì tách nền** (PNG/WebP nền trong, ≥ 1200px) cho 2–3 sản phẩm chủ lực → thay ảnh hero trong admin.
2. **Số liệu thật** cho bộ đếm (năm hoạt động, số nhà vườn, số sản phẩm) – đang là số mẫu, sửa trong admin › Banner › Số liệu.
3. Xác nhận nội dung câu chào hero với chủ doanh nghiệp.

## 10. Cách đánh giá

Chạy song song `fe/uiux` và `fe/vuon-xanh-v1`, cho 3–5 người mua thật (nông dân, đại lý cấp 2) làm 3 việc và đo thời gian:
1. Tìm phân bón cho cây sầu riêng.
2. Tìm số điện thoại để đặt hàng.
3. Gửi yêu cầu tư vấn.

Style được giữ lại nếu cả 3 việc xong < 30 giây mà không cần hướng dẫn.

---

## 11. Landing tổng `/` – bố cục v1.1 (kiểu tạp chí)

Nhánh `fe/notion-style-v1.1`. **Giữ nguyên theme Notion của landing tổng** (nền giấy `hub-canvas`, thẻ trắng viền 1px, bo 12px, không gradient, một màu xanh `hub-blue` cho hành động chính, mảng màu phẳng marigold / sky / peach / midnight). Chỉ đổi bố cục để bớt cảm giác “template”.

### Nguyên tắc
1. **Không tô nền chữ trong tiêu đề**, không nhãn viên màu đầu mỗi khối.
2. Mỗi khối mở bằng **đường kẻ đậm + số thứ tự + tên mục** (`Kicker`), tiêu đề lớn căn trái (7/12 cột), lời dẫn bên phải (4/12 cột).
3. Logo chữ **“kim ngoan”** (`components/shared/wordmark.tsx`) dùng chung cho splash, header, masthead, footer.
4. Câu chữ cụ thể, có tên đất, tên cây; số liệu viết thành câu thay cho hàng ô số.

### Thứ tự khối
| # | Khối | File | Ghi chú |
|---|---|---|---|
| – | Masthead | `app/(hub)/page.tsx` | dòng thông tin như đầu tờ báo → logo chữ hết chiều ngang (vẽ nét khi tải) → H1 + lời dẫn + 2 nút |
| – | Ba cánh cửa | `components/hub/hub-doors.tsx` | 3 ảnh dọc; rê chuột/tab tới cửa nào cửa đó nở rộng, hiện nhóm hàng; di động xếp 3 dải |
| – | Số liệu thành câu + thương hiệu | page | |
| 01 | Sản phẩm | `product-browser.tsx` | giữ nguyên |
| 02 | Lịch mùa vụ | `components/hub/season-calendar.tsx` | chọn cây → biểu đồ 12 tháng; tháng hiện tại tô sáng, bấm tháng khác để xem; khung xanh đêm liệt kê việc của tháng + link danh mục phân/thuốc |
| 03 | Giao hàng | `components/hub/delivery-map.tsx` + `delivery-stage.tsx` | Danh sách 3 vòng + **sa bàn giao hàng** (CSS 3D, không WebGL): tấm bản đồ giấy nghiêng với thửa vườn, sông Bé/Sài Gòn, hồ Dầu Tiếng, QL13/QL14; xe máy chở bao phân chạy theo đường thật tới từng địa danh của vòng đang chọn, thẻ trạng thái km. Bấm tên địa danh để gọi xe tới đó; có nút tạm dừng; tôn trọng "giảm chuyển động". Sa bàn chỉ tải khi gần vào màn hình. Hình học: `lib/content/delivery-geo.ts`; + 4 bước mua hàng dạng dòng kẻ |
| 04 | Về Kim Ngoan | page | ảnh lớn có chú thích (dính khi cuộn) · câu chuyện · thông tin · 3 cam kết |
| 05 | Tin tức | page | bài chính lớn + mục lục bài khác |
| 06 | Hỏi đáp | page | |
| 07 | Liên hệ | page | “đảo tối” xanh đêm duy nhất, thêm nút Chỉ đường |

Số thứ tự tự đánh lại khi một khối bị ẩn (ví dụ chưa có tin tức).

### Nội dung cần xác nhận
Dữ liệu lịch mùa vụ và vùng giao hàng nằm ở `src/lib/content/hub-extras.ts`:
- lịch mùa vụ là **lịch tham khảo** vùng Đông Nam Bộ – nhờ kỹ thuật viên duyệt lại;
- thời gian giao theo vòng (trong ngày / 1–2 ngày / theo hẹn) là **đề xuất** – sửa đúng cam kết thật trước khi chạy chính thức.

---

## 12. Landing phân bón `/phanbon` – bố cục v1.1

Giữ nguyên theme “Vườn Xanh” (§3 màu, §4 chữ, nút pill, nền `paper`, xanh rừng `brand-900`, vàng `sun-300` cho nút gọi). Chỉ đổi bố cục, đồng bộ với landing tổng (§11).

### Bỏ
Hero 3 cột kiểu ảnh mẫu (khung vòm, huy hiệu tròn), nét vẽ tay (`Doodle`), dãy ảnh tròn cây trồng, khối ảnh–chữ xen kẽ, dải 4 cam kết có icon. Các file `landing/hero`, `features-bar`, `product-groups`, `crop-circles`, `about-split`, `shared/doodle`, `shared/arch-frame` đã xoá.

### Thứ tự khối
| # | Khối | File | Ghi chú |
|---|---|---|---|
| – | Hero | `app/(phanbon)/phanbon/page.tsx` | dòng thông tin đầu trang → H1 “Vườn của bạn trồng gì?” + ô tìm kiếm → **5 ô ảnh cây trồng lớn** (CMS › Cây trồng) |
| 01 | Vườn của bạn | `components/phanbon/crop-desk.tsx` | đổi theo cây đã chọn: việc tháng này (lịch mùa vụ, §11), 3 phân/thuốc hợp cây (thẻ nhãn bao), bài kỹ thuật nhắc tới cây, nút hỏi kỹ thuật viên. Cây đã chọn được nhớ trong trình duyệt (`kn-vuon`). Cây chưa có lịch → mời gọi kỹ thuật viên |
| 02 | Sản phẩm | page + `components/phanbon/npk-label.tsx` | trái: mục lục nhóm hàng (CMS › Sản phẩm); phải: 6 **thẻ nhãn bao** |
| 03 | Về Kim Ngoan | page | ảnh lớn có chú thích · câu trích (CMS `about.quote`) · đoạn giới thiệu · số liệu (CMS `hero.stats`) · cam kết (CMS `features`) |
| 04 | Kiến thức canh tác | page | bài chính + mục lục |
| – | Form gọi lại | `landing/quick-consult.tsx` | giữ nguyên (§5.9) |

### Thẻ “nhãn bao”
Thay ảnh sản phẩm (chưa có ảnh bao bì tách nền, §9) bằng nhãn thu gọn:
- dải xanh đậm trên cùng in **công thức như trên bao** (`20-20-15 +TE`); thuốc BVTV dùng dải xanh nhạt để phân biệt;
- 3 thanh **N (xanh lá) – P (vàng) – K (xanh rừng)** đọc từ thành phần “Đạm / Lân / Kali”, thang tối đa 30%;
- phân không phải NPK: lấy thành phần chính có % làm tiêu đề (`≥ 55% hữu cơ`, `60% K₂O`) và liệt kê 3 thành phần;
- dưới cùng: tên, cây phù hợp, quy cách bao, “Chi tiết”.

### Logo
`Logo` hiển thị tên “Kim Ngoan” bằng logo chữ dùng chung (`shared/wordmark.tsx`) cạnh dấu lá; logo tải lên trong admin vẫn thay được dấu lá.

---

## 13. Lốp xe `/lopxe` & sắt thép `/satthep` – bố cục v1.1

Giữ nguyên theme từng chuyên trang (lốp xe: đen · trắng · cam; sắt thép: trắng · xám · đen) và cùng hệ đầu khối “đường kẻ + số thứ tự” với landing tổng / phân bón (`components/nganh/v-section-head.tsx`).
Chữ nổi bật trong tiêu đề (`highlight` trong admin) **không còn bọc viên nhãn** – chỉ đổi màu nhấn (lốp xe: cam; sắt thép: xám).

### Lốp xe – “an toàn → chọn dễ → làm nhanh”
| # | Khối | File | Đòn bẩy tâm lý |
|---|---|---|---|
| – | Banner: **hông lốp khổng lồ**, dãy “205 / 55 R16” in nổi chính là 3 ô chọn cỡ lốp, chạm số nào hiện nghĩa số đó | `tyre-hero.tsx` | công cụ hữu ích ngay màn hình đầu |
| 01 | **Lốp còn an toàn?** đọc tuổi lốp từ 4 số DOT + kéo thanh độ sâu gai (mặt cắt, vạch báo mòn 1,6 mm) → kết luận + nút đặt lịch | `tyre-check.tsx` | sợ mất an toàn, tự phát hiện nhu cầu |
| 02 | **Ba mức lốp** Tiết kiệm / Cân bằng / Cao cấp, mức giữa nổi bật “Nhiều người chọn” | `tyre-parts.tsx` + `lib/data/vertical-extras.ts` | neo giá, giảm phân vân |
| 03 | Loại xe – mục lục đánh số | `lopxe-home.tsx` | |
| 04 | Bán chạy – **nhãn thông số** (cỡ lốp in to, chỉ số tải/tốc độ màu cam) thay hình bánh xe vẽ lặp | `tyre-parts.tsx` | |
| 05 | **30:00** + các bước dịch vụ + **form đặt lịch** (lấy sẵn cỡ vừa tra, ngày, buổi, mức lốp, SĐT) | `tyre-booking.tsx` | khẩn cấp, tiện |
| 06–07 | Cam kết đánh số · tin tức bài chính + mục lục · khối gọi ngay | `lopxe-home.tsx` | |

### Sắt thép – “minh bạch giá → không thiếu, không dư → không mua nhầm”
| # | Khối | File | Đòn bẩy tâm lý |
|---|---|---|---|
| – | Banner trên **nền giấy kẻ ô bản vẽ** (`.blueprint`) + **bảng giá thép hôm nay** cỡ lớn kiểu bảng điện tử, có khung tên bản vẽ, xu hướng ▲▼, nút “Khoá giá hôm nay” | `steel-board.tsx` | minh bạch giá |
| 01 | **Danh sách vật tư**: dự toán theo diện tích sàn (hệ số sơ bộ) · tính theo số cây · chọn từ danh mục → giỏ vật tư lưu trên máy, tổng tấn, **thước bậc giá** lẻ / sỉ / dự án (“thêm x tấn để lên giá sỉ”), gửi báo giá | `steel-cart.tsx` | sợ thiếu/dư, gom đơn lên bậc giá |
| 02 | Duyệt vật tư (giữ nguyên) | `steel-tools.tsx` | |
| 03 | **Nhận biết thép chính phẩm**: bản vẽ cây thép có 4 chú thích + bảng barem cân thử | `rebar-anatomy.tsx` | sợ hàng kém chất lượng |
| 04 | Dịch vụ tại kho dạng **khung tên bản vẽ** | `satthep-home.tsx` | |
| 05–06 | Cam kết đánh số · tin tức dạng mục lục · khối đen gọi chốt giá | `satthep-home.tsx` | |

### Admin
- Nội dung sắt thép › **Bảng giá hôm nay**: nhập giá, đơn vị, xu hướng cho từng sản phẩm; nút “Ghi giờ hiện tại”. Ô trống → “Gọi chốt giá”.
- Nội dung lốp xe thêm 2 khối tiêu đề: “Lốp còn an toàn?” (`safety`), “Ba mức lốp” (`tiers`). Sắt thép thêm “Nhận biết thép chính phẩm” (`genuine`).

### Cần xác nhận
`lib/data/vertical-extras.ts`: cách chia mức lốp theo thương hiệu, điểm so sánh, hệ số thép 35–45 kg/m² sàn, tỉ lệ chia đường kính, mốc bậc giá 1 tấn / 5 tấn. Form đặt lịch và gửi danh sách vật tư hiện chỉ có giao diện (như các form khác) – cần nối API.

---

## 14. Landing phân bón `/phanbon` – bố cục v1.2

Thay §12. Giữ theme “Vườn Xanh”; nhịp nền xen kẽ: giấy sáng → **xanh rừng đậm** (bảng tin) → giấy → trắng → giấy → trắng → giấy.

| # | Khối | File | Ghi chú |
|---|---|---|---|
| – | **Banner kiểu cửa hàng** (thay “Lát cắt khu vườn” – hình cây vẽ bị chê giả) | `components/phanbon/hero-shop.tsx` | Nhìn là biết bán gì: tiêu đề “Phân bón, thuốc BVTV đúng cho từng vườn”, ô tìm kiếm, **6 ô nhóm hàng** có icon, nút gọi đặt hàng, 4 cam kết (CMS). Bên phải: **ảnh vườn thật** của cây đang chọn (tab chọn cây ở trên, ảnh đổi mờ dần) + khung “Gợi ý cho vườn …” với 3 thẻ nhãn bao thu gọn. |
| 01 | **Bảng tin nhà vườn hôm nay** | `farm-bulletin.tsx`, `lib/weather.ts` | Dự báo 5 ngày Chơn Thành (Open-Meteo, cache 30′ – trang ISR 30′), kết luận “Bón phân hôm nay?” / “Phun thuốc hôm nay?” theo lượng mưa, xác suất mưa, gió, nhiệt độ; tiêu đề khối đổi theo kết luận. Bên phải: việc tháng này của cây đã chọn, phân hợp cây, bài kỹ thuật. Không lấy được dự báo → lời khuyên theo mùa. |
| 02 | **Bác sĩ cây trồng** – phiếu khám 3 cột (bỏ hình cây vẽ) | `plant-doctor.tsx`, `lib/content/plant-doctor.ts` | Cột 1 “Bị ở đâu?” (4 vị trí có icon, mở sẵn Lá già) · cột 2 “Dấu hiệu nào giống nhất?” (thẻ có hình lá/trái/rễ nhỏ) · cột 3 kết quả: nguyên nhân thường gặp, chất/tác nhân, việc nên làm, nhóm phân/thuốc, gửi ảnh cho kỹ thuật viên. Chưa chọn → 4 dấu hiệu hay gặp nhất (bấm một lần ra kết quả) + lối tắt gửi ảnh Zalo. Di động: xếp dọc, vị trí thành hàng chip cuộn ngang. |
| 03 | Sản phẩm – nhãn bao | page + `npk-label.tsx` | giữ từ §12 |
| 04 | **Vườn thật, người thật** | `real-gardens.tsx` | Nhập trong admin › Nội dung phân bón › tab **Vườn thật**. Chỉ câu chuyện thật. Trống → khối mời gửi câu chuyện (khung ảnh trống), không dùng nội dung mẫu. |
| 05–06 | Về Kim Ngoan · Kiến thức · form gọi lại | page | giữ từ §12 |

Cây chọn ở hero dùng chung cho cả trang qua `lib/crop-store.ts` (localStorage `kn-vuon` + sự kiện cùng tab).

### Lưu ý kỹ thuật
- Hình vẽ SVG sinh toạ độ (sơ đồ giao hàng…) phải làm tròn toạ độ có sin/cos: server và trình duyệt có thể lệch ở chữ số cuối → lỗi hydrate.
- `WEATHER_FIXTURE=1` chỉ để kiểm thử khi máy không ra được internet.

### Cần xác nhận
Câu chữ “Bác sĩ cây trồng” (`lib/content/plant-doctor.ts`) và các ngưỡng lời khuyên thời tiết (`farm-bulletin.tsx`: mưa ≥ 15 mm hoãn bón, 2–15 mm hợp bón; khả năng mưa ≥ 60 % hoặc gió ≥ 20 km/h không phun) – nhờ kỹ thuật viên duyệt.

---

## 15. Landing tổng `/` – bố cục v1.2 (nghiêng về phân bón)

Nhánh `fe/notion-style-v1.2` (tách từ v1.1). Giữ theme landing tổng: nền giấy `hub-canvas`, Be Vietnam Pro, bo góc mềm, không gradient. Thay đổi:

- **Màu hành động chính → xanh rừng** `#22662a` (vẫn tên token `hub-blue` trong `globals.css` để khỏi sửa hàng trăm chỗ dùng). Nền phụ `hub-blue-tint` = xanh lá nhạt `#edf5e4`.
- **Hạn chế viền**: tách khối bằng nền trắng / nền lá nhạt và khoảng trắng; thẻ không viền, không đổ bóng (trừ thẻ nổi trên ảnh).
- **Slogan**: “Mùa thuận, đường êm, nhà vững.” – ba vế ứng với phân bón, lốp xe, sắt thép. Viết bằng Dancing Script (chỉ dùng cho slogan), sửa được trong admin (Cài đặt → slogan).
- Header: Trang chủ · Sản phẩm · Tin tức · Liên hệ.

### Thứ tự khối
| Khối | File | Ghi chú |
|---|---|---|
| Hero | `app/(hub)/page.tsx` | Ảnh nền toàn khối `public/hero/hero-bg.jpg` (16:9): ba sản phẩm (bao phân, thép, lốp) nằm **bên trái ảnh**, nửa phải để trống. Nội dung đặt bên phải trên thẻ giấy mờ (`hub-canvas/85` + blur) để luôn đọc được: H1 “Chăm từ gốc rễ, cho mùa trĩu quả.”, lời dẫn, slogan, 2 nút, 3 cam kết. Góc trái dưới ảnh: 3 nút ngành (phân bón nền xanh đậm, 2 ngành phụ nền trắng). Mobile: ảnh trên, nút ngành, rồi nội dung. Không còn carousel. |
| Danh mục sản phẩm | page | “Từ gốc cây đến mái nhà”. Phân bón là khối lớn (ảnh, mô tả, 2 nhóm Phân bón / Thuốc BVTV với 8 danh mục con, số sản phẩm, 2 nút); lốp xe & sắt thép là 2 thẻ nhỏ “Ngành bổ trợ”. |
| Tin tức | page | Bài phân bón nổi bật (ảnh lớn) bên trái; bên phải 1 bài lốp xe + 1 bài sắt thép (ảnh nhỏ ngang) và hộp “Thêm về phân bón & chăm cây” liệt kê bài phân bón khác. Ảnh bìa trong `public/news/`. |
| Liên hệ | page | Khối nền lá nhạt: số điện thoại từng ngành, địa chỉ, giờ mở cửa, email, nút Gọi / Zalo; bản đồ Google + nút Chỉ đường. |

Các khối của v1.1 (ba cánh cửa, lịch mùa vụ, sa bàn giao hàng, giới thiệu, hỏi đáp) vẫn giữ trong `components/hub/` để thêm lại khi cần.
