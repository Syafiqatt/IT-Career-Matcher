import bcrypt from "bcryptjs";
import Joi from "joi";
import { asyncHandler } from "../middlewares/asyncHandler.js";
import { signToken } from "../middlewares/auth.js";
import { query } from "../db/pool.js";

const registerSchema = Joi.object({
  name: Joi.string().min(2).max(80).required().messages({
    "string.min": "Nama minimal 2 karakter.",
    "any.required": "Nama wajib diisi.",
  }),
  username: Joi.string().min(3).max(30).pattern(/^[a-zA-Z0-9_]+$/).required().messages({
    "string.min": "Username minimal 3 karakter.",
    "string.pattern.base": "Username hanya boleh huruf, angka, dan garis bawah.",
    "any.required": "Username wajib diisi.",
  }),
  email: Joi.string().email().required().messages({
    "string.email": "Format email tidak valid.",
    "any.required": "Email wajib diisi.",
  }),
  password: Joi.string().min(6).max(128).required().messages({
    "string.min": "Password minimal 6 karakter.",
    "any.required": "Password wajib diisi.",
  }),
});

const loginSchema = Joi.object({
  identifier: Joi.string().required().messages({
    "any.required": "Username atau email wajib diisi.",
  }),
  password: Joi.string().required(),
});

const publicUser = (u) => ({
  id: u.id,
  name: u.name,
  username: u.username,
  email: u.email,
  created_at: u.created_at,
});

/** POST /api/auth/register */
export const register = asyncHandler(async (req, res) => {
  const { error, value } = registerSchema.validate(req.body, { abortEarly: false });
  if (error) {
    return res.status(400).json({
      status: "fail",
      message: "Validasi gagal.",
      errors: error.details.map((d) => d.message),
    });
  }

  const email = value.email.toLowerCase();
  const username = value.username.toLowerCase();

  const dup = await query("SELECT email, username FROM users WHERE email = $1 OR username = $2", [
    email,
    username,
  ]);
  if (dup.rowCount > 0) {
    const taken = dup.rows.some((r) => r.email === email) ? "Email" : "Username";
    return res.status(409).json({ status: "fail", message: `${taken} sudah terdaftar.` });
  }

  const hash = await bcrypt.hash(value.password, 10);
  const { rows } = await query(
    `INSERT INTO users (name, username, email, password_hash) VALUES ($1, $2, $3, $4) RETURNING *`,
    [value.name, username, email, hash]
  );
  const user = rows[0];
  const token = signToken(user);

  res.status(201).json({
    status: "success",
    message: "Registrasi berhasil.",
    data: { token, user: publicUser(user) },
  });
});

/** POST /api/auth/login — identifier bisa berupa username ATAU email. */
export const login = asyncHandler(async (req, res) => {
  const { error, value } = loginSchema.validate(req.body, { abortEarly: false });
  if (error) {
    return res.status(400).json({ status: "fail", message: "Username/email dan password wajib diisi." });
  }

  const id = value.identifier.trim().toLowerCase();
  const { rows } = await query("SELECT * FROM users WHERE email = $1 OR username = $1", [id]);
  const user = rows[0];
  if (!user || !(await bcrypt.compare(value.password, user.password_hash))) {
    return res.status(401).json({ status: "fail", message: "Username/email atau password salah." });
  }

  const token = signToken(user);
  res.json({
    status: "success",
    message: "Login berhasil.",
    data: { token, user: publicUser(user) },
  });
});

/** GET /api/auth/me */
export const me = asyncHandler(async (req, res) => {
  const { rows } = await query("SELECT * FROM users WHERE id = $1", [req.user.id]);
  if (rows.length === 0) {
    return res.status(404).json({ status: "fail", message: "User tidak ditemukan." });
  }
  res.json({ status: "success", data: { user: publicUser(rows[0]) } });
});
