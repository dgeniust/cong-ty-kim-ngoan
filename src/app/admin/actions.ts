"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { authenticate, requireAdmin } from "@/lib/auth/server";
import { SESSION_COOKIE, signSession } from "@/lib/auth/session";
import { siteContentSchema, type SiteContent } from "@/lib/content/schema";
import { resetContent, saveContent } from "@/lib/content/store";
import { settingsSchema, type SiteSettings } from "@/lib/settings/schema";
import { resetSettings, saveSettings } from "@/lib/settings/server";
import { catalogProductSchema, fertilizerProductSchema } from "@/lib/products/schema";
import { getCatalogProducts, getFertilizerProducts, saveCatalogProducts, saveFertilizerProducts, type ProductSite } from "@/lib/products/server";
import type { CatalogProduct } from "@/lib/data/types";
import type { Product } from "@/lib/mock/types";

export type ActionResult = { ok: true } | { ok: false; error: string };

export async function loginAction(_prev: ActionResult | null, formData: FormData): Promise<ActionResult> {
  const email = String(formData.get("email") ?? "");
  const password = String(formData.get("password") ?? "");
  const next = String(formData.get("next") ?? "/admin");
  const session = authenticate(email, password);
  if (!session || session.role !== "ADMIN") return { ok: false, error: "Email hoặc mật khẩu không đúng" };

  (await cookies()).set(SESSION_COOKIE, await signSession(session), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
  redirect(next.startsWith("/admin") ? next : "/admin");
}

export async function logoutAction() {
  (await cookies()).delete(SESSION_COOKIE);
  redirect("/admin/login");
}

export async function saveContentAction(content: SiteContent): Promise<ActionResult> {
  try {
    await requireAdmin();
  } catch {
    return { ok: false, error: "Bạn không có quyền ADMIN" };
  }
  const parsed = siteContentSchema.safeParse(content);
  if (!parsed.success) {
    const issue = parsed.error.issues[0];
    return { ok: false, error: `Dữ liệu không hợp lệ: ${issue.path.join(".")} – ${issue.message}` };
  }
  await saveContent(parsed.data);
  revalidatePath("/", "layout");
  return { ok: true };
}

export async function resetContentAction(): Promise<ActionResult> {
  try {
    await requireAdmin();
  } catch {
    return { ok: false, error: "Bạn không có quyền ADMIN" };
  }
  await resetContent();
  revalidatePath("/", "layout");
  return { ok: true };
}

/* =====================================================================
 * Thông tin chung (công ty + 3 chuyên trang)
 * ===================================================================== */

export type FieldErrors = Record<string, string>;
export type FormResult = { ok: true } | { ok: false; error: string; fieldErrors?: FieldErrors };

const firstErrors = (issues: { path: PropertyKey[]; message: string }[]): FieldErrors => {
  const out: FieldErrors = {};
  for (const i of issues) {
    const k = i.path.map(String).join(".");
    out[k] ??= i.message;
  }
  return out;
};

async function guard(): Promise<FormResult | null> {
  try {
    await requireAdmin();
    return null;
  } catch {
    return { ok: false, error: "Bạn không có quyền ADMIN" };
  }
}

export async function saveSettingsAction(input: SiteSettings): Promise<FormResult> {
  const denied = await guard();
  if (denied) return denied;
  const parsed = settingsSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: "Vui lòng kiểm tra các ô được đánh dấu", fieldErrors: firstErrors(parsed.error.issues) };
  await saveSettings(parsed.data);
  revalidatePath("/", "layout");
  return { ok: true };
}

export async function resetSettingsAction(): Promise<FormResult> {
  const denied = await guard();
  if (denied) return denied;
  await resetSettings();
  revalidatePath("/", "layout");
  return { ok: true };
}

/* =====================================================================
 * Sản phẩm – CRUD theo từng chuyên trang
 * ===================================================================== */
export async function upsertProductAction(site: ProductSite, input: unknown, originalSlug: string | null): Promise<FormResult & { slug?: string }> {
  const denied = await guard();
  if (denied) return denied;

  if (site === "phanbon") {
    const parsed = fertilizerProductSchema.safeParse(input);
    if (!parsed.success) return { ok: false, error: "Vui lòng kiểm tra các ô được đánh dấu", fieldErrors: firstErrors(parsed.error.issues) };
    const list = [...(await getFertilizerProducts())];
    const next = parsed.data as Product;
    const clash = list.findIndex((p) => p.slug === next.slug);
    const idx = originalSlug ? list.findIndex((p) => p.slug === originalSlug) : -1;
    if (clash !== -1 && clash !== idx) return { ok: false, error: "Đường dẫn (slug) đã tồn tại", fieldErrors: { slug: "Đã có sản phẩm dùng đường dẫn này" } };
    if (idx >= 0) list[idx] = next;
    else list.unshift(next);
    await saveFertilizerProducts(list);
  } else {
    const parsed = catalogProductSchema.safeParse({ ...(input as object), site });
    if (!parsed.success) return { ok: false, error: "Vui lòng kiểm tra các ô được đánh dấu", fieldErrors: firstErrors(parsed.error.issues) };
    const list = [...(await getCatalogProducts(site))];
    const next = parsed.data as CatalogProduct;
    const clash = list.findIndex((p) => p.slug === next.slug);
    const idx = originalSlug ? list.findIndex((p) => p.slug === originalSlug) : -1;
    if (clash !== -1 && clash !== idx) return { ok: false, error: "Đường dẫn (slug) đã tồn tại", fieldErrors: { slug: "Đã có sản phẩm dùng đường dẫn này" } };
    if (idx >= 0) list[idx] = next;
    else list.unshift(next);
    await saveCatalogProducts(site, list);
  }
  revalidatePath("/", "layout");
  return { ok: true, slug: (input as { slug: string }).slug };
}

export async function deleteProductAction(site: ProductSite, slug: string): Promise<FormResult> {
  const denied = await guard();
  if (denied) return denied;
  if (site === "phanbon") {
    const list = await getFertilizerProducts();
    if (list.length <= 1) return { ok: false, error: "Cần giữ lại ít nhất 1 sản phẩm" };
    await saveFertilizerProducts(list.filter((p) => p.slug !== slug));
  } else {
    const list = await getCatalogProducts(site);
    if (list.length <= 1) return { ok: false, error: "Cần giữ lại ít nhất 1 sản phẩm" };
    await saveCatalogProducts(site, list.filter((p) => p.slug !== slug));
  }
  revalidatePath("/", "layout");
  return { ok: true };
}
