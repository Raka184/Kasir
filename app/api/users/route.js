import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import { verifyToken, hashPassword, isAdmin, COOKIE_NAME } from "@/lib/auth";
import { parseJsonBody } from "@/lib/request";

function requireAdmin() {
  const token = cookies().get(COOKIE_NAME)?.value;
  const user = token ? verifyToken(token) : null;
  return isAdmin(user) ? user : null;
}

export async function GET() {
  const admin = requireAdmin();
  if (!admin) {
    return NextResponse.json({ error: "Khusus Admin." }, { status: 403 });
  }

  const users = await prisma.user.findMany({
    orderBy: { createdAt: "asc" },
    select: { id: true, name: true, username: true, email: true, role: true, createdAt: true },
  });

  return NextResponse.json({ users });
}

// Admin membuat akun Petugas (atau Admin lain) secara langsung
export async function POST(request) {
  const admin = requireAdmin();
  if (!admin) {
    return NextResponse.json({ error: "Khusus Admin." }, { status: 403 });
  }

  try {
    const { name, username, email, password, role } = await parseJsonBody(request);

    if (!name || !username || !email || !password) {
      return NextResponse.json(
        { error: "Nama, username, email, dan password wajib diisi." },
        { status: 400 }
      );
    }
    if (password.length < 6) {
      return NextResponse.json(
        { error: "Password minimal 6 karakter." },
        { status: 400 }
      );
    }

    const existing = await prisma.user.findFirst({
      where: {
        OR: [{ username }, { email }],
      },
    });
    if (existing) {
      return NextResponse.json(
        { error: "Username atau email sudah digunakan." },
        { status: 409 }
      );
    }

    const user = await prisma.user.create({
      data: {
        name,
        username,
        email,
        password: hashPassword(password),
        role: role === "admin" ? "admin" : "petugas",
      },
      select: { id: true, name: true, username: true, email: true, role: true, createdAt: true },
    });

    return NextResponse.json({ user });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Terjadi kesalahan pada server." },
      { status: 500 }
    );
  }
}
