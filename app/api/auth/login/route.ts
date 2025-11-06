import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { signToken } from "@/lib/jwt";

export async function POST(req: NextRequest) {
  const { email, password } = await req.json();

  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    return NextResponse.json({ error: "Kullanıcı bulunamadı" }, { status: 401 });
  }

  // Şifre alanın password değil, passwordHash
  if (!user.passwordHash) {
    return NextResponse.json({ error: "Bu kullanıcı için şifre ayarlı değil" }, { status: 400 });
  }

  const isValid = await bcrypt.compare(password, user.passwordHash);
  if (!isValid) {
    return NextResponse.json({ error: "Geçersiz şifre" }, { status: 401 });
  }

  const token = signToken({
    userId: user.id,
    email: user.email,
  });

  const res = NextResponse.json({ ok: true });

  res.cookies.set("rota_token", token, {
    httpOnly: true,
    secure: true,
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });

  return res;
}
