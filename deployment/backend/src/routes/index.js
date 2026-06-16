import { Router } from "express";
import { getOptions } from "../controllers/optionsController.js";
import {
  createRecommendation,
  listRecommendations,
  getRecommendation,
  deleteRecommendation,
} from "../controllers/recommendationController.js";
import { register, login, me } from "../controllers/authController.js";
import { validateBody, recommendationSchema } from "../middlewares/validate.js";
import { authOptional, authRequired } from "../middlewares/auth.js";
import { mlHealth } from "../services/mlService.js";
import { asyncHandler } from "../middlewares/asyncHandler.js";

const router = Router();

// Auth opsional global: req.user terisi bila token valid, tapi tidak memblokir anonim.
router.use(authOptional);

// Health check (Express + ML service)
router.get(
  "/health",
  asyncHandler(async (req, res) => {
    const ml = await mlHealth().catch(() => ({ status: "down" }));
    res.json({ status: "success", api: "ok", ml });
  })
);

// Autentikasi
router.post("/auth/register", register);
router.post("/auth/login", login);
router.get("/auth/me", authRequired, me);

// Opsi input
router.get("/options", getOptions);

// Resource: recommendations (mengikuti konvensi RESTful)
router
  .route("/recommendations")
  .get(listRecommendations)
  .post(validateBody(recommendationSchema), createRecommendation);

router
  .route("/recommendations/:id")
  .get(getRecommendation)
  .delete(deleteRecommendation);

export default router;
