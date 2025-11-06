import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { compare } from "bcrypt";
import { signToken } from "@/lib/jwt"; // senin yolun neyse

export async function POST(req: NextRequest) {
  const { email, password } = await req.json();

  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    return NextResponse.json({ error: "Kullanıcı bulunamadı" }, { status: 401 });
  }

  const isValid = await compare(password, user.password);
  if (!isValid) {
    return NextResponse.json({ error: "Geçersiz şifre" }, { status: 401 });
  }

  // 🔴 BURASI HATA VERİYORDU
  const token = signToken({
    userId: user.id, // eğer signToken'ı string kabul edecek şekilde güncellediysen
    email: user.email,
  });

  const res = NextResponse.json({ ok: true });

  res.cookies.set("rota_token", token, {
    httpOnly: true,
    secure: true,
    path: "/",
    maxAge: 60 * 60 * 24 * 7, // 7 gün
  });

  return res;
}
