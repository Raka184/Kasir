import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { hashPassword } from "@/lib/auth";
import { hashResetToken, isResetTokenExpired } from "@/lib/password-reset";
import { parseJsonBody } from "@/lib/request";

export async function POST(request) {
  try {
    const { token, password } = await parseJsonBody(request);

    if (!token || !password) {
      return NextResponse.json(
        { error: "Token dan password baru wajib diisi." },
        { status: 400 }
      );
    }

    if (String(password).length < 6) {
      return NextResponse.json(
        { error: "Password minimal 6 karakter." },
        { status: 400 }
      );
    }

    const tokenHash = hashResetToken(String(token));
    const resetRecord = await prisma.passwordResetToken.findUnique({
      where: { tokenHash },
      include: { user: true },
    });

    if (!resetRecord || resetRecord.usedAt || isResetTokenExpired(resetRecord.expiresAt)) {
      return NextResponse.json(
        { error: "Token reset tidak valid atau sudah kedaluwarsa." },
        { status: 400 }
      );
    }

    await prisma.$transaction([
      prisma.user.update({
        where: { id: resetRecord.userId },
        data: { password: hashPassword(String(password)) },
      }),
      prisma.passwordResetToken.update({
        where: { id: resetRecord.id },
        data: { usedAt: new Date() },
      }),
      prisma.passwordResetToken.deleteMany({
        where: {
          userId: resetRecord.userId,
          id: { not: resetRecord.id },
        },
      }),
    ]);

    return NextResponse.json({
      message: "Password berhasil diubah. Silakan login kembali.",
    });
  } catch (error) {
    console.error("Reset password error:", error);
    return NextResponse.json(
      { error: "Tidak dapat mengubah password." },
      { status: 500 }
    );
  }
}
