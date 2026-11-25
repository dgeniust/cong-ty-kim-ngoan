import Image from "next/image";
import { cn } from "@/lib/utils";

/** Intrinsic size of `public/brand/kim-ngoan-logo.svg` (aspect ratio ≈ 3:2). */
const W = 682;
const H = 455;

/**
 * Kim Ngoan lotus "KN" mark (transparent background).
 * Uses the bold-stroke variant, which stays legible from favicon size up to ~120px;
 * `public/brand/kim-ngoan-logo-full.svg` keeps the original thin strokes for large prints.
 * Size it by height (e.g. `h-10`); the width follows the aspect ratio.
 * Decorative by default because it always sits next to the company name.
 */
export function BrandMark({ className, eager, alt = "" }: { className?: string; /** Load immediately (headers, above the fold). */ eager?: boolean; alt?: string }) {
  return (
    <Image
      src="/brand/kim-ngoan-logo.svg"
      alt={alt}
      width={W}
      height={H}
      loading={eager ? "eager" : "lazy"}
      unoptimized
      className={cn("h-10 w-auto shrink-0 select-none", className)}
      draggable={false}
    />
  );
}
