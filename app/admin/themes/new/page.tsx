"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function NewThemePage() {
  const router = useRouter();
  const [form, setForm] = useState({
    code: "",
    name_tr: "",
    name_en: "",
    isActive: true,
  });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    await fetch("/api/admin/themes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    router.push("/admin/themes");
  }

  return (
    <main className="p-6 max-w-md mx-auto space-y-4">
      <h1 className="text-2xl font-bold">Yeni Tema Ekle</h1>
      <form onSubmit={handleSubmit} className="space-y-3">
        <input
          value={form.code}
          onChange={(e) => setForm((f) => ({ ...f, code: e.target.value }))}
          placeholder="Kod (ör. kids, romantic, historic)"
          className="w-full border p-2 rounded"
          required
        />
        <input
          value={form.name_tr}
          onChange={(e) => setForm((f) => ({ ...f, name_tr: e.target.value }))}
          placeholder="Ad (TR)"
          className="w-full border p-2 rounded"
          required
        />
        <input
          value={form.name_en}
          onChange={(e) => setForm((f) => ({ ...f, name_en: e.target.value }))}
          placeholder="Name (EN)"
          className="w-full border p-2 rounded"
        />

        <label className="flex gap-2 items-center">
          <input
            type="checkbox"
            checked={form.isActive}
            onChange={(e) =>
              setForm((f) => ({ ...f, isActive: e.target.checked }))
            }
          />
          Aktif
        </label>

        <button
          type="submit"
          className="bg-slate-900 text-white px-4 py-2 rounded"
        >
          Kaydet
        </button>
      </form>
    </main>
  );
}
