import express from "express";
import {
  getReviews,
  getReviewById,
  updateReply,
  resolveReview,
} from "../controllers/review.controller.js";

const router = express.Router();

router.get("/", getReviews); // Lấy danh sách review kèm filter
router.get("/:id", getReviewById); // Xem chi tiết 1 review
router.patch("/:id/reply", updateReply); // Cập nhật nội dung trả lời (Bạn C)
router.patch("/:id/resolve", resolveReview); // Đánh dấu đã xử lý xong

export default router;