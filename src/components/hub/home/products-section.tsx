import { ProductTabs, type ShowcaseTab } from "@/components/hub/product-tabs";
import { Reveal } from "@/components/shared/reveal";
import { HUB_PRODUCTS } from "@/lib/content/hub-home";
import { HUB_WRAP, SplitSectionHeader } from "./ui";

/** Khối "Sản phẩm tiêu biểu": tab 3 ngành + lọc theo nhóm (phần tương tác nằm trong ProductTabs). */
export function ProductsSection({ tabs }: { tabs: ShowcaseTab[] }) {
  return (
    <section id="san-pham" aria-labelledby="sp-title" className="scroll-mt-24 bg-hub-paper py-20 md:py-28">
      <div className={HUB_WRAP}>
        <SplitSectionHeader id="sp-title" {...HUB_PRODUCTS} className="md:mb-12" />
        <Reveal>
          <ProductTabs tabs={tabs} />
        </Reveal>
      </div>
    </section>
  );
}
