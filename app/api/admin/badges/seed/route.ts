// app/api/admin/badges/seed/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST() {
  // varsa bozmasın diye upsert kullanalım
  const badgesData = [
    {
      code: "first_route",
      name_tr: "İlk Rota",
      name_en: "First Route",
      criteriaJson: { type: "routes_count", gte: 1 },
    },
    {
      code: "five_routes",
      name_tr: "Ankara Kaşifi",
      name_en: "Ankara Explorer",
      criteriaJson: { type: "routes_count", gte: 5 },
    },
  ];

  for (const b of badgesData) {
    await prisma.badge.upsert({
      where: { code: b.code },
      update: {},
      create: b,
    });
  }

  return NextResponse.json({ ok: true, created: badgesData.length });
}
