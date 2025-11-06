"use client";

import { useEffect, useState } from "react";

type Favorite = {
  id: string;
  place: {
    id: string;
    name_tr: string;
    category: string | null;
    imageUrl?: string | null;
  } | null;
  createdAt?: string;
};

export default function ProfilePage() {
  const [favorites, setFavorites] = useState<Favorite[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/favorites");
        // giriş yoksa login'e yolla
        if (res.status === 401) {
          window.location.href = "/login";
          return;
        }
        const data = await res.json();
        setFavorites(data);
      } catch (err) {
        console.error(err);
        setError("Favoriler alınırken bir hata oldu.");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const favoriteCount = favorites.length;

  return (
    <main className="space-y-6">
      {/* Üst başlık alanı */}
      <section className="bg-slate-950/40 border border-slate-800 rounded-2xl p-5 flex flex-col sm:flex-row gap-5 sm:items-center sm:justify-between">
        <div className="flex gap-4 items-center">
          {/* Avatar */}
          <div className="h-12 w-12 rounded-full bg-indigo-500 text-white flex items-center justify-center text-lg font-bold">
            R
          </div>
          <div>
            <h1 className="text-lg sm:text-xl font-semibold text-white">
              Profilin
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              Ankara’da beğendiğin yerler burada. İstediğin zaman yeniden rota oluşturabilirsin.
            </p>
          </div>
        </div>

        <div className="flex gap-2">
          <a
            href="/swipe"
            className="text-xs bg-slate-100 text-slate-950 px-3 py-2 rounded-lg font-medium hover:bg-white transition"
          >
            Swipe&apos;e dön
          </a>
          <a
            href="/admin/places"
            className="text-xs bg-slate-900 border border-slate-700 text-slate-100 px-3 py-2 rounded-lg hover:bg-slate-800 transition hidden sm:inline"
          >
            Admin
          </a>
        </div>
      </section>

      {/* İstatistikler */}
      <section className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-slate-950/40 border border-slate-800 rounded-xl p-4">
          <p className="text-xs text-slate-400">Favori yer sayısı</p>
          <p className="text-2xl font-semibold text-white mt-1">
            {favoriteCount}
          </p>
          <p className="text-[10px] text-slate-500 mt-2">
            Kalple işaretlediğin mekanlar
          </p>
        </div>
        <div className="bg-slate-950/40 border border-slate-800 rounded-xl p-4">
          <p className="text-xs text-slate-400">Rota rozetleri</p>
          <p className="text-2xl font-semibold text-white mt-1">0</p>
          <p className="text-[10px] text-slate-500 mt-2">
            Rota tamamlayınca burada gözükecek
          </p>
        </div>
        <div className="bg-slate-950/40 border border-slate-800 rounded-xl p-4">
          <p className="text-xs text-slate-400">Son giriş</p>
          <p className="text-sm text-white mt-1">
            Bugün
          </p>
          <p className="text-[10px] text-slate-500 mt-2">
            Oturum açık
          </p>
        </div>
      </section>

      {/* Favoriler bölümü */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold text-slate-200">
            Favori yerlerin
          </h2>
          <p className="text-[10px] text-slate-500">
            {favoriteCount > 0
              ? `${favoriteCount} sonuç`
              : "Henüz favori eklenmemiş"}
          </p>
        </div>

        {/* Yükleniyor */}
        {loading && (
          <div className="bg-slate-950/40 border border-slate-800 rounded-xl p-4 text-sm text-slate-300">
            Yükleniyor...
          </div>
        )}

        {/* Hata */}
        {!loading && error && (
          <div className="bg-red-500/10 border border-red-500/40 rounded-xl p-4 text-sm text-red-100">
            {error}
          </div>
        )}

        {/* Boş durum */}
        {!loading && !error && favorites.length === 0 && (
          <div className="bg-slate-950/40 border border-slate-800 rounded-xl p-6 text-center">
            <p className="text-sm text-slate-200 mb-1">
              Henüz favori yok
            </p>
            <p className="text-xs text-slate-500 mb-4">
              Swipe ekranında bir mekanı kalple işaretlediğinde burada göreceksin.
            </p>
            <a
              href="/swipe"
              className="inline-flex items-center gap-2 text-xs bg-indigo-500 text-white px-4 py-2 rounded-lg"
            >
              Şimdi keşfet
              <span aria-hidden>→</span>
            </a>
          </div>
        )}

        {/* Favori listesi */}
        {!loading && !error && favorites.length > 0 && (
          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
            {favorites.map((fav) => (
              <div
                key={fav.id}
                className="bg-slate-950/40 border border-slate-800 rounded-xl overflow-hidden flex flex-col"
              >
                <div className="h-28 bg-slate-800">
                  {fav.place?.imageUrl ? (
                    <img
                      src={fav.place.imageUrl}
                      alt={fav.place.name_tr}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-xs text-slate-500">
                      Görsel yok
                    </div>
                  )}
                </div>
                <div className="p-3 flex-1 flex flex-col gap-1">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="text-sm font-medium text-white">
                      {fav.place?.name_tr ?? "Silinmiş yer"}
                    </h3>
                    {fav.place?.category && (
                      <span className="text-[10px] px-2 py-1 rounded-full bg-slate-900 text-slate-200">
                        {fav.place.category}
                      </span>
                    )}
                  </div>
                  <p className="text-[10px] text-slate-500">
                    {fav.createdAt
                      ? new Date(fav.createdAt).toLocaleDateString("tr-TR")
                      : "Tarih yok"}
                  </p>
                  <button
                    onClick={async () => {
                      // favoriden çıkar
                      await fetch("/api/favorites", {
                        method: "DELETE",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ placeId: fav.place?.id }),
                      });
                      // listeden düş
                      setFavorites((prev) =>
                        prev.filter((f) => f.id !== fav.id)
                      );
                    }}
                    className="mt-auto text-[10px] text-slate-400 hover:text-red-200 transition self-start"
                  >
                    Favoriden çıkar
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Rozetler / ileride gelecek alan */}
      <section className="space-y-2 pt-4 border-t border-slate-800">
        <h2 className="text-sm font-semibold text-slate-200">Rozetler</h2>
        <p className="text-xs text-slate-500">
          Rota tamamladığında burada rozetlerin görünecek.
        </p>
        <div className="bg-slate-950/30 border border-dashed border-slate-800/70 rounded-xl p-4 text-xs text-slate-500">
          Henüz rozet kazanılmamış.
        </div>
      </section>
    </main>
  );
}
