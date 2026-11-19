/**
 * Cảnh “lát cắt khu vườn” (SVG thuần, không ảnh): trời – cây – mặt đất – các lớp đất – bộ rễ.
 * Mỗi cây trồng một hình vẽ riêng; `step` quyết định máy quay (phóng to vào lá / trái / rễ)
 * và lớp nào được làm nổi (lớp khác mờ đi). Hạt dinh dưỡng N–P–K đi lên theo rễ.
 * Toạ độ gốc: khung 600 × 900, mặt đất y = 380, gốc cây x = 300.
 */
import { cn } from "@/lib/utils";

export type CropShape = "ca-phe" | "cao-su" | "sau-rieng" | "tieu" | "lua" | "cay";
export const GROUND = 380;

/**
 * Giả ngẫu nhiên cố định bằng phép băm số nguyên – kết quả giống hệt nhau ở server (Node) và trình duyệt.
 * (Không dùng Math.sin: mỗi engine có thể lệch ở chữ số cuối → toạ độ SVG khác nhau → lỗi hydrate.)
 */
const rnd = (i: number, s = 1) => {
  let h = (Math.imul(i + 1, 374761393) + Math.imul(s + 7, 668265263)) | 0;
  h = Math.imul(h ^ (h >>> 13), 1274126177);
  h ^= h >>> 16;
  return (h >>> 0) / 4294967296;
};
/** làm tròn 0,1 cho toạ độ có dùng sin/cos */
const r1 = (n: number) => Math.round(n * 10) / 10;
const GREENS = ["#2e7d32", "#3e9b37", "#5fae3f", "#22662a", "#4a8f2e"];

/** tán lá: nhiều lá hình elip quanh một tâm */
function Canopy({ cx, cy, rx, ry, n = 80, seed = 1, size = 1 }: { cx: number; cy: number; rx: number; ry: number; n?: number; seed?: number; size?: number }) {
  return (
    <g>
      {Array.from({ length: n }, (_, i) => {
        const a = rnd(i, seed) * Math.PI * 2;
        const r = Math.sqrt(rnd(i, seed + 1));
        const x = r1(cx + Math.cos(a) * rx * r);
        const y = r1(cy + Math.sin(a) * ry * r);
        const rot = Math.round(rnd(i, seed + 2) * 180);
        return <ellipse key={i} cx={x.toFixed(1)} cy={y.toFixed(1)} rx={15 * size} ry={6.5 * size} fill={GREENS[i % GREENS.length]} transform={`rotate(${rot} ${x.toFixed(1)} ${y.toFixed(1)})`} />;
      })}
    </g>
  );
}

function Trunk({ top, width = 18, color = "#6b4a2f", branches = true }: { top: number; width?: number; color?: string; branches?: boolean }) {
  const w = width / 2;
  return (
    <g>
      <path d={`M${300 - w - 4} ${GROUND} C ${300 - w} ${GROUND - 60}, ${300 - w + 2} ${top + 60}, ${300 - w / 2} ${top} L ${300 + w / 2} ${top} C ${300 + w - 2} ${top + 60}, ${300 + w} ${GROUND - 60}, ${300 + w + 4} ${GROUND} Z`} fill={color} />
      {branches && (
        <g stroke={color} strokeWidth="7" strokeLinecap="round" fill="none">
          <path d={`M300 ${top + 70} Q 250 ${top + 40} 215 ${top + 20}`} />
          <path d={`M300 ${top + 50} Q 350 ${top + 20} 390 ${top + 10}`} />
          <path d={`M300 ${top + 110} Q 360 ${top + 90} 400 ${top + 95}`} strokeWidth="5" />
          <path d={`M300 ${top + 120} Q 240 ${top + 105} 200 ${top + 110}`} strokeWidth="5" />
        </g>
      )}
    </g>
  );
}

