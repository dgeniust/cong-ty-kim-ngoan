import type { Metadata } from "next";
import { ArticlePreviewFrame } from "@/components/admin/article-preview-frame";

export const metadata: Metadata = { title: { absolute: "Xem trước bài viết · Kim Ngoan" }, robots: { index: false, follow: false } };

/**
 * Admin-only page shown inside the article editor's preview iframe (proxy.ts guards /admin/**).
 * It renders nothing on its own: the editor posts the article being written and the frame draws it with the
 * same components as the live article pages, at a real viewport width (desktop or phone).
 */
export default function ArticlePreviewPage() {
  return <ArticlePreviewFrame />;
}
