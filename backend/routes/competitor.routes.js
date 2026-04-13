import express from "express";
import { getCompetitors } from "../controllers/competitor.controller.js"; 

const router = express.Router();

// Định nghĩa endpoint GET tại /api/competitors/
router.get("/", getCompetitors); 

// BẮT BUỘC: Dòng này phải ở cuối file để app.js nhận diện được
export default router;