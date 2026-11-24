import { normalize } from "@/lib/mock/search";
import { CROPS } from "@/constants/hub-extras";

/** Khoá so khớp tên cây: “Cây cà phê” = “Cà phê”, “Hồ tiêu” = “Tiêu”. */
export function cropKey(name: string) {
  return normalize(name)
    .replace(/^cay\s+/, "")
    .replace(/^ho\s+tieu$/, "tieu")
    .replace(/\s+/g, "-");
}

/**
 * Short display name for a crop: drops the leading "Cây" ("Cây cà phê" → "Cà phê")
 * except for "Cây ăn trái", where the word is part of the name.
 */
export function cropLabel(name: string) {
  const s = /^cây\s+ăn\s/i.test(name) ? name : name.replace(/^cây\s+/i, "");
  return s.charAt(0).toUpperCase() + s.slice(1);
}

/** Lịch mùa vụ (hub-extras) của một cây, nếu có. */
export function calendarFor(key: string) {
  return CROPS.find((c) => cropKey(c.name) === key);
}
