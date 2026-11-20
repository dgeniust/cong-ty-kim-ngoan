"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import { ZONES } from "@/lib/content/hub-extras";
import { cn } from "@/lib/utils";

const DOT = ["bg-hub-marigold", "bg-hub-sky", "bg-hub-muted"];

/** Sa bàn 3D (bản đồ + xe giao hàng) chỉ tải khi khối này sắp vào màn hình → không làm chậm lúc mở trang. */
const DeliveryStage = dynamic(() => import("./delivery-stage").then((m) => m.DeliveryStage), {
  ssr: false,
  loading: () => <StageShell />,
});

function StageShell() {
  return <div className="aspect-[4/5] w-full rounded-xl border border-hub-line bg-[#f1efe7] sm:aspect-[5/4] lg:aspect-auto lg:min-h-[560px] lg:flex-1" aria-hidden />;
}

/**
 * Khối giao hàng: 3 vòng (danh sách bên trái, luôn có trong HTML) + sa bàn minh hoạ bên phải.
 */
export function DeliveryMap({ storeLabel }: { storeLabel: string }) {
  const [active, setActive] = useState(0);
  const [near, setNear] = useState(false);
  const figRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = figRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setNear(true);
          io.disconnect();
        }
      },
      { rootMargin: "800px 0px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div className="grid gap-4 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.35fr)] lg:items-stretch [&>*]:min-w-0">
      <ol className="flex flex-col gap-2">
        {ZONES.map((z, i) => {
          const on = i === active;
          return (
            <li key={z.id}>
              <button
                type="button"
                onMouseEnter={() => setActive(i)}
                onFocus={() => setActive(i)}
                onClick={() => setActive(i)}
                aria-pressed={on}
                className={cn("w-full rounded-xl border p-5 text-left transition-colors duration-200 sm:p-6", on ? "border-hub-ink/25 bg-hub-paper" : "border-hub-line bg-hub-paper/50 hover:bg-hub-paper")}
              >
                <span className="inline-flex items-center gap-2.5 text-caption text-hub-ink-soft">
                  <span aria-hidden className={cn("size-2.5 rounded-full", DOT[i])} /> {z.label} · dưới {z.radiusKm} km
                </span>
                <span className="mt-2 block text-h4 font-semibold text-hub-ink">{z.when}</span>
                <span className="mt-1.5 block text-body text-hub-ink-soft">{z.places}</span>
                <span className={cn("grid transition-[grid-template-rows,opacity] duration-300 ease-soft", on ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0")}>
                  <span className="min-h-0 overflow-hidden">
                    <span className="mt-3 block border-t border-hub-line pt-3 text-small text-hub-ink">{z.note}</span>
                  </span>
                </span>
              </button>
            </li>
          );
        })}
      </ol>

      <figure ref={figRef} className="flex flex-col">
        {near ? <DeliveryStage storeLabel={storeLabel} active={active} setActive={setActive} /> : <StageShell />}
        <figcaption className="mt-2 text-center text-caption text-hub-ink-soft">
          Sơ đồ minh hoạ, khoảng cách gần đúng tính từ cửa hàng ở {storeLabel}. Bấm tên một nơi để xem xe chạy tới đó.
        </figcaption>
      </figure>
    </div>
  );
}
