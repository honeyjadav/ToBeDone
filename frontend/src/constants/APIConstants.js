export const APIs = {
  API: "/api",

  // Login
  LOGIN: "/auth/login",
  LOGIN_VERIFY_OTP: "/auth/login/verify-otp",
  LOGIN_RESEND_OTP: "/auth/login/resend-otp",
  GET_ME: "/auth/me",
  UPDATE_PROFILE: "/auth/me",

  // Registration
  REGISTER: "/auth/register",
  VERIFY_OTP: "/auth/verify-otp",
  RESEND_OTP: "/auth/resend-otp",

  // Password
  FORGOT_PASSWORD: "/auth/forgot-password",
  RESET_PASSWORD: "/auth/reset-password",
  CHANGE_PASSWORD: "/auth/change-password",

  // Token
  REFRESH_TOKEN: "/auth/refresh-token",

  // Logout
  LOGOUT: "/auth/logout",

  // Workspaces
  WORKSPACES: "/workspaces",
  WORKSPACE_BY_ID: (workspaceId) => `/workspaces/${workspaceId}`,
  WORKSPACE_MEMBERS: (workspaceId) => `/workspaces/${workspaceId}/members`,
  WORKSPACE_MEMBER_ROLE: (workspaceId, memberId) =>
    `/workspaces/${workspaceId}/members/${memberId}/role`,
  WORKSPACE_MEMBER_REMOVE: (workspaceId, memberId) =>
    `/workspaces/${workspaceId}/members/${memberId}`,

  // Tasks
  TASKS: (workspaceId) => `/workspaces/${workspaceId}/tasks`,
  TASK_BY_ID: (workspaceId, taskId) => `/workspaces/${workspaceId}/tasks/${taskId}`,
  INVITES: (workspaceId) => `/invites/${workspaceId}`,
  INVITE_ACCEPT: (token) => `/invites/accept/${token}`,
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

