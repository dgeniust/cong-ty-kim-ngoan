import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Reveal } from "@/components/shared/reveal";
import { cn } from "@/lib/utils";

export function VContainer({ className, ...props }: React.ComponentProps<"div">) {
  return <div className={cn("mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8", className)} {...props} />;
}

/** Viên nhãn nhỏ đầu khối (kiểu tag Notion). */
export function VTag({ children, className }: { children: React.ReactNode; className?: string }) {
  return <p className={cn("inline-flex items-center gap-1.5 rounded-full bg-v-chip px-3 py-1 text-caption font-medium text-v-fg", className)}>{children}</p>;
}

/** Từ được bọc trong viên màu – dấu hiệu chữ ký của phong cách Notion. */
export function VPill({ children, className }: { children: React.ReactNode; className?: string }) {
  return <span className={cn("inline-block rounded-full bg-v-pill px-[0.35em] leading-[1.15] text-v-on-pill", className)}>{children}</span>;
}

/** Tiêu đề khối: viên nhãn + tiêu đề lớn + link "xem tất cả". */
export function VHeading({
  id,
  index,
  title,
  subtitle,
  href,
  hrefLabel,
  className,
  center,
}: {
  id: string;
  index?: string;
  title: React.ReactNode;
  subtitle?: string;
  href?: string;
  hrefLabel?: string;
  className?: string;
  center?: boolean;
}) {
  return (
    <Reveal className={cn("mb-10 flex flex-wrap items-end gap-x-10 gap-y-5 md:mb-12", center ? "flex-col items-center text-center" : "justify-between", className)}>
      <div className={cn("max-w-3xl", center && "flex flex-col items-center")}>
        {index && <VTag>{index}</VTag>}
        <h2 id={id} className="text-h2 v-display mt-3 text-v-fg">
          {title}
        </h2>
        {subtitle && <p className="mt-4 max-w-xl text-lead leading-relaxed text-v-mute">{subtitle}</p>}
      </div>
      {href && (
        <Link href={href} className="group inline-flex h-9 items-center gap-2 rounded-lg border border-v-line px-4 text-small font-medium text-v-fg transition-colors duration-200 hover:bg-v-raise">
          {hrefLabel ?? "Xem tất cả"}
          <ArrowRight className="size-4 transition-transform duration-200 group-hover:translate-x-0.5" aria-hidden />
        </Link>
      )}
    </Reveal>
  );
}
