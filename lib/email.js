import nodemailer from "nodemailer";

export async function sendResetEmail({ to, name, resetLink }) {
  const host = process.env.SMTP_HOST;
  const port = Number(process.env.SMTP_PORT || 587);
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  const from = process.env.SMTP_FROM || "noreply@kasir-app.local";

  if (!host || !user || !pass) {
    console.log("[Password Reset] Email not sent because SMTP is not configured.");
    console.log({ to, name, resetLink });
    return { simulated: true };
  }

  const transporter = nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: { user, pass },
  });

  await transporter.sendMail({
    from,
    to,
    subject: "Reset password akun Kasir App",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #111827;">Reset password akun Anda</h2>
        <p>Halo ${name || "Pengguna"},</p>
        <p>Kami menerima permintaan untuk mengatur ulang password akun Kasir App Anda.</p>
        <p>
          <a href="${resetLink}" style="display: inline-block; padding: 10px 16px; background: #2563eb; color: white; text-decoration: none; border-radius: 8px;">
            Reset Password
          </a>
        </p>
        <p>Link ini berlaku selama 30 menit.</p>
        <p>Jika Anda tidak meminta reset password, abaikan email ini.</p>
      </div>
    `,
  });

  return { simulated: false };
}
