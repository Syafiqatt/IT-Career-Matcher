/** Bungkus handler async agar error otomatis diteruskan ke errorHandler. */
export const asyncHandler = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);
