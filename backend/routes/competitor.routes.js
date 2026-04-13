import express from "express";
// Chỉ import hàm, không khai báo lại logic ở đây
import { getCompetitors } from "../controllers/competitor.controller.js"; 

const router = express.Router();

// Sử dụng hàm đã import từ controller
router.get("/", getCompetitors); 

export default router;