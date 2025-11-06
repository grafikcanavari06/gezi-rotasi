// app/api/favorites/add/route.ts
import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  const authUser = await getCurrentUser();
  if (!authUser) return NextResponse.json({ error: "Giriş yapınız." }, { status: 401 });

  const { placeId } = await req.json();
  if (!placeId) return NextResponse.json({ error: "placeId zorunlu." }, { status: 400 });

  const fav = await prisma.favorite.create({
    data: {
      userId: authUser.id,
      placeId,
    },
  });

  return NextResponse.json(fav);
}
