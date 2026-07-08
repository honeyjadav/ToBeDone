import nodemailer from 'nodemailer';
import logger from './logger.js';
import * as emailTemplates from './emailTemplates.js';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: true,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export const sendVerificationEmail = async (email, userName, verificationLink) => {
  try {
    const mailOptions = {
      from: process.env.SMTP_FROM,
      to: email,
      subject: 'Verify Your Email - ToBeDone',
      html: emailTemplates.verificationEmailTemplate(userName, verificationLink),
    };

    await transporter.sendMail(mailOptions);
    logger.info(`Verification email sent to ${email}`);
    return true;
  } catch (error) {
    logger.error(`Failed to send verification email: ${error.message}`);
    throw error;
  }
};

export const sendResetPasswordEmail = async (email, userName, resetLink) => {
  try {
    const mailOptions = {
      from: process.env.SMTP_FROM,
      to: email,
      subject: 'Reset Your Password - ToBeDone',
      html: emailTemplates.resetPasswordTemplate(userName, resetLink),
    };

    await transporter.sendMail(mailOptions);
    logger.info(`Password reset email sent to ${email}`);
    return true;
  } catch (error) {
    logger.error(`Failed to send reset password email: ${error.message}`);
    throw error;
  }
};

export const sendWelcomeEmail = async (email, userName) => {
  try {
    const mailOptions = {
      from: process.env.SMTP_FROM,
      to: email,
      subject: 'Welcome to ToBeDone!',
      html: emailTemplates.welcomeEmailTemplate(userName),
    };

    await transporter.sendMail(mailOptions);
    logger.info(`Welcome email sent to ${email}`);
    return true;
  } catch (error) {
    logger.error(`Failed to send welcome email: ${error.message}`);
    throw error;
  }
};  