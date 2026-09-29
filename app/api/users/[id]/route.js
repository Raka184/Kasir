import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import { verifyToken, isAdmin, COOKIE_NAME } from "@/lib/auth";
import { parseJsonBody } from "@/lib/request";

function requireAdmin() {
  const token = cookies().get(COOKIE_NAME)?.value;
  const user = token ? verifyToken(token) : null;
  return isAdmin(user) ? user : null;
}

export async function PUT(request, { params }) {
  const admin = requireAdmin();
  if (!admin) {
    return NextResponse.json({ error: "Khusus Admin." }, { status: 403 });
  }

  try {
    const id = parseInt(params.id, 10);
    const { role } = await parseJsonBody(request);

    const user = await prisma.user.update({
      where: { id },
      data: { role: role === "admin" ? "admin" : "petugas" },
      select: { id: true, name: true, email: true, role: true, createdAt: true },
    });

    return NextResponse.json({ user });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Gagal memperbarui pengguna." },
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params }) {
  const admin = requireAdmin();
  if (!admin) {
    return NextResponse.json({ error: "Khusus Admin." }, { status: 403 });
  }

  const id = parseInt(params.id, 10);
  if (id === admin.id) {
    return NextResponse.json(
      { error: "Tidak bisa menghapus akun Anda sendiri." },
      { status: 400 }
    );
  }

  try {
    await prisma.user.delete({ where: { id } });
    return NextResponse.json({ message: "Pengguna dihapus." });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Gagal menghapus pengguna." },
      { status: 500 }
    );
  }
}
