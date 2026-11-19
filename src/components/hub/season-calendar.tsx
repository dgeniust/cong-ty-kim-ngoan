"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { CROPS, inStage, type StageKind } from "@/lib/content/hub-extras";
import { getCategory } from "@/lib/mock/categories";
import { cn } from "@/lib/utils";

const KIND: Record<StageKind, { label: string; bar: string; dot: string }> = {
  bon: { label: "Bón phân", bar: "bg-hub-mint", dot: "bg-hub-mint" },
  bvtv: { label: "Phòng trừ sâu bệnh", bar: "bg-hub-peach", dot: "bg-hub-peach" },
  thu: { label: "Thu hoạch", bar: "bg-hub-marigold", dot: "bg-hub-marigold" },
  cham: { label: "Chăm sóc", bar: "bg-hub-sky", dot: "bg-hub-sky" },
};
const MONTHS = Array.from({ length: 12 }, (_, i) => i + 1);
const noop = () => () => {};

/** đoạn thanh trên lưới 12 tháng; giai đoạn vắt qua năm mới tách làm 2 đoạn */
function segments(from: number, to: number): [number, number][] {
  return from <= to ? [[from, to]] : [[from, 12], [1, to]];
}

/**
 * Lịch mùa vụ: chọn cây trồng → biểu đồ 12 tháng các việc bón phân, phòng bệnh, thu hoạch.
 * Tháng hiện tại được tô sáng (lấy theo đồng hồ máy người xem); bấm tháng khác để xem việc của tháng đó.
 */
