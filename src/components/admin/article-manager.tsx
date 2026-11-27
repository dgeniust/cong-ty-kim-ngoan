"use client";

import { useEffect, useMemo, useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { ArrowDown, ArrowUp, ArrowUpRight, Heading2, Image as ImageIcon, List, Loader2, Newspaper, Pilcrow, Plus, Quote, Search, Trash2, X } from "lucide-react";
import { deleteArticleAction, upsertArticleAction, type FieldErrors } from "@/app/admin/actions";
import { useNotify } from "@/hooks/use-notify";
import { failure } from "./notify-helpers";
import { ProductArt } from "@/components/shared/product-art";
import { SmartImage } from "@/components/shared/smart-image";
import { ART_KINDS } from "@/lib/products/schema";
import { articleSchema, SECTIONS_BY_SITE, type ArticleSite, type StoredArticle } from "@/lib/articles/schema";
import type { ArtKind } from "@/types/catalog";
import type { ArticleBlock } from "@/types/phanbon";
import { cn } from "@/lib/utils";
import { BTN_DANGER, BTN_PRIMARY, BTN_TEXT, ImagesField, PageHeader, TextField, Toggle } from "./notion-ui";

type Section = StoredArticle["section"];
/** Article as edited in the admin – blocks carry a client-only key so React keeps their inputs stable. */
type Keyed = ArticleBlock & { _k: string };
type Draft = Omit<StoredArticle, "content" | "site"> & { content: Keyed[] };

const SECTION_LABEL: Record<Section, string> = { "tin-tuc": "Tin tức", "dich-vu": "Dịch vụ", "gioi-thieu": "Giới thiệu" };
const SECTION_TONE: Record<Section, string> = { "tin-tuc": "bg-hub-sky-soft text-[#0b5394]", "dich-vu": "bg-hub-mint-soft text-[#1a6b46]", "gioi-thieu": "bg-hub-marigold-soft text-[#7a5200]" };

const META: Record<ArticleSite, { title: string; base: string; description: string; dot: string }> = {
  phanbon: { title: "Bài viết phân bón", base: "/phanbon", description: "Tin tức, dịch vụ và giới thiệu của chuyên trang /phanbon. Tin tức còn hiện ở mục tin của trang chủ.", dot: "bg-sector-phanbon" },
  lopxe: { title: "Bài viết lốp xe", base: "/lopxe", description: "Kiến thức và tin tức về lốp ở chuyên trang /lopxe, cũng hiện ở mục tin của trang chủ.", dot: "bg-sector-lopxe" },
  satthep: { title: "Bài viết sắt thép", base: "/satthep", description: "Kiến thức và tin tức về thép, tôn ở chuyên trang /satthep, cũng hiện ở mục tin của trang chủ.", dot: "bg-sector-satthep" },
};

const ART_LABEL: Partial<Record<ArtKind, string>> = { tyre: "Lốp du lịch", "tyre-at": "Lốp địa hình", "tyre-truck": "Lốp tải", rebar: "Thép cây", ibeam: "Thép hình", pipe: "Ống thép", box: "Thép hộp", roofing: "Tôn lợp", coil: "Cuộn", plate: "Tấm" };
const ARTS_BY_SITE: Record<ArticleSite, ArtKind[]> = { phanbon: [], lopxe: ["tyre", "tyre-at", "tyre-truck"], satthep: ART_KINDS.filter((k) => !k.startsWith("tyre")) };

const EXCERPT_MAX = 200;
const key = () => Math.random().toString(36).slice(2, 10);
const today = () => new Date(Date.now() - new Date().getTimezoneOffset() * 60000).toISOString().slice(0, 10);
const href = (site: ArticleSite, section: Section, slug: string) => `${META[site].base}/${section}/${slug}`;

function slugify(s: string) {
  return s.normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/đ/g, "d").replace(/Đ/g, "D").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 80);
}

const toDraft = (a: StoredArticle): Draft => ({ ...a, content: a.content.map((b) => ({ ...b, _k: key() }) as Keyed) });

const blank = (site: ArticleSite): Draft => ({
  section: "tin-tuc",
  slug: "",
  title: "",
  excerpt: "",
  cover: undefined,
  art: site === "lopxe" ? "tyre" : site === "satthep" ? "rebar" : undefined,
  date: today(),
  author: "Kim Ngoan",
  readingMinutes: 1,
  tags: [],
  content: [{ type: "p", text: "", _k: key() }],
  draft: false,
});

