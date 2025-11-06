// app/api/favorites/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import jwt from "jsonwebtoken";

function getUserIdFromReq(req: NextRequest): string | null {
  const token = req.cookies.get("rota_token")?.value;
  if (!token) return null;
  try {
    // sadece decode da yapabilirdik ama verify daha güvenli
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "supersecret") as {
      userId?: string;
    };
    return decoded.userId ?? null;
  } catch (e) {
    return null;
  }
}

// GET -> favorileri getir
export async function GET(req: NextRequest) {
  const userId = getUserIdFromReq(req);
  if (!userId) {
    return NextResponse.json({ error: "Giriş gerekiyor" }, { status: 401 });
  }

  const favorites = await prisma.favorite.findMany({
    where: { userId },
    include: { place: true },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(favorites);
}

// POST -> favori ekle
export async function POST(req: NextRequest) {
  const userId = getUserIdFromReq(req);
  if (!userId) {
    return NextResponse.json({ error: "Giriş gerekiyor" }, { status: 401 });
  }

  const { placeId } = await req.json();
  if (!placeId) {
    return NextResponse.json({ error: "placeId zorunlu" }, { status: 400 });
  }

  const exists = await prisma.favorite.findFirst({
    where: { userId, placeId },
  });
  if (exists) {
    return NextResponse.json(exists, { status: 200 });
  }

  const fav = await prisma.favorite.create({
    data: { userId, placeId },
  });

  return NextResponse.json(fav, { status: 201 });
}

// DELETE -> favoriden çıkar
export async function DELETE(req: NextRequest) {
  const userId = getUserIdFromReq(req);
  if (!userId) {
    return NextResponse.json({ error: "Giriş gerekiyor" }, { status: 401 });
  }

  const { placeId } = await req.json();
  if (!placeId) {
    return NextResponse.json({ error: "placeId zorunlu" }, { status: 400 });
  }

  await prisma.favorite.deleteMany({
    where: { userId, placeId },
  });

  return NextResponse.json({ ok: true });
}
