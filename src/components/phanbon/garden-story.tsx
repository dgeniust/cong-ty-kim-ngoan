"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowDown, ArrowRight, Check } from "lucide-react";
import { HeroSearch } from "@/components/landing/hero-search";
import { setCrop, useCrop } from "@/lib/crop-store";
import { cn } from "@/lib/utils";
import { CALLOUT, GardenScene, type CropShape } from "./garden-scene";

export type StoryCrop = { key: string; name: string; description: string; image: string };

const SHAPES: CropShape[] = ["ca-phe", "cao-su", "sau-rieng", "tieu", "lua"];
const shapeOf = (key: string): CropShape => (SHAPES.includes(key as CropShape) ? (key as CropShape) : "cay");
const label = (name: string) => {
  const s = name.replace(/^cây\s+/i, "");
  return s.charAt(0).toUpperCase() + s.slice(1);
};
/** “trái” của từng cây cho câu chữ */
const FRUIT: Record<CropShape, string> = { "ca-phe": "trái cà phê", "cao-su": "dòng mủ", "sau-rieng": "trái sầu riêng", tieu: "chuỗi tiêu", lua: "bông lúa", cay: "trái" };

type Step = { no: string; kicker: string; title: string; text: string; sign: string; links: { label: string; href: string }[] };

function steps(shape: CropShape): Step[] {
  const fruit = FRUIT[shape];
  return [
    {
      no: "01",
      kicker: "Ngọn lá",
      title: "Lá xanh, cành mới — nhờ Đạm (N)",
      text: "Đạm là nguyên liệu làm nên diệp lục. Đủ đạm, lá xanh dày, cây ra cành và đọt mới khoẻ — nền cho cả mùa vụ.",
      sign: "Thiếu đạm: lá già vàng đều từ dưới lên, cây còi, đọt nhỏ.",
      links: [
        { label: "Phân bón NPK", href: "/phanbon/danh-muc/phan-bon-npk" },
        { label: "Phân bón vô cơ", href: "/phanbon/danh-muc/phan-bon-vo-co" },
      ],
    },
    {
      no: "02",
      kicker: "Hoa & trái",
      title: `Hoa đậu, ${fruit} chắc — nhờ Lân (P) và Kali (K)`,
      text: `Lân giúp ra rễ và phân hoá mầm hoa; Kali đưa đường bột về ${fruit}, làm cây cứng cáp, ít đổ ngã, chịu hạn tốt hơn.`,
      sign: "Thiếu kali: mép lá già cháy khô, trái nhỏ, nhẹ ký. Thiếu lân: lá xanh sậm hoặc ửng tím, ra hoa kém.",
      links: [{ label: "Phân NPK nuôi trái", href: "/phanbon/danh-muc/phan-bon-npk" }],
    },
    {
      no: "03",
      kicker: "Rễ & đất",
      title: "Rễ khoẻ, đất tơi — nhờ hữu cơ và vi sinh",
      text: "Phân hữu cơ tăng mùn, giữ ẩm, giữ phân. Vi sinh có ích phân giải chất hữu cơ và đối kháng nấm hại rễ — nhờ đó phân hoá học được rễ hút trọn hơn, ít thất thoát.",
      sign: "Đất chai cứng, rễ ít, bón nhiều mà cây vẫn èo uột: đất đang thiếu hữu cơ.",
      links: [
        { label: "Phân bón hữu cơ", href: "/phanbon/danh-muc/phan-bon-huu-co" },
        { label: "Phân bón vi sinh", href: "/phanbon/danh-muc/phan-bon-vi-sinh" },
      ],
    },
    {
      no: "04",
      kicker: "Bảo vệ",
      title: "Giữ thành quả — bảo vệ thực vật đúng lúc",
      text: "Sâu, rệp, nấm bệnh có mùa của chúng. Phòng sớm theo lịch mùa vụ, dùng đúng thuốc, đúng liều và đúng thời gian cách ly trước thu hoạch.",
      sign: "Mùa mưa: chú ý nấm bệnh ở lá, trái, gốc. Mùa khô: rệp, nhện, bọ trĩ.",
      links: [
        { label: "Thuốc trừ sâu", href: "/phanbon/danh-muc/thuoc-tru-sau" },
        { label: "Thuốc trừ bệnh", href: "/phanbon/danh-muc/thuoc-tru-benh" },
      ],
    },
  ];
}

