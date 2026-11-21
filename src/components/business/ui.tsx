import type { ReactNode } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

/** Mảnh giao diện dùng chung của landing Business (Editorial Industrial): phẳng, không khung, bo góc rất nhẹ. */

/** Khung nội dung: tối đa 1280px, lề rộng rãi. */
export const BIZ_WRAP = "mx-auto w-full max-w-[1280px] px-5 sm:px-8 lg:px-12";

const BUTTON = "group inline-flex h-12 items-center justify-center gap-2 rounded-md px-6 text-body font-semibold transition-colors duration-200";
export const bizButton = {
  /** nút đặc – màu cam đồng */
  solid: cn(BUTTON, "bg-hub-blue text-white hover:bg-hub-blue-hover"),
  /** nút nền trắng, dùng trên nền màu/ảnh */
  light: cn(BUTTON, "bg-white text-hub-ink shadow-sm hover:bg-hub-canvas"),
};

/** Mũi tên trượt sang phải khi rê chuột vào phần tử cha có class `group`. */
export function SlideArrow({ className }: { className?: string }) {
  return <ArrowRight className={cn("size-4 transition-transform duration-300 ease-soft group-hover:translate-x-1", className)} aria-hidden />;
}

/** Đường dẫn dạng chữ + mũi tên trượt (nút phụ). */
export function ArrowLink({ href, children, className }: { href: string; children: ReactNode; className?: string }) {
  return (
    <Link href={href} className={cn("group inline-flex h-12 items-center gap-2 text-body font-semibold text-hub-ink transition-colors hover:text-hub-blue", className)}>
      <span className="bg-[linear-gradient(currentColor,currentColor)] bg-[length:0%_1px] bg-left-bottom bg-no-repeat pb-0.5 transition-[background-size] duration-300 ease-soft group-hover:bg-[length:100%_1px]">{children}</span>
      <SlideArrow />
    </Link>
  );
}

/** Nhãn nhỏ in hoa đầu khối. */
export function Eyebrow({ children, className }: { children: ReactNode; className?: string }) {
  return <p className={cn("text-[12px] font-semibold uppercase leading-[1.5] tracking-[0.16em] text-hub-blue", className)}>{children}</p>;
}

/** Tiêu đề khối (h2) – đậm, tracking âm nhẹ. */
export function SectionTitle({ id, children, className }: { id: string; children: ReactNode; className?: string }) {
  return (
    <h2 id={id} className={cn("mt-4 text-[clamp(2rem,3.4vw,2.875rem)] font-bold leading-[1.1] tracking-[-0.02em] text-hub-ink", className)}>
      {children}
    </h2>
  );
}

/** Thẻ ngành nhỏ (chấm màu + tên). */
export function SectorTag({ dot, children, className }: { dot: string; children: ReactNode; className?: string }) {
  return (
    <span className={cn("inline-flex items-center gap-1.5 text-[12px] font-semibold uppercase tracking-[0.12em] text-hub-ink-soft", className)}>
      <span aria-hidden className={cn("size-1.5 rounded-full", dot)} />
      {children}
    </span>
  );
}
