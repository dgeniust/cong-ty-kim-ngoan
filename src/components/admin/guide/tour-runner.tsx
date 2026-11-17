"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight, Check, Lightbulb, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { siteLabel, type Guide, type GuideSite, type TourStep } from "./tours";

const q = (t: string) => document.querySelector<HTMLElement>(`[data-tour="${t}"]`);
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));
const visible = (el: HTMLElement) => {
  const r = el.getBoundingClientRect();
  return r.width > 0 && r.height > 0 && r.right > 0 && r.left < window.innerWidth;
};

async function waitFor(target: string, timeout = 3000) {
  const end = Date.now() + timeout;
  while (Date.now() < end) {
    const el = q(target);
    if (el && visible(el)) return el;
    await sleep(80);
  }
  return null;
}

/** Trạng thái khung sửa sản phẩm mà bước hiện tại cần (tính dồn từ các bước trước) – để “Quay lại” cũng đúng. */
function peekNeed(steps: TourStep[], i: number): "new" | "first" | null {
  let need: "new" | "first" | null = null;
  for (let k = 0; k <= i; k++) {
    const o = steps[k].open;
    if (o === "peek-new") need = "new";
    else if (o === "peek-first") need = "first";
    else if (o === "close-peek") need = null;
  }
  return need;
}

async function syncPeek(need: "new" | "first" | null) {
  let peek = q("peek");
  if (peek && (!need || peek.dataset.mode !== (need === "new" ? "new" : "edit"))) {
    q("peek-close")?.click();
    await sleep(120);
    peek = q("peek");
  }
  if (!peek && need === "new") q("product-add")?.click();
  if (!peek && need === "first") q("db-row")?.querySelector("button")?.click();
}

type Rect = { x: number; y: number; w: number; h: number };
const holePath = (x: number, y: number, w: number, h: number, r: number) =>
  `M${x + r} ${y}H${x + w - r}A${r} ${r} 0 0 1 ${x + w} ${y + r}V${y + h - r}A${r} ${r} 0 0 1 ${x + w - r} ${y + h}H${x + r}A${r} ${r} 0 0 1 ${x} ${y + h - r}V${y + r}A${r} ${r} 0 0 1 ${x + r} ${y}Z`;
const fill = (s: string, site: GuideSite) => s.replaceAll("{site}", siteLabel(site));

