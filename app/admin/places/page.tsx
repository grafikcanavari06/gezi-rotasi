// app/admin/places/page.tsx
"use client";

import { useEffect, useState } from "react";

type Place = {
  id: string;
  name_tr: string;
  category: string | null;
  isActive: boolean;
  isSponsored: boolean;
  createdAt?: string;
};

export default function AdminPlacesPage() {
  const [places, setPlaces] = useState<Place[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const res = await fetch("/api/admin/places");
      if (res.ok) {
        const data = await res.json();
        setPlaces(data);
      }
      setLoading(false);
    })();
  }, []);

  return (
    <main className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Admin · Yerler</h1>
          <p className="text-sm text-slate-400">
            Ankara’daki yerleri buradan yönet.
          </p>
        </div>
        <a
          href="/admin/places/new"
          className="bg-indigo-500 text-white text-sm px-4 py-2 rounded-lg hover:bg-indigo-400 transition"
        >
          + Yeni yer
        </a>
      </div>

      <div className="bg-slate-950/40 border border-slate-800 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm text-slate-200">
            <thead className="bg-slate-950/70 border-b border-slate-800">
              <tr>
                <th className="text-left px-4 py-3">Adı</th>
                <th className="text-left px-4 py-3">Kategori</th>
                <th className="text-left px-4 py-3">Durum</th>
                <th className="text-left px-4 py-3">Sponsor</th>
                <th className="text-left px-4 py-3 w-[1%]">İşlem</th>
              </tr>
            </thead>
            <tbody>
              {loading && (
                <tr>
                  <td
                    colSpan={5}
                    className="px-4 py-6 text-center text-slate-500"
                  >
                    Yükleniyor...
                  </td>
                </tr>
              )}

              {!loading && places.length === 0 && (
                <tr>
                  <td
                    colSpan={5}
                    className="px-4 py-6 text-center text-slate-500"
                  >
                    Kayıt yok.
                  </td>
                </tr>
              )}

              {!loading &&
                places.map((place) => (
                  <tr
                    key={place.id}
                    className="border-b border-slate-900/40 hover:bg-slate-900/40"
                  >
                    <td className="px-4 py-3 font-medium text-slate-100">
                      {place.name_tr}
                    </td>
                    <td className="px-4 py-3 text-slate-300">
                      {place.category || "-"}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-[10px] ${
                          place.isActive
                            ? "bg-emerald-500/10 text-emerald-200"
                            : "bg-slate-500/10 text-slate-300"
                        }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            place.isActive ? "bg-emerald-300" : "bg-slate-400"
                          }`}
                        ></span>
                        {place.isActive ? "Aktif" : "Pasif"}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      {place.isSponsored ? (
                        <span className="text-xs bg-amber-400/10 text-amber-200 px-2 py-1 rounded-full">
                          Sponsorlu
                        </span>
                      ) : (
                        <span className="text-xs text-slate-500">-</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <a
                        href={`/admin/places/${place.id}`}
                        className="text-xs text-indigo-200 hover:text-white"
                      >
                        Düzenle
                      </a>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}
