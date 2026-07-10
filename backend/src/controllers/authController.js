import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import User from "../models/User.js";
import generateOtp from "../utils/generateOtp.js";
import sendEmail from "../utils/sendEmail.js";
import { otpEmailTemplate } from "../utils/emailTemplates.js";

const OTP_EXPIRY_MINUTES = 5;

const generateToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
  });

const createAndSendOtp = async (user) => {
  const otp = generateOtp();
  user.otp = otp;
  user.otpExpires = Date.now() + OTP_EXPIRY_MINUTES * 60 * 1000;
  await user.save();

  await sendEmail({
    to: user.email,
    subject: "Verify your email — ToBeDone",
    html: otpEmailTemplate({
      name: user.name,
      otp,
      expiryMinutes: OTP_EXPIRY_MINUTES,
    }),
  });
};

// @desc    Register a new user — creates account as unverified, sends OTP.
//          If the email already exists but was never verified, treat this
//          as "resume registration": update details + send a fresh OTP,
//          instead of blocking the user permanently.
// @route   POST /api/auth/register
// @access  Public
export const register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      if (existingUser.isEmailVerified) {
        res.status(400);
        throw new Error("An account with this email already exists");
      }

      // Unverified account — let them retry instead of getting stuck forever
      existingUser.name = name;
      existingUser.password = password; // pre('save') hook re-hashes it
      await createAndSendOtp(existingUser);

      return res.status(200).json({
        success: true,
        message:
          "This email is already registered but not verified. A new OTP has been sent.",
        data: {
          email: existingUser.email,
          isEmailVerified: false,
        },
      });
    }

    // Brand new user
    const user = await User.create({
      name,
      email,
      password,
      authProvider: "local",
      isEmailVerified: false,
    });

    await createAndSendOtp(user);

    res.status(201).json({
      success: true,
      message:
        "Account created. An OTP has been sent to your email for verification.",
      data: {
        email: user.email,
        isEmailVerified: user.isEmailVerified,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Verify OTP and activate account (returns JWT on success)
// @route   POST /api/auth/verify-otp
// @access  Public
export const verifyOtp = async (req, res, next) => {
  try {
    const { email, otp } = req.body;

    const user = await User.findOne({ email }).select("+otp +otpExpires");
    if (!user) {
      res.status(404);
      throw new Error("User not found");
    }

    if (user.isEmailVerified) {
      res.status(400);
      throw new Error("Email is already verified");
    }

    if (!user.otp || !user.otpExpires || user.otpExpires < Date.now()) {
      res.status(400);
      throw new Error("OTP has expired. Please request a new one.");
    }

    if (user.otp !== String(otp).trim()) {
      res.status(400);
      throw new Error("Invalid OTP");
    }

    user.isEmailVerified = true;
    user.otp = undefined;
    user.otpExpires = undefined;
    await user.save();

    res.status(200).json({
      success: true,
      message: "Email verified successfully",
      data: {
        id: user._id,
        name: user.name,
        email: user.email,
        authProvider: user.authProvider,
        token: generateToken(user._id),
        hasWorkspace: false,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Resend a new OTP if the previous one expired or was lost
// @route   POST /api/auth/resend-otp
// @access  Public
export const resendOtp = async (req, res, next) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      res.status(404);
      throw new Error("User not found");
    }

    if (user.isEmailVerified) {
      res.status(400);
      throw new Error("Email is already verified");
    }

    await createAndSendOtp(user);

    res.status(200).json({
      success: true,
      message: "A new OTP has been sent to your email",
    });
  } catch (error) {
    next(error);
  }
};
