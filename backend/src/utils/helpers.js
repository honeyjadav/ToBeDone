import jwt from 'jsonwebtoken';
import logger from './logger.js';

export const generateToken = (payload, expiresIn = '7d') => {
  try {
    return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn });
  } catch (error) {
    logger.error(`Token generation error: ${error.message}`);
    throw error;
  }
};

export const generateRefreshToken = (payload) => {
  try {
    return jwt.sign(payload, process.env.JWT_REFRESH_SECRET, {
      expiresIn: process.env.JWT_REFRESH_EXPIRE || '30d',
    });
  } catch (error) {
    logger.error(`Refresh token generation error: ${error.message}`);
    throw error;
  }
};

export const verifyToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    logger.error(`Token verification error: ${error.message}`);
    throw error;
  }
};

export const verifyRefreshToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_REFRESH_SECRET);
  } catch (error) {
    logger.error(`Refresh token verification error: ${error.message}`);
    throw error;
  }
};

export const formatErrorResponse = (message, errors = null) => {
  return {
    success: false,
    message,
    errors,
  };
};

export const formatSuccessResponse = (data, message = 'Success') => {
  return {
    success: true,
    message,
    data,
  };
};

export const calculatePagination = (page = 1, limit = 10) => {
  const skip = (page - 1) * limit;
  return { skip, limit, page };
};

export const generateSlug = (text) => {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_]+/g, '-')
    .replace(/^-+|-+$/g, '');
};

export const isValidObjectId = (id) => {
  return /^[0-9a-fA-F]{24}$/.test(id);
};

export const getInitials = (firstName, lastName) => {
  return `${firstName[0]}${lastName[0]}`.toUpperCase();
};

export const getDaysDifference = (date1, date2) => {
  const oneDay = 24 * 60 * 60 * 1000;
  return Math.round(Math.abs((date1 - date2) / oneDay));
};

export const isOverdue = (dueDate) => {
  return new Date(dueDate) < new Date() && true;
};

export const getDateRange = (days = 7) => {
  const end = new Date();
  const start = new Date(end);
  start.setDate(start.getDate() - days);
  return { start, end };
};