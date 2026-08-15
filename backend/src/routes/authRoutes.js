import express from "express";
import {
  register,
  verifyOtp,
  resendOtp,
  login,
  loginVerifyOtp,
  resendLoginOtp,
  refreshToken,
  logout,
  logoutAll,
  getMySessions,
  revokeSession,
  forgotPassword,
  resetPassword,
  getMe,
  updateProfile,
  changePassword
} from "../controllers/authController.js";

import { createNote, getWorkspaceNotes } from "../controllers/noteController.js";

import validate from "../middleware/validate.js";
import {
  registerSchema,
  verifyOtpSchema,
  resendOtpSchema,
  loginSchema,
} from "../validators/authValidator.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

router.post("/register", validate(registerSchema), register);
router.post("/verify-otp", validate(verifyOtpSchema), verifyOtp);
router.post("/resend-otp", validate(resendOtpSchema), resendOtp);
router.post("/login", validate(loginSchema), login);
router.post("/login/verify-otp", validate(verifyOtpSchema), loginVerifyOtp);
router.post("/login/resend-otp", validate(resendOtpSchema), resendLoginOtp);
router.post("/refresh-token", refreshToken);
router.post("/logout", logout);
router.post("/logout-all", protect, logoutAll);
router.get("/sessions", protect, getMySessions);
router.delete("/sessions/:sessionId", protect, revokeSession);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);
router.get("/me", protect, getMe);
router.patch("/profile", protect, updateProfile);
router.patch("/change-password", protect, changePassword);
// --- 👉 2. ADD YOUR NEW NOTE ROUTES HERE ---
// Notice we use `protect` here so only logged-in users can access them
router.post("/create-note", protect, createNote);
router.get("/workspace-notes/:workspaceId", protect, getWorkspaceNotes);

export default router;