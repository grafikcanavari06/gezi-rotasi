import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

type RouteParams = {
  shareToken: string;
};

export async function GET(req: NextRequest, context: { params: Promise<RouteParams> }) {
  const { shareToken } = await context.params;

  const sharedRoute = await prisma.sharedRoute.findUnique({
    where: { shareToken },
  });

  if (!sharedRoute) {
    return NextResponse.json(
      { error: "Shared route not found" },
      { status: 404 }
    );
  }

  return NextResponse.json({
    route: sharedRoute.routeJson, // senin tablodaki alan adı neyse
    createdAt: sharedRoute.createdAt,
    from: sharedRoute.from ?? "",
  });
}
