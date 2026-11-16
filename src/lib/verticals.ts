/**
 * Cấu hình tập đoàn + 3 chuyên trang (kimngoan.com/phanbon | /lopxe | /satthep).
 * Mọi thông tin liên hệ nằm ở đây — thay số điện thoại/địa chỉ thật trước khi go-live.
 */
export type VerticalId = "phanbon" | "lopxe" | "satthep";

export type Vertical = {
  id: VerticalId;
  /** URL gốc của chuyên trang */
  base: `/${VerticalId}`;
  name: string;
  /** Nhãn ngắn trên tab/nút */
  short: string;
  tagline: string;
  description: string;
  /** Dòng "Liên hệ về …" ở landing tổng */
  contactLabel: string;
  phone: string;
  seoTitle: string;
  seoDescription: string;
  themeColor: string;
};

export const COMPANY = {
  prefix: "CÔNG TY TNHH",
  name: "KIM NGOAN",
  legalName: "Công ty TNHH Kim Ngoan",
  slogan: "Đồng hành cùng nhà nông",
  // TODO(khách hàng): thay bằng thông tin thật
  hotline: "0123 456 789",
  email: "kimngoan@example.com",
  address: "Chơn Thành - Đồng Nai",
  zalo: "https://zalo.me/0123456789",
  facebook: "https://facebook.com",
  /** Truy vấn dùng cho Google Maps embed – thay bằng địa chỉ/toạ độ chính xác. */
  mapQuery: "Chơn Thành",
  openingHours: "Mo-Su 07:00-18:00",
  founded: "2015",
};

export const VERTICALS: Record<VerticalId, Vertical> = {
  phanbon: {
    id: "phanbon",
    base: "/phanbon",
    name: "Phân bón & thuốc BVTV",
    short: "Phân bón",
    tagline: "Vì mùa màng bội thu",
    description: "Phân bón hữu cơ, vô cơ, NPK, vi sinh và thuốc bảo vệ thực vật chính hãng cho cà phê, cao su, sầu riêng, tiêu, lúa.",
    contactLabel: "Liên hệ về phân bón & thuốc BVTV",
    phone: "0123 456 781",
    seoTitle: "Phân bón & thuốc BVTV Kim Ngoan – Đại lý tại Chơn Thành",
    seoDescription: "Đại lý phân bón, thuốc bảo vệ thực vật chính hãng tại Chơn Thành. Tư vấn kỹ thuật miễn phí, giao tận vườn.",
    themeColor: "#143f1b",
  },
  lopxe: {
    id: "lopxe",
    base: "/lopxe",
    name: "Lốp xe ô tô",
    short: "Lốp xe",
    tagline: "Bám đường. Bền bỉ. Chính hãng.",
    description: "Lốp xe du lịch, SUV – bán tải, xe tải và xe khách từ các thương hiệu lớn. Thay lắp, cân bằng động tại chỗ.",
    contactLabel: "Liên hệ về lốp xe ô tô",
    phone: "0123 456 782",
    seoTitle: "Lốp xe ô tô Kim Ngoan – Lốp chính hãng, thay lắp tại Chơn Thành",
    seoDescription: "Đại lý lốp xe ô tô chính hãng tại Chơn Thành: lốp xe du lịch, SUV, bán tải, xe tải. Báo giá nhanh, thay lắp và cân bằng động tại chỗ.",
    themeColor: "#08080a",
  },
  satthep: {
    id: "satthep",
    base: "/satthep",
    name: "Tôn – sắt thép",
    short: "Sắt thép",
    tagline: "Vững từ lõi thép.",
    description: "Thép xây dựng, thép hình, thép ống – hộp, tôn lợp và thép tấm cho công trình dân dụng, nhà xưởng.",
    contactLabel: "Liên hệ về tôn – sắt thép",
    phone: "0123 456 783",
    seoTitle: "Tôn sắt thép Kim Ngoan – Thép xây dựng, thép hình, tôn lợp tại Chơn Thành",
    seoDescription: "Cung cấp thép xây dựng, thép hình, thép ống hộp, tôn lợp chính phẩm tại Chơn Thành. Báo giá theo ngày, cắt theo quy cách, giao tận công trình.",
    themeColor: "#ebe6e3",
  },
};

export const VERTICAL_LIST: Vertical[] = [VERTICALS.phanbon, VERTICALS.lopxe, VERTICALS.satthep];
/** Hai chuyên trang dùng chung bộ route động `app/(nganh)/[site]`. */
export const CATALOG_SITES = ["lopxe", "satthep"] as const;
export type CatalogSite = (typeof CATALOG_SITES)[number];
export const isCatalogSite = (s: string): s is CatalogSite => (CATALOG_SITES as readonly string[]).includes(s);

export const telHref = (phone: string) => `tel:${phone.replace(/[^\d+]/g, "")}`;
