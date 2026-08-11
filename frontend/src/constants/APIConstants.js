export const APIs = {
  API: "/api",

  // Login
  LOGIN: "/auth/login",
  LOGIN_VERIFY_OTP: "/auth/login/verify-otp",
  LOGIN_RESEND_OTP: "/auth/login/resend-otp",

  // Registration
  REGISTER: "/auth/register",
  VERIFY_OTP: "/auth/verify-otp",
  RESEND_OTP: "/auth/resend-otp",

  // Password
  FORGOT_PASSWORD: "/auth/forgot-password",
  RESET_PASSWORD: "/auth/reset-password",

  // Token
  REFRESH_TOKEN: "/auth/refresh-token",

  // Logout
  LOGOUT: "/auth/logout",
};

export const API_STATUS = {
  SUCCESS: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  NOT_FOUND: 404,
  UNAUTHORIZED: 401,
  INTERNAL_SERVER: 500,
  ERR_NETWORK: 0,
};

export const BEARERKEY = "Bearer ";

