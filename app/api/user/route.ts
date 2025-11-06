// app/api/user/route.ts
import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function PATCH(req: Request) {
  const authUser = await getCurrentUser();
  if (!authUser) {
    return NextResponse.json({ error: "Giriş yapınız." }, { status: 401 });
  }

  const { name, photoUrl } = await req.json();

  const updated = await prisma.user.update({
    where: { id: authUser.id },
    data: {
      name: name ?? authUser.name,
      photoUrl: photoUrl ?? authUser.photoUrl,
    },
  });

  return NextResponse.json(updated);
}
