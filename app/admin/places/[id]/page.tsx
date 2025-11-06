// app/admin/places/[id]/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

type Place = {
  id: string;
  name_tr: string;
  name_en?: string | null;
  description_tr?: string | null;
  description_en?: string | null;
  category?: string | null;
  imageUrl?: string | null;
  videoUrl?: string | null;
  googleMapsUrl?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  isActive: boolean;
  isSponsored: boolean;
  isForKids: boolean;
  isRomantic: boolean;
  isHistoric: boolean;
  isInstagrammable: boolean;
  isInsertableAsBreak: boolean;
};

export default function AdminPlaceEditPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;

  const [place, setPlace] = useState<Place | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  // kaydı çek
  useEffect(() => {
    (async () => {
      const res = await fetch(`/api/admin/places?id=${id}`);
      if (!res.ok) {
        setError("Yer alınamadı");
        setLoading(false);
        return;
      }
      const data = await res.json();
      setPlace(data);
      setLoading(false);
    })();
  }, [id]);

  function updateField<K extends keyof Place>(key: K, value: Place[K]) {
    setPlace((prev) => (prev ? { ...prev, [key]: value } : prev));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!place) return;
    setSaving(true);
    setError("");

    const res = await fetch(`/api/admin/places?id=${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(place),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      setError(err?.error || "Kaydedilemedi");
      setSaving(false);
      return;
    }

    setSaving(false);
    router.push("/admin/places");
  }

  if (loading) {
    return <p className="text-slate-200">Yükleniyor...</p>;
  }

  if (!place) {
    return <p className="text-red-300">Yer bulunamadı.</p>;
  }

  return (
    <main className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Yer düzenle</h1>
          <p className="text-sm text-slate-400">{place.name_tr}</p>
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
        {/* Adlar */}
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="text-xs text-slate-300 mb-1 block">Ad (TR)</label>
            <input
              value={place.name_tr}
              onChange={(e) => updateField("name_tr", e.target.value)}
              required
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-100"
            />
          </div>
          <div>
            <label className="text-xs text-slate-300 mb-1 block">Ad (EN)</label>
            <input
              value={place.name_en ?? ""}
              onChange={(e) => updateField("name_en", e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-100"
            />
          </div>
        </div>

        {/* Açıklamalar */}
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="text-xs text-slate-300 mb-1 block">
              Açıklama (TR)
            </label>
            <textarea
              value={place.description_tr ?? ""}
              onChange={(e) => updateField("description_tr", e.target.value)}
              rows={3}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-100"
            />
          </div>
          <div>
            <label className="text-xs text-slate-300 mb-1 block">
              Açıklama (EN)
            </label>
            <textarea
              value={place.description_en ?? ""}
              onChange={(e) => updateField("description_en", e.target.value)}
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
              value={place.imageUrl ?? ""}
              onChange={(e) => updateField("imageUrl", e.target.value)}
              placeholder="https://...jpg"
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-100"
            />
          </div>
          <div>
            <label className="text-xs text-slate-300 mb-1 block">
              Video URL
            </label>
            <input
              value={place.videoUrl ?? ""}
              onChange={(e) => updateField("videoUrl", e.target.value)}
              placeholder="https://youtube.com/..."
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-100"
            />
          </div>
        </div>

        {/* Konum/Kategori */}
        <div className="grid sm:grid-cols-3 gap-4">
          <div className="sm:col-span-2">
            <label className="text-xs text-slate-300 mb-1 block">
              Google Maps Linki
            </label>
            <input
              value={place.googleMapsUrl ?? ""}
              onChange={(e) => updateField("googleMapsUrl", e.target.value)}
              placeholder="https://www.google.com/maps/..."
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-100"
            />
          </div>
          <div>
            <label className="text-xs text-slate-300 mb-1 block">Kategori</label>
            <input
              value={place.category ?? ""}
              onChange={(e) => updateField("category", e.target.value)}
              placeholder="historic / park / museum ..."
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-100"
            />
          </div>
        </div>

        {/* Bayraklar */}
        <div className="grid sm:grid-cols-3 gap-3">
          <label className="flex gap-2 items-center text-xs text-slate-200 bg-slate-900/40 rounded-lg px-3 py-2 border border-slate-700">
            <input
              type="checkbox"
              checked={place.isActive}
              onChange={(e) => updateField("isActive", e.target.checked)}
            />
            Aktif
          </label>
          <label className="flex gap-2 items-center text-xs text-slate-200 bg-slate-900/40 rounded-lg px-3 py-2 border border-slate-700">
            <input
              type="checkbox"
              checked={place.isSponsored}
              onChange={(e) => updateField("isSponsored", e.target.checked)}
            />
            Sponsorlu
          </label>
          <label className="flex gap-2 items-center text-xs text-slate-200 bg-slate-900/40 rounded-lg px-3 py-2 border border-slate-700">
            <input
              type="checkbox"
              checked={place.isInsertableAsBreak}
              onChange={(e) =>
                updateField("isInsertableAsBreak", e.target.checked)
              }
            />
            Araya serpiştir
          </label>
          <label className="flex gap-2 items-center text-xs text-slate-200 bg-slate-900/40 rounded-lg px-3 py-2 border border-slate-700">
            <input
              type="checkbox"
              checked={place.isForKids}
              onChange={(e) => updateField("isForKids", e.target.checked)}
            />
            Çocuk
          </label>
          <label className="flex gap-2 items-center text-xs text-slate-200 bg-slate-900/40 rounded-lg px-3 py-2 border border-slate-700">
            <input
              type="checkbox"
              checked={place.isRomantic}
              onChange={(e) => updateField("isRomantic", e.target.checked)}
            />
            Romantik
          </label>
          <label className="flex gap-2 items-center text-xs text-slate-200 bg-slate-900/40 rounded-lg px-3 py-2 border border-slate-700">
            <input
              type="checkbox"
              checked={place.isHistoric}
              onChange={(e) => updateField("isHistoric", e.target.checked)}
            />
            Tarihi
          </label>
          <label className="flex gap-2 items-center text-xs text-slate-200 bg-slate-900/40 rounded-lg px-3 py-2 border border-slate-700">
            <input
              type="checkbox"
              checked={place.isInstagrammable}
              onChange={(e) =>
                updateField("isInstagrammable", e.target.checked)
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
