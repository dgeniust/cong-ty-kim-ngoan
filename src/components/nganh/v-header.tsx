"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, Phone, X } from "lucide-react";
import { COMPANY, telHref, type Vertical } from "@/lib/verticals";
import { cn } from "@/lib/utils";
import { VButton } from "./v-button";

export function VHeader({ vertical }: { vertical: Vertical }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const nav = [
    { label: "Trang chủ", href: vertical.base },
    { label: "Sản phẩm", href: `${vertical.base}/san-pham` },
    { label: "Tin tức", href: `${vertical.base}/tin-tuc` },
    { label: "Liên hệ", href: `${vertical.base}/lien-he` },
  ];
  const isActive = (href: string) => (href === vertical.base ? pathname === href : pathname.startsWith(href));

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
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
    <header
      className={cn(
        "sticky top-0 z-50 transition-[background-color,box-shadow] duration-300",
        scrolled || open ? "bg-v-bg/92 shadow-[0_10px_40px_-20px_rgb(0_0_0/0.45)] backdrop-blur-md" : "bg-v-bg",
      )}
    >
      <a href="#noi-dung" className="sr-only z-[60] bg-v-accent px-5 py-3 text-sm font-semibold text-v-on-accent focus:not-sr-only focus:fixed focus:left-4 focus:top-4">
        Bỏ qua đến nội dung chính
      </a>
      <div className="mx-auto flex h-[72px] max-w-7xl items-center justify-between gap-6 px-4 sm:px-6 lg:px-8">
        <Link href={vertical.base} aria-label={`${COMPANY.legalName} – ${vertical.name}`} className="flex items-baseline gap-2.5">
          <span className="v-display text-[28px] text-v-fg">{COMPANY.name}</span>
          <span className="v-label bg-v-accent px-2 py-0.5 text-xs text-v-on-accent">{vertical.short}</span>
        </Link>

        <nav aria-label="Điều hướng chính" className="hidden items-center gap-8 lg:flex">
          {nav.map((item) => {
            const active = isActive(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "v-label relative py-2 text-[15px] transition-colors duration-300 after:absolute after:inset-x-0 after:-bottom-0.5 after:h-[3px] after:origin-left after:bg-v-mark after:transition-transform after:duration-300 after:ease-soft",
                  active ? "text-v-fg after:scale-x-100" : "text-v-mute after:scale-x-0 hover:text-v-fg hover:after:scale-x-100",
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2">
          <VButton asChild size="sm" className="hidden sm:inline-flex">
            <a href={telHref(vertical.phone)} aria-label={`Gọi ${vertical.phone}`}>
              <Phone /> <span className="tabular-nums">{vertical.phone}</span>
            </a>
          </VButton>
          <button
            type="button"
            className="grid size-11 place-items-center text-v-fg lg:hidden"
            aria-label={open ? "Đóng menu" : "Mở menu"}
            aria-expanded={open}
            aria-controls="menu-nganh"
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X className="size-6" /> : <Menu className="size-6" />}
          </button>
        </div>
      </div>

      {open && (
        <div id="menu-nganh" className="fixed inset-x-0 bottom-0 top-[72px] overflow-y-auto bg-v-bg lg:hidden">
          <nav aria-label="Điều hướng di động" className="flex flex-col px-4 py-6 sm:px-6">
            {nav.map((item, i) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                aria-current={isActive(item.href) ? "page" : undefined}
                style={{ animationDelay: `${i * 60}ms` }}
                className={cn("v-display animate-rise py-3 text-5xl", isActive(item.href) ? "text-v-mark" : "text-v-fg")}
              >
                {item.label}
              </Link>
            ))}
            <VButton asChild size="lg" className="mt-8 self-start">
              <a href={telHref(vertical.phone)}>
                <Phone /> Gọi {vertical.phone}
              </a>
            </VButton>
          </nav>
        </div>
      )}
    </header>
  );
}
