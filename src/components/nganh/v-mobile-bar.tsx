import { MessageCircle, Phone } from "lucide-react";
import { COMPANY, telHref, type Vertical } from "@/lib/verticals";

/** Thanh hành động cố định trên di động: gọi & Zalo luôn trong tầm ngón cái. */
export function VMobileBar({ vertical }: { vertical: Vertical }) {
  return (
    <div className="pb-safe fixed inset-x-0 bottom-0 z-40 grid grid-cols-2 gap-2 border-t border-v-line bg-v-bg/95 p-2 backdrop-blur-md lg:hidden">
      <a href={COMPANY.zalo} target="_blank" rel="noopener noreferrer" className="flex h-12 items-center justify-center gap-2 rounded-lg bg-v-tint text-sm font-medium text-v-on-tint">
        <MessageCircle className="size-4" aria-hidden /> Zalo báo giá
      </a>
      <a href={telHref(vertical.phone)} className="flex h-12 items-center justify-center gap-2 rounded-lg bg-v-accent text-sm font-medium text-v-on-accent">
        <Phone className="size-4" aria-hidden /> Gọi ngay
      </a>
    </div>
  );
}
