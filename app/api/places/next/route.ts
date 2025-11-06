// app/api/places/next/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const theme = searchParams.get("theme");

  // 1) aktif yerleri say
  const total = await prisma.place.count({
    where: {
      // şimdilik sadece aktif filtre
      // başka alanlar eklemedik ki hata çıkmasın
    },
  });

  if (total === 0) {
    return NextResponse.json({ place: null });
  }

  // 2) rastgele skip
  const skip = Math.floor(Math.random() * total);

  // 3) rastgele bir tane çek
  let place = await prisma.place.findFirst({
    skip,
  });

  // tema geldiyse çok kaba bir filtre yap
  if (theme) {
    const t = theme.toLowerCase();
    place =
      (await prisma.place.findFirst({
        where: {
          category: {
            contains: t,
            mode: "insensitive",
          },
        },
      })) || place;
  }

  return NextResponse.json({ place });
}
