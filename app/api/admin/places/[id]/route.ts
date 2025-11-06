import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

type RouteParams = {
  id: string;
};

// GET /api/admin/places/[id]
export async function GET(req: NextRequest, context: { params: Promise<RouteParams> }) {
  const { id } = await context.params;

  const place = await prisma.place.findUnique({
    where: { id },
  });

  if (!place) {
    return NextResponse.json({ error: "Place not found" }, { status: 404 });
  }

  return NextResponse.json(place);
}

// PATCH /api/admin/places/[id]
export async function PATCH(req: NextRequest, context: { params: Promise<RouteParams> }) {
  const { id } = await context.params;
  const body = await req.json();

  // body’de ne gönderiyorsan aynen prisma’ya geçiyoruz
  const updated = await prisma.place.update({
    where: { id },
    data: {
      ...body,
      // örn. openHoursJson gönderiyorsan:
      // openHoursJson: body.openHoursJson ?? null,
    },
  });

  return NextResponse.json(updated);
}

// DELETE /api/admin/places/[id]
export async function DELETE(req: NextRequest, context: { params: Promise<RouteParams> }) {
  const { id } = await context.params;

  await prisma.place.delete({
    where: { id },
  });

  return NextResponse.json({ ok: true });
}
