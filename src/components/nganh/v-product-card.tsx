import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { CatalogProduct } from "@/lib/data/types";
import { VERTICALS } from "@/lib/verticals";
import { ProductVisual } from "./product-visual";

/** Thẻ sản phẩm không viền: mảng nền + hình lớn, cả thẻ là một link. */
export function VProductCard({ product, headingLevel: Heading = "h3" }: { product: CatalogProduct; headingLevel?: "h2" | "h3" }) {
  const href = `${VERTICALS[product.site].base}/san-pham/${product.slug}`;
  return (
    <article className="group relative flex flex-col">
      <div className="relative">
        <ProductVisual
          name={product.name}
          art={product.art}
          image={product.images?.[0]}
          className="aspect-[4/5] sm:aspect-square"
          artClassName="transition-transform duration-700 ease-soft group-hover:scale-[1.07] group-hover:-rotate-3"
        />
        <div className="absolute left-0 top-4 flex flex-col items-start gap-1.5">
          {product.isNew && <span className="v-label bg-v-accent px-3 py-1 text-xs text-v-on-accent">Mới</span>}
          {product.featured && <span className="v-label bg-v-fg px-3 py-1 text-xs text-v-bg">Bán chạy</span>}
        </div>
        <span
          aria-hidden
          className="absolute bottom-0 right-0 grid size-11 translate-y-2 place-items-center bg-v-accent text-v-on-accent opacity-0 transition-all duration-300 ease-soft group-hover:translate-y-0 group-hover:opacity-100"
        >
          <ArrowUpRight className="size-5" />
        </span>
      </div>
      <div className="flex flex-1 flex-col pt-4">
        <p className="v-label text-[13px] text-v-mute">{product.brand}</p>
        <Heading className="mt-1 text-[17px] font-semibold leading-snug text-v-fg">
          <Link href={href} className="after:absolute after:inset-0 after:content-[''] focus-visible:outline-none focus-visible:after:outline-2 focus-visible:after:outline-offset-2 focus-visible:after:outline-v-accent">
            {product.name}
          </Link>
        </Heading>
        <p className="mt-1.5 line-clamp-2 hidden text-sm leading-relaxed text-v-mute sm:block">{product.shortDescription}</p>
        <p className="v-display mt-auto pt-3 text-xl text-v-fg">
          <span className="text-v-mark">/</span> {product.keySpec}
        </p>
      </div>
    </article>
  );
}
