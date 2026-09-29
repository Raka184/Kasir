import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import { verifyToken, COOKIE_NAME } from "@/lib/auth";
import { parseJsonBody } from "@/lib/request";

function requireUser() {
  const token = cookies().get(COOKIE_NAME)?.value;
  return token ? verifyToken(token) : null;
}

export async function GET() {
  const user = requireUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const members = await prisma.member.findMany({
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json({ members });
}

// Registrasi member baru — bisa dilakukan oleh Admin maupun Petugas
export async function POST(request) {
  const user = requireUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { name, phone, address } = await parseJsonBody(request);

    if (!name) {
      return NextResponse.json(
        { error: "Nama member wajib diisi." },
        { status: 400 }
      );
    }

    const member = await prisma.member.create({
      data: { name, phone: phone || null, address: address || null },
    });

    return NextResponse.json({ member });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Terjadi kesalahan pada server." },
      { status: 500 }
    );
  }
}
