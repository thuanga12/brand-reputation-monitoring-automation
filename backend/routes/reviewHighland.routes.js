import express from "express";
import { getHighlandReviews } from "../controllers/reviewHighland.controller.js";

const router = express.Router();

router.get("/", getHighlandReviews);

export default router;