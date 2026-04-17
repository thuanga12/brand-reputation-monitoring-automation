import express from "express";
import { approveReviewReply } from "../controllers/crm.controller.js";

const router = express.Router();

// Định nghĩa đường dẫn PATCH
router.patch("/approve-reply/:id", approveReviewReply);

export default router;