import express from "express";
import { register, verifyOtp, resendOtp } from "../controllers/authController.js";
import validate from "../middleware/validate.js";
import { registerSchema, verifyOtpSchema, resendOtpSchema } from "../validators/authValidator.js";

const router = express.Router();

router.post("/register", validate(registerSchema), register);
router.post("/verify-otp", validate(verifyOtpSchema), verifyOtp);
router.post("/resend-otp", validate(resendOtpSchema), resendOtp);

export default router;