"use client";

import { useEffect, useState } from "react";
import { PbArticleCallCard, PbArticleView, type PbArticleViewData } from "@/components/phanbon/catalog/pb-article-view";
import { VArticleView, type VArticleViewData } from "@/components/verticals/v-article-view";
import type { Vertical } from "@/lib/verticals";

/** Messages between the editor (parent window) and this frame. */
export type PreviewMessage =
  | { type: "kn-preview-data"; site: "phanbon"; sectionTitle: string; phone: string; article: PbArticleViewData }
  | { type: "kn-preview-data"; site: "lopxe" | "satthep"; vertical: Vertical; article: VArticleViewData }
  | { type: "kn-preview-focus"; index: number };
type Data = Extract<PreviewMessage, { type: "kn-preview-data" }>;

/** Draws the article sent by the editor with the live page components; links are inert. */
export function ArticlePreviewFrame() {
  const [data, setData] = useState<Data | null>(null);

  useEffect(() => {
    const onMessage = (e: MessageEvent<PreviewMessage>) => {
      if (e.origin !== window.location.origin || e.source !== window.parent) return;
      const m = e.data;
      if (m?.type === "kn-preview-data") setData(m);
      if (m?.type === "kn-preview-focus") {
        const el = document.querySelector<HTMLElement>(`[data-block="${m.index}"]`);
        if (!el) return;
        el.scrollIntoView({ behavior: "smooth", block: "center" });
        el.animate([{ outline: "3px solid rgb(35 131 226 / 0.55)", outlineOffset: "6px" }, { outline: "3px solid rgb(35 131 226 / 0)", outlineOffset: "6px" }], { duration: 1400, easing: "ease-out" });
      }
    };
    window.addEventListener("message", onMessage);
    window.parent.postMessage({ type: "kn-preview-ready" }, window.location.origin);
    return () => window.removeEventListener("message", onMessage);
  }, []);

  if (!data) return <p className="grid min-h-screen place-items-center text-sm text-neutral-500">Đang tải bản xem trước…</p>;

  return (
    // links would navigate the frame away from the preview
    <div onClickCapture={(e) => (e.target as HTMLElement).closest("a") && e.preventDefault()}>
      {data.site === "phanbon" ? (
        <div className="theme-pb">
          <PbArticleView
            article={data.article}
            sectionTitle={data.sectionTitle}
            markBlocks
            aside={
              <>
                <PbArticleCallCard phone={data.phone} />
                <div>
                  <p className="text-h4 font-semibold text-brand-900">Bài viết mới</p>
                  <p className="mt-3 text-small text-ink-subtle">Danh sách bài mới tự hiện ở đây trên website.</p>
                </div>
              </>
            }
          />
        </div>
      ) : (
        <div className={`theme-${data.site} min-h-screen bg-v-bg text-v-fg`}>
          <VArticleView vertical={data.vertical} item={data.article} markBlocks />
        </div>
      )}
    </div>
  );
}
