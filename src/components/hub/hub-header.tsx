"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Menu, Phone, X } from "lucide-react";
import { COMPANY, telHref } from "@/lib/verticals";
import { cn } from "@/lib/utils";

const MAIN = [
  { label: "Trang chủ", href: "/" },
  { label: "Tin tức", href: "/tin-tuc" },
  { label: "Sản phẩm", href: "/#san-pham" },
  { label: "Liên hệ", href: "/#lien-he" },
];
/** Hàng 2 theo phác thảo của khách: đi thẳng vào từng chuyên trang. */
const SECTORS = [
  { label: "Phân bón", href: "/phanbon", dot: "bg-sector-phanbon" },
  { label: "Thuốc BVTV", href: "/phanbon/danh-muc/thuoc-bao-ve-thuc-vat", dot: "bg-sector-phanbon" },
  { label: "Tôn sắt thép", href: "/satthep", dot: "bg-sector-satthep" },
  { label: "Lốp xe ô tô", href: "/lopxe", dot: "bg-sector-lopxe" },
];

export function HubMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" aria-hidden className={className}>
      <rect width="48" height="48" rx="12" className="fill-hub-ink" />
      <path d="M14 12v24M14 24l12-12M14 24l12 12" stroke="#fff" strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <circle cx="34" cy="14" r="4" className="fill-sector-phanbon" />
      <circle cx="34" cy="24" r="4" className="fill-sector-lopxe" />
      <circle cx="34" cy="34" r="4" fill="#e4f222" />
    </svg>
  );
}

export function HubHeader() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <header className={cn("sticky top-0 z-50 bg-hub-paper/92 backdrop-blur-md transition-shadow duration-300", (scrolled || open) && "shadow-[0_12px_40px_-24px_rgb(20_23_26/0.35)]")}>
      <a href="#noi-dung" className="sr-only z-[60] rounded-full bg-hub-ink px-5 py-3 text-sm font-semibold text-white focus:not-sr-only focus:fixed focus:left-4 focus:top-4">
        Bỏ qua đến nội dung chính
      </a>
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-6 px-4 py-3 sm:px-6 lg:px-8">
        <Link href="/" aria-label={`${COMPANY.legalName} – Trang chủ`} className="flex items-center gap-3">
          <HubMark className="size-11 shrink-0" />
          <span className="leading-none">
            <span className="block text-[10px] font-semibold tracking-[0.2em] text-hub-ink-soft">{COMPANY.prefix}</span>
            <span className="mt-1 block text-[22px] font-semibold tracking-tight text-hub-ink">{COMPANY.name}</span>
            <span className="mt-1 hidden text-[11px] text-hub-ink-soft sm:block">{COMPANY.slogan}</span>
          </span>
        </Link>

        <div className="hidden flex-col items-end gap-1.5 lg:flex">
          <div className="flex items-center gap-1">
            <nav aria-label="Điều hướng chính" className="flex items-center">
              {MAIN.map((m) => (
                <Link key={m.href} href={m.href} className="rounded-full px-4 py-2 text-sm font-medium text-hub-ink-soft transition-colors hover:bg-hub-sand hover:text-hub-ink">
                  {m.label}
                </Link>
              ))}
            </nav>
            <a href={telHref(COMPANY.hotline)} className="ml-2 inline-flex h-10 items-center gap-2 rounded-full bg-hub-ink px-5 text-sm font-medium text-white">
              <Phone className="size-4" aria-hidden /> <span className="tabular-nums">{COMPANY.hotline}</span>
            </a>
          </div>
          <nav aria-label="Lĩnh vực kinh doanh" className="flex items-center gap-5 pr-1">
            {SECTORS.map((s) => (
              <Link key={s.label} href={s.href} className="group flex items-center gap-2 text-[13px] font-medium text-hub-ink-soft transition-colors hover:text-hub-ink">
                <span aria-hidden className={cn("size-2 rounded-full transition-transform duration-300 group-hover:scale-150", s.dot)} />
                {s.label}
              </Link>
            ))}
          </nav>
        </div>

        <button type="button" className="grid size-11 place-items-center rounded-full text-hub-ink lg:hidden" aria-label={open ? "Đóng menu" : "Mở menu"} aria-expanded={open} aria-controls="menu-hub" onClick={() => setOpen((v) => !v)}>
          {open ? <X className="size-6" /> : <Menu className="size-6" />}
        </button>
      </div>

      {open && (
        <div id="menu-hub" className="fixed inset-x-0 bottom-0 top-[68px] overflow-y-auto bg-hub-paper px-4 py-6 sm:px-6 lg:hidden">
          <nav aria-label="Lĩnh vực kinh doanh" className="grid gap-2">
            {SECTORS.map((s, i) => (
              <Link key={s.label} href={s.href} onClick={() => setOpen(false)} style={{ animationDelay: `${i * 50}ms` }} className="animate-rise flex items-center gap-3 rounded-[20px] bg-hub-sand px-5 py-4 text-lg font-medium text-hub-ink">
                <span aria-hidden className={cn("size-2.5 rounded-full", s.dot)} /> {s.label}
              </Link>
            ))}
          </nav>
          <nav aria-label="Điều hướng di động" className="mt-6 flex flex-col">
            {MAIN.map((m) => (
              <Link key={m.href} href={m.href} onClick={() => setOpen(false)} className="px-5 py-3 text-base font-medium text-hub-ink-soft">
                {m.label}
              </Link>
            ))}
          </nav>
          <a href={telHref(COMPANY.hotline)} className="mt-6 flex h-12 items-center justify-center gap-2 rounded-full bg-hub-ink font-semibold text-white">
            <Phone className="size-4" aria-hidden /> Hotline {COMPANY.hotline}
          </a>
        </div>
      )}
    </header>
  );
}