/** Phần trên mặt đất của từng cây. Trả về [lá, trái/hoa] để làm nổi riêng từng phần. */
function plant(shape: CropShape): { leaves: React.ReactNode; fruits: React.ReactNode; trunk: React.ReactNode } {
  switch (shape) {
    case "ca-phe":
      return {
        trunk: <Trunk top={170} />,
        leaves: <Canopy cx={300} cy={180} rx={160} ry={120} n={110} seed={3} />,
        fruits: (
          <g>
            {Array.from({ length: 14 }, (_, k) => {
              const x = 190 + rnd(k, 9) * 220;
              const y = 150 + rnd(k, 10) * 110;
              return (
                <g key={k}>
                  {Array.from({ length: 6 }, (_, j) => (
                    <circle key={j} cx={x + (j % 3) * 7} cy={y + Math.floor(j / 3) * 7} r="4.2" fill={j % 4 === 0 ? "#6aa84f" : j % 2 ? "#b3261e" : "#d9482b"} />
                  ))}
                </g>
              );
            })}
          </g>
        ),
      };
    case "sau-rieng":
      return {
        trunk: <Trunk top={150} width={22} />,
        leaves: <Canopy cx={300} cy={160} rx={175} ry={115} n={120} seed={5} size={1.1} />,
        fruits: (
          <g>
            {[
              [235, 265],
              [330, 280],
              [385, 245],
              [280, 225],
            ].map(([x, y], k) => (
              <g key={k}>
                <path d={`M${x} ${y - 46} V ${y - 24}`} stroke="#6b4a2f" strokeWidth="3" />
                <ellipse cx={x} cy={y} rx="20" ry="25" fill="#9bb33b" stroke="#6f8a1f" strokeWidth="5" strokeDasharray="2 4" />
                <ellipse cx={x - 5} cy={y - 6} rx="6" ry="9" fill="#b8cc5c" />
              </g>
            ))}
          </g>
        ),
      };
    case "cao-su":
      return {
        trunk: (
          <g>
            <Trunk top={95} width={26} color="#9b8466" branches={false} />
            {/* đường cạo mủ + chén hứng mủ */}
            <path d="M287 268 L 314 290" stroke="#f3eee2" strokeWidth="3" />
            <path d="M313 291 V 312" stroke="#f3eee2" strokeWidth="2.5" strokeLinecap="round" />
            <path d="M302 314 h 24 l -3 16 h -18 Z" fill="#cfcac0" />
            <ellipse cx="314" cy="316" rx="10" ry="3" fill="#ffffff" />
          </g>
        ),
        leaves: <Canopy cx={300} cy={115} rx={140} ry={80} n={95} seed={7} />,
        fruits: (
          <g>
            {/* giọt mủ – “trái” của cao su */}
            <path d="M314 300 q -5 9 0 13 q 5 -4 0 -13 Z" fill="#ffffff" />
            <circle cx="314" cy="324" r="13" fill="none" stroke="#f6e27a" strokeWidth="2.5" strokeDasharray="3 4" />
          </g>
        ),
      };
    case "tieu":
      return {
        trunk: <rect x="288" y="80" width="24" height={GROUND - 80} rx="4" fill="#8f8f80" />,
        leaves: (
          <g>
            {Array.from({ length: 90 }, (_, i) => {
              const y = 95 + rnd(i, 11) * 270;
              const spread = 70 - Math.abs(y - 220) * 0.12;
              const x = 300 + (rnd(i, 12) - 0.5) * 2 * spread;
              const rot = Math.round(rnd(i, 13) * 140 - 70);
              return <ellipse key={i} cx={x.toFixed(1)} cy={y.toFixed(1)} rx="13" ry="8" fill={GREENS[i % GREENS.length]} transform={`rotate(${rot} ${x.toFixed(1)} ${y.toFixed(1)})`} />;
            })}
          </g>
        ),
        fruits: (
          <g>
            {Array.from({ length: 10 }, (_, k) => {
              const x = 250 + rnd(k, 14) * 100;
              const y = 130 + rnd(k, 15) * 200;
              return (
                <g key={k}>
                  {Array.from({ length: 7 }, (_, j) => (
                    <circle key={j} cx={r1(x + [0, 1.3, 1.4, 0.2, -1.1, -1.4, -0.4][j])} cy={r1(y + j * 5.5)} r="3.2" fill={j > 4 ? "#c0392b" : "#5f9e2f"} />
                  ))}
                </g>
              );
            })}
          </g>
        ),
      };
    case "lua":
      return {
        trunk: null,
        leaves: (
          <g fill="none" strokeLinecap="round">
            {Array.from({ length: 16 }, (_, i) => {
              const x = 235 + i * 9;
              const lean = (i - 7.5) * 9;
              return <path key={i} d={`M${x} ${GROUND} Q ${x + lean * 0.3} 280 ${x + lean} ${190 + rnd(i, 16) * 30}`} stroke={GREENS[i % 4]} strokeWidth="4" />;
            })}
            {Array.from({ length: 10 }, (_, i) => {
              const x = 240 + i * 13;
              const dir = i % 2 ? 1 : -1;
              return <path key={`l${i}`} d={`M${x} ${GROUND - 20} Q ${x + dir * 40} 300 ${x + dir * 75} 290`} stroke="#5fae3f" strokeWidth="3" />;
            })}
          </g>
        ),
        fruits: (
          <g>
            {Array.from({ length: 9 }, (_, i) => {
              const x = 240 + i * 15 + (i - 4) * 6;
              const y = 190 + rnd(i, 17) * 20;
              const dir = i < 4 ? -1 : 1;
              return (
                <g key={i}>
                  <path d={`M${x} ${y} q ${dir * 22} 8 ${dir * 30} 50`} stroke="#c9a24a" strokeWidth="2.5" fill="none" />
                  {Array.from({ length: 8 }, (_, j) => (
                    <ellipse key={j} cx={x + dir * (4 + j * 3.4)} cy={y + 4 + j * 6} rx="3.4" ry="2.2" fill="#e2bf5f" transform={`rotate(${dir * 50} ${x + dir * (4 + j * 3.4)} ${y + 4 + j * 6})`} />
                  ))}
                </g>
              );
            })}
          </g>
        ),
      };
    default:
      return { trunk: <Trunk top={170} />, leaves: <Canopy cx={300} cy={180} rx={160} ry={115} n={110} seed={19} />, fruits: null };
  }
}

