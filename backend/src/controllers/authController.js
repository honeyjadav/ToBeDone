import * as authService from '../services/authService.js';
import { HTTP_STATUS } from '../utils/constants.js';
import { formatSuccessResponse, formatErrorResponse } from '../utils/helpers.js';
import logger from '../utils/logger.js';

export const register = async (req, res, next) => {
  try {
    const { firstName, lastName, email, password } = req.body;

    const user = await authService.registerService({
      firstName,
      lastName,
      email,
      password,
    });

    res.status(HTTP_STATUS.CREATED).json(
      formatSuccessResponse(user, 'Registration successful. Please verify your email.')
    );
  } catch (error) {
    logger.error(`Register error: ${error.message}`);
    res.status(HTTP_STATUS.BAD_REQUEST).json(
      formatErrorResponse(error.message)
    );
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const result = await authService.loginService(email, password);

    res.status(HTTP_STATUS.OK).json(
      formatSuccessResponse(result, 'Login successful')
    );
  } catch (error) {
    logger.error(`Login error: ${error.message}`);
    res.status(HTTP_STATUS.UNAUTHORIZED).json(
      formatErrorResponse(error.message)
    );
  }
};

export const refreshToken = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json(
        formatErrorResponse('Refresh token is required')
      );
    }

    const result = await authService.refreshTokenService(refreshToken);

    res.status(HTTP_STATUS.OK).json(
      formatSuccessResponse(result, 'Token refreshed successfully')
    );
  } catch (error) {
    logger.error(`Refresh token error: ${error.message}`);
    res.status(HTTP_STATUS.UNAUTHORIZED).json(
      formatErrorResponse(error.message)
    );
  }
};

export const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;

    const result = await authService.forgotPasswordService(email);

    res.status(HTTP_STATUS.OK).json(
      formatSuccessResponse(result, result.message)
    );
  } catch (error) {
    logger.error(`Forgot password error: ${error.message}`);
    res.status(HTTP_STATUS.BAD_REQUEST).json(
      formatErrorResponse(error.message)
    );
  }
};

export const resetPassword = async (req, res, next) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    const result = await authService.resetPasswordService(token, password);

    res.status(HTTP_STATUS.OK).json(
      formatSuccessResponse(result, result.message)
    );
  } catch (error) {
    logger.error(`Reset password error: ${error.message}`);
    res.status(HTTP_STATUS.BAD_REQUEST).json(
      formatErrorResponse(error.message)
    );
  }
};

export const verifyEmail = async (req, res, next) => {
  try {
    const { token } = req.query;

    if (!token) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json(
        formatErrorResponse('Verification token is required')
      );
    }

    const result = await authService.verifyEmailService(token);

    res.status(HTTP_STATUS.OK).json(
      formatSuccessResponse(result, result.message)
    );
  } catch (error) {
    logger.error(`Email verification error: ${error.message}`);
    res.status(HTTP_STATUS.BAD_REQUEST).json(
      formatErrorResponse(error.message)
    );
  }
};

export const getCurrentUser = async (req, res, next) => {
  try {
    res.status(HTTP_STATUS.OK).json(
      formatSuccessResponse(req.user.getPublicProfile(), 'User profile retrieved')
    );
  } catch (error) {
    logger.error(`Get current user error: ${error.message}`);
    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json(
      formatErrorResponse(error.message)
    );
  }
};