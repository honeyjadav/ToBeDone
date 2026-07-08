import User from '../models/User.js';
import { generateToken, generateRefreshToken, verifyRefreshToken } from '../utils/helpers.js';
import * as emailService from '../utils/emailService.js';
import crypto from 'crypto';
import logger from '../utils/logger.js';

export const registerService = async (userData) => {
  try {
    const existingUser = await User.findOne({ email: userData.email });

    if (existingUser) {
      throw new Error('Email already registered');
    }

    const verificationToken = crypto.randomBytes(32).toString('hex');
    const verificationTokenExpires = new Date(Date.now() + 24 * 60 * 60 * 1000);

    const user = new User({
      firstName: userData.firstName,
      lastName: userData.lastName,
      email: userData.email,
      password: userData.password,
      verificationToken,
      verificationTokenExpires,
    });

    await user.save();

    const verificationLink = `${process.env.FRONTEND_URL}/verify-email?token=${verificationToken}`;
    await emailService.sendVerificationEmail(
      user.email,
      user.firstName,
      verificationLink
    );

    logger.info(`User registered: ${user.email}`);

    return {
      id: user._id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
    };
  } catch (error) {
    logger.error(`Registration error: ${error.message}`);
    throw error;
  }
};

export const loginService = async (email, password) => {
  try {
    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      throw new Error('Invalid email or password');
    }

    if (!user.isEmailVerified) {
      throw new Error('Please verify your email first');
    }

    const isPasswordValid = await user.comparePassword(password);

    if (!isPasswordValid) {
      throw new Error('Invalid email or password');
    }

    user.lastLogin = new Date();
    await user.save();

    const accessToken = generateToken({ id: user._id, email: user.email });
    const refreshToken = generateRefreshToken({ id: user._id });

    logger.info(`User logged in: ${user.email}`);

    return {
      accessToken,
      refreshToken,
      user: user.getPublicProfile(),
    };
  } catch (error) {
    logger.error(`Login error: ${error.message}`);
    throw error;
  }
};

export const refreshTokenService = async (refreshToken) => {
  try {
    const decoded = verifyRefreshToken(refreshToken);
    const user = await User.findById(decoded.id);

    if (!user || !user.isActive) {
      throw new Error('User not found or inactive');
    }

    const newAccessToken = generateToken({ id: user._id, email: user.email });

    logger.info(`Token refreshed for user: ${user.email}`);

    return { accessToken: newAccessToken };
  } catch (error) {
    logger.error(`Token refresh error: ${error.message}`);
    throw error;
  }
};

export const forgotPasswordService = async (email) => {
  try {
    const user = await User.findOne({ email });

    if (!user) {
      throw new Error('User not found');
    }

    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenHash = crypto
      .createHash('sha256')
      .update(resetToken)
      .digest('hex');
    const resetPasswordExpires = new Date(Date.now() + 60 * 60 * 1000);

    user.resetPasswordToken = resetTokenHash;
    user.resetPasswordExpires = resetPasswordExpires;
    await user.save();

    const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;
    await emailService.sendResetPasswordEmail(user.email, user.firstName, resetLink);

    logger.info(`Password reset email sent to: ${user.email}`);

    return { message: 'Password reset link sent to your email' };
  } catch (error) {
    logger.error(`Forgot password error: ${error.message}`);
    throw error;
  }
};

export const resetPasswordService = async (token, newPassword) => {
  try {
    const tokenHash = crypto
      .createHash('sha256')
      .update(token)
      .digest('hex');

    const user = await User.findOne({
      resetPasswordToken: tokenHash,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) {
      throw new Error('Invalid or expired reset token');
    }

    user.password = newPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    logger.info(`Password reset for user: ${user.email}`);

    return { message: 'Password reset successfully' };
  } catch (error) {
    logger.error(`Reset password error: ${error.message}`);
    throw error;
  }
};

export const verifyEmailService = async (token) => {
  try {
    const user = await User.findOne({
      verificationToken: token,
      verificationTokenExpires: { $gt: Date.now() },
    });

    if (!user) {
      throw new Error('Invalid or expired verification token');
    }

    user.isEmailVerified = true;
    user.verificationToken = undefined;
    user.verificationTokenExpires = undefined;
    await user.save();

    await emailService.sendWelcomeEmail(user.email, user.firstName);

    logger.info(`Email verified for user: ${user.email}`);

    return { message: 'Email verified successfully' };
  } catch (error) {
    logger.error(`Email verification error: ${error.message}`);
    throw error;
  }
};