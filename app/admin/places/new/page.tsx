// app/admin/places/new/page.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminPlaceNewPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    name_tr: "",
    name_en: "",
    description_tr: "",
    description_en: "",
    category: "",
    imageUrl: "",
    videoUrl: "",
    googleMapsUrl: "",
    isActive: true,
    isSponsored: false,
    isForKids: false,
    isRomantic: false,
    isHistoric: false,
    isInstagrammable: false,
    isInsertableAsBreak: false,
  });
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  function update<K extends keyof typeof form>(key: K, value: (typeof form)[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSaving(true);

    const res = await fetch("/api/admin/places", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      setError(err?.error || "Kaydedilemedi");
      setSaving(false);
      return;
    }

    router.push("/admin/places");
  }

  return (
    <main className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Yeni Yer Ekle</h1>
          <p className="text-sm text-slate-400">
            Ankara’ya yeni bir mekan ekliyorsun.
          </p>
        </div>
        <button
          onClick={() => router.push("/admin/places")}
          className="text-xs bg-slate-900 border border-slate-700 text-slate-100 px-3 py-2 rounded-lg"
        >
          ← Listeye dön
        </button>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/30 text-red-100 text-sm rounded-lg p-3">
          {error}
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="bg-slate-950/40 border border-slate-800 rounded-2xl p-5 space-y-4"
      >
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="text-xs text-slate-300 mb-1 block">Ad (TR)</label>
            <input
              value={form.name_tr}
              onChange={(e) => update("name_tr", e.target.value)}
              required
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-100"
            />
          </div>
          <div>
            <label className="text-xs text-slate-300 mb-1 block">Ad (EN)</label>
            <input
              value={form.name_en}
              onChange={(e) => update("name_en", e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-100"
            />
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="text-xs text-slate-300 mb-1 block">
              Açıklama (TR)
            </label>
            <textarea
              value={form.description_tr}
              onChange={(e) => update("description_tr", e.target.value)}
              rows={3}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-100"
            />
          </div>
          <div>
            <label className="text-xs text-slate-300 mb-1 block">
              Açıklama (EN)
            </label>
            <textarea
              value={form.description_en}
              onChange={(e) => update("description_en", e.target.value)}
              rows={3}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-100"
            />
          </div>
        </div>

        {/* Medya */}
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="text-xs text-slate-300 mb-1 block">
              Fotoğraf URL
            </label>
            <input
              value={form.imageUrl}
              onChange={(e) => update("imageUrl", e.target.value)}
              placeholder="https://...jpg"
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-100"
            />
          </div>
          <div>
            <label className="text-xs text-slate-300 mb-1 block">
              Video URL
            </label>
            <input
              value={form.videoUrl}
              onChange={(e) => update("videoUrl", e.target.value)}
              placeholder="https://youtube.com/..."
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-100"
            />
          </div>
        </div>

        {/* Konum / kategori */}
        <div className="grid sm:grid-cols-3 gap-4">
          <div className="sm:col-span-2">
            <label className="text-xs text-slate-300 mb-1 block">
              Google Maps Linki
            </label>
            <input
              value={form.googleMapsUrl}
              onChange={(e) => update("googleMapsUrl", e.target.value)}
              placeholder="https://www.google.com/maps/..."
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-100"
            />
          </div>
          <div>
            <label className="text-xs text-slate-300 mb-1 block">
              Kategori
            </label>
            <input
              value={form.category}
              onChange={(e) => update("category", e.target.value)}
              placeholder="historic / museum / park ..."
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-100"
            />
          </div>
        </div>

        {/* Bayraklar */}
        <div className="grid sm:grid-cols-3 gap-3">
          <label className="flex gap-2 items-center text-xs text-slate-200 bg-slate-900/40 rounded-lg px-3 py-2 border border-slate-700">
            <input
              type="checkbox"
              checked={form.isActive}
              onChange={(e) => update("isActive", e.target.checked)}
            />
            Aktif
          </label>
          <label className="flex gap-2 items-center text-xs text-slate-200 bg-slate-900/40 rounded-lg px-3 py-2 border border-slate-700">
            <input
              type="checkbox"
              checked={form.isSponsored}
              onChange={(e) => update("isSponsored", e.target.checked)}
            />
            Sponsorlu
          </label>
          <label className="flex gap-2 items-center text-xs text-slate-200 bg-slate-900/40 rounded-lg px-3 py-2 border border-slate-700">
            <input
              type="checkbox"
              checked={form.isInsertableAsBreak}
              onChange={(e) =>
                update("isInsertableAsBreak", e.target.checked)
              }
            />
            Araya serpiştir
          </label>
          <label className="flex gap-2 items-center text-xs text-slate-200 bg-slate-900/40 rounded-lg px-3 py-2 border border-slate-700">
            <input
              type="checkbox"
              checked={form.isForKids}
              onChange={(e) => update("isForKids", e.target.checked)}
            />
            Çocuk
          </label>
          <label className="flex gap-2 items-center text-xs text-slate-200 bg-slate-900/40 rounded-lg px-3 py-2 border border-slate-700">
            <input
              type="checkbox"
              checked={form.isRomantic}
              onChange={(e) => update("isRomantic", e.target.checked)}
            />
            Romantik
          </label>
          <label className="flex gap-2 items-center text-xs text-slate-200 bg-slate-900/40 rounded-lg px-3 py-2 border border-slate-700">
            <input
              type="checkbox"
              checked={form.isHistoric}
              onChange={(e) => update("isHistoric", e.target.checked)}
            />
            Tarihi
          </label>
          <label className="flex gap-2 items-center text-xs text-slate-200 bg-slate-900/40 rounded-lg px-3 py-2 border border-slate-700">
            <input
              type="checkbox"
              checked={form.isInstagrammable}
              onChange={(e) =>
                update("isInstagrammable", e.target.checked)
              }
            />
            Fotoğraf çekmelik
          </label>
        </div>

        <div className="flex justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={() => router.push("/admin/places")}
            className="text-xs bg-slate-900 border border-slate-700 text-slate-100 px-4 py-2 rounded-lg"
          >
            Vazgeç
          </button>
          <button
            type="submit"
            disabled={saving}
            className="text-xs bg-indigo-500 hover:bg-indigo-400 disabled:bg-slate-700 text-white px-4 py-2 rounded-lg"
          >
            {saving ? "Kaydediliyor..." : "Kaydet"}
          </button>
        </div>
      </form>
    </main>
  );
}