/** Strips client-only keys and empty optionals before validating / submitting. */
function payload(site: ArticleSite, d: Draft) {
  return {
    site,
    section: d.section,
    slug: d.slug,
    title: d.title,
    excerpt: d.excerpt,
    cover: d.cover || undefined,
    art: site === "phanbon" ? undefined : d.art,
    date: d.date,
    author: d.author,
    readingMinutes: d.readingMinutes,
    tags: d.tags,
    content: d.content.map(({ _k, ...b }) => {
      void _k;
      return b.type === "img" ? { ...b, caption: b.caption?.trim() || undefined } : b;
    }),
    draft: d.draft || undefined,
  };
}

function validate(site: ArticleSite, d: Draft): FieldErrors {
  const r = articleSchema.safeParse(payload(site, d));
  if (r.success) return {};
  const out: FieldErrors = {};
  for (const i of r.error.issues) out[i.path.map(String).join(".")] ??= i.message;
  return out;
}

function Thumb({ a, className }: { a: Pick<Draft, "cover" | "art" | "title">; className?: string }) {
  return (
    <span className={cn("relative grid shrink-0 place-items-center overflow-hidden rounded-md bg-hub-canvas", className)}>
      {a.cover ? <SmartImage src={a.cover} alt={a.title} fill sizes="64px" className="object-cover" /> : a.art ? <ProductArt kind={a.art} className="!size-[80%]" /> : <Newspaper className="size-4 text-hub-ink/30" />}
    </span>
  );
}

