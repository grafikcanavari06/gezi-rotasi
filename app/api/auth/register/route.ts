// app/api/auth/register/route.ts
import { NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma";
import { hashPassword, signToken, setAuthCookie } from "../../../../lib/auth";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => null);
    if (!body) {
      return NextResponse.json(
        { error: "Geçersiz istek gövdesi." },
        { status: 400 }
      );
    }

    const { email, password, name } = body;

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email ve şifre zorunlu." },
        { status: 400 }
      );
    }

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json(
        { error: "Bu email zaten kayıtlı." },
        { status: 400 }
      );
    }

    const hashed = await hashPassword(password);

    const user = await prisma.user.create({
      data: {
        email,
        password: hashed,
        name: name || "",
      },
    });

    const token = signToken({ userId: user.id });
    setAuthCookie(token);

    return NextResponse.json({
      id: user.id,
      email: user.email,
      name: user.name,
      photoUrl: user.photoUrl,
    });
  } catch (err) {
    console.error("REGISTER ERROR:", err);
    return NextResponse.json(
      { error: "Sunucu hatası (register)." },
      { status: 500 }
    );
  }
}
