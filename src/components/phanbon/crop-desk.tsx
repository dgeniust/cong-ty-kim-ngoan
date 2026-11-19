"use client";

import { useRef, useState, useSyncExternalStore } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Check, Phone } from "lucide-react";
import { NpkLabel, type LabelProduct } from "@/components/phanbon/npk-label";
import { Kicker } from "@/components/shared/kicker";
import { inStage, type StageKind } from "@/lib/content/hub-extras";
import { calendarFor, cropKey } from "@/lib/content/crop-match";
import { formatDate } from "@/lib/format";
import { getCategory } from "@/lib/mock/categories";
import { telHref } from "@/lib/verticals";
import { cn } from "@/lib/utils";

export type DeskCrop = { key: string; name: string; description: string; image: string };
export type DeskArticle = { href: string; title: string; excerpt: string; date: string; tags: string[] };

const STORE = "kn-vuon"; // nhớ cây bà con đã chọn cho lần sau
const KIND: Record<StageKind, string> = { bon: "Bón phân", bvtv: "Phòng sâu bệnh", thu: "Thu hoạch", cham: "Chăm sóc" };
const DOT: Record<StageKind, string> = { bon: "bg-brand-500", bvtv: "bg-[#f0a37a]", thu: "bg-sun-300", cham: "bg-[#8cc4f0]" };

function readStore() {
  try {
    return window.localStorage.getItem(STORE);
  } catch {
    return null;
  }
}
function subscribe(cb: () => void) {
  window.addEventListener("storage", cb);
  return () => window.removeEventListener("storage", cb);
}
const label = (name: string) => {
  const s = name.replace(/^cây\s+/i, "");
  return s.charAt(0).toUpperCase() + s.slice(1);
};

/**
 * “Vườn của bạn trồng gì?” – chọn cây ở hero, khối bên dưới đổi theo cây đó:
 * việc của tháng này (lịch mùa vụ), phân/thuốc hợp với cây (thẻ nhãn bao), bài kỹ thuật liên quan.
 * Cây đã chọn được nhớ trong trình duyệt để lần sau mở sẵn đúng vườn.
 */
