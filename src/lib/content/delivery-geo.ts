import { PLACES } from "@/lib/content/hub-extras";

/**
 * Hình học cho "sa bàn giao hàng" quanh cửa hàng ở Chơn Thành.
 * Hệ toạ độ km: x = Đông, y = Bắc, gốc (0,0) = cửa hàng. Mặt sa bàn 1000×1000 đơn vị ≈ 190×190 km.
 * Vị trí sông, hồ, đường lấy gần đúng theo bản đồ thật (đủ để nhận ra vùng), không dùng để chỉ đường.
 *
 * Mọi số đều làm tròn 0,1 và chỉ dùng phép tính số học (PRNG băm số nguyên) để server và trình duyệt
 * sinh ra cùng một chuỗi SVG – tránh lỗi hydration.
 */

export type P = [number, number];

export const SIZE = 1000;
export const HALF_KM = 95;
export const U = SIZE / 2 / HALF_KM; // đơn vị sa bàn / km
const r1 = (n: number) => Math.round(n * 10) / 10;

/** km → đơn vị sa bàn (y hướng xuống như SVG) */
export const toU = ([x, y]: P): P => [r1(SIZE / 2 + x * U), r1(SIZE / 2 - y * U)];

/** vị trí địa danh (km) từ hướng + khoảng cách trong dữ liệu nội dung */
export function placeKm(name: string): P {
  const p = PLACES.find((x) => x.name === name);
  if (!p) return [0, 0];
  const a = (p.bearing * Math.PI) / 180;
  return [r1(p.km * Math.sin(a)), r1(p.km * Math.cos(a))];
}

/* ------------------------------------------------------------- đường cong mượt */

/** Catmull-Rom → các điểm mẫu (polyline mịn), chỉ dùng + − × ÷ */
export function smooth(pts: P[], steps = 10, closed = false): P[] {
  if (pts.length < 3) return pts.slice();
  const n = pts.length;
  const get = (i: number) => (closed ? pts[(i + n) % n] : pts[Math.max(0, Math.min(n - 1, i))]);
  const out: P[] = [];
  const segs = closed ? n : n - 1;
  for (let i = 0; i < segs; i++) {
    const p0 = get(i - 1), p1 = get(i), p2 = get(i + 1), p3 = get(i + 2);
    for (let s = 0; s < steps; s++) {
      const t = s / steps, t2 = t * t, t3 = t2 * t;
      const f = (a: number, b: number, c: number, d: number) => 0.5 * (2 * b + (-a + c) * t + (2 * a - 5 * b + 4 * c - d) * t2 + (-a + 3 * b - 3 * c + d) * t3);
      out.push([r1(f(p0[0], p1[0], p2[0], p3[0])), r1(f(p0[1], p1[1], p2[1], p3[1]))]);
    }
  }
  if (!closed) out.push(pts[n - 1]);
  return out;
}

/** polyline km → thuộc tính d (đơn vị sa bàn) */
export function pathD(pts: P[], closed = false) {
  const d = pts.map((p, i) => {
    const [x, y] = toU(p);
    return `${i ? "L" : "M"}${x} ${y}`;
  });
  return d.join("") + (closed ? "Z" : "");
}

/* ------------------------------------------------------------- PRNG băm số nguyên */

function hash(a: number, b: number, seed = 0) {
  let h = (Math.imul(a | 0, 374761393) + Math.imul(b | 0, 668265263) + Math.imul(seed, 2147483647)) | 0;
  h = Math.imul(h ^ (h >>> 13), 1274126177);
  h ^= h >>> 16;
  return (h >>> 0) / 4294967296;
}

/* ------------------------------------------------------------- mạng lưới đường */

export type RoadClass = "ql" | "dt" | "lane";
export type Road = { id: string; cls: RoadClass; pts: P[] };

const S: P = [0, 0];
const at = placeKm;