export function SeasonCalendar({ serverMonth }: { serverMonth: number }) {
  const now = useSyncExternalStore(noop, () => new Date().getMonth() + 1, () => serverMonth);
  const [cropId, setCropId] = useState(CROPS[0].id);
  const [picked, setPicked] = useState<number | null>(null);
  const month = picked ?? now;
  const scroller = useRef<HTMLDivElement>(null);

  // Màn hình hẹp (biểu đồ cuộn ngang): cuộn sẵn tới tháng hiện tại.
  useEffect(() => {
    const el = scroller.current;
    if (!el || el.scrollWidth <= el.clientWidth || !now) return;
    el.scrollLeft = Math.max(0, ((now - 1) / 12) * (el.scrollWidth - 184) - el.clientWidth / 3);
  }, [now]);
  const crop = CROPS.find((c) => c.id === cropId) ?? CROPS[0];
  const stages = [...crop.stages].sort((a, b) => a.from - b.from);
  const doing = stages.filter((s) => inStage(s, month));
  const next = stages.find((s) => !inStage(s, month) && s.from > month) ?? stages[0];

  return (
    <div className="grid gap-4 lg:grid-cols-[1fr_22rem]">
      <div className="min-w-0 rounded-xl border border-hub-line bg-hub-paper">
        {/* chọn cây */}
        <div role="tablist" aria-label="Chọn cây trồng" className="flex gap-1.5 overflow-x-auto border-b border-hub-line p-2">
          {CROPS.map((c) => {
            const on = c.id === cropId;
            return (
              <button
                key={c.id}
                type="button"
                role="tab"
                aria-selected={on}
                aria-controls="lich-mua-vu"
                onClick={() => setCropId(c.id)}
                className={cn("inline-flex h-11 shrink-0 items-center gap-2 rounded-lg pl-1.5 pr-4 text-body font-medium transition-colors duration-200", on ? "bg-hub-ink text-white" : "text-hub-ink-soft hover:bg-hub-canvas hover:text-hub-ink")}
              >
                {c.image ? (
                  <Image src={c.image} alt="" width={32} height={32} className="size-8 rounded-md object-cover" />
                ) : (
                  <span aria-hidden className={cn("grid size-8 place-items-center rounded-md text-caption font-semibold", on ? "bg-white/15" : "bg-hub-canvas")}>{c.name[0]}</span>
                )}
                {c.name}
              </button>
            );
          })}
        </div>

        {/* biểu đồ 12 tháng */}
        <div ref={scroller} id="lich-mua-vu" role="tabpanel" aria-label={`Lịch mùa vụ ${crop.name}`} className="overflow-x-auto p-4 sm:p-5">
          <div className="grid min-w-[680px] grid-cols-[11.5rem_1fr]">
            <div>
              <div className="h-10" />
              {stages.map((s) => (
                <div key={s.name} className="flex h-12 items-center gap-2 pr-3 text-small text-hub-ink">
                  <span aria-hidden className={cn("size-2.5 shrink-0 rounded-full", KIND[s.kind].dot)} />
                  <span className="line-clamp-2 leading-tight">{s.name}</span>
                </div>
              ))}
            </div>
            <div className="relative">
              {/* cột tháng đang xem */}
              <div aria-hidden className="pointer-events-none absolute inset-y-0 rounded-md bg-hub-canvas transition-[left] duration-300 ease-soft" style={{ left: `${((month - 1) / 12) * 100}%`, width: `${100 / 12}%` }} />
              <div className="relative grid h-10 grid-cols-12">
                {MONTHS.map((m) => (
                  <button
                    key={m}
                    type="button"
                    onClick={() => setPicked(m === now ? null : m)}
                    aria-pressed={m === month}
                    aria-label={`Xem việc tháng ${m}`}
                    className={cn("mx-0.5 rounded-md text-caption tabular-nums transition-colors duration-200", m === month ? "font-semibold text-hub-ink" : "text-hub-ink/50 hover:text-hub-ink")}
                  >
                    T{m}
                    {m === now && <span className="block text-[10px] font-medium leading-none text-hub-blue">nay</span>}
                  </button>
                ))}
              </div>
              {stages.map((s) => (
                <div key={s.name} className="relative grid h-12 grid-cols-12 items-center border-t border-dashed border-hub-line">
                  {segments(s.from, s.to).map(([a, b]) => (
                    <span
                      key={a}
                      title={`${s.name}: tháng ${s.from}–${s.to}`}
                      className={cn("mx-0.5 h-7 rounded-md transition-opacity duration-300", KIND[s.kind].bar, inStage(s, month) ? "opacity-100" : "opacity-55")}
                      style={{ gridColumn: `${a} / ${b + 1}`, gridRow: 1 }}
                    />
                  ))}
                </div>
              ))}
            </div>
          </div>
          <ul className="mt-4 flex flex-wrap gap-x-5 gap-y-2 border-t border-hub-line pt-4 text-caption text-hub-ink-soft">
            {(Object.keys(KIND) as StageKind[]).map((k) => (
              <li key={k} className="inline-flex items-center gap-2">
                <span aria-hidden className={cn("h-2.5 w-5 rounded-sm", KIND[k].bar)} /> {KIND[k].label}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* việc của tháng đang xem */}
      <aside aria-live="polite" className="flex flex-col rounded-xl bg-hub-midnight p-6 text-white sm:p-7">
        <p className="text-caption text-white/60">{picked ? "Tháng đang xem" : "Tháng này"} · {crop.name}</p>
        <p className="mt-1 text-h2 font-semibold tabular-nums">Tháng {month}</p>
        {doing.length > 0 ? (
          <ul className="mt-5 divide-y divide-white/10">
            {doing.map((s) => {
              const cat = s.category ? getCategory(s.category) : undefined;
              return (
                <li key={s.name} className="py-4 first:pt-0">
                  <p className="inline-flex items-center gap-2 text-caption text-white/60">
                    <span aria-hidden className={cn("size-2 rounded-full", KIND[s.kind].dot)} /> {KIND[s.kind].label}
                  </p>
                  <p className="mt-1 text-title font-semibold">{s.name}</p>
                  <p className="mt-1 text-small leading-relaxed text-white/70">{s.note}</p>
                  {cat && (
                    <Link href={`/phanbon/danh-muc/${cat.slug}`} className="group mt-2 inline-flex min-h-9 items-center gap-1.5 text-small font-medium text-hub-marigold hover:underline">
                      Xem {cat.name.toLowerCase()} <ArrowRight className="size-3.5 transition-transform duration-200 group-hover:translate-x-0.5" aria-hidden />
                    </Link>
                  )}
                </li>
              );
            })}
          </ul>
        ) : (
          <p className="mt-5 text-body leading-relaxed text-white/75">
            Vườn {crop.name.toLowerCase()} không có việc lớn trong tháng này. Việc tiếp theo: <strong className="font-semibold text-white">{next.name.toLowerCase()}</strong> (tháng {next.from}).
          </p>
        )}
        <p className="mt-auto pt-6 text-caption leading-relaxed text-white/50">Lịch tham khảo cho vùng Đông Nam Bộ. Thời điểm thực tế tuỳ giống, tuổi cây và thời tiết — gọi kỹ thuật viên để có lịch cho vườn của bạn.</p>
      </aside>
    </div>
  );
}
