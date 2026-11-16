import Link from "next/link";
import { COMPANY, VERTICAL_LIST, type VerticalId } from "@/lib/verticals";
import { cn } from "@/lib/utils";

/**
 * Dải mỏng trên cùng mỗi chuyên trang: quay về landing tổng + chuyển nhanh giữa 3 ngành.
 * `tone` chỉ đổi màu nền/chữ để hợp với theme của chuyên trang.
 */
export function SectorSwitcher({ current, tone }: { current: VerticalId; tone: "green" | "dark" | "light" }) {
  const tones = {
    green: "bg-brand-950 text-white/70 [--on:#fff]",
    dark: "bg-[#0a0502] text-[#ffedd7]/60 [--on:#ffedd7]",
    light: "bg-black text-white/55 [--on:#e4f222]",
  } as const;
  return (
    <nav aria-label="Các lĩnh vực của Kim Ngoan" className={cn("text-[13px]", tones[tone])}>
      <div className="mx-auto flex h-9 max-w-7xl items-center gap-5 overflow-x-auto px-4 [scrollbar-width:none] sm:px-6 lg:px-8 [&::-webkit-scrollbar]:hidden">
        <Link href="/" className="shrink-0 font-semibold tracking-wide text-white transition-opacity hover:opacity-80">
          {COMPANY.name}
        </Link>
        <span aria-hidden className="h-3 w-px shrink-0 bg-white/25" />
        {VERTICAL_LIST.map((v) => (
          <Link
            key={v.id}
            href={v.base}
            aria-current={v.id === current ? "true" : undefined}
            className={cn("shrink-0 transition-colors hover:text-white", v.id === current && "font-semibold text-[var(--on)]")}
          >
            {v.short}
          </Link>
        ))}
      </div>
    </nav>
  );
}
