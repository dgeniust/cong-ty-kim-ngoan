import type { CatalogSite } from "@/lib/verticals";

/** Mô tả các khối tiêu đề của từng chuyên trang – dùng cho trình sửa trong admin (thứ tự = thứ tự trên trang). */
export type SectionSpec = { key: string; label: string; where: string; fields: ("highlight" | "after" | "subtitle")[] };

export const SECTION_SPECS: Record<CatalogSite, SectionSpec[]> = {
  lopxe: [
    { key: "finder", label: "Công cụ tra cỡ lốp", where: "Khối 2 – ngay dưới banner", fields: ["highlight", "after", "subtitle"] },
    { key: "categories", label: "Chọn theo loại xe", where: "Khối 3 – 4 thẻ loại xe", fields: ["highlight", "after", "subtitle"] },
    { key: "featured", label: "Lốp bán chạy", where: "Khối 4 – dải sản phẩm tự cuộn", fields: ["highlight", "after", "subtitle"] },
    { key: "process", label: "Quy trình thay lốp", where: "Khối 5 – các bước dịch vụ", fields: ["highlight", "after", "subtitle"] },
    { key: "news", label: "Tin tức", where: "Khối 7 – bài viết mới", fields: ["highlight", "after", "subtitle"] },
  ],
  satthep: [
    { key: "categories", label: "Duyệt vật tư", where: "Khối 3 – danh mục kiểu thanh bên", fields: ["highlight", "after", "subtitle"] },
    { key: "tool", label: "Công cụ tính trọng lượng", where: "Khối 4 – máy tính số ký thép", fields: ["highlight", "after", "subtitle"] },
    { key: "commitments", label: "Cam kết", where: "Khối 5 – 4 cột cam kết", fields: ["highlight", "after", "subtitle"] },
    { key: "news", label: "Tin tức", where: "Khối 7 – danh sách bài viết", fields: ["highlight", "after", "subtitle"] },
  ],
};
