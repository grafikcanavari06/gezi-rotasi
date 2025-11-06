// app/api/admin/themes/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/admin/themes → tüm temalar
export async function GET() {
  const themes = await prisma.theme.findMany({
    orderBy: { name_tr: "asc" },
  });
  return NextResponse.json(themes);
}

// POST /api/admin/themes → yeni tema ekle
export async function POST(req: NextRequest) {
  const data = await req.json();
  if (!data.code || !data.name_tr) {
    return NextResponse.json(
      { error: "code ve name_tr zorunludur" },
      { status: 400 }
    );
  }

  const theme = await prisma.theme.create({
    data: {
      code: data.code,
      name_tr: data.name_tr,
      name_en: data.name_en ?? data.name_tr,
      isActive: data.isActive ?? true,
    },
  });

  return NextResponse.json(theme, { status: 201 });
}
