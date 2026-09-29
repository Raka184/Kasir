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
  const products = await prisma.product.findMany({
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json({ products });
}

export async function POST(request) {
  const user = requireUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { name, category, price, stock, image } = await parseJsonBody(request);

    if (!name || price === undefined || price === null) {
      return NextResponse.json(
        { error: "Nama dan harga produk wajib diisi." },
        { status: 400 }
      );
    }

    const product = await prisma.product.create({
      data: {
        name,
        category: category || null,
        price: parseInt(price, 10),
        stock: stock ? parseInt(stock, 10) : 0,
        image: image || null,
      },
    });

    return NextResponse.json({ product });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Terjadi kesalahan pada server." },
      { status: 500 }
    );
  }
}