/** Tuyến xe giao hàng: từ cửa hàng theo đường thật tới từng địa danh (km). */
export const ROUTES: Record<string, P[]> = {
  "Hớn Quản": [S, [-0.4, 6], at("Hớn Quản")],
  "Bình Long": [S, [-0.4, 6], at("Hớn Quản"), [-3, 20], at("Bình Long")],
  "Lộc Ninh": [S, [-0.4, 6], at("Hớn Quản"), [-3, 20], at("Bình Long"), [-4.6, 40], [-6.6, 51], at("Lộc Ninh")],
  "Bàu Bàng": [S, [0.8, -9], at("Bàu Bàng")],
  "Bến Cát": [S, [0.8, -9], at("Bàu Bàng"), [2.6, -30], at("Bến Cát")],
  "TP.HCM": [S, [0.8, -9], at("Bàu Bàng"), [2.6, -30], at("Bến Cát"), [3.2, -50], [1, -63], at("TP.HCM")],
  "Đồng Xoài": [S, [7, 2.2], [15, 5.4], [22, 8.6], at("Đồng Xoài")],
  "Bù Đăng": [S, [7, 2.2], [15, 5.4], [22, 8.6], at("Đồng Xoài"), [40, 12.6], [49, 13.4], [59, 16.4], at("Bù Đăng")],
  "Phú Giáo": [S, [0.8, -9], [6, -12.6], [12, -17.4], [16.6, -21.6], at("Phú Giáo")],
  "Dầu Tiếng": [S, [-5.6, -3.4], [-12.4, -7.8], [-20.6, -10.8], at("Dầu Tiếng")],
};

const TDM: P = [3.2, -50]; // Thủ Dầu Một (chỉ ghi chú)
const PHUOC_LONG: P = [40, 44];

export const ROADS: Road[] = [
  // quốc lộ
  { id: "QL13", cls: "ql", pts: [[-4, 96], [-5.6, 76], at("Lộc Ninh"), [-6.6, 51], [-4.6, 40], at("Bình Long"), [-3, 20], at("Hớn Quản"), [-0.4, 6], S, [0.8, -9], at("Bàu Bàng"), [2.6, -30], at("Bến Cát"), TDM, [1, -63], at("TP.HCM"), [-1, -96]] },
  { id: "QL14", cls: "ql", pts: [[-30, 30], [-14, 9], [-6, 2.6], S, [7, 2.2], [15, 5.4], [22, 8.6], at("Đồng Xoài"), [40, 12.6], [49, 13.4], [59, 16.4], at("Bù Đăng"), [82, 24], [96, 34]] },
  // tỉnh lộ
  { id: "DT741", cls: "dt", pts: [PHUOC_LONG, [37, 30], [33, 19], at("Đồng Xoài"), [27, -2], [23, -14], at("Phú Giáo"), [18, -34], [12, -44], TDM] },
  { id: "DT750", cls: "dt", pts: [S, [-5.6, -3.4], [-12.4, -7.8], [-20.6, -10.8], at("Dầu Tiếng"), [-40, -20], [-58, -22], [-80, -30], [-96, -32]] },
  { id: "DT-PG", cls: "dt", pts: [[0.8, -9], [6, -12.6], [12, -17.4], [16.6, -21.6], at("Phú Giáo"), [36, -30], [52, -36], [70, -48], [96, -58]] },
  { id: "DT-BL", cls: "dt", pts: [at("Bình Long"), [12, 36], [26, 42], PHUOC_LONG, [62, 58], [80, 72]] },
  { id: "DT-DT", cls: "dt", pts: [at("Dầu Tiếng"), [-22, -30], [-16, -44], [-6, -58], [1, -63]] },
  { id: "DT-LN", cls: "dt", pts: [at("Lộc Ninh"), [-24, 70], [-44, 78], [-70, 92]] },
  { id: "DT-BD", cls: "dt", pts: [at("Bù Đăng"), [72, 44], [76, 70], [72, 96]] },
  { id: "DT-W", cls: "dt", pts: [at("Bình Long"), [-20, 24], [-40, 18], [-62, 22], [-96, 20]] },
  // đường làng
  { id: "L1", cls: "lane", pts: [at("Hớn Quản"), [10, 16], [18, 26], [24, 40]] },
  { id: "L2", cls: "lane", pts: [at("Bàu Bàng"), [-10, -22], [-20, -30], [-34, -34]] },
  { id: "L3", cls: "lane", pts: [[22, 8.6], [16, 22], [12, 36]] },
  { id: "L4", cls: "lane", pts: [[-12.4, -7.8], [-14, 6], [-18, 16], [-26, 26]] },
  { id: "L5", cls: "lane", pts: [at("Phú Giáo"), [32, -12], [44, -8], [56, 2], [70, 6]] },
  { id: "L6", cls: "lane", pts: [at("Bến Cát"), [14, -38], [22, -46], [30, -60]] },
  { id: "L7", cls: "lane", pts: [[-4.6, 40], [-18, 46], [-30, 50], [-46, 54]] },
  { id: "L8", cls: "lane", pts: [at("Đồng Xoài"), [44, 0], [58, -10], [72, -20]] },
  { id: "L9", cls: "lane", pts: [[-20.6, -10.8], [-26, -2], [-34, 10], [-46, 30], [-52, 46]] },
  { id: "L10", cls: "lane", pts: [[59, 16.4], [56, 30], [52, 40]] },
];