const PROGRESS = ["Tổng quan", "Lá", "Hoa trái", "Rễ & đất", "Bảo vệ"];

/**
 * Hero “Lát cắt khu vườn” – cuộn để kể chuyện một bao phân đi đâu trong cây:
 * cột trái là chữ (mở đầu + 4 bước), cột phải là cảnh lát cắt đứng yên (sticky), máy quay
 * phóng vào lá → hoa trái → rễ → tán lá theo bước đang đọc. Di động: cảnh dính trên đầu, chữ trôi bên dưới.
 * Chọn cây ở đây đổi cả hình vẽ và các khối bên dưới (lib/crop-store).
 */
export function GardenStory({ crops, eyebrow, phone }: { crops: StoryCrop[]; eyebrow: React.ReactNode; phone: React.ReactNode }) {
  const keys = crops.map((c) => c.key);
  const key = useCrop(keys);
  const crop = crops.find((c) => c.key === key) ?? crops[0];
  const shape = shapeOf(key);
  const list = steps(shape);
  const [step, setStep] = useState(0);
  const refs = useRef<(HTMLElement | null)[]>([]);

  useEffect(() => {
    const els = refs.current.filter((e): e is HTMLElement => !!e);
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) if (e.isIntersecting) setStep(Number((e.target as HTMLElement).dataset.step));
      },
      { rootMargin: "-48% 0px -48% 0px" },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  const goTo = (i: number) => {
    const el = refs.current[i];
    if (!el) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - window.innerHeight * 0.35, behavior: reduce ? "auto" : "smooth" });
  };
  if (!crop) return null;
  const name = label(crop.name);

  return (
    <div className="flex flex-col lg:grid lg:grid-cols-12 lg:gap-x-8">
      {/* MỞ ĐẦU */}
      <div ref={(el) => void (refs.current[0] = el)} data-step={0} className="flex flex-col justify-center pb-8 pt-8 lg:col-span-5 lg:col-start-1 lg:min-h-[calc(100svh-9rem)] lg:pb-16 lg:pt-12">
        <p className="text-caption font-semibold text-brand-700">{eyebrow}</p>
        <h1 id="hero-title" className="mt-3 text-display font-semibold text-brand-900">
          Một bao phân đi đâu trong vườn <span className="text-brand-600">{name.toLowerCase()}</span>?
        </h1>
        <p className="mt-5 text-lead leading-relaxed text-ink-muted">Chọn cây của bạn, rồi cuộn xuống: theo hạt phân từ đất lên ngọn lá, tới hoa, trái và bộ rễ — để bón đúng loại, đúng lúc.</p>

        <div role="radiogroup" aria-label="Vườn của bạn trồng gì?" className="mt-7">
          <p className="mb-2.5 text-caption text-ink-muted">Vườn của bạn trồng gì?</p>
          <div className="flex flex-wrap gap-2">
            {crops.map((c) => {
              const on = c.key === key;
              return (
                <button
                  key={c.key}
                  type="button"
                  role="radio"
                  aria-checked={on}
                  onClick={() => setCrop(c.key)}
                  className={cn("inline-flex h-11 items-center gap-2 rounded-full py-1 pl-1 pr-4 text-body font-semibold transition-colors duration-200", on ? "bg-brand-900 text-white" : "bg-white text-brand-900 ring-1 ring-brand-900/15 hover:ring-brand-900/40")}
                >
                  <span className="relative size-9 overflow-hidden rounded-full bg-surface">
                    <Image src={c.image} alt="" fill sizes="36px" className="object-cover" />
                    {on && (
                      <span className="absolute inset-0 grid place-items-center bg-brand-900/55">
                        <Check className="size-4 text-sun-300" strokeWidth={3} aria-hidden />
                      </span>
                    )}
                  </span>
                  {label(c.name)}
                </button>
              );
            })}
          </div>
        </div>

        <div className="mt-8 hidden lg:block">
          <HeroSearch />
        </div>
        <button type="button" onClick={() => goTo(1)} className="group mt-8 inline-flex items-center gap-2 self-start text-small font-semibold text-brand-800">
          <span className="grid size-9 place-items-center rounded-full bg-sun-300 text-brand-900 transition-transform group-hover:translate-y-0.5">
            <ArrowDown className="size-4" aria-hidden />
          </span>
          Cuộn để theo hạt phân · {phone}
        </button>
      </div>

      {/* CẢNH LÁT CẮT – đứng yên */}
      <div className="sticky top-2 z-10 -mx-4 h-[44svh] bg-paper px-4 pb-3 sm:-mx-6 sm:px-6 lg:top-24 lg:col-span-7 lg:col-start-6 lg:row-span-5 lg:row-start-1 lg:mx-0 lg:h-[calc(100svh-7.5rem)] lg:self-start lg:px-0 lg:pb-0 lg:pt-6">
        <div className="relative size-full overflow-hidden rounded-[28px] bg-[#eaf3df] ring-1 ring-brand-900/10">
          <GardenScene shape={shape} step={step} label={`Lát cắt vườn ${name.toLowerCase()}: lá, hoa trái, rễ và các lớp đất`} />
          <p className="absolute left-3 top-3 inline-flex items-center gap-2 rounded-full bg-white/90 px-3 py-1.5 text-caption font-semibold text-brand-900 backdrop-blur sm:left-4 sm:top-4">
            <span aria-hidden className="size-2 rounded-full bg-brand-500" /> Lát cắt vườn {name.toLowerCase()}
          </p>
          {CALLOUT[step] && (
            <p key={`${step}-${key}`} aria-hidden className="kn-pop absolute right-3 top-3 hidden rounded-full bg-brand-900 px-4 py-2 text-small font-semibold text-white sm:right-4 sm:top-4 sm:block">
              {CALLOUT[step]}
            </p>
          )}
          {/* tiến trình */}
          <nav aria-label="Các tầng của lát cắt" className="absolute inset-x-3 bottom-3 flex gap-1 rounded-full bg-white/90 p-1 backdrop-blur sm:inset-x-auto sm:bottom-4 sm:left-1/2 sm:-translate-x-1/2">
            {PROGRESS.map((t, i) => (
              <button
                key={t}
                type="button"
                onClick={() => goTo(i)}
                aria-current={step === i ? "step" : undefined}
                className={cn("h-8 flex-1 whitespace-nowrap rounded-full px-2.5 text-[11px] font-semibold transition-colors sm:flex-none sm:px-3.5 sm:text-caption", step === i ? "bg-brand-900 text-white" : "text-brand-900/70 hover:text-brand-900")}
              >
                {t}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* 4 BƯỚC */}
      {list.map((st, i) => (
        <article
          key={st.no}
          ref={(el) => void (refs.current[i + 1] = el)}
          data-step={i + 1}
          aria-labelledby={`tang-${i + 1}`}
          className="flex min-h-[78svh] items-center py-10 lg:col-span-5 lg:col-start-1 lg:min-h-[86svh]"
        >
          <div className={cn("w-full rounded-3xl p-6 transition-all duration-500 sm:p-8", step === i + 1 ? "bg-white shadow-lift" : "bg-white/50")}>
            <p className="flex items-center justify-between border-t border-brand-900 pt-3 text-caption text-brand-900">
              <span className="font-semibold tabular-nums">{st.no}</span>
              <span className="opacity-70">{st.kicker}</span>
            </p>
            <h2 id={`tang-${i + 1}`} className="mt-5 text-h2 font-semibold text-brand-900">
              {st.title}
            </h2>
            <p className="mt-4 text-body leading-relaxed text-ink-muted">{st.text}</p>
            <p className="mt-4 rounded-2xl bg-surface px-4 py-3 text-small leading-relaxed text-brand-900">
              <strong className="font-semibold">Dấu hiệu: </strong>
              {st.sign}
            </p>
            <ul className="mt-5 flex flex-wrap gap-2">
              {st.links.map((l) => (
                <li key={l.label}>
                  <Link href={l.href} className="group inline-flex h-10 items-center gap-1.5 rounded-full bg-brand-900 px-4 text-small font-semibold text-white transition-colors hover:bg-brand-800">
                    {l.label} <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" aria-hidden />
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </article>
      ))}
    </div>
  );
}