/** Rễ: cây thân gỗ có rễ cọc + rễ ngang; lúa có rễ chùm nông. */
function Roots({ shape }: { shape: CropShape }) {
  if (shape === "lua") {
    return (
      <g stroke="#efe3cf" strokeLinecap="round" fill="none">
        {Array.from({ length: 24 }, (_, i) => {
          const x0 = 244 + i * 5; // rễ chùm toả ra từ gốc khóm lúa
          const spread = (x0 - 302) * 1.7 + (rnd(i, 22) - 0.5) * 20;
          const depth = 120 + rnd(i, 21) * 70 - Math.abs(spread) * 0.25;
          return <path key={i} d={`M${x0} ${GROUND} q ${(spread * 0.35).toFixed(1)} ${(depth * 0.55).toFixed(1)} ${spread.toFixed(1)} ${depth.toFixed(1)}`} strokeWidth={i % 3 ? 1.6 : 2.4} />;
        })}
      </g>
    );
  }
  const deep = shape === "tieu" ? 600 : 760;
  return (
    <g stroke="#efe3cf" strokeLinecap="round" fill="none">
      <path d={`M300 ${GROUND} C 302 470, 296 600, 300 ${deep}`} strokeWidth="9" />
      {[
        [400, 165, 470],
        [430, -150, 480],
        [480, 190, 560],
        [520, -175, 600],
        [580, 120, 650],
        [620, -120, 690],
      ]
        .filter(([y]) => y < deep - 20)
        .map(([y, dx, y2], i) => (
          <g key={i}>
            <path d={`M300 ${y} C ${300 + dx * 0.4} ${y + 10}, ${300 + dx * 0.8} ${y2 - 30}, ${300 + dx} ${y2}`} strokeWidth="5" />
            <path d={`M${300 + dx * 0.6} ${y + 25} q ${dx * 0.15} 30 ${dx * 0.1} 55`} strokeWidth="2.5" />
            <path d={`M${300 + dx * 0.85} ${y2 - 25} q ${dx * 0.2} 5 ${dx * 0.35} 30`} strokeWidth="2" />
          </g>
        ))}
    </g>
  );
}

const NUTRIENT = {
  N: { fill: "#3e9b37", text: "#ffffff" },
  P: { fill: "#f6e27a", text: "#143f1b" },
  K: { fill: "#143f1b", text: "#f6e27a" },
} as const;

/** hạt dinh dưỡng: chấm tròn có chữ, trôi lên theo rễ (CSS .kn-rise) */
const OFFSETS = [
  [-95, 40],
  [60, 70],
  [120, -10],
  [-40, -20],
  [15, 110],
  [-130, -60],
  [95, -80],
  [-10, -95],
  [150, 60],
];
function Particles({ kinds, active, at, spread = 1 }: { kinds: (keyof typeof NUTRIENT)[]; active: boolean; at: [number, number]; spread?: number }) {
  const spots = OFFSETS.map(([dx, dy]) => [at[0] + dx * spread, at[1] + dy * spread]);
  return (
    <g className={cn("transition-opacity duration-500", active ? "opacity-100" : "opacity-0")}>
      {spots.map(([x, y], i) => {
        const k = kinds[i % kinds.length];
        return (
          <g key={i} className="kn-rise" style={{ animationDelay: `${(i * 0.37) % 2.6}s` }}>
            <circle cx={x} cy={y} r="11" fill={NUTRIENT[k].fill} stroke="#ffffff" strokeWidth="2" />
            <text x={x} y={y + 4.5} textAnchor="middle" fontSize="12" fontWeight="800" fill={NUTRIENT[k].text}>
              {k}
            </text>
          </g>
        );
      })}
    </g>
  );
}

