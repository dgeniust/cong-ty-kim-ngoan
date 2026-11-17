"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import { cn } from "@/lib/utils";

const WIDTHS = [155, 165, 175, 185, 195, 205, 215, 225, 235, 245, 255, 265, 275, 285];
const RATIOS = [40, 45, 50, 55, 60, 65, 70, 75, 80];
const RIMS = [13, 14, 15, 16, 17, 18, 19, 20];

/**
 * Tra cứu cỡ lốp: chọn bề rộng / tỉ lệ / đường kính mâm → mở danh sách sản phẩm lọc theo cỡ (?q=205/55R16).
 * Bên cạnh là phần giải thích từng con số, sáng lên theo lựa chọn.
 */
export function TyreFinder({ base, popular }: { base: string; popular: string[] }) {
  const router = useRouter();
  const [w, setW] = useState(205);
  const [r, setR] = useState(55);
  const [d, setD] = useState(16);
  const [focus, setFocus] = useState<"w" | "r" | "d" | null>(null);
  const size = `${w}/${r}R${d}`;

  const select = "h-12 w-full appearance-none rounded-lg border border-v-line bg-v-bg px-3.5 text-[17px] font-semibold tabular-nums text-v-fg outline-none transition-[border-color,box-shadow] duration-200 focus:border-v-accent focus:shadow-[0_0_0_3px_var(--v-tint)]";
  const part = (k: "w" | "r" | "d") => cn("rounded-md px-1 transition-colors duration-200", focus === k ? "bg-v-accent text-v-on-accent" : "text-v-fg");

  return (
    <div className="grid gap-4 lg:grid-cols-[1.2fr_1fr]">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          router.push(`${base}/san-pham?q=${encodeURIComponent(size)}`);
        }}
        className="rounded-xl border border-v-line bg-v-card p-6 sm:p-8"
      >
        <p className="text-sm font-semibold text-v-fg">Tra cứu theo cỡ lốp</p>
        <p className="mt-1 text-sm text-v-mute">Xem cỡ in trên hông lốp đang dùng, chọn đúng 3 con số.</p>
        <div className="mt-6 grid grid-cols-3 gap-2.5">
          {(
            [
              ["w", "Bề rộng (mm)", w, setW, WIDTHS],
              ["r", "Tỉ lệ (%)", r, setR, RATIOS],
              ["d", "Mâm (inch)", d, setD, RIMS],
            ] as const
          ).map(([k, label, value, set, opts]) => (
            <label key={k} className="block">
              <span className="mb-1.5 block text-[13px] text-v-mute">{label}</span>
              <select value={value} onChange={(e) => set(Number(e.target.value))} onFocus={() => setFocus(k)} onBlur={() => setFocus(null)} className={select}>
                {opts.map((o) => (
                  <option key={o} value={o}>
                    {k === "d" ? `R${o}` : o}
                  </option>
                ))}
              </select>
            </label>
          ))}
        </div>
        <button type="submit" className="mt-5 inline-flex h-12 w-full items-center justify-center gap-2 rounded-lg bg-v-accent text-[15px] font-medium text-v-on-accent transition-colors duration-200 hover:bg-v-accent-hover">
          <Search className="size-4" aria-hidden /> Tìm lốp {size}
        </button>
        {popular.length > 0 && (
          <div className="mt-5 flex flex-wrap items-center gap-1.5">
            <span className="mr-1 text-[13px] text-v-mute">Cỡ phổ biến:</span>
            {popular.map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => router.push(`${base}/san-pham?q=${encodeURIComponent(p)}`)}
                className="rounded-full bg-v-chip px-3 py-1 text-[13px] font-medium tabular-nums text-v-fg transition-colors duration-200 hover:bg-v-tint hover:text-v-on-tint"
              >
                {p}
              </button>
            ))}
          </div>
        )}
      </form>

      <div className="rounded-xl bg-v-island p-6 text-v-on-island sm:p-8">
        <p className="text-sm font-semibold">Đọc cỡ lốp thế nào?</p>
        <p className="mt-6 text-center text-[clamp(2.25rem,5vw,3.5rem)] font-semibold tabular-nums tracking-[-0.04em]" aria-live="polite">
          <span className={part("w")}>{w}</span>/<span className={part("r")}>{r}</span>R<span className={part("d")}>{d}</span>
        </p>
        <dl className="mt-6 space-y-2.5 text-sm">
          {[
            ["w", `${w}`, "Bề rộng mặt lốp, tính bằng mm."],
            ["r", `${r}`, "Chiều cao hông lốp bằng bao nhiêu % bề rộng."],
            ["d", `R${d}`, "Lốp bố tỏa tròn (Radial), lắp mâm đường kính theo inch."],
          ].map(([k, v, t]) => (
            <div key={k} className={cn("flex gap-3 rounded-lg p-2.5 transition-colors duration-200", focus === k && "bg-v-accent/15")}>
              <dt className="w-12 shrink-0 font-semibold tabular-nums">{v}</dt>
              <dd className="opacity-75">{t}</dd>
            </div>
          ))}
        </dl>
      </div>
    </div>
  );
}
