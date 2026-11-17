import type { SectionHeading } from "@/lib/data/types";
import { VPill } from "./v-section";

/** “{title} [highlight]{after}” – phần nổi bật hiện dạng viên nhãn; `after` bắt đầu bằng dấu câu thì không thêm khoảng trắng. */
export function Headline({ h, pillClassName }: { h?: Pick<SectionHeading, "title" | "highlight" | "after">; pillClassName?: string }) {
  if (!h) return null;
  const after = h.after ? (/^[,.;:!?…]/.test(h.after) ? h.after : ` ${h.after}`) : null;
  return (
    <>
      {h.title}
      {h.highlight && (
        <>
          {" "}
          <VPill className={pillClassName}>{h.highlight}</VPill>
        </>
      )}
      {after}
    </>
  );
}
