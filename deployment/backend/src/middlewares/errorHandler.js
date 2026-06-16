/** Handler 404 untuk route yang tidak dikenal. */
export function notFound(req, res, next) {
  res.status(404).json({
    status: "fail",
    message: `Route ${req.method} ${req.originalUrl} tidak ditemukan.`,
  });
}

/** Error handler terpusat — mencegah aplikasi crash & memberi respons konsisten. */
// eslint-disable-next-line no-unused-vars
export function errorHandler(err, req, res, next) {
  console.error("[ERROR]", err.message);

  // ML service tidak dapat dihubungi
  if (err.code === "ECONNREFUSED" || err.code === "ECONNABORTED") {
    return res.status(503).json({
      status: "error",
      message: "Layanan ML sedang tidak tersedia. Coba lagi nanti.",
    });
  }

  res.status(err.statusCode || 500).json({
    status: "error",
    message: err.message || "Terjadi kesalahan pada server.",
  });
}
