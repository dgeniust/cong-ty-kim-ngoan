"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { BookOpenText, ExternalLink, FileText, Home, LogOut, Menu, Package, Settings2, X } from "lucide-react";
import { logoutAction } from "@/app/admin/actions";
import { cn } from "@/lib/utils";

export type AdminNavCounts = { phanbon: number; lopxe: number; satthep: number };

const DOT = { phanbon: "bg-sector-phanbon", lopxe: "bg-sector-lopxe", satthep: "bg-sector-satthep" } as const;

/** Khung admin kiểu thanh bên Notion: không gian làm việc · trang · cơ sở dữ liệu sản phẩm. */
export function AdminShell({ user, counts, children }: { user: string; counts: AdminNavCounts; children: React.ReactNode }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  // eslint-disable-next-line react-hooks/set-state-in-effect -- đóng menu di động khi chuyển trang
  useEffect(() => setOpen(false), [pathname]);

  const pages = [
    { href: "/admin", label: "Tổng quan", icon: Home },
    { href: "/admin/thong-tin-chung", label: "Thông tin chung", icon: Settings2 },
    { href: "/admin/noi-dung-phanbon", label: "Nội dung trang phân bón", icon: FileText },
  ];
  const dbs = [
    { href: "/admin/san-pham/phanbon", label: "Phân bón", id: "phanbon" as const },
    { href: "/admin/san-pham/lopxe", label: "Lốp xe", id: "lopxe" as const },
    { href: "/admin/san-pham/satthep", label: "Sắt thép", id: "satthep" as const },
  ];
  const isActive = (href: string) => (href === "/admin" ? pathname === "/admin" : pathname.startsWith(href));
  const item = (active: boolean) =>
    cn("flex items-center gap-2.5 rounded-md px-2.5 py-1.5 text-[14px] transition-colors duration-150", active ? "bg-hub-ink/[0.06] font-medium text-hub-ink" : "text-hub-ink/65 hover:bg-hub-ink/[0.04] hover:text-hub-ink");

  const sidebar = (
    <div className="flex h-full flex-col">
      <Link href="/admin" className="flex items-center gap-2.5 rounded-md px-2.5 py-2 hover:bg-hub-ink/[0.04]">
        <span className="grid size-7 place-items-center rounded-md bg-hub-ink text-[13px] font-bold text-white">K</span>
        <span className="min-w-0 leading-tight">
          <span className="block truncate text-[14px] font-semibold text-hub-ink">Kim Ngoan</span>
          <span className="block truncate text-[12px] text-hub-ink/50">{user}</span>
        </span>
      </Link>

      <nav aria-label="Trang quản trị" className="mt-4 space-y-0.5">
        {pages.map((p) => (
          <Link key={p.href} href={p.href} aria-current={isActive(p.href) ? "page" : undefined} className={item(isActive(p.href))}>
            <p.icon className="size-4 shrink-0" strokeWidth={1.8} aria-hidden /> {p.label}
          </Link>
        ))}
      </nav>

      <p className="mt-6 px-2.5 text-[12px] font-medium text-hub-ink/45">Cơ sở dữ liệu sản phẩm</p>
      <nav aria-label="Sản phẩm" className="mt-1 space-y-0.5">
        {dbs.map((d) => (
          <Link key={d.href} href={d.href} aria-current={isActive(d.href) ? "page" : undefined} className={item(isActive(d.href))}>
            <Package className="size-4 shrink-0" strokeWidth={1.8} aria-hidden />
            <span className="flex-1">{d.label}</span>
            <span aria-hidden className={cn("size-1.5 rounded-full", DOT[d.id])} />
            <span className="text-[12px] tabular-nums text-hub-ink/45">{counts[d.id]}</span>
          </Link>
        ))}
      </nav>

      <div className="mt-auto space-y-0.5 border-t border-hub-line pt-3">
        <a href="/" target="_blank" rel="noopener" className={item(false)}>
          <ExternalLink className="size-4" strokeWidth={1.8} aria-hidden /> Xem website
        </a>
        <Link href="/admin#huong-dan" className={item(false)}>
          <BookOpenText className="size-4" strokeWidth={1.8} aria-hidden /> Hướng dẫn
        </Link>
        <form action={logoutAction}>
          <button type="submit" className={cn(item(false), "w-full")}>
            <LogOut className="size-4" strokeWidth={1.8} aria-hidden /> Đăng xuất
          </button>
        </form>
      </div>
    </div>
  );

  return (
    <div className="theme-hub min-h-screen bg-hub-paper text-hub-ink">
      {/* thanh trên cho điện thoại */}
      <div className="sticky top-0 z-40 flex h-12 items-center gap-2 border-b border-hub-line bg-hub-paper/95 px-3 backdrop-blur lg:hidden">
        <button type="button" onClick={() => setOpen((v) => !v)} aria-label={open ? "Đóng menu" : "Mở menu"} aria-expanded={open} className="grid size-9 place-items-center rounded-md hover:bg-hub-ink/5">
          {open ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
        <span className="text-sm font-semibold">Quản trị Kim Ngoan</span>
      </div>

      <aside className={cn("fixed inset-y-0 left-0 z-30 w-64 border-r border-hub-line bg-hub-canvas p-3 transition-transform duration-200 lg:translate-x-0", open ? "translate-x-0 pt-14" : "-translate-x-full")}>
        {sidebar}
      </aside>
      {open && <button type="button" aria-label="Đóng menu" onClick={() => setOpen(false)} className="fixed inset-0 z-20 bg-black/20 lg:hidden" />}

      <div className="lg:pl-64">{children}</div>
    </div>
  );
}
