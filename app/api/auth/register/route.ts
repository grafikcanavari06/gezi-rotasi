import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(req: NextRequest) {
  const { email, password, name } = await req.json();

  // 1) aynı mail var mı
  const existing = await prisma.user.findUnique({
    where: { email },
  });

  if (existing) {
    return NextResponse.json(
      { error: "Bu e-posta zaten kayıtlı" },
      { status: 400 }
    );
  }

  // 2) şifreyi hashle
  const hashed = await bcrypt.hash(password, 10);

  // 3) kullanıcı oluştur
  const user = await prisma.user.create({
    data: {
      email,
      passwordHash: hashed,   // 👈 burada password değil passwordHash
      name: name || "",
      // preferencesJson gibi alanların varsa buraya ekleyebilirsin
    },
  });

  return NextResponse.json(
    {
      id: user.id,
      email: user.email,
      name: user.name,
    },
    { status: 201 }
  );
}
