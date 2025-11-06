// app/api/admin/places/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/admin/places           → tüm yerler
// GET /api/admin/places?id=abc123 → tek yer
export async function GET(req: NextRequest) {
  const id = req.nextUrl.searchParams.get("id");

  if (id) {
    const place = await prisma.place.findUnique({
      where: { id },
    });

    if (!place) {
      return NextResponse.json({ error: "Yer bulunamadı" }, { status: 404 });
    }

    return NextResponse.json(place);
  }

  const places = await prisma.place.findMany({
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(places);
}

// POST /api/admin/places → yeni yer
export async function POST(req: NextRequest) {
  const body = await req.json();

  if (!body.name_tr) {
    return NextResponse.json(
      { error: "name_tr zorunludur" },
      { status: 400 }
    );
  }

  const place = await prisma.place.create({
    data: {
      name_tr: body.name_tr,
      name_en: body.name_en ?? body.name_tr,
      description_tr: body.description_tr ?? null,
      description_en: body.description_en ?? null,
      category: body.category ?? null,
      imageUrl: body.imageUrl ?? null,
      videoUrl: body.videoUrl ?? null,
      googleMapsUrl: body.googleMapsUrl ?? null,
      latitude: body.latitude ?? null,
      longitude: body.longitude ?? null,
      isActive: body.isActive ?? true,
      isSponsored: body.isSponsored ?? false,
      isForKids: body.isForKids ?? false,
      isRomantic: body.isRomantic ?? false,
      isHistoric: body.isHistoric ?? false,
      isInstagrammable: body.isInstagrammable ?? false,
      isInsertableAsBreak: body.isInsertableAsBreak ?? false,
      openHoursJson: body.openHoursJson ?? null,
    },
  });

  return NextResponse.json(place, { status: 201 });
}

// PATCH /api/admin/places?id=abc123 → yeri güncelle
export async function PATCH(req: NextRequest) {
  const id = req.nextUrl.searchParams.get("id");
  if (!id) {
    return NextResponse.json(
      { error: "id query parametresi gerekli (?id=...)" },
      { status: 400 }
    );
  }

  const body = await req.json();

  if (!body.name_tr) {
    return NextResponse.json(
      { error: "name_tr zorunludur" },
      { status: 400 }
    );
  }

  const dataToUpdate = {
    name_tr: body.name_tr,
    name_en: body.name_en ?? body.name_tr,
    description_tr: body.description_tr ?? null,
    description_en: body.description_en ?? null,
    category: body.category ?? null,
    imageUrl: body.imageUrl ?? null,
    videoUrl: body.videoUrl ?? null,
    googleMapsUrl: body.googleMapsUrl ?? null,
    latitude:
      body.latitude === null || body.latitude === undefined
        ? null
        : Number(body.latitude),
    longitude:
      body.longitude === null || body.longitude === undefined
        ? null
        : Number(body.longitude),
    isActive: body.isActive ?? true,
    isSponsored: body.isSponsored ?? false,
    isForKids: body.isForKids ?? false,
    isRomantic: body.isRomantic ?? false,
    isHistoric: body.isHistoric ?? false,
    isInstagrammable: body.isInstagrammable ?? false,
    isInsertableAsBreak: body.isInsertableAsBreak ?? false,
    openHoursJson: body.openHoursJson ?? null,
  };

  const updated = await prisma.place.update({
    where: { id },
    data: dataToUpdate,
  });

  return NextResponse.json(updated);
}

// DELETE /api/admin/places?id=abc123
export async function DELETE(req: NextRequest) {
  const id = req.nextUrl.searchParams.get("id");
  if (!id) {
    return NextResponse.json(
      { error: "id query parametresi gerekli (?id=...)" },
      { status: 400 }
    );
  }

  await prisma.place.delete({
    where: { id },
  });

  return NextResponse.json({ ok: true });
}
