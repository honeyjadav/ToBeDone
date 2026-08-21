export const APIs = {
  API: "/api",

  // Login
  LOGIN: "/auth/login",
  LOGIN_VERIFY_OTP: "/auth/login/verify-otp",
  LOGIN_RESEND_OTP: "/auth/login/resend-otp",
  GET_ME: "/auth/me",
  UPDATE_PROFILE: "/auth/profile",

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

  // Webhooks
  WEBHOOKS: (workspaceId) => `/workspaces/${workspaceId}/webhooks`,
  WEBHOOK_BY_ID: (workspaceId, webhookId) => `/workspaces/${workspaceId}/webhooks/${webhookId}`,
  WEBHOOK_SEND: (workspaceId, webhookId) => `/workspaces/${workspaceId}/webhooks/${webhookId}/send`,

  // Digest / Activity
  DIGEST: (workspaceId) => `/workspaces/${workspaceId}/digest`,
  ACTIVITY_FEED: (workspaceId) => `/workspaces/${workspaceId}/activity`,

  // Groups
  GROUPS: (workspaceId) => `/workspaces/${workspaceId}/groups`,
  GROUP_BY_ID: (workspaceId, groupId) => `/workspaces/${workspaceId}/groups/${groupId}`,
  GROUP_DELETE: (workspaceId, groupId) => `/workspaces/${workspaceId}/groups/${groupId}`, 
  GROUP_MEMBERS: (workspaceId, groupId) => `/workspaces/${workspaceId}/groups/${groupId}/members`,
  GROUP_MEMBER_REMOVE: (workspaceId, groupId, userId) =>
    `/workspaces/${workspaceId}/groups/${groupId}/members/${userId}`,

  // Conversations (sidebar list: groups + DM-able members)
  CONVERSATIONS: (workspaceId) => `/workspaces/${workspaceId}/conversations`,

  // Messages
  MESSAGES: (workspaceId) => `/messages/${workspaceId}`,
  MESSAGE_DELETE: (workspaceId, id) => `/messages/${workspaceId}/${id}`,
  MESSAGE_MODERATE: (workspaceId, id) => `/messages/${workspaceId}/${id}/moderate`,
  
  // Dashboard
  DASHBOARD: (workspaceId) => `/workspaces/${workspaceId}/dashboard`,

  // Notifications
  NOTIFICATIONS: (workspaceId) => `/workspaces/${workspaceId}/notifications`,
  NOTIFICATION_READ: (workspaceId, notificationId) =>
    `/workspaces/${workspaceId}/notifications/${notificationId}/read`,
  NOTIFICATIONS_READ_ALL: (workspaceId) =>
    `/workspaces/${workspaceId}/notifications/read-all`,
  NOTIFICATIONS_CLEAR_READ: (workspaceId) =>
  `/workspaces/${workspaceId}/notifications/read`,
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

