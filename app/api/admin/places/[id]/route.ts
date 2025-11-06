// app/api/admin/places/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// TEK YERİ GETİR
export async function GET(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  const place = await prisma.place.findUnique({
    where: { id: params.id },
  });

  if (!place) {
    return NextResponse.json({ error: "Yer bulunamadı" }, { status: 404 });
  }

  return NextResponse.json(place);
}

// YERİ GÜNCELLE
export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await req.json();

    if (!body.name_tr) {
      return NextResponse.json(
        { error: "name_tr zorunludur" },
        { status: 400 }
      );
    }

    // burada sadece izin verdiğimiz alanları alıyoruz
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
      where: { id: params.id },
      data: dataToUpdate,
    });

    return NextResponse.json(updated);
  } catch (err: any) {
    console.error("ADMIN PLACE UPDATE ERROR:", err);
    return NextResponse.json(
      {
        error:
          err?.message || "Güncelleme sırasında bir hata oluştu (PATCH place)",
      },
      { status: 500 }
    );
  }
}

// İSTERSEK SİL
export async function DELETE(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  await prisma.place.delete({
    where: { id: params.id },
  });
  return NextResponse.json({ ok: true });
}
