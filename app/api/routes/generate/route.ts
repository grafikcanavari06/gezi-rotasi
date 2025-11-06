// app/api/routes/generate/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// Ankara/Kızılay varsayılan merkez
const DEFAULT_CENTER = {
  lat: Number(process.env.DEFAULT_CENTER_LAT) || 39.92077,
  lng: Number(process.env.DEFAULT_CENTER_LNG) || 32.85411,
};

export async function POST(req: NextRequest) {
  // body oku, boşsa çökmesin
  const body = (await req.json().catch(() => ({}))) as {
    timePreference?: string;
    theme?: string;
    currentLocation?: { lat: number; lng: number };
  };

  const timePreference = body.timePreference || "half-day";
  const theme = body.theme;
  const currentLocation = body.currentLocation;

  // durak sayısı
  let stopCount = 4;
  if (timePreference === "2h") stopCount = 3;
  if (timePreference === "full-day") stopCount = 6;

  try {
    // 1) veritabanından yerleri al (hiç filtre yok ki patlamasın)
    const allPlaces = await prisma.place.findMany({
      take: 100,
    });

    if (!allPlaces || allPlaces.length === 0) {
      return NextResponse.json(
        { error: "Veritabanında hiç yer yok. Admin'den yer ekleyin." },
        { status: 400 }
      );
    }

    // 2) JS tarafında kaba filtre
    let candidates = allPlaces;

    if (theme) {
      const t = theme.toLowerCase();
      candidates = candidates.filter((p) =>
        (p.category || "").toLowerCase().includes(t)
      );
    }

    // tema sonrası boşaldıysa yine hepsini kullan
    if (candidates.length === 0) {
      candidates = allPlaces;
    }

    // 3) mesafeye göre sırala
    const origin = currentLocation || DEFAULT_CENTER;

    const candidatesWithDistance = candidates
      .map((p) => {
        if (!p.latitude || !p.longitude) {
          return { ...p, dist: 999999 };
        }
        const d = distanceInMeters(
          origin.lat,
          origin.lng,
          p.latitude,
          p.longitude
        );
        return { ...p, dist: d };
      })
      .sort((a, b) => a.dist - b.dist);

    // yeterli durak yoksa sayıyı düşür
    if (candidatesWithDistance.length < stopCount) {
      stopCount = candidatesWithDistance.length;
    }

    const selected = candidatesWithDistance.slice(0, stopCount);

    // 4) Google Maps linki
    const mapsBase =
      process.env.GOOGLE_MAPS_BASE || "https://www.google.com/maps/dir";
    const waypoints = selected
      .map((p) => encodeURIComponent(p.googleMapsUrl || p.name_tr))
      .join("/");

    const mapsUrl = `${mapsBase}/${origin.lat},${origin.lng}/${waypoints}`;

    // 5) paylaşım token'i
    const shareToken = Math.random().toString(36).substring(2, 8);

    // 6) DB'ye kaydetmeyi DENE ama hata olsa bile kullanıcıya JSON dön
    try {
      await prisma.route.create({
        data: {
          // userId yok artık
          routeJson: {
            origin,
            stops: selected.map((p) => ({
              id: p.id,
              name_tr: p.name_tr,
              name_en: p.name_en,
              lat: p.latitude,
              lng: p.longitude,
              maps: p.googleMapsUrl,
            })),
            googleMapsUrl: mapsUrl,
          },
          shareToken,
        },
      });
    } catch (saveErr) {
      console.error("ROTA DB KAYIT HATASI:", saveErr);
      // ama devam ediyoruz
    }

    // 7) her durumda başarı dön
    return NextResponse.json({
      shareToken,
      googleMapsUrl: mapsUrl,
    });
  } catch (err) {
    console.error("ROTA OLUŞTURMA HATASI (genel):", err);
    return NextResponse.json(
      { error: "Rota oluşturulurken bir hata oluştu (genel)." },
      { status: 500 }
    );
  }
}

// mesafe hesabı
function distanceInMeters(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
) {
  const R = 6371e3;
  const φ1 = (lat1 * Math.PI) / 180;
  const φ2 = (lat2 * Math.PI) / 180;
  const Δφ = ((lat2 - lat1) * Math.PI) / 180;
  const Δλ = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(Δφ / 2) ** 2 +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}