export function CropDesk({
  crops,
  products,
  articles,
  serverMonth,
  phone,
}: {
  crops: DeskCrop[];
  products: LabelProduct[];
  articles: DeskArticle[];
  serverMonth: number;
  phone: string;
}) {
  const stored = useSyncExternalStore(subscribe, readStore, () => null);
  const month = useSyncExternalStore(subscribe, () => new Date().getMonth() + 1, () => serverMonth);
  const [picked, setPicked] = useState<string | null>(null);
  const panel = useRef<HTMLDivElement>(null);
  const valid = (k: string | null) => (k && crops.some((c) => c.key === k) ? k : null);
  const key = valid(picked) ?? valid(stored) ?? crops[0]?.key;
  const crop = crops.find((c) => c.key === key);
  if (!crop) return null;
  const name = label(crop.name);

  const choose = (k: string) => {
    setPicked(k);
    try {
      window.localStorage.setItem(STORE, k);
    } catch {}
    // khối kết quả đang nằm dưới màn hình → kéo lên cho thấy ngay
    const el = panel.current;
    if (el && el.getBoundingClientRect().top > window.innerHeight * 0.7) {
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      el.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
    }
  };

  // việc tháng này theo lịch mùa vụ
  const cal = calendarFor(key);
  const stages = cal ? [...cal.stages].sort((a, b) => a.from - b.from) : [];
  const doing = stages.filter((s) => inStage(s, month));
  const next = stages.find((s) => !inStage(s, month) && s.from > month) ?? stages.find((s) => !inStage(s, month));

  // phân / thuốc hợp với cây: đúng cây trước, rồi loại dùng cho mọi cây trồng
  const fits = products.filter((p) => p.crops.some((c) => cropKey(c) === key));
  const general = products.filter((p) => !fits.includes(p) && p.crops.some((c) => /tất cả/i.test(c)));
  const picks = [...fits.sort((a, b) => Number(!!b.featured) - Number(!!a.featured)), ...general].slice(0, 3);

  // bài kỹ thuật nhắc tới cây
  const reads = articles.filter((a) => [a.title, ...a.tags].some((t) => cropKey(t).includes(key) || cropKey(t) === key || t.toLowerCase().includes(name.toLowerCase()))).slice(0, 2);

  return (
    <>
      {/* chọn cây – lựa chọn kiểu radio, dùng nút để bấm/tab được */}
      <div role="radiogroup" aria-label="Chọn cây trồng của bạn" className="-mx-4 flex snap-x gap-2 overflow-x-auto px-4 pb-1 sm:-mx-6 sm:px-6 lg:mx-0 lg:grid lg:grid-cols-5 lg:overflow-visible lg:px-0">
        {crops.map((c, i) => {
          const on = c.key === key;
          return (
            <button
              key={c.key}
              type="button"
              role="radio"
              aria-checked={on}
              onClick={() => choose(c.key)}
              className={cn(
                "group relative aspect-[4/5] w-[44vw] max-w-56 shrink-0 snap-start overflow-hidden rounded-2xl bg-surface text-left outline-offset-4 transition-shadow duration-300 sm:w-56 lg:w-auto lg:max-w-none",
                on ? "ring-2 ring-brand-900 ring-offset-2 ring-offset-paper" : "hover:shadow-lift",
              )}
            >
              <Image src={c.image} alt="" fill priority={i < 3} sizes="(min-width: 1024px) 20vw, 50vw" className={cn("object-cover transition-transform duration-700 ease-out", on ? "scale-100" : "group-hover:scale-[1.04]")} />
              <span className={cn("absolute inset-x-2 bottom-2 rounded-xl px-3.5 py-3 transition-colors duration-300", on ? "bg-brand-900 text-white" : "bg-white/95 text-brand-900")}>
                <span className="flex items-center justify-between gap-2 text-title font-semibold">
                  {label(c.name)}
                  <span aria-hidden className={cn("grid size-6 shrink-0 place-items-center rounded-full transition-colors duration-300", on ? "bg-sun-300 text-brand-900" : "bg-surface text-transparent")}>
                    <Check className="size-3.5" strokeWidth={3} />
                  </span>
                </span>
                <span className={cn("mt-0.5 line-clamp-1 text-caption", on ? "text-white/70" : "text-ink-muted")}>{c.description}</span>
              </span>
            </button>
          );
        })}
      </div>

      {/* kết quả theo cây */}
      <div ref={panel} id="vuon-cua-ban" aria-live="polite" className="scroll-mt-28 pt-16 text-brand-900 md:pt-24">
        <Kicker no="01">Vườn của bạn</Kicker>
        <h2 className="mt-7 text-h1 font-semibold md:mt-9">
          Vườn {name.toLowerCase()}, <span className="text-brand-600">tháng {month}</span>
        </h2>

        <div className="mt-10 grid gap-4 lg:grid-cols-12">
          {/* việc tháng này */}
          <section aria-label={`Việc của vườn ${name} trong tháng ${month}`} className="flex flex-col rounded-2xl bg-brand-900 p-6 text-white sm:p-7 lg:col-span-4 lg:self-start">
            <p className="text-caption text-white/60">Việc nên làm tháng này</p>
            {cal ? (
              doing.length > 0 ? (
                <ul className="mt-4 divide-y divide-white/10">
                  {doing.map((s) => {
                    const cat = s.category ? getCategory(s.category) : undefined;
                    return (
                      <li key={s.name} className="py-4 first:pt-0">
                        <p className="inline-flex items-center gap-2 text-caption text-white/60">
                          <span aria-hidden className={cn("size-2 rounded-full", DOT[s.kind])} /> {KIND[s.kind]}
                        </p>
                        <p className="mt-1 text-title font-semibold">{s.name}</p>
                        <p className="mt-1 text-small leading-relaxed text-white/75">{s.note}</p>
                        {cat && (
                          <Link href={`/phanbon/danh-muc/${cat.slug}`} className="group mt-2 inline-flex min-h-9 items-center gap-1.5 text-small font-semibold text-sun-300 hover:underline">
                            Xem {cat.name.toLowerCase()} <ArrowRight className="size-3.5 transition-transform duration-200 group-hover:translate-x-0.5" aria-hidden />
                          </Link>
                        )}
                      </li>
                    );
                  })}
                </ul>
              ) : (
                <p className="mt-4 text-body leading-relaxed text-white/80">Tháng này vườn {name.toLowerCase()} không có việc lớn — thời điểm tốt để kiểm tra đất, vệ sinh vườn.</p>
              )
            ) : (
              <p className="mt-4 text-body leading-relaxed text-white/80">Chưa có lịch soạn sẵn cho cây {name.toLowerCase()}. Gọi kỹ thuật viên để được lên lịch bón phân theo đúng giống và tuổi cây.</p>
            )}
            {next && (
              <p className="mt-4 border-t border-white/10 pt-4 text-small text-white/70">
                Tiếp theo: <strong className="font-semibold text-white">{next.name.toLowerCase()}</strong> (tháng {next.from})
              </p>
            )}
            <div className="pt-6">
              <a href={telHref(phone)} className="inline-flex h-11 items-center justify-center gap-2 rounded-full bg-sun-300 px-5 text-body font-semibold text-brand-900 transition-colors hover:bg-sun-200">
                <Phone className="size-4" aria-hidden /> Hỏi kỹ thuật viên
              </a>
            </div>
          </section>

          {/* phân / thuốc hợp với cây */}
          <section aria-label={`Phân bón, thuốc hợp với cây ${name}`} className="lg:col-span-8">
            <div className="flex items-end justify-between gap-4">
              <h3 className="text-title font-semibold">Phân, thuốc hợp với {name.toLowerCase()}</h3>
              <Link href={`/phanbon/tim-kiem?q=${encodeURIComponent(name)}`} className="group inline-flex min-h-9 shrink-0 items-center gap-1 text-small font-semibold text-brand-700 hover:underline">
                Xem tất cả <ArrowRight className="size-3.5 transition-transform duration-200 group-hover:translate-x-0.5" aria-hidden />
              </Link>
            </div>
            <ul className="mt-4 grid gap-4 sm:grid-cols-3">
              {picks.map((p) => (
                <li key={p.slug}>
                  <NpkLabel product={p} />
                </li>
              ))}
            </ul>
            {reads.length > 0 && (
              <div className="mt-6">
                <h3 className="text-title font-semibold">Bài kỹ thuật cho vườn {name.toLowerCase()}</h3>
                <ul className="mt-3 grid gap-x-6 sm:grid-cols-2">
                  {reads.map((a) => (
                    <li key={a.href} className="group relative border-t border-brand-900/15 py-4">
                      <p className="text-caption text-ink-subtle">{formatDate(a.date)}</p>
                      <p className="mt-1 text-body font-semibold leading-snug">
                        <Link href={a.href} className="after:absolute after:inset-0 after:content-[''] group-hover:text-brand-700">
                          {a.title}
                        </Link>
                      </p>
                      <p className="mt-1 line-clamp-2 text-small text-ink-muted">{a.excerpt}</p>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </section>
        </div>
      </div>
    </>
  );
}
