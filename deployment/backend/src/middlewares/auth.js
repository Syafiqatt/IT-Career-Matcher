import jwt from "jsonwebtoken";
import { config } from "../config/index.js";

/** Buat JWT untuk sebuah user. */
export function signToken(user) {
  return jwt.sign({ id: user.id, email: user.email, name: user.name }, config.jwt.secret, {
    expiresIn: config.jwt.expiresIn,
  });
}

function readToken(req) {
  const header = req.headers.authorization || "";
  if (header.startsWith("Bearer ")) return header.slice(7);
  return null;
}

/**
 * Auth opsional: jika ada token valid, set req.user. Jika tidak, lanjut sebagai anonim.
 * Dipakai global agar flow lama (tanpa login) tetap berjalan.
 */
export function authOptional(req, res, next) {
  const token = readToken(req);
  if (token) {
    try {
      req.user = jwt.verify(token, config.jwt.secret);
    } catch {
      /* token tidak valid -> diperlakukan sebagai anonim */
    }
  }
  next();
}

/** Auth wajib: tolak bila tidak ada token valid. */
export function authRequired(req, res, next) {
  const token = readToken(req);
  if (!token) {
    return res.status(401).json({ status: "fail", message: "Anda harus login terlebih dahulu." });
  }
  try {
    req.user = jwt.verify(token, config.jwt.secret);
    next();
  } catch {
    return res.status(401).json({ status: "fail", message: "Sesi tidak valid atau kedaluwarsa." });
  }
}
