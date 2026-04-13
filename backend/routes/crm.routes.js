import express from "express";
import { getCRMReports } from "../controllers/crm.controller.js";

const router = express.Router();

// Định nghĩa API lấy danh sách báo cáo CRM
router.get("/", getCRMReports);

// Xuất mặc định để App.js nhận diện được route này
export default router;