export function ArticleManager({ site, articles }: { site: ArticleSite; articles: StoredArticle[] }) {
  const meta = META[site];
  const sections = SECTIONS_BY_SITE[site];
  const router = useRouter();
  const [view, setView] = useState<"all" | "live" | "draft">("all");
  const [q, setQ] = useState("");
  const [sec, setSec] = useState<"" | Section>("");
  const [editing, setEditing] = useState<{ original: { section: Section; slug: string } | null; data: Draft } | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<StoredArticle | null>(null);
  const [deleting, startDelete] = useTransition();
  const n = useNotify({ record: true });

  const rows = useMemo(() => {
    const term = slugify(q);
    return [...articles]
      .sort((a, b) => b.date.localeCompare(a.date))
      .filter((a) => (view === "all" || (view === "draft" ? a.draft : !a.draft)) && (!sec || a.section === sec) && (!term || slugify(`${a.title} ${a.tags.join(" ")}`).includes(term)));
  }, [articles, view, sec, q]);

  const views = [
    { id: "all" as const, label: "Tất cả", n: articles.length },
    { id: "live" as const, label: "Đã đăng", n: articles.filter((a) => !a.draft).length },
    { id: "draft" as const, label: "Bản nháp", n: articles.filter((a) => a.draft).length },
  ];

  async function undo(a: StoredArticle, at: number) {
    const res = await n.promise(upsertArticleAction(site, a, null, at), {
      loading: { title: "Đang khôi phục bài viết…", description: a.title },
      success: { title: "Đã khôi phục bài viết", description: `“${a.title}” đã hiện lại`, link: a.draft ? undefined : { label: "Xem trên web", href: href(site, a.section, a.slug), external: true } },
      error: failure("Không khôi phục được bài viết"),
    });
    if (res?.ok) router.refresh();
  }

  function remove() {
    if (!confirmDelete) return;
    const target = confirmDelete;
    const at = articles.findIndex((a) => a.section === target.section && a.slug === target.slug);
    startDelete(async () => {
      const res = await n.promise(deleteArticleAction(site, target.section, target.slug), {
        loading: { title: "Đang xoá bài viết…", description: target.title },
        success: { title: "Đã xoá bài viết", description: `“${target.title}” đã gỡ khỏi website`, action: { label: "Hoàn tác", onClick: () => undo(target, at) }, duration: 10000 },
        error: failure("Chưa xoá được bài viết"),
      });
      setConfirmDelete(null);
      if (res?.ok) {
        setEditing(null);
        router.refresh();
      }
    });
  }

  const openNew = () => setEditing({ original: null, data: { ...blank(site), section: sec || "tin-tuc" } });

  return (
    <>
      <PageHeader
        icon={<Newspaper />}
        title={meta.title}
        description={meta.description}
        actions={
          <button type="button" onClick={openNew} className={BTN_PRIMARY}>
            <Plus /> Viết bài mới
          </button>
        }
      />

      <div className="mx-auto max-w-5xl px-5 pb-24 sm:px-10">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-hub-line pb-2">
          <div role="tablist" aria-label="Chế độ xem" className="flex gap-1">
            {views.map((v) => (
              <button
                key={v.id}
                type="button"
                role="tab"
                aria-selected={view === v.id}
                onClick={() => setView(v.id)}
                className={cn("relative inline-flex h-8 items-center gap-1.5 rounded-md px-2.5 text-sm transition-colors", view === v.id ? "font-medium text-hub-ink after:absolute after:inset-x-2 after:-bottom-2 after:h-0.5 after:rounded-full after:bg-hub-ink" : "text-hub-ink/55 hover:bg-hub-ink/5 hover:text-hub-ink")}
              >
                {v.label} <span className="text-[12px] tabular-nums text-hub-ink/40">{v.n}</span>
              </button>
            ))}
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <label className="relative">
              <span className="sr-only">Tìm bài viết</span>
              <Search className="pointer-events-none absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-hub-ink/40" aria-hidden />
              <input type="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Tìm tiêu đề, thẻ…" className="h-8 w-56 rounded-md bg-hub-canvas pl-8 pr-2 text-sm outline-none placeholder:text-hub-ink/40 focus:bg-hub-paper focus:shadow-[0_0_0_1px_var(--color-hub-blue),0_0_0_4px_var(--color-hub-blue-tint)]" />
            </label>
            {sections.length > 1 && (
              <select value={sec} onChange={(e) => setSec(e.target.value as "" | Section)} aria-label="Lọc theo chuyên mục" className="h-8 rounded-md bg-hub-canvas px-2 text-sm text-hub-ink/80 outline-none focus:shadow-[0_0_0_1px_var(--color-hub-blue)]">
                <option value="">Mọi chuyên mục</option>
                {sections.map((s) => (
                  <option key={s} value={s}>{SECTION_LABEL[s]}</option>
                ))}
              </select>
            )}
          </div>
        </div>

        <div className="relative mt-2 overflow-x-auto">
          <table className="w-full min-w-[720px] border-collapse text-left text-sm">
            <thead>
              <tr className="border-b border-hub-line text-[12px] text-hub-ink/50">
                <th scope="col" className="py-2 pl-1 pr-3 font-normal">Tiêu đề</th>
                <th scope="col" className="px-3 py-2 font-normal">Chuyên mục</th>
                <th scope="col" className="px-3 py-2 font-normal">Ngày đăng</th>
                <th scope="col" className="px-3 py-2 font-normal">Trạng thái</th>
                <th scope="col" className="w-20 py-2 font-normal"><span className="sr-only">Thao tác</span></th>
              </tr>
            </thead>
            <tbody>
              {rows.map((a) => (
                <tr key={`${a.section}/${a.slug}`} className="group border-b border-hub-line transition-colors hover:bg-hub-ink/[0.025]">
                  <td className="py-2 pl-1 pr-3">
                    <button type="button" onClick={() => setEditing({ original: { section: a.section, slug: a.slug }, data: toDraft(structuredClone(a)) })} className="flex w-full items-center gap-3 text-left">
                      <Thumb a={a} className="h-10 w-14" />
                      <span className="min-w-0">
                        <span className="line-clamp-1 font-medium text-hub-ink underline-offset-2 group-hover:underline">{a.title}</span>
                        <span className="block truncate text-[12px] text-hub-ink/45">{a.tags.join(" · ") || `/${a.slug}`}</span>
                      </span>
                    </button>
                  </td>
                  <td className="px-3 py-2">
                    <span className={cn("inline-block whitespace-nowrap rounded px-1.5 py-0.5 text-[12px]", SECTION_TONE[a.section])}>{SECTION_LABEL[a.section]}</span>
                  </td>
                  <td className="whitespace-nowrap px-3 py-2 tabular-nums text-hub-ink/75">{a.date.split("-").reverse().join("/")}</td>
                  <td className="px-3 py-2">
                    {a.draft ? <span className="rounded bg-hub-canvas px-1.5 py-0.5 text-[12px] text-hub-ink/60">Bản nháp</span> : <span className="rounded bg-hub-mint-soft px-1.5 py-0.5 text-[12px] text-[#1a6b46]">Đã đăng</span>}
                  </td>
                  <td className="py-2 pr-1">
                    <span className="flex justify-end gap-0.5 opacity-60 transition-opacity group-hover:opacity-100">
                      {!a.draft && (
                        <a href={href(site, a.section, a.slug)} target="_blank" rel="noopener" aria-label={`Xem “${a.title}” trên website`} className="grid size-8 place-items-center rounded-md text-hub-ink/60 hover:bg-hub-ink/5 hover:text-hub-ink">
                          <ArrowUpRight className="size-4" />
                        </a>
                      )}
                      <button type="button" onClick={() => setConfirmDelete(a)} aria-label={`Xoá “${a.title}”`} className="grid size-8 place-items-center rounded-md text-hub-ink/60 hover:bg-[#d1242f]/10 hover:text-[#d1242f]">
                        <Trash2 className="size-4" />
                      </button>
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {rows.length === 0 && (
            <div className="py-16 text-center">
              <p className="text-[15px] text-hub-ink/60">{articles.length ? "Không có bài viết nào khớp bộ lọc." : "Chưa có bài viết nào."}</p>
              {articles.length > 0 && (
                <button type="button" onClick={() => { setQ(""); setSec(""); setView("all"); }} className={cn(BTN_TEXT, "mt-2 text-hub-blue")}>
                  Xoá bộ lọc
                </button>
              )}
            </div>
          )}
          <button type="button" onClick={openNew} className="flex w-full items-center gap-2 border-b border-hub-line px-1 py-2.5 text-left text-sm text-hub-ink/45 transition-colors hover:bg-hub-ink/[0.025] hover:text-hub-ink">
            <Plus className="size-4" /> Mới
          </button>
          <p className="mt-2 px-1 text-[12px] text-hub-ink/45">Đang hiện {rows.length}/{articles.length}</p>
        </div>
      </div>

      {editing && (
        <ArticlePeek
          key={editing.original ? `${editing.original.section}/${editing.original.slug}` : "new"}
          site={site}
          original={editing.original}
          initial={editing.data}
          onClose={() => setEditing(null)}
          onDelete={() => editing.original && setConfirmDelete(articles.find((a) => a.section === editing.original!.section && a.slug === editing.original!.slug) ?? null)}
          onSaved={() => {
            setEditing(null);
            router.refresh();
          }}
        />
      )}

      {confirmDelete && (
        <div className="fixed inset-0 z-[60] grid place-items-center bg-black/30 p-4" onClick={() => !deleting && setConfirmDelete(null)}>
          <div role="alertdialog" aria-modal="true" aria-labelledby="del-title" aria-describedby="del-desc" onClick={(e) => e.stopPropagation()} className="w-full max-w-sm animate-pop rounded-xl bg-hub-paper p-6 shadow-[0_12px_40px_rgb(0_0_0/0.18)]">
            <h2 id="del-title" className="text-[17px] font-semibold text-hub-ink">Xoá bài viết này?</h2>
            <p id="del-desc" className="mt-2 text-sm leading-relaxed text-hub-ink-soft">“{confirmDelete.title}” sẽ bị gỡ khỏi website ngay. Bạn có 10 giây để bấm Hoàn tác.</p>
            <div className="mt-6 flex justify-end gap-2">
              <button type="button" autoFocus onClick={() => setConfirmDelete(null)} disabled={deleting} className={BTN_TEXT}>Huỷ</button>
              <button type="button" onClick={remove} disabled={deleting} className={cn(BTN_PRIMARY, "bg-[#d1242f] hover:bg-[#b01e28]")}>
                {deleting && <Loader2 className="animate-spin" />} Xoá
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

/* ---------------- Side peek: write / edit an article ---------------- */

function PropRow({ label, children, error }: { label: string; children: React.ReactNode; error?: string }) {
  return (
    <div className="grid grid-cols-[120px_1fr] items-start gap-3 sm:grid-cols-[150px_1fr]">
      <span className="pt-2 text-[13px] text-hub-ink/50">{label}</span>
      <div>
        {children}
        {error && <p className="mt-0.5 text-[12px] text-[#d1242f]">{error}</p>}
      </div>
    </div>
  );
}
const PROP_INPUT = "w-full rounded-md px-2 py-1.5 text-sm text-hub-ink outline-none transition-colors placeholder:text-hub-ink/30 hover:bg-hub-ink/[0.04] focus:bg-hub-paper focus:shadow-[0_0_0_1px_var(--color-hub-blue),0_0_0_4px_var(--color-hub-blue-tint)] aria-[invalid=true]:shadow-[0_0_0_1px_#d1242f]";

function ArticlePeek({ site, original, initial, onClose, onDelete, onSaved }: { site: ArticleSite; original: { section: Section; slug: string } | null; initial: Draft; onClose: () => void; onDelete: () => void; onSaved: () => void }) {
  const [d, setD] = useState(initial);
  const [slugTouched, setSlugTouched] = useState(original !== null);
  const [tagText, setTagText] = useState(initial.tags.join(", "));
  const [showErrors, setShowErrors] = useState(false);
  const [serverErrors, setServerErrors] = useState<FieldErrors>({});
  const [pending, start] = useTransition();
  const titleRef = useRef<HTMLTextAreaElement>(null);
  const n = useNotify({ record: true });
  const meta = META[site];
  const sections = SECTIONS_BY_SITE[site];
  const arts = ARTS_BY_SITE[site];
  const dirty = JSON.stringify(payload(site, d)) !== JSON.stringify(payload(site, initial));
  const errors = showErrors ? { ...validate(site, d), ...serverErrors } : {};
  const err = (k: string) => errors[k];

  useEffect(() => {
    titleRef.current?.focus();
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, []);

  const set = <K extends keyof Draft>(k: K) => (v: Draft[K]) => {
    setServerErrors({});
    setD((x) => ({ ...x, [k]: v }));
  };
  const setBlock = (i: number, b: Keyed) => set("content")(d.content.map((x, j) => (j === i ? b : x)));
  const moveBlock = (i: number, by: -1 | 1) => {
    const next = [...d.content];
    const [b] = next.splice(i, 1);
    next.splice(i + by, 0, b);
    set("content")(next);
  };
  const addBlock = (type: ArticleBlock["type"]) => {
    const _k = key();
    const b: Keyed = type === "ul" ? { type, items: [], _k } : type === "img" ? { type, src: "", _k } : { type, text: "", _k };
    set("content")([...d.content, b]);
    // focus the new block's first field once it is rendered
    requestAnimationFrame(() => document.querySelector<HTMLElement>(`[data-block="${_k}"] textarea, [data-block="${_k}"] input`)?.focus());
  };

  function close() {
    if (dirty && !confirm("Bỏ các thay đổi chưa lưu?")) return;
    onClose();
  }

  function save() {
    const local = validate(site, d);
    const count = Object.keys(local).length;
    if (count) {
      setShowErrors(true);
      n.warning("Thiếu hoặc sai thông tin", { description: `Kiểm tra ${count} ô được viền đỏ rồi lưu lại.`, record: false });
      return;
    }
    start(async () => {
      const live = !d.draft;
      const res = await n.promise(upsertArticleAction(site, payload(site, d), original), {
        loading: { title: original ? "Đang lưu thay đổi…" : "Đang đăng bài…", description: d.title },
        success: {
          title: d.draft ? "Đã lưu bản nháp" : original ? "Đã lưu thay đổi" : "Đã đăng bài viết",
          description: d.draft ? `“${d.title}” chưa hiện trên website` : `“${d.title}” đã cập nhật trên chuyên trang`,
          link: live ? { label: "Xem trên web", href: href(site, d.section, d.slug), external: true } : undefined,
        },
        error: failure(original ? "Chưa lưu được thay đổi" : "Chưa đăng được bài viết"),
      });
      if (res?.ok) onSaved();
      else if (res) {
        setShowErrors(true);
        setServerErrors(res.fieldErrors ?? {});
      }
    });
  }

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if ((e.metaKey || e.ctrlKey) && e.key === "s") {
        e.preventDefault();
        save();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  const words = d.content.map((b) => (b.type === "ul" ? b.items.join(" ") : b.type === "img" ? (b.caption ?? "") : b.text)).join(" ").split(/\s+/).filter(Boolean).length;

  return (
    <div className="fixed inset-0 z-50">
      <button type="button" aria-label="Đóng" onClick={close} className="absolute inset-0 animate-fade bg-black/20" />
      <aside role="dialog" aria-modal="true" aria-label={original ? `Sửa ${initial.title}` : "Viết bài mới"} className="absolute inset-y-0 right-0 flex w-full max-w-[760px] animate-[peek_.24s_cubic-bezier(.2,.8,.2,1)] flex-col border-l border-hub-line bg-hub-paper shadow-[-8px_0_32px_rgb(0_0_0/0.08)]">
        <div className="flex h-12 shrink-0 items-center justify-between gap-2 border-b border-hub-line px-3">
          <div className="flex min-w-0 items-center gap-1.5 text-sm text-hub-ink/55">
            <button type="button" onClick={close} aria-label="Đóng" className="grid size-8 place-items-center rounded-md hover:bg-hub-ink/5">
              <X className="size-4" />
            </button>
            <span aria-hidden className={cn("size-1.5 rounded-full", meta.dot)} />
            <span>{meta.title}</span>
            <span aria-hidden>/</span>
            <span className="truncate text-hub-ink">{original ? "Sửa bài viết" : "Bài viết mới"}</span>
          </div>
          {original && !initial.draft && (
            <a href={href(site, original.section, original.slug)} target="_blank" rel="noopener" className={cn(BTN_TEXT, "h-8 px-2.5")}>
              Mở trên web <ArrowUpRight />
            </a>
          )}
        </div>

        <div className="flex-1 overflow-y-auto overscroll-contain px-6 pb-10 pt-8 sm:px-10">
          <Thumb a={d} className="h-16 w-24 rounded-xl" />
          <label className="sr-only" htmlFor="article-title">Tiêu đề bài viết</label>
          <textarea
            id="article-title"
            ref={titleRef}
            rows={1}
            value={d.title}
            placeholder="Tiêu đề bài viết"
            aria-invalid={err("title") ? true : undefined}
            onChange={(e) => {
              const title = e.target.value.replace(/\n/g, " ");
              setServerErrors({});
              setD((x) => ({ ...x, title, slug: slugTouched ? x.slug : slugify(title) }));
            }}
            className="mt-4 w-full resize-none bg-transparent text-[28px] font-bold leading-tight tracking-[-0.025em] text-hub-ink outline-none [field-sizing:content] placeholder:text-hub-ink/25"
          />
          {err("title") && <p className="text-[13px] text-[#d1242f]">{err("title")}</p>}

          {/* properties */}
          <div className="mt-5 space-y-1 border-b border-hub-line pb-5">
            {sections.length > 1 && (
              <PropRow label="Chuyên mục" error={err("section")}>
                <select value={d.section} aria-label="Chuyên mục" onChange={(e) => set("section")(e.target.value as Section)} className={PROP_INPUT}>
                  {sections.map((s) => (
                    <option key={s} value={s}>{SECTION_LABEL[s]}</option>
                  ))}
                </select>
              </PropRow>
            )}
            <PropRow label="Đường dẫn" error={err("slug")}>
              <div className="flex items-center rounded-md">
                <span className="shrink-0 whitespace-nowrap pl-2 text-[13px] text-hub-ink/35">{meta.base}/{d.section}/</span>
                <input
                  value={d.slug}
                  aria-label="Đường dẫn"
                  aria-invalid={err("slug") ? true : undefined}
                  onChange={(e) => {
                    setSlugTouched(true);
                    set("slug")(slugify(e.target.value) + (e.target.value.endsWith("-") ? "-" : ""));
                  }}
                  className={cn(PROP_INPUT, "pl-0.5")}
                />
              </div>
            </PropRow>
            <PropRow label="Ngày đăng" error={err("date")}>
              <input type="date" value={d.date} aria-label="Ngày đăng" onChange={(e) => set("date")(e.target.value)} className={PROP_INPUT} />
            </PropRow>
            <PropRow label="Tác giả" error={err("author")}>
              <input value={d.author} aria-label="Tác giả" aria-invalid={err("author") ? true : undefined} onChange={(e) => set("author")(e.target.value)} className={PROP_INPUT} />
            </PropRow>
            <PropRow label="Thẻ" error={err("tags")}>
              <input
                value={tagText}
                aria-label="Thẻ, cách nhau bằng dấu phẩy"
                placeholder="VD: Cà phê, Bón phân"
                onChange={(e) => {
                  setTagText(e.target.value);
                  set("tags")(e.target.value.split(",").map((t) => t.trim()).filter(Boolean));
                }}
                className={PROP_INPUT}
              />
            </PropRow>
          </div>

          <div className="mt-6 space-y-6">
            <Toggle label="Bản nháp" hint="Lưu lại nhưng chưa hiện trên website" checked={!!d.draft} onChange={set("draft")} />

            <TextField
              label="Tóm tắt"
              required
              multiline
              value={d.excerpt}
              onChange={set("excerpt")}
              error={err("excerpt")}
              hint={`${d.excerpt.length}/${EXCERPT_MAX} ký tự · 1–2 câu, hiện trên thẻ bài viết, đầu bài và khi chia sẻ lên Zalo, Facebook${d.excerpt.length > EXCERPT_MAX ? " – nên rút gọn" : ""}`}
            />

            <ImagesField label={site === "phanbon" ? "Ảnh bìa *" : "Ảnh bìa (tuỳ chọn)"} value={d.cover ? [d.cover] : []} onChange={(v) => set("cover")(v[0])} error={err("cover")} max={1} />

            {arts.length > 0 && !d.cover && (
              <fieldset>
                <legend className="mb-1.5 text-[13px] font-medium text-hub-ink/75">Hình minh hoạ (dùng khi chưa có ảnh bìa)</legend>
                <div className="grid grid-cols-4 gap-2 sm:grid-cols-7">
                  {arts.map((k) => (
                    <button key={k} type="button" aria-pressed={d.art === k} onClick={() => set("art")(k)} className={cn("flex flex-col items-center gap-1 rounded-lg border p-2 text-[11px] transition-colors", d.art === k ? "border-hub-blue bg-hub-blue-tint text-hub-blue" : "border-hub-line text-hub-ink/55 hover:bg-hub-ink/[0.03]")}>
                      <ProductArt kind={k} className="!size-9" />
                      <span className="truncate">{ART_LABEL[k]}</span>
                    </button>
                  ))}
                </div>
              </fieldset>
            )}

            {/* body: the same blocks the article page renders */}
            <section aria-labelledby="body-label">
              <div className="mb-2 flex items-baseline justify-between">
                <h3 id="body-label" className="text-[13px] font-medium text-hub-ink/75">Nội dung bài viết <span className="text-[#d1242f]">*</span></h3>
                <span className="text-[12px] tabular-nums text-hub-ink/40">{words} chữ · ~{Math.max(1, Math.round(words / 200))} phút đọc</span>
              </div>
              {err("content") && <p className="mb-2 text-[13px] text-[#d1242f]">{err("content")}</p>}
              <ol className="space-y-2">
                {d.content.map((b, i) => (
                  <BlockEditor
                    key={b._k}
                    block={b}
                    index={i}
                    count={d.content.length}
                    error={Object.entries(errors).find(([k]) => k.startsWith(`content.${i}.`) || k === `content.${i}`)?.[1]}
                    onChange={(nb) => setBlock(i, nb)}
                    onMove={(by) => moveBlock(i, by)}
                    onRemove={() => set("content")(d.content.filter((_, j) => j !== i))}
                  />
                ))}
              </ol>
              <div className="mt-3 flex flex-wrap gap-1.5" role="group" aria-label="Thêm khối nội dung">
                {(
                  [
                    ["p", "Đoạn văn", Pilcrow],
                    ["h2", "Tiêu đề phụ", Heading2],
                    ["ul", "Danh sách", List],
                    ["quote", "Trích dẫn", Quote],
                    ["img", "Ảnh", ImageIcon],
                  ] as const
                ).map(([t, label, Icon]) => (
                  <button key={t} type="button" onClick={() => addBlock(t)} className="inline-flex h-8 items-center gap-1.5 rounded-md border border-hub-line px-2.5 text-[13px] text-hub-ink/70 transition-colors hover:border-hub-blue hover:bg-hub-blue-tint hover:text-hub-blue">
                    <Plus className="size-3.5" aria-hidden /> <Icon className="size-3.5" aria-hidden /> {label}
                  </button>
                ))}
              </div>
            </section>
          </div>
        </div>

        <div className="flex shrink-0 items-center justify-between gap-2 border-t border-hub-line px-4 py-3">
          {original ? (
            <button type="button" onClick={onDelete} className={BTN_DANGER}>
              <Trash2 /> Xoá
            </button>
          ) : (
            <span className="text-[12px] text-hub-ink/40">Ctrl/⌘ + S để lưu</span>
          )}
          <div className="flex gap-2">
            <button type="button" onClick={close} className={BTN_TEXT}>Huỷ</button>
            <button type="button" onClick={save} disabled={pending} className={BTN_PRIMARY}>
              {pending && <Loader2 className="animate-spin" />} {d.draft ? "Lưu nháp" : original ? "Lưu thay đổi" : "Đăng bài"}
            </button>
          </div>
        </div>
      </aside>
    </div>
  );
}

/* ---------------- One content block ---------------- */

const BLOCK_META: Record<ArticleBlock["type"], { label: string; Icon: typeof Pilcrow }> = {
  p: { label: "Đoạn văn", Icon: Pilcrow },
  h2: { label: "Tiêu đề phụ", Icon: Heading2 },
  ul: { label: "Danh sách", Icon: List },
  quote: { label: "Trích dẫn", Icon: Quote },
  img: { label: "Ảnh", Icon: ImageIcon },
};
const BLOCK_INPUT = "w-full resize-none rounded-md bg-transparent px-2 py-1.5 text-[15px] leading-relaxed text-hub-ink outline-none [field-sizing:content] placeholder:text-hub-ink/30 focus:bg-hub-paper focus:shadow-[0_0_0_1px_var(--color-hub-blue),0_0_0_4px_var(--color-hub-blue-tint)]";

function BlockEditor({ block, index, count, error, onChange, onMove, onRemove }: { block: Keyed; index: number; count: number; error?: string; onChange: (b: Keyed) => void; onMove: (by: -1 | 1) => void; onRemove: () => void }) {
  const { label, Icon } = BLOCK_META[block.type];
  // list items are edited as text (one per line); keep the raw text so empty lines can be typed
  const [listText, setListText] = useState(block.type === "ul" ? block.items.join("\n") : "");
  const tool = "grid size-7 place-items-center rounded-md text-hub-ink/45 hover:bg-hub-ink/5 hover:text-hub-ink disabled:pointer-events-none disabled:opacity-30";

  return (
    <li data-block={block._k} className={cn("group rounded-lg border bg-hub-paper p-2 transition-colors", error ? "border-[#d1242f]" : "border-hub-line focus-within:border-hub-blue/50")}>
      <div className="flex items-center justify-between gap-2 px-1">
        <span className="inline-flex items-center gap-1.5 text-[12px] font-medium text-hub-ink/50">
          <Icon className="size-3.5" aria-hidden /> {label}
        </span>
        <span className="flex gap-0.5 opacity-70 transition-opacity group-hover:opacity-100 group-focus-within:opacity-100">
          <button type="button" className={tool} disabled={index === 0} onClick={() => onMove(-1)} aria-label={`Đưa khối ${index + 1} lên`}><ArrowUp className="size-3.5" /></button>
          <button type="button" className={tool} disabled={index === count - 1} onClick={() => onMove(1)} aria-label={`Đưa khối ${index + 1} xuống`}><ArrowDown className="size-3.5" /></button>
          <button type="button" className={cn(tool, "hover:bg-[#d1242f]/10 hover:text-[#d1242f]")} onClick={onRemove} aria-label={`Xoá khối ${index + 1}`}><Trash2 className="size-3.5" /></button>
        </span>
      </div>

      {block.type === "p" && <textarea rows={2} value={block.text} placeholder="Viết đoạn văn…" aria-label={`Khối ${index + 1}: đoạn văn`} onChange={(e) => onChange({ ...block, text: e.target.value })} className={BLOCK_INPUT} />}
      {block.type === "h2" && <input value={block.text} placeholder="Tiêu đề phụ" aria-label={`Khối ${index + 1}: tiêu đề phụ`} onChange={(e) => onChange({ ...block, text: e.target.value })} className={cn(BLOCK_INPUT, "text-[18px] font-semibold")} />}
      {block.type === "quote" && <textarea rows={2} value={block.text} placeholder="Câu trích dẫn, lời khuyên nổi bật…" aria-label={`Khối ${index + 1}: trích dẫn`} onChange={(e) => onChange({ ...block, text: e.target.value })} className={cn(BLOCK_INPUT, "border-l-2 border-hub-ink/20 italic")} />}
      {block.type === "ul" && (
        <>
          <textarea
            rows={3}
            value={listText}
            placeholder={"Mỗi dòng là một ý\nÝ thứ hai"}
            aria-label={`Khối ${index + 1}: danh sách, mỗi dòng một ý`}
            onChange={(e) => {
              setListText(e.target.value);
              onChange({ ...block, items: e.target.value.split("\n").map((s) => s.trim()).filter(Boolean) });
            }}
            className={BLOCK_INPUT}
          />
          <p className="px-2 text-[12px] text-hub-ink/40">Mỗi dòng là một ý · {block.items.length} ý</p>
        </>
      )}
      {block.type === "img" && (
        <div className="space-y-2 px-1 pb-1 pt-1.5">
          <ImagesField label="Ảnh trong bài" value={block.src ? [block.src] : []} onChange={(v) => onChange({ ...block, src: v[0] ?? "" })} max={1} />
          <input value={block.caption ?? ""} placeholder="Chú thích ảnh (tuỳ chọn)" aria-label={`Khối ${index + 1}: chú thích ảnh`} onChange={(e) => onChange({ ...block, caption: e.target.value })} className={cn(BLOCK_INPUT, "text-sm")} />
        </div>
      )}
      {error && <p className="px-2 pt-1 text-[12px] text-[#d1242f]">{error}</p>}
    </li>
  );
}
