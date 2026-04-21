import express from "express";
import { approveReviewReply, getCRMStrategy } from "../controllers/crm.controller.js";

const router = express.Router();

// Workflow 3: Phê duyệt (Dùng PATCH vì là cập nhật một phần dữ liệu)
router.patch("/approve-reply/:id", approveReviewReply);

// Workflow 4: Lấy chiến lược (Dùng GET để lấy dữ liệu)
router.get("/strategy", getCRMStrategy);

export default router;