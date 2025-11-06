"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type Theme = {
  id: string;
  name_tr: string;
  code: string;
  isActive: boolean;
};

export default function EditPlaceForm({ place }: { place: any }) {
  const router = useRouter();
  const [themes, setThemes] = useState<Theme[]>([]);
  const [form, setForm] = useState(place);

  // temaları çek
  useEffect(() => {
    (async () => {
      const res = await fetch("/api/admin/themes");
      if (res.ok) {
        const data = await res.json();
        setThemes(data.filter((t: Theme) => t.isActive));
      }
    })();
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    await fetch(`/api/admin/places/${place.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...form,
        themeId: form.themeId || null,
      }),
    });
    router.push("/admin/places");
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <input
        value={form.name_tr}
        onChange={(e) => setForm((f: any) => ({ ...f, name_tr: e.target.value }))}
        className="w-full border p-2 rounded"
      />
      <input
        value={form.name_en || ""}
        onChange={(e) => setForm((f: any) => ({ ...f, name_en: e.target.value }))}
        className="w-full border p-2 rounded"
      />
      <input
        value={form.category || ""}
        onChange={(e) => setForm((f: any) => ({ ...f, category: e.target.value }))}
        className="w-full border p-2 rounded"
      />

      {/* Tema seçimi */}
      <select
        value={form.themeId || ""}
        onChange={(e) =>
          setForm((f: any) => ({ ...f, themeId: e.target.value }))
        }
        className="w-full border p-2 rounded"
      >
        <option value="">Tema seç (opsiyonel)</option>
        {themes.map((t) => (
          <option key={t.id} value={t.id}>
            {t.name_tr} ({t.code})
          </option>
        ))}
      </select>

      <label className="flex gap-2 items-center">
        <input
          type="checkbox"
          checked={form.isActive}
          onChange={(e) =>
            setForm((f: any) => ({ ...f, isActive: e.target.checked }))
          }
        />
        Aktif
      </label>

      <label className="flex gap-2 items-center">
        <input
          type="checkbox"
          checked={form.isSponsored}
          onChange={(e) =>
            setForm((f: any) => ({ ...f, isSponsored: e.target.checked }))
          }
        />
        Sponsorlu
      </label>

      <button
        type="submit"
        className="bg-slate-900 text-white px-4 py-2 rounded"
      >
        Kaydet
      </button>
    </form>
  );
}
