"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowRight, Menu, Phone, X } from "lucide-react";
import { telHref } from "@/lib/verticals";
import { Wordmark } from "@/components/shared/wordmark";

import { cn } from "@/lib/utils";

type HeaderCompany = { prefix: string; name: string; slogan: string; legalName: string; hotline: string };

/** `spy` = id của khối trên trang chủ; mục menu sáng lên khi cuộn tới khối đó. */
const MAIN = [
  { label: "Giới thiệu", href: "/#gioi-thieu", spy: "gioi-thieu" },
  { label: "Sản phẩm", href: "/#san-pham", spy: "san-pham" },
  { label: "Tin tức", href: "/tin-tuc", spy: "tin-tuc" },
  { label: "Liên hệ", href: "/#lien-he", spy: "lien-he" },
];
/** Lối vào thẳng từng chuyên trang (menu điện thoại). */
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

  // Scrollspy trên trang chủ (mục menu gạch chân khi cuộn tới khối tương ứng)
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
        "sticky top-0 z-50 transition-[background-color,box-shadow,backdrop-filter] duration-300 ease-out",
        // trong suốt khi ở đỉnh hero (trang chủ), trắng đục + mờ nền khi cuộn
        scrolled || open || !onHome ? "bg-white/85 shadow-[0_1px_0_rgb(24_24_27/0.08)] backdrop-blur-md" : "bg-transparent",
      )}
    >
      <a href="#noi-dung" className="sr-only z-[60] rounded-md bg-hub-blue px-5 py-3 text-small font-medium text-white focus:not-sr-only focus:fixed focus:left-4 focus:top-4">
        Bỏ qua đến nội dung chính
      </a>
      <div className="mx-auto flex h-16 max-w-[1400px] items-center justify-between gap-6 px-4 sm:px-6 lg:h-[76px] lg:px-10">
        <Link href="/" aria-label={`${COMPANY.legalName} – trang chủ`} className="group flex flex-col gap-1 rounded-md text-hub-ink">
          <span className="block logo-prefix text-hub-ink-soft">{COMPANY.prefix}</span>
          <Wordmark className="h-[22px] w-auto transition-transform duration-300 ease-soft group-hover:-translate-y-px lg:h-6" />
        </Link>

        <nav aria-label="Điều hướng chính" className="hidden items-center gap-1 lg:flex">
          {MAIN.map((m) => {
            const active = isActive(m);
            return (
              <Link
                key={m.href}
                href={m.href}
                aria-current={active ? (onHome ? "location" : "page") : undefined}
                className={cn(
                  "relative px-4 py-2 text-body font-medium transition-colors duration-200 after:absolute after:inset-x-4 after:-bottom-0.5 after:h-[2px] after:origin-left after:bg-hub-blue after:transition-transform after:duration-300 after:ease-soft",
                  active ? "text-hub-ink after:scale-x-100" : "text-hub-ink/60 after:scale-x-0 hover:text-hub-ink",
                )}
              >
                {m.label}
              </Link>
            );
          })}
        </nav>

        <div className="hidden items-center gap-5 lg:flex">
          <a href={telHref(COMPANY.hotline)} className="group inline-flex items-center gap-2 text-body font-semibold tabular-nums text-hub-ink">
            <Phone className="size-4 text-hub-blue transition-transform duration-300 group-hover:rotate-12" aria-hidden /> {COMPANY.hotline}
          </a>
          <Link href="/#lien-he" className="group inline-flex h-11 items-center gap-2 rounded-md bg-hub-blue px-5 text-body font-medium text-white transition-colors duration-200 hover:bg-hub-blue-hover">
            Nhận báo giá <ArrowRight className="size-4 transition-transform duration-200 group-hover:translate-x-0.5" aria-hidden />
          </Link>
        </div>

        <button type="button" className="grid size-11 place-items-center rounded-full text-hub-ink lg:hidden" aria-label={open ? "Đóng menu" : "Mở menu"} aria-expanded={open} aria-controls="menu-hub" onClick={() => setOpen((v) => !v)}>
          {open ? <X className="size-6" /> : <Menu className="size-6" />}
        </button>
      </div>

      {/* tiến trình đọc trang */}
      <span ref={progress} aria-hidden className="absolute inset-x-0 bottom-0 block h-0.5 origin-left scale-x-0 bg-hub-blue" />

      {open && (
        <div id="menu-hub" className="fixed inset-x-0 bottom-0 top-16 overflow-y-auto bg-hub-canvas px-4 py-6 sm:px-6 lg:hidden">
          <nav aria-label="Lĩnh vực kinh doanh" className="grid gap-2">
            {SECTORS.map((s, i) => (
              <Link key={s.label} href={s.href} onClick={() => setOpen(false)} style={{ animationDelay: `${i * 50}ms` }} className="animate-rise flex items-center gap-3 rounded-md bg-hub-paper px-5 py-4 text-title font-medium text-hub-ink shadow-sm">
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
          <a href={telHref(COMPANY.hotline)} className="mt-6 flex h-13 items-center justify-center gap-2 rounded-md bg-hub-blue text-body font-medium text-white">
            <Phone className="size-4" aria-hidden /> Hotline {COMPANY.hotline}
          </a>
        </div>
      )}
    </header>
  );
}
