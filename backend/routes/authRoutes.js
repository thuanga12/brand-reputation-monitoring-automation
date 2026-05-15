import express from "express";
import { 
  register, login, updateProfile, 
  getAllUsers, updateUserRole, deleteUser , adminUpdateUser
} from "../controllers/authController.js";
import { verifyToken, authorize } from "../middlewares/auth.js"; // Import từ middleware

const router = express.Router();

// Public
router.post("/register", register);
router.post("/login", login);

// Private (Cần Login)
router.put("/update-profile", verifyToken, updateProfile);

// Admin Only (Quản lý tài khoản)
router.get("/users", verifyToken, authorize("admin"), getAllUsers);
router.put("/users/:id", verifyToken, authorize("admin"), updateUserRole);
router.delete("/users/:id", verifyToken, authorize("admin"), deleteUser);
router.put("/users/:id", verifyToken, authorize("admin"), adminUpdateUser);
export default router;