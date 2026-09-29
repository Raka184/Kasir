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

  const transactions = await prisma.transaction.findMany({
    orderBy: { createdAt: "desc" },
    include: { items: true, member: true },
    take: 100,
  });

  return NextResponse.json({ transactions });
}

export async function POST(request) {
  const user = requireUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { items, paid, paymentMethod, memberId } = await parseJsonBody(request);

    if (!items || items.length === 0) {
      return NextResponse.json(
        { error: "Keranjang belanja kosong." },
        { status: 400 }
      );
    }

    // Ambil data produk terbaru dari DB (jangan percaya harga dari client)
    const productIds = items.map((i) => i.productId);
    const products = await prisma.product.findMany({
      where: { id: { in: productIds } },
    });
    const productMap = Object.fromEntries(products.map((p) => [p.id, p]));

    let total = 0;
    const itemsData = [];
    for (const item of items) {
      const product = productMap[item.productId];
      if (!product) {
        return NextResponse.json(
          { error: `Produk dengan id ${item.productId} tidak ditemukan.` },
          { status: 400 }
        );
      }
      if (product.stock < item.qty) {
        return NextResponse.json(
          { error: `Stok "${product.name}" tidak mencukupi.` },
          { status: 400 }
        );
      }
      const subtotal = product.price * item.qty;
      total += subtotal;
      itemsData.push({
        productId: product.id,
        name: product.name,
        qty: item.qty,
        price: product.price,
        subtotal,
      });
    }

    const resolvedPaymentMethod = paymentMethod || "tunai";
    const totalDue = total + (resolvedPaymentMethod === "qris" ? 1000 : 0);
    const paidAmount =
      resolvedPaymentMethod === "qris" ? totalDue : parseInt(paid, 10) || 0;
    if (paidAmount < totalDue) {
      return NextResponse.json(
        { error: "Jumlah uang dibayar kurang dari total belanja." },
        { status: 400 }
      );
    }

    const invoiceNo = `INV-${Date.now()}`;

    const transaction = await prisma.$transaction(async (tx) => {
      const trx = await tx.transaction.create({
        data: {
          invoiceNo,
          cashierName: user.name,
          memberId: memberId ? parseInt(memberId, 10) : null,
          total: totalDue,
          paid: paidAmount,
          change: paidAmount - totalDue,
          paymentMethod: resolvedPaymentMethod,
          items: { create: itemsData },
        },
        include: { items: true, member: true },
      });

      for (const item of itemsData) {
        await tx.product.update({
          where: { id: item.productId },
          data: { stock: { decrement: item.qty } },
        });
      }

      return trx;
    });

    return NextResponse.json({ transaction });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Terjadi kesalahan pada server." },
      { status: 500 }
    );
  }
}
