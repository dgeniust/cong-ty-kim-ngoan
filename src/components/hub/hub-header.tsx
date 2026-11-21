"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, Phone, X } from "lucide-react";
import { telHref } from "@/lib/verticals";
import { Wordmark } from "@/components/shared/wordmark";

type HeaderCompany = { prefix: string; name: string; slogan: string; legalName: string; hotline: string };
import { cn } from "@/lib/utils";

/** `spy` = id của khối trên trang chủ; mục menu sáng lên khi cuộn tới khối đó. */
const MAIN = [
  { label: "Trang chủ", href: "/", spy: "" },
  { label: "Sản phẩm", href: "/#san-pham", spy: "san-pham" },
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

export function HubHeader({ company: COMPANY }: { company: HeaderCompany }) {
  const pathname = usePathname();
  const onHome = pathname === "/";
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [spy, setSpy] = useState("");
  const progress = useRef<HTMLSpanElement>(null);

  // Bóng đổ khi cuộn + thanh tiến trình đọc trang.
  // Header KHÔNG đổi chiều cao khi cuộn: trước đây header co lại (padding, slogan, hàng ngành)
  // làm trang nhảy lên vài chục px → scrollY vượt qua lại ngưỡng → giật liên tục.
  // Giờ chỉ đổi bóng/nền, gom cập nhật vào 1 khung hình (rAF) và có ngưỡng trễ để không nhấp nháy.
  useEffect(() => {
    let raf = 0;
    const update = () => {
      raf = 0;
      const y = window.scrollY;
      setScrolled((prev) => (prev ? y > 4 : y > 24));
      const max = document.documentElement.scrollHeight - window.innerHeight;
      if (progress.current) progress.current.style.transform = `scaleX(${max > 0 ? Math.min(y / max, 1) : 0})`;
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [pathname]);

  // Scrollspy trên trang chủ
  useEffect(() => {
    if (!onHome) return;
    const ids = MAIN.map((m) => m.spy).filter(Boolean);
    const els = ids.map((id) => document.getElementById(id)).filter((el): el is HTMLElement => !!el);
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) if (e.isIntersecting) setSpy(e.target.id);
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );
    els.forEach((el) => io.observe(el));
    const onTop = () => window.scrollY < 300 && setSpy("");
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
    <header
      className={cn(
        "sticky top-0 z-50 backdrop-blur-md transition-[background-color,box-shadow] duration-200 ease-out",
        scrolled || open ? "bg-hub-canvas/90 shadow-[var(--shadow-hub-nav)]" : "bg-hub-canvas/0 shadow-[0_0_0_rgb(0_0_0/0)]",
      )}
    >
      <a href="#noi-dung" className="sr-only z-[60] rounded-lg bg-hub-blue px-5 py-3 text-small font-medium text-white focus:not-sr-only focus:fixed focus:left-4 focus:top-4">
        Bỏ qua đến nội dung chính
      </a>
      <div className="mx-auto flex h-[68px] max-w-[1400px] items-center justify-between gap-6 px-4 sm:px-6 lg:h-[84px] lg:px-10">
        <Link href="/" aria-label={`${COMPANY.legalName} – trang chủ`} className="group flex flex-col gap-1.5 rounded-lg text-hub-ink">
          <span className="block logo-prefix text-hub-ink-soft">{COMPANY.prefix}</span>
          <Wordmark className="h-6 w-auto transition-transform duration-300 ease-soft group-hover:-translate-y-px lg:h-7" />
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
                    className={cn("rounded-lg px-3.5 py-2 text-body font-medium transition-colors duration-200", active ? "bg-hub-ink/[0.05] text-hub-ink" : "text-hub-ink/55 hover:text-hub-ink")}
                  >
                    {m.label}
                  </Link>
                );
              })}
            </nav>
            <a href={telHref(COMPANY.hotline)} className="group ml-3 inline-flex h-11 items-center gap-2 rounded-lg bg-hub-blue px-5 text-body font-medium text-white transition-colors duration-200 hover:bg-hub-blue-hover">
              <Phone className="size-4 transition-transform duration-300 [transition-timing-function:cubic-bezier(0.34,1.56,0.64,1)] group-hover:rotate-12 group-hover:scale-110" aria-hidden /> <span className="tabular-nums">{COMPANY.hotline}</span>
            </a>
          </div>
          <nav aria-label="Lĩnh vực kinh doanh" className="flex items-center gap-5 pr-1">
            {SECTORS.map((s) => (
              <Link key={s.label} href={s.href} className="group flex items-center gap-2 text-caption font-medium text-hub-ink/55 transition-colors duration-200 hover:text-hub-ink">
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
      <span ref={progress} aria-hidden className="absolute inset-x-0 bottom-0 block h-0.5 origin-left scale-x-0 bg-hub-blue" />

      {open && (
        <div id="menu-hub" className="fixed inset-x-0 bottom-0 top-[68px] overflow-y-auto bg-hub-canvas px-4 py-6 sm:px-6 lg:hidden">
          <nav aria-label="Lĩnh vực kinh doanh" className="grid gap-2">
            {SECTORS.map((s, i) => (
              <Link key={s.label} href={s.href} onClick={() => setOpen(false)} style={{ animationDelay: `${i * 50}ms` }} className="animate-rise flex items-center gap-3 rounded-xl border border-hub-line bg-hub-paper px-5 py-4 text-title font-medium text-hub-ink">
                <span aria-hidden className={cn("size-2.5 rounded-full", s.dot)} /> {s.label}
              </Link>
            ))}
          </nav>
          <nav aria-label="Điều hướng di động" className="mt-6 flex flex-col">
            {MAIN.map((m) => (
              <Link key={m.href} href={m.href} onClick={() => setOpen(false)} className="px-5 py-3 text-body font-medium text-hub-ink-soft">
                {m.label}
              </Link>
            ))}
          </nav>
          <a href={telHref(COMPANY.hotline)} className="mt-6 flex h-13 items-center justify-center gap-2 rounded-lg bg-hub-blue text-body font-medium text-white">
            <Phone className="size-4" aria-hidden /> Hotline {COMPANY.hotline}
          </a>
        </div>
      )}
    </header>
  );
}
