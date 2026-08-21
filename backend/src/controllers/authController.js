import jwt from "jsonwebtoken";
import User from "../models/User.js";
import WorkspaceMember from "../models/WorkspaceMember.js";
import Session from "../models/Session.js";
import generateOtp from "../utils/generateOtp.js";
import sendEmail from "../utils/sendEmail.js";
import { otpEmailTemplate, loginSuccessEmailTemplate, inviteEmailTemplate,resetPasswordEmailTemplate } from "../utils/emailTemplates.js";
import {
  createSession,
  rotateAccessToken,
  setRefreshTokenCookie,
} from "../utils/tokenUtils.js";

// NOTE: Frontend should clear sessionStorage.PENDING_REGISTER_EMAIL 
// before calling login to ensure correct 2FA flow detection
import crypto from "crypto";
const OTP_EXPIRY_MINUTES = 5;

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

// @desc    Register a new user — verified but not logged in
// @route   POST /api/auth/register
// @access  Public
export const register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ email });

    if (existingUser && existingUser.isEmailVerified) {
      res.status(400);
      throw new Error("An account with this email already exists");
    }

    let user;
    if (existingUser) {
      // Update existing unverified user
      existingUser.name = name;
      existingUser.password = password;
      existingUser.isEmailVerified = true;
      user = await existingUser.save();
    } else {
      // Create new user
      user = await User.create({
        name,
        email,
        password,
        authProvider: "local",
        isEmailVerified: true, // ✅ Auto-verify on registration
      });
    }

    res.status(201).json({
      success: true,
      message: "Account created successfully. Please login to continue.",
      data: {
        email: user.email,
        message: "You can now login with your credentials",
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Verify OTP and activate account. Creates a session (both tokens
//          stored in DB), so the user is fully logged in right after this.
// @route   POST /api/auth/verify-otp
// @access  Public
// export const verifyOtp = async (req, res, next) => {
//   try {
//     const { email, otp } = req.body;

//     const user = await User.findOne({ email }).select("+otp +otpExpires");
//     if (!user) {
//       res.status(404);
//       throw new Error("User not found");
//     }

//     if (user.isEmailVerified) {
//       res.status(400);
//       throw new Error("Email is already verified");
//     }

//     if (!user.otp || !user.otpExpires || user.otpExpires < Date.now()) {
//       res.status(400);
//       throw new Error("OTP has expired. Please request a new one.");
//     }

//     if (user.otp !== String(otp).trim()) {
//       res.status(400);
//       throw new Error("Invalid OTP");
//     }

//     user.isEmailVerified = true;
//     user.otp = undefined;
//     user.otpExpires = undefined;
//     await user.save();

//     const { accessToken, refreshToken } = await createSession(user._id, req);
//     setRefreshTokenCookie(res, refreshToken);

//     // await sendEmail({
//     //   to: user.email,
//     //   subject: "Successfully signed in to ToBeDone",
//     //   html: loginSuccessEmailTemplate({
//     //     name: user.name,
//     //     loginTime: new Date().toISOString(),
//     //   }),
//     // });

//     res.status(200).json({
//       success: true,
//       message: "Email verified successfully",
//       data: {
//         id: user._id,
//         name: user.name,
//         email: user.email,
//         authProvider: user.authProvider,
//         accessToken,
//         workspaces: [],
//         hasWorkspace: false,
//       },
//     });
//   } catch (error) {
//     next(error);
//   }
// };

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

    createAndSendOtp(user);

    res.status(200).json({
      success: true,
      message: "A new OTP has been sent to your email",
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Login with email + password. Creates a session (both tokens
//          stored in DB) and returns the user's workspaces.
// @route   POST /api/auth/login
// @access  Public
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      res.status(401);
      throw new Error("Invalid email or password");
    }

    if (user.authProvider !== "local") {
      res.status(400);
      throw new Error(`This account uses ${user.authProvider} sign-in. Please use that instead.`);
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      res.status(401);
      throw new Error("Invalid email or password");
    }

    if (!user.isEmailVerified) {
      res.status(403);
      throw new Error("Please verify your email before logging in");
    }

    // ✅ Reuse same otp field — send login OTP instead of tokens
     createAndSendOtp(user);

    res.status(200).json({
      success: true,
      message: "OTP sent to your email. Please verify to complete login.",
      data: {
        email: user.email,
        otpSent: true,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Verify login 2FA OTP and issue tokens
// @route   POST /api/auth/login/verify-otp
// @access  Public
export const loginVerifyOtp = async (req, res, next) => {
  try {
    const { email, otp } = req.body;

    // ✅ same fields — otp + otpExpires
    const user = await User.findOne({ email }).select("+otp +otpExpires");
    if (!user) {
      res.status(404);
      throw new Error("User not found");
    }

    // ✅ opposite guard from verifyOtp — user MUST be verified to be here
    if (!user.isEmailVerified) {
      res.status(403);
      throw new Error("Please verify your email first");
    }

    if (!user.otp || !user.otpExpires || user.otpExpires < Date.now()) {
      res.status(400);
      throw new Error("OTP has expired. Please login again.");
    }

    if (user.otp !== String(otp).trim()) {
      res.status(400);
      throw new Error("Invalid OTP");
    }

    // ✅ clear same otp fields
    user.otp = undefined;
    user.otpExpires = undefined;
    await user.save();

    // NOW issue tokens
    const { accessToken, refreshToken } = await createSession(user._id, req);
    setRefreshTokenCookie(res, refreshToken);

    const memberships = await WorkspaceMember.find({ userId: user._id })
      .populate("workspaceId", "name");

    const workspaces = memberships.map((m) => ({
      workspaceId: m.workspaceId._id,
      name: m.workspaceId.name,
      role: m.role,
    }));

    res.status(200).json({
      success: true,
      message: "Login successful",
      data: {
        id: user._id,
        name: user.name,
        email: user.email,
        accessToken,
        workspaces,
        hasWorkspace: workspaces.length > 0,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Resend login OTP if expired
// @route   POST /api/auth/login/resend-otp
// @access  Public
export const resendLoginOtp = async (req, res, next) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      res.status(404);
      throw new Error("User not found");
    }

    // ✅ opposite guard from resendOtp
    if (!user.isEmailVerified) {
      res.status(403);
      throw new Error("Please verify your email first");
    }

    // ✅ reuse exact same createAndSendOtp function
    createAndSendOtp(user);

    res.status(200).json({
      success: true,
      message: "A new OTP has been sent to your email",
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Silently exchange a valid refresh token (httpOnly cookie) for a
//          new access token. Updates the SAME session document.
// @route   POST /api/auth/refresh-token
// @access  Public
export const refreshToken = async (req, res, next) => {
  try {
    const token = req.cookies.refreshToken;
    if (!token) {
      res.status(401);
      throw new Error("No refresh token provided");
    }

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);
    } catch (err) {
      res.status(401);
      throw new Error("Invalid or expired refresh token");
    }

    const session = await Session.findOne({ refreshToken: token, userId: decoded.id });
    if (!session) {
      res.status(401);
      throw new Error("Session not found. Please log in again.");
    }

    if (session.refreshTokenExpiresAt < new Date()) {
      await Session.deleteOne({ _id: session._id });
      res.status(401);
      throw new Error("Session expired. Please log in again.");
    }

    const newAccessToken = await rotateAccessToken(session);

    res.status(200).json({
      success: true,
      data: { accessToken: newAccessToken },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Logout — revokes just the current device's session
// @route   POST /api/auth/logout
// @access  Public
export const logout = async (req, res, next) => {
  try {
    const token = req.cookies?.refreshToken;

    // Delete refresh-token session from database
    if (token) {
      await Session.deleteOne({
        refreshToken: token,
      });
    }

    // Clear refresh-token cookie
    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      path: "/",
    });

    return res.status(200).json({
      success: true,
      message: "Logged out successfully",
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Log out of ALL devices (revokes every session for this user)
// @route   POST /api/auth/logout-all
// @access  Private
export const logoutAll = async (req, res, next) => {
  try {
    await Session.deleteMany({ userId: req.user.id });
    res.clearCookie("refreshToken");
    res.status(200).json({ success: true, message: "Logged out of all devices" });
  } catch (error) {
    next(error);
  }
};

// @desc    List all active sessions (devices) for the logged-in user,
//          with user details populated.
// @route   GET /api/auth/sessions
// @access  Private
export const getMySessions = async (req, res, next) => {
  try {
    const sessions = await Session.find({ userId: req.user.id })
      .populate("userId", "name email authProvider isEmailVerified")
      .sort({ lastUsedAt: -1 });

    const formatted = sessions.map((s) => ({
      sessionId: s._id,
      user: {
        id: s.userId._id,
        name: s.userId.name,
        email: s.userId.email,
        authProvider: s.userId.authProvider,
        isEmailVerified: s.userId.isEmailVerified,
      },
      device: s.userAgent,
      ip: s.ip,
      accessTokenExpiresAt: s.accessTokenExpiresAt,
      refreshTokenExpiresAt: s.refreshTokenExpiresAt,
      lastUsedAt: s.lastUsedAt,
      createdAt: s.createdAt,
    }));

    res.status(200).json({ success: true, data: formatted });
  } catch (error) {
    next(error);
  }
};

// @desc    Revoke a single session (log out one specific device)
// @route   DELETE /api/auth/sessions/:sessionId
// @access  Private
export const revokeSession = async (req, res, next) => {
  try {
    const { sessionId } = req.params;

    const session = await Session.findOne({ _id: sessionId, userId: req.user.id });
    if (!session) {
      res.status(404);
      throw new Error("Session not found");
    }

    await Session.deleteOne({ _id: sessionId });

    res.status(200).json({ success: true, message: "Session revoked" });
  } catch (error) {
    next(error);
  }
};

// @desc    Validate email and send reset password link
// @route   POST /api/auth/forgot-password
// @access  Public
export const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });

    // ✅ Only perform async operations if user exists AND verified
    if (user && user.isEmailVerified) {
      // Generate reset token
      const resetToken = crypto.randomUUID();
      user.resetPasswordToken = resetToken;
      user.resetPasswordExpires = Date.now() + 15 * 60 * 1000; // 15 minutes
      await user.save();

      const resetLink = `${process.env.CLIENT_URL}/reset-password?token=${resetToken}`;

      sendEmail({
        to: user.email,
        subject: "Reset your password — ToBeDone",
        html: resetPasswordEmailTemplate({
          name: user.name,
          resetLink,
          expiryMinutes: 15,
        }),
      });
    }

    // ✅ Send response ONCE, at the end, regardless of user validity
    // This ensures if an error occurs above, the catch block can send an error response
    res.status(200).json({
      success: true,
      message: "If this email is registered and verified, a reset link has been sent.",
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Verify reset token and update password
// @route   POST /api/auth/reset-password
// @access  Public
export const resetPassword = async (req, res, next) => {
  try {
    const { token, newPassword } = req.body;

    // Validate request
    if (!token) {
      res.status(400);
      throw new Error("Reset token is required.");
    }

    if (!newPassword) {
      res.status(400);
      throw new Error("New password is required.");
    }

    // Find user by reset token
    const user = await User.findOne({
      resetPasswordToken: token,
    }).select("+resetPasswordToken +resetPasswordExpires +password");

    if (!user) {
      res.status(400);
      throw new Error("Invalid reset link.");
    }

    // Check token expiry
    if (!user.resetPasswordExpires || user.resetPasswordExpires < Date.now()) {
      res.status(400);
      throw new Error("Reset link has expired. Please request a new one.");
    }

    // Update password
    user.password = newPassword;

    // Remove reset token
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;

    await user.save();

    // Logout from all devices
    await Session.deleteMany({ userId: user._id });

    return res.status(200).json({
      success: true,
      message: "Password reset successful. Please login with your new password.",
    });
  } catch (error) {
    next(error);
  }
};

export const getMe = async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id).select(
            "-password"
        );

        if (!user) {
            res.status(404);
            throw new Error("User not found");
        }

        res.status(200).json({
            success: true,
            data: user,
        });
    } catch (error) {
        next(error);
    }
};

export const updateProfile = async (req, res) => {
    try {
        const { name } = req.body;

        if (!name || !name.trim()) {
            return res.status(400).json({
                success: false,
                message: "Name is required",
            });
        }

        const user = await User.findByIdAndUpdate(
            req.user.id,
            {
                $set: {
                    name: name.trim(),
                },
            },
            {
                new: true,
                runValidators: true,
            }
        ).select("-password");

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        return res.status(200).json({
            success: true,
            message: "Profile updated successfully",
            data: user,
        });

    } catch (error) {
        console.error(
            "Update profile error:",
            error
        );

        return res.status(500).json({
            success: false,
            message: "Failed to update profile",
        });
    }
};

// @desc    Change password for a logged-in user (requires current password)
// @route   PATCH /api/auth/change-password
// @access  Private
export const changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;

    const user = await User.findById(req.user.id).select("+password");
    if (!user) {
      res.status(404);
      throw new Error("User not found");
    }

    if (user.authProvider !== "local") {
      res.status(400);
      throw new Error(
        `This account uses ${user.authProvider} sign-in and does not have a password.`
      );
    }

    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) {
      res.status(401);
      throw new Error("Current password is incorrect");
    }

    if (currentPassword === newPassword) {
      res.status(400);
      throw new Error("New password must be different from the current password");
    }

    user.password = newPassword;
    await user.save();

    // Revoke every other session, keep the current device logged in
    const currentToken = req.cookies?.refreshToken;
    await Session.deleteMany({
      userId: user._id,
      ...(currentToken ? { refreshToken: { $ne: currentToken } } : {}),
    });

    res.status(200).json({
      success: true,
      message: "Password changed successfully",
    });
  } catch (error) {
    next(error);
  }
};