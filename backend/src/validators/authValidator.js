import Joi from "joi";

export const registerSchema = Joi.object({
  name: Joi.string().trim().min(1).required().messages({
    "string.empty": "Name is required",
  }),
  email: Joi.string().email().trim().lowercase().required().messages({
    "string.email": "A valid email is required",
    "string.empty": "Email is required",
  }),
  password: Joi.string()
    .min(8)
    .pattern(/[A-Z]/, "uppercase letter")
    .pattern(/[a-z]/, "lowercase letter")
    .pattern(/[0-9]/, "digit")
    .pattern(/[!@#$%^&*(),.?":{}|<>]/, "special character")
    .required()
    .messages({
      "string.min": "Password must be at least 8 characters long",
      "string.pattern.name": "Password must contain at least one {#name}",
      "string.empty": "Password is required",
    }),
});

export const verifyOtpSchema = Joi.object({
  email: Joi.string().email().trim().lowercase().required().messages({
    "string.email": "A valid email is required",
  }),
  otp: Joi.string().length(6).pattern(/^[0-9]+$/).required().messages({
    "string.length": "OTP must be 6 digits",
    "string.pattern.base": "OTP must contain only digits",
  }),
});

export const resendOtpSchema = Joi.object({
  email: Joi.string().email().trim().lowercase().required().messages({
    "string.email": "A valid email is required",
  }),
});