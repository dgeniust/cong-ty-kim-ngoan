import type { Metadata } from "next";
import Link from "next/link";
import { VPageHead } from "@/components/nganh/v-page-head";
import { VProductCard } from "@/components/nganh/v-product-card";
import { VContainer } from "@/components/nganh/v-section";
import { Reveal } from "@/components/shared/reveal";
import { getBrands, getCategories, getCategory, getProducts } from "@/lib/data/catalog";
import { resolveSite } from "@/lib/site-params";
import { VERTICALS, isCatalogSite } from "@/lib/verticals";
import { cn } from "@/lib/utils";

type Props = { params: Promise<{ site: string }>; searchParams: Promise<{ nhom?: string; hang?: string; q?: string }> };

export async function generateMetadata({ params, searchParams }: Props): Promise<Metadata> {
  const { site } = await params;
  if (!isCatalogSite(site)) return {};
  const v = VERTICALS[site];
  const { nhom, hang } = await searchParams;
  const cat = nhom ? getCategory(site, nhom) : undefined;
  const title = [cat?.name ?? `Sản phẩm ${v.name.toLowerCase()}`, hang].filter(Boolean).join(" ");
  return {
    title,
    description: cat?.description ?? v.description,
    // Trang lọc theo nhóm có canonical riêng; lọc theo hãng gộp về trang nhóm để tránh trùng lặp nội dung
    alternates: { canonical: cat ? `${v.base}/san-pham?nhom=${cat.slug}` : `${v.base}/san-pham` },
  };
}

function FilterLink({ href, active, children }: { href: string; active: boolean; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      scroll={false}
      aria-current={active ? "true" : undefined}
      className={cn(
        "flex items-center gap-3 px-4 py-2.5 text-[15px] transition-colors duration-300",
        active ? "bg-v-accent font-semibold text-v-on-accent" : "text-v-mute hover:bg-v-raise hover:text-v-fg",
      )}
    >
      {children}
    </Link>
  );
}

export default async function ProductListing({ params, searchParams }: Props) {
  const { site, vertical } = resolveSite((await params).site);
  const { nhom, hang, q: rawQ } = await searchParams;
  const q = rawQ?.trim().slice(0, 60) || undefined;
  const categories = getCategories(site);
  const brands = getBrands(site);
  const category = nhom ? getCategory(site, nhom) : undefined;
  const brand = hang && brands.includes(hang) ? hang : undefined;
  const items = getProducts(site, { category: category?.slug, brand, q });
  const base = `${vertical.base}/san-pham`;
  const url = (q: { nhom?: string; hang?: string }) => {
    const sp = new URLSearchParams();
    if (q.nhom) sp.set("nhom", q.nhom);
    if (q.hang) sp.set("hang", q.hang);
    const s = sp.toString();
    return s ? `${base}?${s}` : base;
  };

  return (
    <>
      <VPageHead
        vertical={vertical}
        crumbs={category ? [{ label: "Sản phẩm", href: base }, { label: category.name }] : [{ label: "Sản phẩm" }]}
        title={category?.name ?? "Tất cả sản phẩm"}
        lead={category?.description ?? vertical.description}
      />
      <VContainer className="grid gap-10 py-12 md:py-16 lg:grid-cols-[250px_1fr] lg:gap-14">
        {/* Bộ lọc: nhóm hàng + thương hiệu (theo phác thảo của khách) */}
        <aside aria-label="Bộ lọc sản phẩm" className="lg:sticky lg:top-28 lg:self-start">
          <p className="v-label mb-2 px-4 text-xs text-v-mute">Nhóm sản phẩm</p>
          <ul className="flex gap-1 overflow-x-auto pb-2 [scrollbar-width:none] lg:block lg:space-y-0.5 lg:pb-0 [&::-webkit-scrollbar]:hidden [&_a]:whitespace-nowrap">
            <li><FilterLink href={url({ hang: brand })} active={!category}>Tất cả</FilterLink></li>
            {categories.map((c) => (
              <li key={c.slug}><FilterLink href={url({ nhom: c.slug, hang: brand })} active={category?.slug === c.slug}>{c.name}</FilterLink></li>
            ))}
          </ul>
          <p className="v-label mb-2 mt-6 px-4 text-xs text-v-mute lg:mt-9">Thương hiệu</p>
          <ul className="flex gap-1 overflow-x-auto pb-2 [scrollbar-width:none] lg:block lg:space-y-0.5 lg:pb-0 [&::-webkit-scrollbar]:hidden [&_a]:whitespace-nowrap">
            <li><FilterLink href={url({ nhom: category?.slug })} active={!brand}>Tất cả</FilterLink></li>
            {brands.map((b) => (
              <li key={b}><FilterLink href={url({ nhom: category?.slug, hang: b })} active={brand === b}>{b}</FilterLink></li>
            ))}
          </ul>
        </aside>

        <div>
          <p className="mb-6 text-sm text-v-mute" role="status">
            <span className="font-semibold text-v-fg">{items.length}</span> sản phẩm{brand ? ` · ${brand}` : ""}{q ? ` · kết quả cho “${q}”` : ""}
          </p>
          {items.length ? (
            <div className="grid grid-cols-2 gap-x-3 gap-y-10 md:gap-x-5 xl:grid-cols-3">
              {items.map((p, i) => (
                <Reveal key={p.slug} delay={(i % 3) * 70}>
                  <VProductCard product={p} headingLevel="h2" />
                </Reveal>
              ))}
            </div>
          ) : (
            <div className="bg-v-raise px-8 py-16 text-center">
              <p className="v-display text-3xl text-v-fg">Chưa có sản phẩm phù hợp</p>
              <p className="mt-3 text-v-mute">Thử bỏ bớt bộ lọc, hoặc gọi {vertical.phone} để được báo giá theo quy cách riêng.</p>
              <Link href={base} className="v-label mt-6 inline-block bg-v-accent px-6 py-3 text-sm text-v-on-accent">Xoá bộ lọc</Link>
            </div>
          )}
        </div>
      </VContainer>
    </>
  );
}
