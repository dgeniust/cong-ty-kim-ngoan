import Link from "next/link";
import { ArrowUpRight, CheckSquare, FileText, Package, Settings2, Sparkles, Sprout } from "lucide-react";
import { ProductArt } from "@/components/nganh/product-art";
import { getSession } from "@/lib/auth/server";
import { getCatalogProducts, getFertilizerProducts } from "@/lib/products/server";
import { getRawSettings } from "@/lib/settings/server";
import { cn } from "@/lib/utils";

export const dynamic = "force-dynamic";

/** Trang giới thiệu khu quản trị: chào, lối vào từng mục, hướng dẫn ngắn. */
export default async function AdminOverview() {
  const [session, settings, pb, lx, st] = await Promise.all([getSession(), getRawSettings(), getFertilizerProducts(), getCatalogProducts("lopxe"), getCatalogProducts("satthep")]);
  const hour = new Date().getHours();
  const greet = hour < 11 ? "Chào buổi sáng" : hour < 18 ? "Chào buổi chiều" : "Chào buổi tối";

  const dbs = [
    { href: "/admin/san-pham/phanbon", label: "Phân bón & thuốc BVTV", count: pb.length, featured: pb.filter((p) => p.featured).length, tone: "bg-hub-mint-soft", ring: "border-sector-phanbon", art: null },
    { href: "/admin/san-pham/lopxe", label: "Lốp xe ô tô", count: lx.length, featured: lx.filter((p) => p.featured).length, tone: "bg-lopxe-soft", ring: "border-sector-lopxe", art: "tyre" as const },
    { href: "/admin/san-pham/satthep", label: "Tôn – sắt thép", count: st.length, featured: st.filter((p) => p.featured).length, tone: "bg-satthep-soft", ring: "border-sector-satthep", art: "ibeam" as const },
  ];

  return (
    <div className="mx-auto max-w-5xl px-5 pb-24 pt-10 sm:px-10 lg:pt-16">
      {/* dấu tròn kiểu Notion */}
      <ul aria-hidden className="flex gap-2">
        {(["border-hub-signal", "border-hub-coral", "border-hub-marigold", "border-hub-sky"] as const).map((ring, i) => (
          <li key={ring} style={{ animationDelay: `${i * 0.3}s` }} className={cn("grid size-11 animate-bob place-items-center rounded-full border-2 bg-hub-paper", ring)}>
            <ProductArt kind={(["tyre", "ibeam", "rebar", "roofing"] as const)[i]} className="!size-7" />
          </li>
        ))}
      </ul>
      <p className="mt-6 text-sm text-hub-ink/55">{greet}, {session?.sub}</p>
      <h1 className="mt-1 text-[clamp(2rem,4vw,3rem)] font-bold leading-[1.1] tracking-[-0.035em] text-hub-ink">
        Quản trị website{" "}
        <span className="inline-block rounded-full bg-hub-peach px-[0.35em]">{settings.company.name}</span>
      </h1>
      <p className="mt-4 max-w-2xl text-[16px] leading-relaxed text-hub-ink-soft">
        Mọi thay đổi ở đây được lưu và cập nhật lên website ngay sau khi bấm <strong className="font-semibold text-hub-ink">Lưu</strong>. Chọn một mục bên dưới hoặc ở thanh bên trái để bắt đầu.
      </p>

      {/* lối vào chính */}
      <div className="mt-10 grid gap-3 md:grid-cols-2">
        <Link href="/admin/thong-tin-chung" className="group relative overflow-hidden rounded-xl bg-hub-marigold p-6 sm:p-7">
          <Settings2 className="size-7 transition-transform duration-300 [transition-timing-function:cubic-bezier(0.34,1.56,0.64,1)] group-hover:-rotate-12 group-hover:scale-110" strokeWidth={1.75} aria-hidden />
          <h2 className="mt-8 text-[22px] font-semibold tracking-[-0.02em] text-hub-ink">Thông tin chung</h2>
          <p className="mt-1.5 text-[15px] text-hub-ink/75">Tên công ty, hotline, địa chỉ, Zalo, Facebook và số điện thoại, mô tả, SEO của từng chuyên trang.</p>
          <ArrowUpRight className="absolute right-5 top-5 size-5 text-hub-ink/60 transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden />
        </Link>
        <Link href="/admin/noi-dung-phanbon" className="group relative overflow-hidden rounded-xl border border-hub-line bg-hub-paper p-6 sm:p-7 transition-colors hover:bg-hub-canvas/60">
          <FileText className="size-7 transition-transform duration-300 [transition-timing-function:cubic-bezier(0.34,1.56,0.64,1)] group-hover:-rotate-12 group-hover:scale-110" strokeWidth={1.75} aria-hidden />
          <h2 className="mt-8 text-[22px] font-semibold tracking-[-0.02em] text-hub-ink">Nội dung trang phân bón</h2>
          <p className="mt-1.5 text-[15px] text-hub-ink-soft">Banner, ưu điểm, nhóm sản phẩm, cây trồng, giới thiệu và footer của chuyên trang /phanbon.</p>
          <ArrowUpRight className="absolute right-5 top-5 size-5 text-hub-ink/40 transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden />
        </Link>
      </div>

      {/* 3 cơ sở dữ liệu sản phẩm */}
      <h2 className="mt-12 flex items-center gap-2 text-[13px] font-medium text-hub-ink/50">
        <Package className="size-4" aria-hidden /> Cơ sở dữ liệu sản phẩm
      </h2>
      <ul className="mt-3 grid gap-3 sm:grid-cols-3">
        {dbs.map((d) => (
          <li key={d.href}>
            <Link href={d.href} className="group flex h-full flex-col rounded-xl border border-hub-line bg-hub-paper p-5 transition-colors hover:border-hub-ink/20">
              <span className={cn("relative grid aspect-[16/9] place-items-center overflow-hidden rounded-lg", d.tone)}>
                {d.art ? <ProductArt kind={d.art} className="!size-[64%] transition-transform duration-300 [transition-timing-function:cubic-bezier(0.34,1.56,0.64,1)] group-hover:-rotate-6 group-hover:scale-110" /> : <Sprout className="size-16 text-sector-phanbon transition-transform duration-300 [transition-timing-function:cubic-bezier(0.34,1.56,0.64,1)] group-hover:-rotate-6 group-hover:scale-110" strokeWidth={1.4} aria-hidden />}
              </span>
              <span className="mt-4 text-[17px] font-semibold tracking-[-0.01em] text-hub-ink">{d.label}</span>
              <span className="mt-2 flex flex-wrap gap-1.5 text-[12px]">
                <span className="rounded-full bg-hub-canvas px-2 py-0.5 tabular-nums text-hub-ink/70">{d.count} sản phẩm</span>
                <span className="rounded-full bg-hub-blue-tint px-2 py-0.5 tabular-nums text-hub-blue">{d.featured} bán chạy</span>
              </span>
              <span className="mt-auto inline-flex items-center gap-1 pt-4 text-sm font-medium text-hub-blue">
                Quản lý <ArrowUpRight className="size-4" aria-hidden />
              </span>
            </Link>
          </li>
        ))}
      </ul>

      {/* hướng dẫn ngắn – dạng trang tài liệu */}
      <section id="huong-dan" className="mt-12 scroll-mt-16 rounded-xl border border-hub-line bg-hub-canvas/60 p-6 sm:p-8">
        <h2 className="flex items-center gap-2 text-[17px] font-semibold text-hub-ink">
          <Sparkles className="size-5 text-hub-marigold" aria-hidden /> Hướng dẫn nhanh
        </h2>
        <ul className="mt-4 space-y-2.5 text-[15px] leading-relaxed text-hub-ink-soft">
          {[
            "Thêm sản phẩm: vào một cơ sở dữ liệu, bấm “Thêm sản phẩm”, điền thông tin rồi lưu – sản phẩm xuất hiện ngay trên chuyên trang.",
            "Đường dẫn (slug) được tạo tự động từ tên sản phẩm; chỉ đổi khi thật cần vì link cũ sẽ không còn.",
            "Đánh dấu “Bán chạy” để sản phẩm lên khối nổi bật ở trang chủ chuyên trang và landing tổng.",
            "Ảnh: tải lên trực tiếp (JPG, PNG, WEBP – tối đa 5MB) hoặc dán đường dẫn ảnh có sẵn.",
            "Số điện thoại trong “Thông tin chung” hiện ở header, nút gọi, trang liên hệ và landing tổng.",
          ].map((t) => (
            <li key={t} className="flex gap-2.5">
              <CheckSquare className="mt-1 size-4 shrink-0 text-hub-blue" aria-hidden />
              <span>{t}</span>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
