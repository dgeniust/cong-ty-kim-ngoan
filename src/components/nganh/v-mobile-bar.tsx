import { MessageCircle, Phone } from "lucide-react";
import { COMPANY, telHref, type Vertical } from "@/lib/verticals";

/** Thanh hành động cố định trên di động: gọi & Zalo luôn trong tầm ngón cái. */
export function VMobileBar({ vertical }: { vertical: Vertical }) {
  return (
    <div className="pb-safe fixed inset-x-0 bottom-0 z-40 grid grid-cols-2 bg-v-bg shadow-[0_-12px_30px_-16px_rgb(0_0_0/0.5)] lg:hidden">
      <a href={COMPANY.zalo} target="_blank" rel="noopener noreferrer" className="v-label flex h-14 items-center justify-center gap-2 text-sm text-v-fg">
        <MessageCircle className="size-4" aria-hidden /> Zalo báo giá
      </a>
      <a href={telHref(vertical.phone)} className="v-label flex h-14 items-center justify-center gap-2 bg-v-accent text-sm text-v-on-accent">
        <Phone className="size-4" aria-hidden /> Gọi ngay
      </a>
    </div>
  );
}
