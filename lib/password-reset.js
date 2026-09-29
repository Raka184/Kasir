import crypto from "node:crypto";

export function createResetToken() {
  return crypto.randomBytes(32).toString("hex");
}

export function hashResetToken(token) {
  return crypto.createHash("sha256").update(token).digest("hex");
}

export function isResetTokenExpired(expiresAt) {
  return new Date(expiresAt).getTime() <= Date.now();
}

export function buildResetUrl(token) {
  const baseUrl =
    process.env.NEXT_PUBLIC_APP_URL ||
    process.env.APP_URL ||
    "http://localhost:3000";

  return `${baseUrl.replace(/\/$/, "")}/reset-password?token=${encodeURIComponent(token)}`;
}
