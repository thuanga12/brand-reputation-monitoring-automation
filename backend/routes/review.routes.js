import express from "express";
import {
  getReviews,
  getReviewById,
  updateReply,
  resolveReview,
  getCompetitorHighlights,
} from "../controllers/review.controller.js";

import { getHighlandReviews } from "../controllers/reviewHighland.controller.js";

const router = express.Router();

/**
 * ROUTES CHO HIGHLANDS
 * Endpoint: /api/reviews/highland
 */
router.get("/highland", getHighlandReviews);

/**
 * ROUTES CHO ĐỐI THỦ
 * Endpoint: /api/reviews/competitor-highlights?brand=Katinat&type=Tích cực
 */
router.get("/competitor-highlights", getCompetitorHighlights);

/**
 * ROUTES QUẢN TRỊ REVIEW CHUNG
 */
router.get("/", getReviews);
router.get("/:id", getReviewById);
router.patch("/:id/reply", updateReply);
router.patch("/:id/resolve", resolveReview);

export default router;