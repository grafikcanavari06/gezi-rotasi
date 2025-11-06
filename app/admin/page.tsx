// app/admin/page.tsx
import Link from "next/link";

export default function AdminHome() {
  return (
    <main className="p-6 max-w-xl mx-auto space-y-4">
      <h1 className="text-2xl font-bold">Admin Paneli</h1>
      <p>Buradan içerik yönetebilirsin.</p>
      <div className="flex flex-col gap-2">
        <Link
          href="/admin/places"
          className="px-4 py-2 bg-slate-900 text-white rounded"
        >
          Yerleri Yönet
        </Link>
        <Link
          href="/admin/themes"
          className="px-4 py-2 bg-slate-200 text-slate-900 rounded"
        >
          Temaları Yönet
        </Link>
      </div>
    </main>
  );
}
