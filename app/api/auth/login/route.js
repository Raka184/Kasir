import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { comparePassword, signToken, COOKIE_NAME } from "@/lib/auth";
import { parseJsonBody } from "@/lib/request";

export async function POST(request) {
  try {
    const { username, password } = await parseJsonBody(request);

    if (!username || !password) {
      return NextResponse.json(
        { error: "Username dan password wajib diisi." },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({ where: { username } });
    if (!user || !comparePassword(password, user.password)) {
      return NextResponse.json(
        { error: "Username atau password salah." },
        { status: 401 }
      );
    }

    const token = signToken({
      id: user.id,
      name: user.name,
      username: user.username,
      email: user.email,
      role: user.role,
    });

    const res = NextResponse.json({
      message: "Login berhasil.",
      user: { id: user.id, name: user.name, username: user.username, email: user.email, role: user.role },
    });

    res.cookies.set(COOKIE_NAME, token, {
      httpOnly: true,
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });

    return res;
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Terjadi kesalahan pada server." },
      { status: 500 }
    );
  }
}
