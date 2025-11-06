import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

type RouteParams = {
  id: string;
};

// GET /api/admin/themes/[id]
export async function GET(req: NextRequest, context: { params: Promise<RouteParams> }) {
  const { id } = await context.params;

  const theme = await prisma.theme.findUnique({
    where: { id },
  });

  if (!theme) {
    return NextResponse.json({ error: "Theme not found" }, { status: 404 });
  }

  return NextResponse.json(theme);
}

// PATCH /api/admin/themes/[id]
export async function PATCH(req: NextRequest, context: { params: Promise<RouteParams> }) {
  const { id } = await context.params;
  const body = await req.json();

  const updated = await prisma.theme.update({
    where: { id },
    data: {
      code: body.code,
      name_tr: body.name_tr,
      name_en: body.name_en ?? null,
      isActive: body.isActive,
    },
  });

  return NextResponse.json(updated);
}

// DELETE /api/admin/themes/[id]
export async function DELETE(req: NextRequest, context: { params: Promise<RouteParams> }) {
  const { id } = await context.params;

  await prisma.theme.delete({
    where: { id },
  });

  return NextResponse.json({ ok: true });
}
