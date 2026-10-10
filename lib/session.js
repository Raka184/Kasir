export const COOKIE_NAME = "kasir_token";

export function getTokenPayload(token) {
  if (!token || typeof token !== "string") {
    return null;
  }

  const parts = token.split(".");
  if (parts.length !== 3) {
    return null;
  }

  try {
    const base64 = parts[1].replace(/-/g, "+").replace(/_/g, "/");
    const padded = base64.padEnd(Math.ceil(base64.length / 4) * 4, "=");
    const decoded = typeof atob === "function"
      ? atob(padded)
      : Buffer.from(padded, "base64").toString("binary");

    const json = JSON.parse(decoded);
    if (!json || typeof json !== "object") {
      return null;
    }

    const exp = Number(json.exp);
    if (Number.isFinite(exp) && Date.now() >= exp * 1000) {
      return null;
    }

    return json;
  } catch (error) {
    return null;
  }
}
