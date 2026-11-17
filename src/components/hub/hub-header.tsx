"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, Phone, X } from "lucide-react";
import { COMPANY, telHref } from "@/lib/verticals";
import { cn } from "@/lib/utils";

/** `spy` = id của khối trên trang chủ; mục menu sáng lên khi cuộn tới khối đó. */
const MAIN = [
  { label: "Trang chủ", href: "/", spy: "top" },
  { label: "Lĩnh vực", href: "/#linh-vuc", spy: "linh-vuc" },
  { label: "Sản phẩm", href: "/#san-pham", spy: "san-pham" },
  { label: "Giới thiệu", href: "/#gioi-thieu", spy: "gioi-thieu" },
  { label: "Tin tức", href: "/tin-tuc", spy: "tin-tuc" },
  { label: "Liên hệ", href: "/#lien-he", spy: "lien-he" },
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
      <circle cx="34" cy="34" r="4" className="fill-sector-satthep" />
    </svg>
  );
}

export function HubHeader() {
  const pathname = usePathname();
  const onHome = pathname === "/";
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [spy, setSpy] = useState("top");
  const progress = useRef<HTMLSpanElement>(null);

  // Bóng đổ khi cuộn + thanh tiến trình đọc trang (cập nhật thẳng vào DOM, không render lại)
  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 8);
      const max = document.documentElement.scrollHeight - window.innerHeight;
      if (progress.current) progress.current.style.transform = `scaleX(${max > 0 ? Math.min(window.scrollY / max, 1) : 0})`;
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [pathname]);

  // Scrollspy trên trang chủ
  useEffect(() => {
    if (!onHome) return;
    const ids = MAIN.map((m) => m.spy).filter((id) => id !== "top");
    const els = ids.map((id) => document.getElementById(id)).filter((el): el is HTMLElement => !!el);
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) if (e.isIntersecting) setSpy(e.target.id);
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );
    els.forEach((el) => io.observe(el));
    const onTop = () => window.scrollY < 300 && setSpy("top");
    window.addEventListener("scroll", onTop, { passive: true });
    return () => {
      io.disconnect();
      window.removeEventListener("scroll", onTop);
    };
  }, [onHome]);

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

  const isActive = (m: (typeof MAIN)[number]) => (onHome ? spy === m.spy : m.href !== "/" && !m.href.includes("#") && pathname.startsWith(m.href));

  return (
    <header className={cn("sticky top-0 z-50 bg-hub-paper/90 backdrop-blur-md transition-shadow duration-300", (scrolled || open) && "shadow-[0_1px_3px_rgb(0_0_0/0.08),0_1px_2px_-1px_rgb(0_0_0/0.06)]")}>
      <a href="#noi-dung" className="sr-only z-[60] rounded-full bg-hub-marigold px-5 py-3 text-sm font-medium text-hub-ink focus:not-sr-only focus:fixed focus:left-4 focus:top-4">
        Bỏ qua đến nội dung chính
      </a>
      <div className={cn("mx-auto flex max-w-[1400px] items-center justify-between gap-6 px-4 transition-[padding] duration-300 sm:px-6 lg:px-10", scrolled ? "py-2" : "py-3")}>
        <Link href="/" aria-label={`${COMPANY.legalName} – Trang chủ`} className="group flex items-center gap-3">
          <HubMark className="size-11 shrink-0 transition-transform duration-500 ease-soft group-hover:rotate-[-8deg]" />
          <span className="leading-none">
            <span className="block text-[10px] font-semibold tracking-[0.2em] text-hub-ink-soft">{COMPANY.prefix}</span>
            <span className="mt-1 block text-[22px] font-semibold tracking-tight text-hub-ink">{COMPANY.name}</span>
            <span className={cn("mt-1 hidden text-[11px] text-hub-ink-soft transition-[opacity,height] duration-300 sm:block", scrolled && "sm:hidden")}>{COMPANY.slogan}</span>
          </span>
        </Link>

        <div className="hidden flex-col items-end gap-1.5 lg:flex">
          <div className="flex items-center gap-1">
            <nav aria-label="Điều hướng chính" className="flex items-center">
              {MAIN.map((m) => {
                const active = isActive(m);
                return (
                  <Link
                    key={m.href}
                    href={m.href}
                    aria-current={active ? (onHome ? "location" : "page") : undefined}
                    className={cn("rounded-full px-4 py-2 text-sm font-medium transition-colors duration-300", active ? "bg-hub-marigold-soft text-hub-ink" : "text-hub-ink-soft hover:bg-hub-sand hover:text-hub-ink")}
                  >
                    {m.label}
                  </Link>
                );
              })}
            </nav>
            <a href={telHref(COMPANY.hotline)} className="group ml-2 inline-flex h-10 items-center gap-2 rounded-full bg-hub-marigold px-5 text-sm font-medium text-hub-ink transition-shadow duration-300 hover:shadow-[var(--shadow-craft-hover)]">
              <Phone className="size-4 transition-transform duration-300 group-hover:rotate-12" aria-hidden /> <span className="tabular-nums">{COMPANY.hotline}</span>
            </a>
          </div>
          <nav aria-label="Lĩnh vực kinh doanh" className={cn("flex items-center gap-5 overflow-hidden pr-1 transition-[max-height,opacity] duration-300", scrolled ? "max-h-0 opacity-0" : "max-h-6 opacity-100")}>
            {SECTORS.map((s) => (
              <Link key={s.label} href={s.href} tabIndex={scrolled ? -1 : 0} className="group flex items-center gap-2 text-[13px] font-medium text-hub-ink-soft transition-colors hover:text-hub-ink">
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

      {/* tiến trình đọc trang */}
      <span ref={progress} aria-hidden className="absolute inset-x-0 bottom-0 block h-[3px] origin-left scale-x-0 bg-gradient-to-r from-hub-mint via-hub-marigold to-hub-peri" />

      {open && (
        <div id="menu-hub" className="fixed inset-x-0 bottom-0 top-[64px] overflow-y-auto bg-hub-paper px-4 py-6 sm:px-6 lg:hidden">
          <nav aria-label="Lĩnh vực kinh doanh" className="grid gap-2">
            {SECTORS.map((s, i) => (
              <Link key={s.label} href={s.href} onClick={() => setOpen(false)} style={{ animationDelay: `${i * 50}ms` }} className="animate-rise flex items-center gap-3 rounded-[20px] bg-hub-sand px-5 py-4 text-lg font-medium text-hub-ink shadow-[var(--shadow-craft)]">
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
          <a href={telHref(COMPANY.hotline)} className="mt-6 flex h-12 items-center justify-center gap-2 rounded-full bg-hub-marigold font-medium text-hub-ink">
            <Phone className="size-4" aria-hidden /> Hotline {COMPANY.hotline}
          </a>
        </div>
      )}
    </header>
  );
}