export function TourRunner({ guide, site, steps, index, onNext, onPrev, onClose }: { guide: Guide; site: GuideSite; steps: TourStep[]; index: number; onNext: () => void; onPrev: () => void; onClose: (finished: boolean) => void }) {
  const router = useRouter();
  const pathname = usePathname();
  const step = steps[index];
  const route = guide.route?.(site);
  const last = index === steps.length - 1;

  const [resolved, setResolved] = useState<{ index: number; el: HTMLElement | null } | null>(null);
  const [rect, setRect] = useState<Rect | null>(null);
  const [measured, setMeasured] = useState(-1);
  const [cardH, setCardH] = useState(220);
  const [vw, setVw] = useState(1280);
  const [vh, setVh] = useState(800);
  const cardRef = useRef<HTMLDivElement>(null);
  const primaryRef = useRef<HTMLButtonElement>(null);
  // chỉ hiện thẻ khi đã đo xong vị trí → không bị “nhảy” từ giữa màn hình sang chỗ đúng
  const ready = resolved?.index === index && measured === index;

  // 1) đúng trang → 2) mở/đóng khung sửa → 3) chờ phần tử → 4) cuộn tới
  useEffect(() => {
    if (route && pathname !== route) {
      router.push(route);
      return;
    }
    let cancelled = false;
    (async () => {
      await syncPeek(peekNeed(steps, index));
      const el = step.target ? await waitFor(step.target) : null;
      if (cancelled) return;
      if (el) {
        const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        el.scrollIntoView({ block: "center", inline: "nearest", behavior: reduce ? "auto" : "smooth" });
      }
      setResolved({ index, el });
    })();
    return () => {
      cancelled = true;
    };
  }, [index, pathname, route, router, step.target, steps]);

  // đo vị trí phần tử + kích thước thẻ mỗi khung hình (theo cuộn, đổi cỡ, khung trượt…)
  useEffect(() => {
    let raf = 0;
    const el = resolved?.el ?? null;
    const idx = resolved?.index ?? -1;
    const tick = () => {
      // vùng nhìn thấy thật (trên điện thoại có thể nhỏ hơn innerWidth khi trang bị tràn ngang)
      setVw(Math.min(window.innerWidth, window.visualViewport?.width ?? Infinity));
      setVh(Math.min(window.innerHeight, window.visualViewport?.height ?? Infinity));
      if (cardRef.current) setCardH(cardRef.current.offsetHeight);
      if (el && el.isConnected && visible(el)) {
        const r = el.getBoundingClientRect();
        setRect((p) => (p && Math.abs(p.x - r.left) < 0.5 && Math.abs(p.y - r.top) < 0.5 && Math.abs(p.w - r.width) < 0.5 && Math.abs(p.h - r.height) < 0.5 ? p : { x: r.left, y: r.top, w: r.width, h: r.height }));
      } else setRect(null);
      setMeasured(idx);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [resolved]);

  useEffect(() => {
    if (ready) primaryRef.current?.focus({ preventScroll: true });
  }, [ready, index]);

  // bàn phím (bắt ở pha capture để đi trước phím tắt của trang, VD: Esc đóng khung sửa, Ctrl+S)
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const card = cardRef.current;
      const stop = () => {
        e.preventDefault();
        e.stopImmediatePropagation();
      };
      if (e.key === "Escape") {
        stop();
        onClose(false);
      } else if (e.key === "ArrowRight") {
        stop();
        if (last) onClose(true);
        else onNext();
      } else if (e.key === "ArrowLeft") {
        stop();
        if (index > 0) onPrev();
      } else if (e.key === "Tab" && card) {
        // giữ focus vòng trong thẻ hướng dẫn
        const items = [...card.querySelectorAll<HTMLElement>("button")];
        const i = items.indexOf(document.activeElement as HTMLElement);
        stop();
        const n = i === -1 ? items.indexOf(primaryRef.current!) : (i + (e.shiftKey ? -1 : 1) + items.length) % items.length;
        items[n]?.focus();
      } else if (!card?.contains(document.activeElement)) stop();
    };
    window.addEventListener("keydown", onKey, true);
    return () => window.removeEventListener("keydown", onKey, true);
  }, [index, last, onClose, onNext, onPrev]);

  // vị trí thẻ
  const M = 12;
  const GAP = 16;
  const mobile = vw < 640;
  const W = Math.min(360, vw - M * 2);
  const clamp = (v: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, v));
  let left = (vw - W) / 2;
  let top = (vh - cardH) / 2;
  if (rect && mobile) {
    left = M;
    top = rect.y + rect.h / 2 > vh / 2 ? M + 48 : vh - cardH - M;
  } else if (rect) {
    const fitsRight = rect.x + rect.w + GAP + W < vw - M;
    const fitsLeft = rect.x - GAP - W > M;
    const fitsBelow = rect.y + rect.h + GAP + cardH < vh - M;
    const fitsAbove = rect.y - GAP - cardH > M;
    const order = { right: ["right", "left", "bottom", "top"], left: ["left", "right", "bottom", "top"], bottom: ["bottom", "top", "right", "left"], top: ["top", "bottom", "right", "left"] }[step.placement ?? "bottom"];
    const fits: Record<string, boolean> = { right: fitsRight, left: fitsLeft, bottom: fitsBelow, top: fitsAbove };
    const side = order.find((s) => fits[s]);
    if (side === "right" || side === "left") {
      left = side === "right" ? rect.x + rect.w + GAP : rect.x - GAP - W;
      top = clamp(rect.y + rect.h / 2 - cardH / 2, M, vh - cardH - M);
    } else if (side === "bottom" || side === "top") {
      left = clamp(rect.x + rect.w / 2 - W / 2, M, vw - W - M);
      top = side === "bottom" ? rect.y + rect.h + GAP : rect.y - GAP - cardH;
    } else {
      // phần tử quá lớn: đặt thẻ ở góc dưới phải, vẫn thấy vùng được chỉ
      left = vw - W - M * 2;
      top = vh - cardH - M * 2;
    }
  }
  const PAD = 6;

  return (
    <div className="theme-hub" data-tour-runner>
      {/* chặn thao tác với trang trong lúc hướng dẫn */}
      <div aria-hidden className="fixed inset-0 z-[70]" onClick={() => primaryRef.current?.focus()} />
      {/* lớp làm tối có “lỗ” quanh phần được chỉ (SVG evenodd – không phụ thuộc giới hạn vẽ bóng của trình duyệt) */}
      <svg aria-hidden data-spotlight={rect ? "on" : "off"} className="pointer-events-none fixed inset-0 z-[71]" width={vw} height={vh}>
        <path fillRule="evenodd" fill="rgb(15 15 15 / 0.5)" d={`M0 0H${vw}V${vh}H0Z${rect ? holePath(rect.x - PAD, rect.y - PAD, rect.w + PAD * 2, rect.h + PAD * 2, 10) : ""}`} />
      </svg>
      {rect && (
        <div
          aria-hidden
          className="pointer-events-none fixed z-[71] rounded-[10px] border-2 border-hub-blue motion-safe:transition-[left,top,width,height] motion-safe:duration-200"
          style={{ left: rect.x - PAD, top: rect.y - PAD, width: rect.w + PAD * 2, height: rect.h + PAD * 2 }}
        />
      )}

      {ready && (
        <div
          ref={cardRef}
          key={index}
          role="dialog"
          aria-modal="true"
          aria-labelledby="tour-title"
          aria-describedby="tour-body"
          className={cn("fixed z-[72] animate-pop rounded-xl bg-hub-paper p-5 text-hub-ink shadow-[0_16px_48px_rgb(0_0_0/0.22)]", !mobile && "motion-safe:transition-[left,top] motion-safe:duration-300")}
          style={{ left, top, width: W }}
        >
          <div className="flex items-center justify-between gap-2">
            <p className="flex min-w-0 items-center gap-1.5 text-[12px] font-medium text-hub-ink/50">
              <guide.icon className="size-3.5 shrink-0" aria-hidden />
              <span className="truncate">{guide.title}</span>
              <span aria-hidden>·</span>
              <span className="shrink-0 tabular-nums">
                Bước {index + 1}/{steps.length}
              </span>
            </p>
            <button type="button" onClick={() => onClose(false)} aria-label="Thoát hướng dẫn" className="-mr-1.5 -mt-1 grid size-8 place-items-center rounded-md text-hub-ink/40 hover:bg-hub-ink/5 hover:text-hub-ink">
              <X className="size-4" />
            </button>
          </div>
          <div aria-hidden className="mt-2 flex gap-1">
            {steps.map((_, i) => (
              <span key={i} className={cn("h-1 flex-1 rounded-full transition-colors duration-300", i <= index ? "bg-hub-blue" : "bg-hub-ink/10")} />
            ))}
          </div>

          <h2 id="tour-title" className="mt-4 text-[18px] font-semibold leading-snug tracking-[-0.015em]">{fill(step.title, site)}</h2>
          <p id="tour-body" className="mt-1.5 text-[14px] leading-relaxed text-hub-ink-soft">{fill(step.body, site)}</p>
          {step.tips && (
            <ul className="mt-3 space-y-1.5 rounded-lg bg-hub-marigold-soft/70 px-3 py-2.5 text-[13px] leading-snug text-hub-ink/80">
              {step.tips.map((t) => (
                <li key={t} className="flex gap-2">
                  <Lightbulb className="mt-0.5 size-3.5 shrink-0 text-[#b26b00]" aria-hidden /> {t}
                </li>
              ))}
            </ul>
          )}
          {step.target && !rect && <p className="mt-3 text-[12px] text-hub-ink/45">Phần này nằm trong menu – trên điện thoại hãy bấm ☰ ở góc trên để xem.</p>}

          <div className="mt-5 flex items-center justify-between gap-2">
            {!last ? (
              <button type="button" onClick={() => onClose(false)} className="text-[13px] text-hub-ink/50 underline-offset-2 hover:text-hub-ink hover:underline">
                Bỏ qua
              </button>
            ) : (
              <span />
            )}
            <div className="flex gap-1.5">
              {index > 0 && (
                <button type="button" onClick={onPrev} className="inline-flex h-9 items-center gap-1 rounded-lg px-3 text-sm font-medium text-hub-ink/75 hover:bg-hub-ink/5">
                  <ArrowLeft className="size-4" /> Quay lại
                </button>
              )}
              <button ref={primaryRef} type="button" onClick={() => (last ? onClose(true) : onNext())} className="inline-flex h-9 items-center gap-1.5 rounded-lg bg-hub-blue px-4 text-sm font-medium text-white transition-colors hover:bg-hub-blue-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-hub-blue">
                {last ? (
                  <>
                    <Check className="size-4" /> Hoàn thành
                  </>
                ) : (
                  <>
                    Tiếp tục <ArrowRight className="size-4" />
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