/** máy quay theo bước: [tỉ lệ, tâm x, tâm y] */
function camera(step: number, shape: CropShape): [number, number, number] {
  const leaf: Record<CropShape, [number, number]> = { "ca-phe": [300, 190], "cao-su": [300, 120], "sau-rieng": [300, 170], tieu: [300, 200], lua: [300, 230], cay: [300, 190] };
  const fruit: Record<CropShape, [number, number]> = { "ca-phe": [300, 210], "cao-su": [312, 300], "sau-rieng": [310, 255], tieu: [300, 230], lua: [300, 230], cay: [300, 210] };
  switch (step) {
    case 1:
      return [1.55, ...leaf[shape]];
    case 2:
      return [shape === "cao-su" ? 2.6 : 1.85, ...fruit[shape]];
    case 3:
      return [1.35, 300, shape === "lua" ? 470 : 590];
    case 4:
      return [1.55, ...leaf[shape]];
    default:
      return [1, 300, shape === "cao-su" ? 360 : 400];
  }
}

/** chú thích theo bước (hiện bằng HTML phủ trên cảnh để không bị cắt khi khung đổi tỉ lệ) */
export const CALLOUT = ["", "N · Đạm → lá, cành", "P · Lân + K · Kali → hoa, trái", "Hữu cơ + vi sinh → rễ, đất", "Thuốc BVTV → chặn sâu bệnh"];