/* ------------------------------------------------------------- sông, hồ */

export type River = { id: string; name: string; width: number; pts: P[] };
export const RIVERS: River[] = [
  { id: "song-be", name: "Sông Bé", width: 4.2, pts: [[60, 96], [55, 74], [48, 56], [44, 38], [41, 22], [38, 8], [33, -6], [29, -20], [25, -30], [25, -42], [29, -54], [36, -68], [40, -82], [44, -96]] },
  { id: "song-sg", name: "Sông Sài Gòn", width: 5, pts: [[-20, 96], [-17, 76], [-19, 58], [-24, 40], [-27, 24], [-30, 12], [-29, -15], [-24, -22], [-16, -32], [-10, -44], [-2, -56], [6, -66], [12, -74], [18, -86], [22, -96]] },
  { id: "suoi", name: "", width: 2, pts: [[-6, 30], [-12, 20], [-16, 8], [-22, -2], [-28, 4]] },
  { id: "suoi2", name: "", width: 1.8, pts: [[10, -2], [14, -14], [20, -24], [25, -30]] },
];

export const LAKES: { id: string; name: string; pts: P[]; label: P }[] = [
  { id: "dau-tieng", name: "Hồ Dầu Tiếng", label: [-44, 2], pts: [[-30, -12], [-28, -2], [-31, 8], [-34, 16], [-40, 22], [-48, 20], [-53, 12], [-58, 4], [-55, -6], [-49, -11], [-42, -15], [-36, -16]] },
  { id: "thac-mo", name: "Hồ Thác Mơ", label: [52, 47], pts: [[46, 52], [52, 54], [58, 51], [61, 46], [57, 41], [50, 40], [45, 44]] },
  { id: "phuoc-hoa", name: "", label: [0, 0], pts: [[18, -2], [22, 0], [25, -3], [22, -7], [18, -6]] },
];

/* ------------------------------------------------------------- ruộng vườn (chắp vá) */

export type FieldKind = "rubber" | "cashew" | "soil" | "open";
export type Field = { d: string; kind: FieldKind; hatch: 0 | 1 | 2 };

const STEP = 9; // km
function lattice(i: number, j: number): P {
  const jx = (hash(i, j, 1) - 0.5) * STEP * 0.7;
  const jy = (hash(i, j, 2) - 0.5) * STEP * 0.7;
  return [r1(i * STEP + jx), r1(j * STEP + jy)];
}
const KINDS: FieldKind[] = ["rubber", "rubber", "cashew", "open", "soil", "rubber", "cashew", "open"];

let fieldsCache: Field[] | null = null;
/** thửa vườn – tính khi cần (không chạy lúc nạp module) */
export function fields(): Field[] {
  if (fieldsCache) return fieldsCache;
  fieldsCache = (() => {
  const out: Field[] = [];
  const n = Math.ceil(HALF_KM / STEP) + 1;
  for (let i = -n; i < n; i++)
    for (let j = -n; j < n; j++) {
      const q: P[] = [lattice(i, j), lattice(i + 1, j), lattice(i + 1, j + 1), lattice(i, j + 1)];
      // vùng loại cây theo cụm 3×3 ô để nhìn như thật (cao su thành mảng lớn), thêm nhiễu từng ô
      const zone = hash(Math.floor(i / 3), Math.floor(j / 3), 7);
      const k = hash(i, j, 3) < 0.7 ? KINDS[Math.floor(zone * KINDS.length)] : KINDS[Math.floor(hash(i, j, 4) * KINDS.length)];
      // co ô vào một chút → khe sáng giữa các thửa
      const cx = (q[0][0] + q[1][0] + q[2][0] + q[3][0]) / 4;
      const cy = (q[0][1] + q[1][1] + q[2][1] + q[3][1]) / 4;
      const shrink = q.map(([x, y]) => [r1(cx + (x - cx) * 0.93), r1(cy + (y - cy) * 0.93)] as P);
      // chia đôi một số ô thành 2 thửa
      if (hash(i, j, 5) < 0.35) {
        const m1: P = [r1((shrink[0][0] + shrink[1][0]) / 2), r1((shrink[0][1] + shrink[1][1]) / 2)];
        const m2: P = [r1((shrink[3][0] + shrink[2][0]) / 2), r1((shrink[3][1] + shrink[2][1]) / 2)];
        const k2 = KINDS[Math.floor(hash(i, j, 6) * KINDS.length)];
        out.push({ d: pathD([shrink[0], [m1[0] - 0.4, m1[1]], [m2[0] - 0.4, m2[1]], shrink[3]], true), kind: k, hatch: (Math.floor(hash(i, j, 8) * 3) as 0 | 1 | 2) });
        out.push({ d: pathD([[m1[0] + 0.4, m1[1]], shrink[1], shrink[2], [m2[0] + 0.4, m2[1]]], true), kind: k2, hatch: (Math.floor(hash(i, j, 9) * 3) as 0 | 1 | 2) });
      } else out.push({ d: pathD(shrink, true), kind: k, hatch: (Math.floor(hash(i, j, 8) * 3) as 0 | 1 | 2) });
    }
  return out;
  })();
  return fieldsCache;
}

