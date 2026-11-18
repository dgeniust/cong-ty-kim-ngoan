import { getSettings } from "@/lib/settings/server";
import { fitTitle, metaDescription } from "@/lib/seo";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProductListing } from "@/components/site/product-listing";
import type { Crumb } from "@/components/site/breadcrumbs";
import { categories, getCategory } from "@/lib/mock/categories";

type Params = Promise<{ slug: string }>;

export function generateStaticParams() {
  return categories.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const category = getCategory((await params).slug);
  if (!category) return { title: "Danh mục" };
  const { COMPANY } = await getSettings();
  return {
    title: fitTitle(category.name, "Kim Ngoan"),
    description: metaDescription([category.description, `${category.name} chính hãng tại đại lý Kim Ngoan – ${COMPANY.area}`, "Báo giá theo số lượng, tư vấn kỹ thuật miễn phí, giao tận vườn"]),
    alternates: { canonical: `/phanbon/danh-muc/${category.slug}` },
  };
}

export default async function CategoryPage({
  params,
  searchParams,
}: {
  params: Params;
  searchParams: Promise<{ page?: string; "sap-xep"?: string }>;
}) {
  const { slug } = await params;
  const category = getCategory(slug);
  if (!category) notFound();
  const parent = category.parent ? getCategory(category.parent) : undefined;

  const crumbs: Crumb[] = [{ label: "Sản phẩm", href: "/phanbon/san-pham" }];
  if (parent) crumbs.push({ label: parent.name, href: `/phanbon/danh-muc/${parent.slug}` });
  crumbs.push({ label: category.name });

  return (
    <ProductListing
      title={category.name}
      description={category.description}
      crumbs={crumbs}
      basePath={`/phanbon/danh-muc/${slug}`}
      categorySlug={slug}
      searchParams={await searchParams}
    />
  );
}
