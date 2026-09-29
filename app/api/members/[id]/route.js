import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import { verifyToken, COOKIE_NAME } from "@/lib/auth";
import { parseJsonBody } from "@/lib/request";

function requireUser() {
  const token = cookies().get(COOKIE_NAME)?.value;
  return token ? verifyToken(token) : null;
}

export async function PUT(request, { params }) {
  const user = requireUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const id = parseInt(params.id, 10);
    const { name, phone, address } = await parseJsonBody(request);

    const member = await prisma.member.update({
      where: { id },
      data: { name, phone: phone || null, address: address || null },
    });

    return NextResponse.json({ member });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Gagal memperbarui member." },
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params }) {
  const user = requireUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const id = parseInt(params.id, 10);
    await prisma.member.delete({ where: { id } });
    return NextResponse.json({ message: "Member dihapus." });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Gagal menghapus member. Mungkin sudah punya riwayat transaksi." },
      { status: 500 }
    );
  }
}
