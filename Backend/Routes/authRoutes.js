import express from "express";
import {
  registerUser,
  loginUser,
  getProfile,
  updateUsername,
  changePassword,
  deleteAccount,
} from "../Controllers/authController.js";
import { protect } from "../Middleware/authMiddleware.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/profile", protect, getProfile);
router.put("/update-username", protect, updateUsername);
router.put("/change-password", protect, changePassword);
router.delete("/delete-account", protect, deleteAccount);

export default router;
