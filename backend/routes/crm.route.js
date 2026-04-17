import express from "express";
import { approveReviewReply } from "../controllers/crm.controller.js";

const router = express.Router();

router.patch("/approve-reply/:id", approveReviewReply);

export default router;