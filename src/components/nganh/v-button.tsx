import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

/** Nút dùng chung cho chuyên trang lốp xe / sắt thép – hình dáng & màu lấy từ token theme. */
const vButton = cva(
  "v-cut v-label group/btn inline-flex shrink-0 items-center justify-center gap-2.5 whitespace-nowrap text-[15px] transition-[background-color,color,transform] duration-300 ease-soft active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50 [&_svg]:size-4 [&_svg]:shrink-0 [&_svg]:transition-transform [&_svg]:duration-300 hover:[&_svg.arrow]:translate-x-1",
  {
    variants: {
      variant: {
        accent: "bg-v-accent text-v-on-accent hover:brightness-110",
        solid: "bg-v-fg text-v-bg hover:bg-v-accent hover:text-v-on-accent",
        quiet: "bg-v-raise text-v-fg hover:bg-v-sunk",
        onInvert: "bg-v-on-invert text-v-invert hover:brightness-95",
      },
      size: { md: "h-12 px-7", lg: "h-14 px-9 text-base", sm: "h-10 px-5 text-sm" },
    },
    defaultVariants: { variant: "accent", size: "md" },
  },
);

export function VButton({
  className,
  variant,
  size,
  asChild,
  ...props
}: React.ComponentProps<"button"> & VariantProps<typeof vButton> & { asChild?: boolean }) {
  const Comp = asChild ? Slot : "button";
  return <Comp className={cn(vButton({ variant, size }), className)} {...props} />;
}
