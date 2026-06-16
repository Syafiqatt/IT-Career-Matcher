import { asyncHandler } from "../middlewares/asyncHandler.js";
import { predictCareer } from "../services/mlService.js";
import { query } from "../db/pool.js";

/**
 * POST /api/recommendations
 * Membuat rekomendasi baru: panggil ML service, simpan ke DB, kembalikan hasil.
 * Bila pengguna login (req.user), riwayat ditautkan ke akunnya.
 */
export const createRecommendation = asyncHandler(async (req, res) => {
  const profile = req.validated;
  const userId = req.user?.id ?? null;

  const ml = await predictCareer(profile);
  const recs = ml.recommendations || [];
  const top = recs[0] || {};

  const insert = await query(
    `INSERT INTO recommendations
       (skills, tools, databases, years_code, education_level, top_n,
        model_name, results, top_career, top_score, user_id)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)
     RETURNING *`,
    [
      JSON.stringify(profile.skills),
      JSON.stringify(profile.tools),
      JSON.stringify(profile.databases),
      profile.years_code,
      profile.education_level,
      profile.top_n,
      ml.model_name,
      JSON.stringify(recs),
      top.career || null,
      top.score ?? null,
      userId,
    ]
  );

  res.status(201).json({
    status: "success",
    message: "Rekomendasi berhasil dibuat.",
    data: insert.rows[0],
  });
});

/**
 * GET /api/recommendations — daftar riwayat (terbaru dulu).
 * Login  -> hanya riwayat milik user tsb.
 * Anonim -> hanya riwayat tanpa pemilik (user_id IS NULL).
 * Query: ?limit=10&offset=0&search=&sort=
 */
export const listRecommendations = asyncHandler(async (req, res) => {
  const limit = Math.min(parseInt(req.query.limit || "20", 10), 100);
  const offset = Math.max(parseInt(req.query.offset || "0", 10), 0);
  const search = (req.query.search || "").trim();
  const sort = req.query.sort === "score" ? "top_score DESC" : "created_at DESC";

  const where = [];
  const params = [];
  if (req.user?.id) {
    params.push(req.user.id);
    where.push(`user_id = $${params.length}`);
  } else {
    where.push(`user_id IS NULL`);
  }
  if (search) {
    params.push(`%${search}%`);
    where.push(`top_career ILIKE $${params.length}`);
  }
  const whereSql = `WHERE ${where.join(" AND ")}`;

  const listParams = [...params, limit, offset];
  const [rows, count] = await Promise.all([
    query(
      `SELECT * FROM recommendations ${whereSql}
       ORDER BY ${sort} LIMIT $${params.length + 1} OFFSET $${params.length + 2}`,
      listParams
    ),
    query(`SELECT COUNT(*)::int AS total FROM recommendations ${whereSql}`, params),
  ]);

  res.json({
    status: "success",
    meta: { total: count.rows[0].total, limit, offset },
    data: rows.rows,
  });
});

/** Klausa kepemilikan: login -> user_id =, anonim -> user_id IS NULL. */
function ownership(req, startIndex) {
  if (req.user?.id) return { sql: `user_id = $${startIndex}`, params: [req.user.id] };
  return { sql: `user_id IS NULL`, params: [] };
}

/** GET /api/recommendations/:id — satu riwayat (milik sendiri). */
export const getRecommendation = asyncHandler(async (req, res) => {
  const own = ownership(req, 2);
  const { rows } = await query(
    `SELECT * FROM recommendations WHERE id = $1 AND ${own.sql}`,
    [req.params.id, ...own.params]
  );
  if (rows.length === 0) {
    return res.status(404).json({ status: "fail", message: "Riwayat tidak ditemukan." });
  }
  res.json({ status: "success", data: rows[0] });
});

/** DELETE /api/recommendations/:id — hapus riwayat (milik sendiri). */
export const deleteRecommendation = asyncHandler(async (req, res) => {
  const own = ownership(req, 2);
  const { rowCount } = await query(
    `DELETE FROM recommendations WHERE id = $1 AND ${own.sql}`,
    [req.params.id, ...own.params]
  );
  if (rowCount === 0) {
    return res.status(404).json({ status: "fail", message: "Riwayat tidak ditemukan." });
  }
  res.json({ status: "success", message: "Riwayat dihapus." });
});
