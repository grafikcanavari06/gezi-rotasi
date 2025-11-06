"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";

// sadece tarayıcıda yükle
const TinderCard = dynamic(() => import("react-tinder-card"), {
  ssr: false,
});

type Place = {
  id: string;
  name_tr: string;
  description_tr?: string | null;
  imageUrl?: string | null;
  category?: string | null;
  isSponsored?: boolean;
};

type Theme = {
  id: string;
  code: string;
  name_tr: string;
  isActive: boolean;
};

export default function SwipePage() {
  const [currentPlace, setCurrentPlace] = useState<Place | null>(null);
  const [loading, setLoading] = useState(true);
  const [swipeCount, setSwipeCount] = useState(0);
  const [showDialog, setShowDialog] = useState(false);
  const [themes, setThemes] = useState<Theme[]>([]);
  const [selectedTheme, setSelectedTheme] = useState<string>("");
  const [isFavorite, setIsFavorite] = useState<boolean>(false);
  const [cardVisible, setCardVisible] = useState(false); // animasyon için

  // temalar
  useEffect(() => {
    (async () => {
      const res = await fetch("/api/admin/themes");
      if (res.ok) {
        const data = await res.json();
        setThemes(data.filter((t: any) => t.isActive));
      }
    })();
  }, []);

  async function loadNextPlace(theme?: string) {
    setLoading(true);
    const url = new URL("/api/places/next", window.location.origin);
    if (theme) url.searchParams.set("theme", theme);
    const res = await fetch(url.toString());
    const data = await res.json();
    setCurrentPlace(data.place ?? null);
    setLoading(false);
    setIsFavorite(false);
    // kart yüklendiğinde küçük giriş animasyonu
    setTimeout(() => setCardVisible(true), 30);
  }

  // ilk kart
  useEffect(() => {
    loadNextPlace();
  }, []);

  // kart değiştiğinde favori kontrolü
  useEffect(() => {
    (async () => {
      if (!currentPlace) return;
      const res = await fetch("/api/favorites");
      if (!res.ok) {
        setIsFavorite(false);
        return;
      }
      const favs = await res.json();
      const exists = favs.some((f: any) => f.place?.id === currentPlace.id);
      setIsFavorite(exists);
    })();
  }, [currentPlace]);

  async function sendSwipe(direction: "like" | "dislike", placeId: string) {
    await fetch("/api/swipes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ placeId, direction }),
    });
  }

  async function toggleFavorite(placeId: string) {
    if (isFavorite) {
      const res = await fetch("/api/favorites", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ placeId }),
      });
      if (res.ok) setIsFavorite(false);
      return;
    }
    const res = await fetch("/api/favorites", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ placeId }),
    });
    if (res.ok) setIsFavorite(true);
    else alert("Favorilere eklenemedi. Giriş yapmış olman gerekebilir.");
  }

  async function handleSwipe(dir: "left" | "right") {
    if (!currentPlace) return;
    const direction = dir === "right" ? "like" : "dislike";
    await sendSwipe(direction, currentPlace.id);

    const nextCount = swipeCount + 1;
    setSwipeCount(nextCount);

    if (nextCount >= 10) {
      setShowDialog(true);
    } else {
      setCardVisible(false);
      loadNextPlace(selectedTheme || undefined);
    }
  }

  async function handleButtonSwipe(direction: "like" | "dislike") {
    if (!currentPlace) return;
    await sendSwipe(direction, currentPlace.id);

    const nextCount = swipeCount + 1;
    setSwipeCount(nextCount);

    if (nextCount >= 10) {
      setShowDialog(true);
    } else {
      setCardVisible(false);
      loadNextPlace(selectedTheme || undefined);
    }
  }

  async function generateRoute(timePreference: string) {
    const res = await fetch("/api/routes/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        timePreference,
        theme: selectedTheme || undefined,
      }),
    });

    const data = await res.json().catch(() => null);

    if (!res.ok || !data || !data.shareToken) {
      alert(data?.error || "Rota oluşturulamadı, sonra tekrar dene.");
      return;
    }

    window.location.href = `/route/${data.shareToken}`;
  }

  return (
    <div className="min-h-screen bg-[#f3f4f6] flex flex-col lg:flex-row gap-6 items-start justify-center px-4 py-6">
      {/* sol panel */}
      <div className="w-full max-w-sm space-y-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Bugün nereyi gezelim?</h1>
          <p className="text-xs text-slate-500 mt-1">
            Ankara’daki yerleri sağa/sola kaydır, 10 seçimden sonra rota gelsin.
          </p>
        </div>

        {/* Tema seçimi */}
        {themes.length > 0 && (
          <div className="space-y-1">
            <label className="text-xs text-slate-500">Tema seç (opsiyonel)</label>
            <select
              value={selectedTheme}
              onChange={(e) => {
                const v = e.target.value;
                setSelectedTheme(v);
                setCardVisible(false);
                loadNextPlace(v || undefined);
              }}
              className="w-full bg-white border border-slate-200 rounded-lg p-2 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-200"
            >
              <option value="">Hepsi</option>
              {themes.map((t) => (
                <option key={t.id} value={t.code}>
                  {t.name_tr}
                </option>
              ))}
            </select>
          </div>
        )}

        <div className="flex items-center gap-2 text-xs text-slate-500">
          <span className="inline-flex items-center gap-1 bg-white border border-slate-200 px-2 py-1 rounded-full text-[10px] text-slate-700">
            {swipeCount}/10 tamamlandı
          </span>
          <span className="text-slate-400">hedef: rota oluştur</span>
        </div>
      </div>

      {/* kart alanı */}
      <div className="w-full max-w-sm">
        <div className="relative h-[430px] bg-transparent rounded-2xl flex items-center justify-center overflow-visible">
          {/* arka dekor kart 1 */}
          <div
            className="pointer-events-none absolute w-full h-full bg-white rounded-2xl border border-slate-200 shadow-md"
            style={{
              top: "0",
              right: "0",
              transform: "rotate(4deg) scale(0.98)",
            }}
          />
          {/* arka dekor kart 2 */}
          <div
            className="pointer-events-none absolute w-full h-full bg-white rounded-2xl border border-slate-200 shadow-md"
            style={{
              top: "0",
              left: "0",
              transform: "rotate(-3deg) scale(0.97)",
            }}
          />

          {/* asıl kart alanı */}
          <div className="relative w-full h-full flex items-center justify-center">
            {loading && (
              <p className="text-slate-400 text-sm z-10 bg-white/70 px-4 py-2 rounded-lg shadow">
                Yükleniyor...
              </p>
            )}

            {!loading && !currentPlace && (
              <p className="text-slate-400 text-sm text-center px-4 z-10 bg-white/70 rounded-lg shadow">
                Bu tema için yer bulunamadı.
              </p>
            )}

            {!loading && currentPlace && (
              // @ts-expect-error dynamic component
              <TinderCard
                onSwipe={(dir: any) => handleSwipe(dir)}
                preventSwipe={["up", "down"]}
                className={`absolute w-[90%] h-[85%] transition-all duration-300 z-20 ${
                  cardVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3"
                }`}
              >
                <div className="w-full h-full flex flex-col bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-xl hover:scale-[1.01] transition-transform duration-300">
                  <div className="h-40 bg-slate-100 overflow-hidden relative">
                    {currentPlace.imageUrl ? (
                      <img
                        src={currentPlace.imageUrl}
                        alt={currentPlace.name_tr}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="h-full flex items-center justify-center text-slate-400 text-sm">
                        Görsel yok
                      </div>
                    )}

                    {currentPlace.isSponsored && (
                      <span className="absolute top-2 left-2 bg-amber-400 text-xs px-2 py-1 rounded-full text-slate-900 font-semibold shadow">
                        Sponsorlu
                      </span>
                    )}

                    {/* kalp */}
                    <button
                      onClick={() => currentPlace && toggleFavorite(currentPlace.id)}
                      className={`absolute top-2 right-2 rounded-full w-9 h-9 flex items-center justify-center text-lg transition-all shadow ${
                        isFavorite
                          ? "bg-pink-500 text-white"
                          : "bg-white/80 text-pink-500"
                      }`}
                      title={isFavorite ? "Favorilerden çıkar" : "Favorilere ekle"}
                    >
                      {isFavorite ? "♥" : "♡"}
                    </button>
                  </div>
                  <div className="p-4 flex-1 flex flex-col gap-3">
                    <h2 className="text-lg font-semibold text-slate-900">
                      {currentPlace.name_tr}
                    </h2>
                    <p className="text-sm text-slate-500 line-clamp-4">
                      {currentPlace.description_tr || "Açıklama yok"}
                    </p>
                    <p className="text-[10px] text-slate-400 mt-auto uppercase tracking-wide">
                      Kategori: {currentPlace.category || "Genel"}
                    </p>
                  </div>
                </div>
              </TinderCard>
            )}
          </div>
        </div>

        {/* alt butonlar */}
        <div className="flex gap-3 mt-4">
          <button
            onClick={() => handleButtonSwipe("dislike")}
            className="flex-1 bg-white border border-slate-200 text-slate-600 py-2 rounded-lg text-sm hover:bg-slate-50 transition"
          >
            Beğenmedim
          </button>
          <button
            onClick={() => handleButtonSwipe("like")}
            className="flex-1 bg-indigo-500 text-white py-2 rounded-lg text-sm font-semibold hover:bg-indigo-400 transition"
          >
            Beğendim
          </button>
        </div>
      </div>

      {/* rota dialogu */}
      {showDialog && (
        <div className="fixed inset-0 bg-black/20 flex items-center justify-center p-4 z-50">
          <div className="bg-white border border-slate-200 rounded-2xl p-5 w-full max-w-sm space-y-4 shadow-2xl">
            <h2 className="text-lg font-semibold text-slate-900">
              10 seçim yaptın 🎉 Rota oluşturulsun mu?
            </h2>
            <p className="text-xs text-slate-500">
              Süreye göre 3-6 durak seçeceğiz.
            </p>
            <button
              onClick={() => generateRoute("2h")}
              className="w-full bg-indigo-500 text-white py-2 rounded-lg text-sm font-semibold"
            >
              2 saatlik rota
            </button>
            <button
              onClick={() => generateRoute("full-day")}
              className="w-full bg-white border border-slate-200 text-slate-700 py-2 rounded-lg text-sm"
            >
              Tüm gün
            </button>
            <button
              onClick={() => {
                setShowDialog(false);
                setSwipeCount(0);
                setCardVisible(false);
                loadNextPlace(selectedTheme || undefined);
              }}
              className="w-full text-slate-400 text-xs mt-1"
            >
              Kartlara devam et
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
