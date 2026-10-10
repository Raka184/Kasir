import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

export { COOKIE_NAME, getTokenPayload } from "./session.js";

const JWT_SECRET = process.env.JWT_SECRET || "dev-secret-jangan-dipakai-di-produksi";

export function hashPassword(password) {
  return bcrypt.hashSync(password, 10);
}

export function comparePassword(password, hash) {
  return bcrypt.compareSync(password, hash);
}

export function signToken(payload) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" });
}

export function verifyToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (err) {
    return null;
  }
}

export function isAdmin(user) {
  return user?.role === "admin";
}
