"use client";

import { useEffect, useState } from "react";
import { ArrowUp, MessageCircle, Phone } from "lucide-react";
import { cn } from "@/lib/utils";

/** Cụm nút nổi góc phải dưới: gọi hotline, Zalo, lên đầu trang. */
export function HubFloating({ phone, phoneHref, zalo }: { phone: string; phoneHref: string; zalo: string }) {
  const [deep, setDeep] = useState(false);

  useEffect(() => {
    const onScroll = () => setDeep(window.scrollY > 700);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const circle = "grid size-12 place-items-center rounded-full shadow-[var(--shadow-craft)] transition-transform duration-300 ease-soft hover:scale-110";

  return (
    <div className="pb-safe fixed bottom-4 right-4 z-40 flex flex-col items-center gap-2.5 sm:bottom-6 sm:right-6">
      <button
        type="button"
        aria-label="Lên đầu trang"
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        className={cn(circle, "bg-hub-peri-soft text-hub-ink transition-[opacity,transform]", deep ? "opacity-100" : "pointer-events-none translate-y-3 opacity-0")}
        tabIndex={deep ? 0 : -1}
      >
        <ArrowUp className="size-5" aria-hidden />
      </button>
      <a href={zalo} target="_blank" rel="noopener noreferrer" aria-label="Nhắn Zalo" className={cn(circle, "bg-hub-sky text-hub-ink")}>
        <MessageCircle className="size-5" aria-hidden />
      </a>
      <a href={phoneHref} aria-label={`Gọi hotline ${phone}`} className={cn(circle, "relative bg-hub-papaya text-white")}>
        <span aria-hidden className="absolute inset-0 animate-ping rounded-full bg-hub-papaya/35 [animation-duration:2.4s]" />
        <Phone className="relative size-5" aria-hidden />
      </a>
    </div>
  );
}
