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
    const { name, category, price, stock, image } = await parseJsonBody(request);

    const product = await prisma.product.update({
      where: { id },
      data: {
        name,
        category: category || null,
        price: parseInt(price, 10),
        stock: parseInt(stock, 10),
        image: image || null,
      },
    });

    return NextResponse.json({ product });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Gagal memperbarui produk." },
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
    await prisma.product.delete({ where: { id } });
    return NextResponse.json({ message: "Produk dihapus." });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Gagal menghapus produk." },
      { status: 500 }
    );
  }
}
