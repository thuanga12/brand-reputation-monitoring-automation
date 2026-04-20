import express from "express";
import {
  getReviews,      // Hàm cũ
  updateReply,     // Hàm của bạn C
  resolveReview,
} from "../controllers/review.controller.js";

// IMPORT thêm hàm lấy dữ liệu Highlands từ crm.controller.js (nếu bạn viết ở đó)
import { getHighlandReviews } from "../controllers/reviewHighland.controller.js";
const router = express.Router();

router.get("/highland", getHighlandReviews); // Frontend sẽ gọi đến /api/reviews/highland

router.get("/", getReviews); 
router.patch("/:id/reply", updateReply); 

export default router;