export function GardenScene({ shape, step, label }: { shape: CropShape; step: number; label: string }) {
  const [s, fx, fy] = camera(step, shape);
  const tx = 300 - fx * s;
  const ty = 450 - fy * s;
  const p = plant(shape);
  const dim = (on: boolean) => cn("transition-opacity duration-700", step === 0 || on ? "opacity-100" : "opacity-30");

  return (
    <svg viewBox="0 0 600 900" preserveAspectRatio="xMidYMid slice" className="block size-full" role="img" aria-label={label}>
      <g style={{ transform: `translate(${tx}px, ${ty}px) scale(${s})`, transformOrigin: "0 0" }} className="transition-transform duration-[900ms] ease-[cubic-bezier(0.65,0,0.35,1)] motion-reduce:transition-none">
        {/* trời */}
        <rect x="-600" y="-400" width="1800" height={GROUND + 400} fill="#eaf3df" />
        <circle cx="505" cy="85" r="40" fill="#f6e27a" />
        <circle cx="505" cy="85" r="58" fill="#f6e27a" opacity="0.25" />
        <g fill="#ffffff" opacity="0.9">
          <ellipse cx="110" cy="80" rx="46" ry="15" />
          <ellipse cx="140" cy="70" rx="30" ry="16" />
          <ellipse cx="560" cy="170" rx="38" ry="11" />
        </g>

        {/* đất: 3 lớp gợn sóng */}
        <path d={`M-600 ${GROUND} H 1200 V 1300 H -600 Z`} fill="#7a5a3c" />
        <path d="M-600 525 C -300 505, -100 545, 150 520 S 600 500, 1200 530 V 1300 H -600 Z" fill="#6a4c32" />
        <path d="M-600 705 C -250 690, 50 725, 300 700 S 800 690, 1200 715 V 1300 H -600 Z" fill="#573f2a" />
        {/* sỏi, mùn */}
        <g>
          {Array.from({ length: 34 }, (_, i) => (
            <ellipse key={i} cx={(rnd(i, 31) * 900 - 150).toFixed(0)} cy={(GROUND + 40 + rnd(i, 32) * 470).toFixed(0)} rx={(3 + rnd(i, 33) * 9).toFixed(1)} ry={(2 + rnd(i, 34) * 5).toFixed(1)} fill={i % 3 ? "#8d7257" : "#3e2b1c"} opacity="0.8" />
          ))}
        </g>
        {/* cỏ trên mặt đất */}
        <g stroke="#5fae3f" strokeWidth="2.5" strokeLinecap="round">
          {Array.from({ length: 40 }, (_, i) => {
            const x = -120 + i * 22 + rnd(i, 35) * 10;
            return <path key={i} d={`M${x} ${GROUND} l ${(rnd(i, 36) - 0.5) * 8} -${6 + rnd(i, 37) * 8}`} />;
          })}
        </g>
        <path d={`M-600 ${GROUND} H 1200`} stroke="#4f3a26" strokeWidth="3" />

        {/* thước độ sâu */}
        <g className={dim(step === 3)} fontSize="11" fill="#f3eee2" fontWeight="600">
          <path d={`M560 ${GROUND} V 800`} stroke="#f3eee2" strokeWidth="1.5" opacity="0.6" />
          {[0, 20, 40, 60, 80].map((cm, i) => (
            <g key={cm}>
              <path d={`M552 ${GROUND + i * 100} H 568`} stroke="#f3eee2" strokeWidth="1.5" opacity="0.6" />
              <text x="548" y={GROUND + i * 100 + 4} textAnchor="end" opacity="0.85">
                {cm} cm
              </text>
            </g>
          ))}
        </g>

        {/* rễ + vi sinh + mùn hữu cơ */}
        <g className={dim(step === 3)}>
          <Roots shape={shape} />
          <g stroke="#d7e8b9" strokeWidth="2" fill="none" strokeLinecap="round" className={cn("transition-opacity duration-700", step === 3 ? "opacity-100" : "opacity-40")}>
            {Array.from({ length: 16 }, (_, i) => {
              const x = 170 + rnd(i, 41) * 260;
              const y = 430 + rnd(i, 42) * 300;
              return <path key={i} d={`M${x.toFixed(0)} ${y.toFixed(0)} q 4 -5 8 0 t 8 0`} className="kn-wiggle" style={{ animationDelay: `${(i * 0.21) % 1.6}s` }} />;
            })}
          </g>
        </g>

        {/* cây */}
        <g>{p.trunk}</g>
        <g className={dim(step === 1 || step === 4)}>{p.leaves}</g>
        <g className={dim(step === 2)}>{p.fruits}</g>

        {/* sâu hại + vòng bảo vệ (bước 4) */}
        <g className={cn("transition-opacity duration-500", step === 4 ? "opacity-100" : "opacity-0")}>
          {[
            [215, 150],
            [380, 205],
            [290, 110],
          ].map(([x, y], i) => (
            <g key={i}>
              <ellipse cx={x} cy={y} rx="9" ry="6" fill="#3b2a1a" />
              <circle cx={x + 8} cy={y - 2} r="3.5" fill="#3b2a1a" />
              <path d={`M${x - 6} ${y + 5} l -4 5 M${x} ${y + 6} v 6 M${x + 5} ${y + 5} l 4 5`} stroke="#3b2a1a" strokeWidth="1.5" />
              <path d={`M${x - 16} ${y - 14} L ${x + 18} ${y + 14}`} stroke="#d1242f" strokeWidth="3" strokeLinecap="round" />
            </g>
          ))}
          <ellipse cx="300" cy={shape === "cao-su" ? 120 : 185} rx="205" ry="150" fill="none" stroke="#f6e27a" strokeWidth="4" strokeDasharray="10 9" className="kn-spin-slow" />
        </g>

        {/* hạt dinh dưỡng theo bước */}
        {/* hạt dinh dưỡng: trong đất (tổng quan) và quanh phần cây đang phóng to */}
        <Particles kinds={["N", "P", "K"]} active={step === 0} at={[300, 600]} spread={1.4} />
        <Particles kinds={["N"]} active={step === 1} at={[camera(1, shape)[1], camera(1, shape)[2] + 40]} spread={0.75} />
        <Particles kinds={["P", "K"]} active={step === 2} at={[camera(2, shape)[1], camera(2, shape)[2] + 30]} spread={shape === "cao-su" ? 0.45 : 0.62} />
        <g className={cn("transition-opacity duration-500", step === 3 ? "opacity-100" : "opacity-0")}>
          {Array.from({ length: 20 }, (_, i) => (
            <rect key={i} x={(160 + rnd(i, 51) * 280).toFixed(0)} y={(GROUND + 8 + rnd(i, 52) * 70).toFixed(0)} width="7" height="4" rx="1.5" fill="#2b1d12" transform={`rotate(${Math.round(rnd(i, 53) * 90)} ${(160 + rnd(i, 51) * 280).toFixed(0)} ${(GROUND + 8 + rnd(i, 52) * 70).toFixed(0)})`} />
          ))}
        </g>
      </g>

    </svg>
  );
}
