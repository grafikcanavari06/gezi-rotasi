// app/api/routes/[shareToken]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  req: NextRequest,
  { params }: { params: { shareToken: string } }
) {
  const { shareToken } = params;

  try {
    const route = await prisma.route.findUnique({
      where: { shareToken },
    });

    if (route) {
      return NextResponse.json({
        route: route.routeJson,
        createdAt: route.createdAt,
        from: "by-token",
      });
    }

    const latest = await prisma.route.findFirst({
      orderBy: { createdAt: "desc" },
    });

    if (!latest) {
      return NextResponse.json(
        { error: "Rota bulunamadı" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      route: latest.routeJson,
      createdAt: latest.createdAt,
      from: "latest-fallback",
    });
  } catch (err) {
    console.error("ROUTE FETCH ERROR:", err);
    return NextResponse.json(
      { error: "Rota okunamadı" },
      { status: 500 }
    );
  }
}
