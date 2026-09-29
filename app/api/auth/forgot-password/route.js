import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendResetEmail } from "@/lib/email";
import { buildResetUrl, createResetToken, hashResetToken } from "@/lib/password-reset";
import { parseJsonBody } from "@/lib/request";

export async function POST(request) {
  try {
    const { email } = await parseJsonBody(request);
    const normalizedEmail = String(email || "").trim().toLowerCase();

    if (!normalizedEmail) {
      return NextResponse.json(
        { error: "Email wajib diisi." },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { email: normalizedEmail },
    });

    if (user) {
      await prisma.passwordResetToken.deleteMany({
        where: { userId: user.id },
      });

      const token = createResetToken();
      const expiresAt = new Date(Date.now() + 30 * 60 * 1000);

      await prisma.passwordResetToken.create({
        data: {
          userId: user.id,
          tokenHash: hashResetToken(token),
          expiresAt,
        },
      });

      const resetLink = buildResetUrl(token);

      await sendResetEmail({
        to: user.email,
        name: user.name,
        resetLink,
      });
    }

    return NextResponse.json({
      message:
        "Jika email terdaftar, kami akan mengirimkan link reset password ke email Anda.",
    });
  } catch (error) {
    console.error("Forgot password error:", error);
    return NextResponse.json(
      { error: "Tidak dapat memproses permintaan reset password." },
      { status: 500 }
    );
  }
}
