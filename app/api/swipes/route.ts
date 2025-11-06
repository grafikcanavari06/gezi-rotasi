// app/api/swipes/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { placeId, direction } = body as {
    placeId: string;
    direction: "like" | "dislike" | "favorite";
  };

  if (!placeId || !direction) {
    return NextResponse.json(
      { error: "placeId and direction required" },
      { status: 400 }
    );
  }

  // userId şu anlık yok (login ekleyince koyarız)
  await prisma.swipe.create({
    data: {
      placeId,
      direction,
    },
  });

  // favori ise ayrı tabloya da yaz
  if (direction === "favorite") {
    // user yoksa şimdilik atla
  }

  return NextResponse.json({ ok: true });
}
