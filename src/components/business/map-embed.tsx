"use client";

import { useState } from "react";
import { MousePointerClick, Navigation } from "lucide-react";

/**
 * Bản đồ Google nhúng, KHÔNG bắt con lăn chuột khi người dùng đang cuộn trang:
 * lớp phủ trong suốt chặn tương tác cho tới khi bấm vào bản đồ; rời chuột khỏi bản đồ thì khoá lại.
 */
export function MapEmbed({ query, title, hint, directionsLabel }: { query: string; title: string; hint: string; directionsLabel: string }) {
  const [active, setActive] = useState(false);
  const q = encodeURIComponent(query);
  return (
    <div className="relative h-full min-h-[420px] bg-hub-stone" onMouseLeave={() => setActive(false)}>
      <iframe title={title} src={`https://www.google.com/maps?q=${q}&output=embed`} loading="lazy" referrerPolicy="no-referrer-when-downgrade" className="absolute inset-0 size-full border-0" />
      {!active && (
        <button type="button" onClick={() => setActive(true)} className="group absolute inset-0 flex items-start justify-end p-4" aria-label={hint}>
          <span className="inline-flex items-center gap-2 rounded-md bg-white/90 px-3 py-2 text-small font-medium text-hub-ink shadow-sm opacity-0 backdrop-blur transition-opacity duration-200 group-hover:opacity-100 group-focus-visible:opacity-100">
            <MousePointerClick className="size-4" aria-hidden /> {hint}
          </span>
        </button>
      )}
      <a
        href={`https://www.google.com/maps/dir/?api=1&destination=${q}`}
        target="_blank"
        rel="noopener noreferrer"
        className="group absolute bottom-5 left-5 inline-flex h-12 items-center gap-2 rounded-md bg-hub-ink px-5 text-body font-semibold text-white shadow-[0_8px_24px_rgb(0_0_0/0.18)] transition-colors hover:bg-black"
      >
        <Navigation className="size-4" aria-hidden /> {directionsLabel}
      </a>
    </div>
  );
}
