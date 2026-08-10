export const APIs = {
  API: "/api",

  LOGIN: "/auth/login",
  LOGIN_VERIFY_OTP: "/auth/login/verify-otp",
  LOGIN_RESEND_OTP: "/auth/login/resend-otp",

  REGISTER: "/auth/register",
  VERIFY_OTP: "/auth/verify-otp",
  RESEND_OTP: "/auth/resend-otp",

  REFRESH_TOKEN: "/auth/refresh-token",
  LOGOUT: "/auth/logout",
  ME: "/auth/me",
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