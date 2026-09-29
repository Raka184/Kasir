import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { hashPassword } from "@/lib/auth";
import { parseJsonBody } from "@/lib/request";

export async function POST(request) {
  try {
    const { name, username, email, password } = await parseJsonBody(request);

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
        { error: "Username atau email sudah terdaftar." },
        { status: 409 }
      );
    }

    // Akun pertama yang mendaftar otomatis menjadi Admin.
    // Pendaftaran berikutnya otomatis menjadi Petugas (kasir).
    // Akun Petugas selanjutnya bisa dibuat langsung oleh Admin lewat menu "Pengguna".
    const userCount = await prisma.user.count();
    const role = userCount === 0 ? "admin" : "petugas";

    const user = await prisma.user.create({
      data: {
        name,
        username,
        email,
        password: hashPassword(password),
        role,
      },
    });

    return NextResponse.json({
      message:
        role === "admin"
          ? "Akun Admin berhasil dibuat."
          : "Akun berhasil dibuat.",
      user: { id: user.id, name: user.name, username: user.username, email: user.email, role: user.role },
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Terjadi kesalahan pada server." },
      { status: 500 }
    );
  }
}
