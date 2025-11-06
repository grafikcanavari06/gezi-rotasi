// app/api/auth/login/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { signToken } from "@/lib/auth";

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  if (!body) {
    return NextResponse.json({ error: "Geçersiz gövde" }, { status: 400 });
  }

  const { email, password } = body as { email: string; password: string };

  if (!email || !password) {
    return NextResponse.json(
      { error: "email ve password zorunludur" },
      { status: 400 }
    );
  }

  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user || !user.passwordHash) {
    return NextResponse.json(
      { error: "Kullanıcı bulunamadı" },
      { status: 401 }
    );
  }

  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) {
    return NextResponse.json({ error: "Şifre hatalı" }, { status: 401 });
  }

  const token = signToken({ userId: user.id, email: user.email });

  const res = NextResponse.json({ ok: true });
  res.cookies.set("rota_token", token, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
  });

  return res;
}
