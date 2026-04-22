import express from "express";
// THÊM deleteReview VÀO ĐÂY
import { getHighlandReviews, deleteReview } from "../controllers/reviewHighland.controller.js"; 
import { verifyToken, authorize } from '../middlewares/auth.js';

const router = express.Router();

// User nào cũng được xem review
router.get('/', verifyToken, getHighlandReviews);

// Chỉ Admin mới được xóa review
router.delete('/:id', verifyToken, authorize('admin'), deleteReview);

export default router;