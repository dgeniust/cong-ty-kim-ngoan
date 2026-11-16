import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-32 text-center">
      <p className="v-display text-[9rem] text-v-mark">404</p>
      <h1 className="v-display mt-4 text-4xl text-v-fg">Không tìm thấy trang</h1>
      <p className="mt-4 text-v-mute">Trang bạn tìm có thể đã được đổi tên hoặc không còn tồn tại.</p>
      <Link href="/" className="v-label mt-8 inline-block bg-v-accent px-7 py-3.5 text-v-on-accent">Về trang chủ Kim Ngoan</Link>
    </div>
  );
}