/* ------------------------------------------------------------- thị trấn (khối nhà) */

export type Town = { name: string; at: P; size: number; label: boolean };
export const TOWNS: Town[] = [
  ...PLACES.map((p) => ({ name: p.name, at: at(p.name), size: p.name === "TP.HCM" ? 3 : p.name === "Đồng Xoài" ? 1.8 : 1, label: false })),
  { name: "Chơn Thành", at: S, size: 1.3, label: false },
  { name: "Thủ Dầu Một", at: TDM, size: 2, label: true },
  { name: "Phước Long", at: PHUOC_LONG, size: 0.9, label: true },
];

/** các khối nhà nhỏ quanh thị trấn (đơn vị sa bàn) */
export function blocks(): { x: number; y: number; w: number; h: number }[] {
  return (() => {
  const out: { x: number; y: number; w: number; h: number }[] = [];
  TOWNS.forEach((t, ti) => {
    const [cx, cy] = toU(t.at);
    const count = Math.round(10 * t.size * t.size);
    const spread = 9 * t.size;
    for (let k = 0; k < count; k++) {
      const rx = (hash(ti, k, 11) - 0.5) * 2, ry = (hash(ti, k, 12) - 0.5) * 2;
      if (rx * rx + ry * ry > 1) continue;
      const w = r1(2.2 + hash(ti, k, 13) * 3.4), h = r1(2 + hash(ti, k, 14) * 3);
      out.push({ x: r1(cx + rx * spread - w / 2), y: r1(cy + ry * spread - h / 2), w, h });
    }
  });
  return out;
  })();
}

/* ------------------------------------------------------------- lấy mẫu tuyến cho xe */

export type Track = { pts: P[]; cum: number[]; len: number; d: string };

/** Tuyến xe theo đơn vị sa bàn, đã làm mượt; cum[i] = quãng đường cộng dồn tới điểm i. */
export function track(name: string): Track | null {
  const raw = ROUTES[name];
  if (!raw) return null;
  const pts = smooth(raw, 12).map(toU);
  const cum = [0];
  for (let i = 1; i < pts.length; i++) {
    const dx = pts[i][0] - pts[i - 1][0], dy = pts[i][1] - pts[i - 1][1];
    cum.push(cum[i - 1] + Math.sqrt(dx * dx + dy * dy));
  }
  const d = pts.map((p, i) => `${i ? "L" : "M"}${p[0]} ${p[1]}`).join("");
  return { pts, cum, len: cum[cum.length - 1], d };
}

/** điểm và hướng tại quãng đường s */
export function pointAt(t: Track, s: number): { x: number; y: number; dx: number; dy: number } {
  const { pts, cum } = t;
  if (s <= 0) return { x: pts[0][0], y: pts[0][1], dx: pts[1][0] - pts[0][0], dy: pts[1][1] - pts[0][1] };
  let lo = 0, hi = cum.length - 1;
  while (hi - lo > 1) {
    const mid = (lo + hi) >> 1;
    if (cum[mid] < s) lo = mid;
    else hi = mid;
  }
  const seg = cum[hi] - cum[lo] || 1;
  const k = Math.min(1, (s - cum[lo]) / seg);
  const a = pts[lo], b = pts[hi];
  return { x: a[0] + (b[0] - a[0]) * k, y: a[1] + (b[1] - a[1]) * k, dx: b[0] - a[0], dy: b[1] - a[1] };
}
