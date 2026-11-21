import type { ReactNode } from "react";
import Link from "next/link";
import { ArrowRight, type LucideIcon } from "lucide-react";
import { Reveal } from "@/components/shared/reveal";
import { BUTTON_SIZES } from "@/lib/ui";
import { cn } from "@/lib/utils";
import { SECTOR_DOT, type VerticalId } from "@/lib/verticals";

/** Mảnh giao diện dùng chung cho các khối của landing tổng. */

/** Khung nội dung: rộng tối đa 1320px, lề hai bên theo màn hình. */
export const HUB_WRAP = "mx-auto w-full max-w-[1320px] px-4 sm:px-6 lg:px-10";

const BUTTON = `inline-flex items-center justify-center gap-2 rounded-xl font-medium transition-colors duration-200 ${BUTTON_SIZES.md}`;
export const hubButton = {
  /** nút chính: nền xanh rừng; mũi tên bên trong nhích sang khi rê chuột */
  primary: `${BUTTON} group bg-hub-blue text-white hover:bg-hub-blue-hover`,
  /** nút phụ trên nền màu */
  paper: cn(BUTTON, "bg-hub-paper text-hub-ink hover:bg-hub-paper/70"),
  /** nút nổi trên ảnh/bản đồ */
  floating: cn(BUTTON, "bg-hub-paper text-hub-ink shadow-[var(--shadow-hub-ui)] hover:bg-hub-canvas"),
};

/** Mũi tên "đi tiếp" – nhích sang phải khi rê chuột vào thẻ/nút cha có class `group`. */
export function ArrowIcon({ icon: Icon = ArrowRight, className = "group-hover:translate-x-0.5" }: { icon?: LucideIcon; className?: string }) {
  return <Icon className={cn("size-4 transition-transform duration-200", className)} aria-hidden />;
}

/** Dòng chữ cuối thẻ ("Đọc tiếp →"): đổi màu khi rê chuột vào cả thẻ. */
export function CardCue({ children, className, icon }: { children: ReactNode; className?: string; icon?: ReactNode }) {
  return (
    <span className={cn("mt-auto inline-flex items-center gap-1.5 text-small font-semibold text-hub-ink transition-colors group-hover:text-hub-blue", className)}>
      {children} {icon ?? <ArrowIcon />}
    </span>
  );
}

/** Chấm màu của ngành. */
export function SectorDot({ id, className = "size-2" }: { id: VerticalId; className?: string }) {
  return <span aria-hidden className={cn("rounded-full", className, SECTOR_DOT[id])} />;
}

/** Nhãn nhỏ đầu khối: gạch ngắn + chữ xanh (không viết hoa toàn bộ). */
export function Eyebrow({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <p className={cn("flex items-center gap-2.5 text-small font-semibold text-hub-blue", className)}>
      <span aria-hidden className="h-[2px] w-6 rounded-full bg-current" />
      {children}
    </p>
  );
}

type HeaderText = { id: string; eyebrow: string; title: string; lead: string };

/** Tiêu đề khối dạng hai cột: tiêu đề bên trái, lời dẫn bên phải (màn hình lớn). */
export function SplitSectionHeader({ id, eyebrow, title, lead, className }: HeaderText & { className?: string }) {
  return (
    <Reveal className={cn("mb-10 grid gap-5 lg:grid-cols-12 lg:items-end lg:gap-8", className)}>
      <div className="lg:col-span-7">
        <Eyebrow>{eyebrow}</Eyebrow>
        <h2 id={id} className="mt-4 text-h1 font-semibold text-hub-ink">
          {title}
        </h2>
      </div>
      <p className="text-lead leading-relaxed text-hub-ink-soft lg:col-span-5">{lead}</p>
    </Reveal>
  );
}

/** Tiêu đề khối xếp dọc, kèm một đường dẫn "xem tất cả" ở bên phải. */
export function StackedSectionHeader({ id, eyebrow, title, lead, action }: HeaderText & { action: { href: string; label: string } }) {
  return (
    <Reveal className="mb-10 flex flex-wrap items-end justify-between gap-x-8 gap-y-5 md:mb-14">
      <div className="max-w-3xl">
        <Eyebrow>{eyebrow}</Eyebrow>
        <h2 id={id} className="mt-4 text-h1 font-semibold text-hub-ink">
          {title}
        </h2>
        <p className="mt-4 text-lead leading-relaxed text-hub-ink-soft">{lead}</p>
      </div>
      <Link href={action.href} className="group inline-flex min-h-11 items-center gap-1.5 text-body font-semibold text-hub-blue">
        {action.label} <ArrowIcon />
      </Link>
    </Reveal>
  );
}
