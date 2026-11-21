import { BadgeCheck, Headset, ReceiptText, ShieldCheck, type LucideIcon } from "lucide-react";
import type { VerticalId } from "@/lib/verticals";

/**
 * Nội dung tĩnh của landing tổng `/` – phong cách Business (Editorial Industrial), nhánh fe/bussiness-style-v1.
 * Sửa câu chữ, ảnh ở đây; không cần đụng vào JSX. `{founded}`, `{area}` lấy từ phần Cài đặt công ty.
 */

export const HUB_HERO = {
  eyebrow: "Nhà phân phối vật tư nông nghiệp · vận tải · xây dựng",
  titleLines: ["Chăm từ gốc rễ,", "cho mùa trĩu quả."],
  lead: "Từ năm {founded}, Kim Ngoan cung ứng phân bón, thuốc bảo vệ thực vật chính hãng cho nhà vườn quanh {area}, cùng lốp xe và tôn – sắt thép cho xe chở nông sản, nhà kho, công trình. Một đầu mối, đủ hàng, giá báo theo ngày.",
  primaryCta: { label: "Khám phá sản phẩm", href: "#san-pham" },
  secondaryCta: { label: "Liên hệ báo giá", href: "#lien-he" },
  /** ảnh nền: chủ thể lệch phải, nửa trái để trống cho chữ */
  slides: [
    { id: "phanbon", image: "/photos/phanbon-vuon-sau-rieng.jpg", alt: "Vườn sầu riêng, cà phê trên đất đỏ và bao phân bón", focus: "72% 50%" },
    { id: "lopxe", image: "/photos/lopxe-cua-hang.jpg", alt: "Cửa hàng lốp xe với lốp mới xếp trên kệ", focus: "75% 50%" },
    { id: "satthep", image: "/photos/satthep-bai-thep.jpg", alt: "Bãi thép với những bó thép cây xếp gọn", focus: "72% 50%" },
  ] satisfies { id: VerticalId; image: string; alt: string; focus: string }[],
};

export const HUB_ABOUT = {
  eyebrow: "Về Kim Ngoan",
  title: "Từ đại lý vật tư nông nghiệp đến ba ngành hàng",
  paragraphs: [
    "Khởi đầu là một đại lý phân bón nhỏ ở {area}, Kim Ngoan lớn lên cùng những vườn cà phê, sầu riêng, hồ tiêu của bà con trong vùng. Phân bón và thuốc bảo vệ thực vật vẫn là nghề chính, là nơi chúng tôi đặt nhiều tâm sức nhất.",
    "Rồi bà con cần lốp cho xe chở nông sản, cần thép cho nhà kho, chuồng trại. Chúng tôi mở thêm hai ngành hàng để một cuộc gọi là lo đủ cho mùa vụ, con đường và mái nhà.",
  ],
  quote: "Bán đúng hàng, nói đúng liều, giao đúng hẹn. Bà con tin mình vì mình chưa từng bán thứ mình không dám dùng.",
  quoteBy: "Ban điều hành Kim Ngoan",
  image: "/garden.jpg",
  alt: "Vườn cây ăn trái nhìn từ trên cao ở vùng Chơn Thành",
};

export const HUB_COMMITMENTS: { icon: LucideIcon; title: string; text: string }[] = [
  { icon: ShieldCheck, title: "Chính hãng 100%", text: "Nhập từ nhà sản xuất và đại lý cấp 1, có hoá đơn, tem nhãn đầy đủ." },
  { icon: Headset, title: "Tư vấn đúng nghề", text: "Liều bón theo tuổi cây, cỡ lốp theo xe, quy cách thép theo công trình." },
  { icon: ReceiptText, title: "Giá rõ, báo theo ngày", text: "Báo giá trước khi giao, không phát sinh. Đơn lớn có giá riêng." },
  { icon: BadgeCheck, title: "Đổi trả minh bạch", text: "Hàng lỗi do nhà sản xuất được đổi theo chính sách của hãng." },
];

/** Khối sản phẩm: mỗi ngành một "không gian trưng bày". */
export const HUB_PRODUCTS = {
  eyebrow: "Sản phẩm",
  title: "Ba ngành hàng, một đầu mối",
  sectors: [
    {
      id: "phanbon",
      title: "Dinh dưỡng đúng lúc cho từng giai đoạn cây",
      text: "Phân hữu cơ, vô cơ, NPK, vi sinh và thuốc bảo vệ thực vật chính hãng. Mỗi bao phân bán ra đều kèm hướng dẫn liều lượng theo tuổi cây và thời điểm trong mùa.",
      image: "/coffee.jpg",
      alt: "Cành cà phê chín đỏ trong vườn",
      caption: "Cà phê vào mùa thu hoạch, Chơn Thành",
    },
    {
      id: "lopxe",
      title: "Lốp chính hãng cho xe con, bán tải, xe tải nhẹ",
      text: "Đủ cỡ thông dụng cho xe gia đình và xe chở nông sản. Thay, cân bằng động và đảo lốp ngay tại cửa hàng, có hẹn giờ trước.",
      image: "/photos/lopxe-cua-hang.jpg",
      alt: "Kệ lốp xe mới trong cửa hàng",
      caption: "Khu trưng bày lốp tại cửa hàng",
    },
    {
      id: "satthep",
      title: "Thép, tôn đủ quy cách cho nhà ở và nhà xưởng",
      text: "Thép cây, thép hình, ống hộp, tôn lợp cho nhà ở, nhà kho, chuồng trại. Cắt theo yêu cầu, báo giá theo ngày, giao tận công trình.",
      image: "/photos/satthep-bai-thep.jpg",
      alt: "Những bó thép cây xếp trên bãi",
      caption: "Bãi thép – hàng có sẵn mỗi ngày",
    },
  ] satisfies { id: VerticalId; title: string; text: string; image: string; alt: string; caption: string }[],
};

export const HUB_NEWS = {
  eyebrow: "Tin tức & kiến thức",
  title: "Chuyện vườn, chuyện nghề",
  allLabel: "Xem tất cả bài viết",
  featureTag: "Kỹ thuật canh tác",
};

export const HUB_CONTACT = {
  eyebrow: "Liên hệ",
  title: "Cần báo giá? Để lại số, chúng tôi gọi lại ngay.",
  lead: "Mỗi ngành có người phụ trách riêng, trả lời đúng chuyên môn. Gấp thì gọi thẳng hotline hoặc nhắn Zalo.",
  formTitle: "Yêu cầu báo giá nhanh",
  mapHint: "Bấm để xem bản đồ",
  directions: "Mở chỉ đường trên Google Maps",
};
