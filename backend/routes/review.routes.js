import express from "express";
import {
  getReviews,
  getReviewById, // Thêm nếu cần lấy chi tiết
  updateReply,
  resolveReview,
  getCompetitorHighlights, // Hàm lấy review thực tế của đối thủ
} from "../controllers/review.controller.js";

// Import hàm lấy dữ liệu Highlands từ controller riêng của bạn
import { getHighlandReviews } from "../controllers/reviewHighland.controller.js";

const router = express.Router();

/**
 * ROUTES CHO HIGHLANDS (Dữ liệu nội bộ)
 */
router.get("/highland", getHighlandReviews); 

/**
 * ROUTES CHO ĐỐI THỦ (Dữ liệu cào từ n8n)
 */
// Endpoint: /api/reviews/competitor-highlights?brand=Katinat&type=Tích cực
router.get("/competitor-highlights", getCompetitorHighlights); 

/**
 * ROUTES QUẢN TRỊ CHUNG (CRM)
 */
router.get("/", getReviews); 
router.get("/:id", getReviewById);
router.patch("/:id/reply", updateReply); 
router.patch("/:id/resolve", resolveReview);

export default router;