import express from "express";
import { askConsultant, getChatHistory, clearChatHistory } from "../controllers/ai.controller.js";
import { verifyToken, authorize } from "../middlewares/auth.js";

const router = express.Router();

// Chỉ Admin và Manager mới được phép truy cập AI Consultant
router.post("/chat", verifyToken, authorize("admin", "manager"), askConsultant);
router.get("/history", verifyToken, authorize("admin", "manager"), getChatHistory);
router.delete("/history", verifyToken, authorize("admin", "manager"), clearChatHistory);

export default router;
