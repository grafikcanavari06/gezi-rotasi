// app/route/[shareToken]/page.tsx

type RouteData = {
  origin: { lat: number; lng: number };
  stops: {
    id: string;
    name_tr: string;
    name_en?: string | null;
    lat?: number | null;
    lng?: number | null;
    maps?: string | null;
  }[];
  googleMapsUrl: string;
};

async function fetchRoute(shareToken: string) {
  // ÖNEMLİ: relatif URL kullan
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL ?? ""}/api/routes/${shareToken}`, {
    cache: "no-store",
  }).catch(() => null);

  // Eğer üstteki base URL yoksa veya hata aldıysak, bir de tamamen relatif dene
  if (!res || !res.ok) {
    const res2 = await fetch(`/api/routes/${shareToken}`, {
      cache: "no-store",
    }).catch(() => null);

    if (!res2 || !res2.ok) return null;
    return res2.json();
  }

  return res.json();
}

export default async function RoutePage({
  params,
}: {
  params: { shareToken: string };
}) {
  const data = await fetchRoute(params.shareToken);

  if (!data) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-slate-100 p-6">
        <div className="bg-white p-6 rounded shadow max-w-md w-full text-center space-y-2">
          <h1 className="text-xl font-semibold">Rota bulunamadı</h1>
          <p className="text-sm text-slate-500">
            Bu rota kaydedilmemiş veya süresi geçmiş olabilir.
          </p>
          <a
            href="/swipe"
            className="inline-block mt-3 bg-slate-900 text-white px-4 py-2 rounded"
          >
            Yeni rota oluştur
          </a>
        </div>
      </main>
    );
  }

  const route = data.route as RouteData;

  return (
    <main className="min-h-screen bg-slate-50 p-6 max-w-2xl mx-auto space-y-4">
      <div>
        <h1 className="text-2xl font-bold">Rota hazır 🎉</h1>
        <p className="text-slate-600 text-sm">
          Aşağıdaki durakları sırayla gezebilirsin.
        </p>
      </div>

      <a
        href={route.googleMapsUrl}
        target="_blank"
        className="inline-block bg-slate-900 text-white px-4 py-2 rounded"
      >
        Google Maps’te aç
      </a>

      <div className="space-y-3">
        {route.stops?.map((stop, idx) => (
          <div
            key={stop.id}
            className="bg-white rounded border p-3 flex gap-3 items-start"
          >
            <div className="w-6 h-6 rounded-full bg-slate-900 text-white flex items-center justify-center text-xs mt-1">
              {idx + 1}
            </div>
            <div className="flex-1">
              <div className="font-medium">{stop.name_tr}</div>
              {stop.maps && (
                <a
                    href={stop.maps}
                    target="_blank"
                    className="text-xs text-blue-500"
                  >
                    Bu durağı Maps’te aç
                  </a>
              )}
            </div>
          </div>
        ))}
      </div>

      <p className="text-xs text-slate-400">
        Paylaş: {`http://localhost:3000/route/${params.shareToken}`}
      </p>
    </main>
  );
}
