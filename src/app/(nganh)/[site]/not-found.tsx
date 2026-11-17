import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-32 text-center">
      <p className="v-display text-[9rem] text-v-mark">404</p>
      <h1 className="v-display mt-4 text-4xl text-v-fg">Không tìm thấy trang</h1>
      <p className="mt-4 text-v-mute">Trang bạn tìm có thể đã được đổi tên hoặc không còn tồn tại.</p>
      <Link href="/" className="mt-8 inline-flex h-11 items-center rounded-lg bg-v-accent px-5 font-medium text-v-on-accent">Về trang chủ Kim Ngoan</Link>
    </div>
  );
}
