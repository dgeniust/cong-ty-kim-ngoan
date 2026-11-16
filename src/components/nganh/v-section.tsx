import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Reveal } from "@/components/shared/reveal";
import { cn } from "@/lib/utils";

export function VContainer({ className, ...props }: React.ComponentProps<"div">) {
  return <div className={cn("mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8", className)} {...props} />;
}

/** Tiêu đề khối: số thứ tự + tiêu đề lớn + link "xem tất cả". */
export function VHeading({
  id,
  index,
  title,
  subtitle,
  href,
  hrefLabel,
  className,
}: {
  id: string;
  index?: string;
  title: string;
  subtitle?: string;
  href?: string;
  hrefLabel?: string;
  className?: string;
}) {
  return (
    <Reveal className={cn("mb-10 flex flex-wrap items-end justify-between gap-x-10 gap-y-5 md:mb-14", className)}>
      <div className="max-w-2xl">
        {index && (
          <p className="v-label mb-3 flex items-center gap-3 text-sm text-v-mute">
            <span className="text-v-mark">{index}</span>
            <span aria-hidden className="h-px w-10 bg-current opacity-40" />
          </p>
        )}
        <h2 id={id} className="v-display text-[clamp(2.25rem,5.2vw,4.25rem)] text-v-fg">
          {title}
        </h2>
        {subtitle && <p className="mt-4 text-base leading-relaxed text-v-mute md:text-lg">{subtitle}</p>}
      </div>
      {href && (
        <Link href={href} className="v-label group inline-flex items-center gap-2 text-[15px] text-v-fg">
          <span className="bg-[linear-gradient(currentColor,currentColor)] bg-[length:100%_2px] bg-[position:0_100%] bg-no-repeat pb-1">{hrefLabel ?? "Xem tất cả"}</span>
          <ArrowRight className="size-4 transition-transform duration-300 ease-soft group-hover:translate-x-1.5" aria-hidden />
        </Link>
      )}
    </Reveal>
  );
}
