import { BadgeCheck, Headset, ReceiptText, ShieldCheck, type LucideIcon } from "lucide-react";
import type { VerticalId } from "@/lib/verticals";

/**
 * Nội dung tĩnh của landing tổng `/` (chữ, ảnh, danh sách cam kết…).
 * Sửa câu chữ ở đây, không cần đụng vào JSX. Dữ liệu động (sản phẩm, tin, thông tin công ty) lấy từ
 * `lib/hub/home.ts` và phần Cài đặt trong admin.
 */

export const HUB_HERO = {
  titleLines: ["Chăm từ gốc rễ,", "cho mùa trĩu quả."],
  /** câu giới thiệu theo từng ngành; `{founded}` và `{area}` lấy từ thông tin công ty */
  slides: [
    {
      id: "phanbon",
      text: "Từ năm {founded}, Kim Ngoan đi cùng những vườn cà phê, sầu riêng, hồ tiêu quanh {area}: phân bón, thuốc bảo vệ thực vật chính hãng và lời khuyên thật lòng của người hiểu đất, hiểu cây.",
      cta: "Xem phân bón & thuốc",
      image: "/photos/phanbon-vuon-sau-rieng.jpg",
      alt: "Vườn sầu riêng, cà phê trên đất đỏ và bao phân bón",
      focus: "72% 50%",
    },
    {
      id: "lopxe",
      text: "Lốp chính hãng cho xe con, bán tải và xe tải nhẹ chở nông sản. Thay, cân bằng động và đảo lốp ngay tại cửa hàng, có hẹn giờ trước.",
      cta: "Xem lốp xe ô tô",
      image: "/photos/lopxe-cua-hang.jpg",
      alt: "Cửa hàng lốp xe với lốp mới xếp trên kệ",
      focus: "75% 50%",
    },
    {
      id: "satthep",
      text: "Thép cây, thép hình, ống hộp và tôn lợp đủ quy cách cho nhà ở, nhà kho, chuồng trại. Cắt theo yêu cầu, báo giá theo ngày.",
      cta: "Xem tôn & sắt thép",
      image: "/photos/satthep-bai-thep.jpg",
      alt: "Bãi thép với những bó thép cây xếp gọn",
      focus: "72% 50%",
    },
  ] satisfies { id: VerticalId; text: string; cta: string; image: string; alt: string; focus: string }[],
};

export const HUB_STATS_LABEL = "Kim Ngoan qua những con số";

export const HUB_SECTORS = {
  eyebrow: "Danh mục sản phẩm",
  title: "Từ gốc cây đến mái nhà",
  lead: "Phân bón là nghề chính, là cái tâm của Kim Ngoan. Lốp xe và sắt thép đi kèm để phục vụ chính bà con nhà vườn: lốp cho xe chở nông sản, thép cho nhà kho, chuồng trại, mái nhà.",
  main: {
    badge: "Ngành hàng chính",
    image: "/coffee.jpg",
    alt: "Cành cà phê chín đỏ",
    text: "Đủ các dòng phân hữu cơ, vô cơ, NPK, vi sinh và thuốc bảo vệ thực vật chính hãng. Mỗi bao phân bán ra đều kèm hướng dẫn liều lượng theo tuổi cây và thời điểm trong mùa.",
    cta: "Vào trang phân bón",
  },
  supportBadge: "Ngành bổ trợ",
  support: [
    { id: "lopxe", image: "/item-tyre.jpg", alt: "Lốp xe ô tô", text: "Lốp chính hãng cho xe con, bán tải và xe tải nhẹ. Thay, cân bằng động và đảo lốp tại chỗ." },
    { id: "satthep", image: "/item-steel.jpg", alt: "Thép ống mạ kẽm", text: "Thép cây, thép hình, ống hộp và tôn lợp đủ quy cách, cắt theo yêu cầu, báo giá theo ngày." },
  ] satisfies { id: Exclude<VerticalId, "phanbon">; image: string; alt: string; text: string }[],
};

export const HUB_COMMITMENTS: { icon: LucideIcon; title: string; text: string }[] = [
  { icon: ShieldCheck, title: "Chính hãng 100%", text: "Hàng nhập từ nhà sản xuất và đại lý cấp 1, có hoá đơn, tem nhãn đầy đủ." },
  { icon: Headset, title: "Tư vấn đúng nghề", text: "Hỏi đâu đáp đó: liều bón theo tuổi cây, cỡ lốp theo xe, quy cách thép theo công trình." },
  { icon: ReceiptText, title: "Giá rõ, báo theo ngày", text: "Báo giá trước khi giao, không phát sinh. Đơn lớn có giá riêng." },
  { icon: BadgeCheck, title: "Đổi trả minh bạch", text: "Hàng lỗi do nhà sản xuất được đổi theo chính sách của hãng." },
];

export const HUB_PRODUCTS = {
  eyebrow: "Sản phẩm tiêu biểu",
  title: "Hàng đang bán chạy tại cửa hàng",
  lead: "Chọn ngành, lọc theo nhóm và xem nhanh từng sản phẩm. Cần tư vấn liều lượng hay quy cách, cứ bấm vào để xem chi tiết hoặc gọi cho chúng tôi.",
};

export const HUB_NEWS = {
  eyebrow: "Tin tức & kiến thức",
  title: "Chuyện vườn, chuyện nghề",
  lead: "Kinh nghiệm bón phân theo mùa, cách chăm cây qua nắng hạn, và vài điều nên biết trước khi thay lốp hay mua thép.",
  allLabel: "Xem tất cả bài viết",
  featureBadge: "Kỹ thuật canh tác",
  moreTitle: "Thêm về phân bón & chăm cây",
  moreAllLabel: "Tất cả bài viết về phân bón",
};

export const HUB_CONTACT = {
  eyebrow: "Liên hệ",
  title: "Ghé cửa hàng, hay gọi một cuộc là đủ.",
  lead: "Cây có dấu hiệu lạ, cần báo giá cho công trình hay muốn thay bộ lốp mới, cứ gọi. Mỗi ngành có người phụ trách riêng, trả lời đúng chuyên môn.",
  fertilizerNote: "Tư vấn kỹ thuật canh tác miễn phí",
};
