import { asyncHandler } from "../middlewares/asyncHandler.js";
import { fetchVocab } from "../services/mlService.js";

// Cache vocab di memori (jarang berubah) agar tidak memanggil ML service berulang.
let vocabCache = null;

/** GET /api/options — daftar opsi skill/tool/database/karir untuk frontend. */
export const getOptions = asyncHandler(async (req, res) => {
  if (!vocabCache) {
    vocabCache = await fetchVocab();
  }
  res.json({ status: "success", data: vocabCache });
});
