export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  UNPROCESSABLE_ENTITY: 422,
  INTERNAL_SERVER_ERROR: 500,
  SERVICE_UNAVAILABLE: 503,
};

export const USER_ROLES = {
  ADMIN: 'admin',
  MANAGER: 'manager',
  MEMBER: 'member',
};

export const TASK_STATUS = {
  BACKLOG: 'backlog',
  TODO: 'todo',
  IN_PROGRESS: 'in_progress',
  REVIEW: 'review',
  TESTING: 'testing',
  DONE: 'done',
};

export const TASK_PRIORITY = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
  URGENT: 'urgent',
};

export const ACTIVITY_TYPES = {
  LOGIN: 'login',
  LOGOUT: 'logout',
  TASK_CREATED: 'task_created',
  TASK_UPDATED: 'task_updated',
  TASK_COMPLETED: 'task_completed',
  COMMENT_ADDED: 'comment_added',
  FILE_UPLOADED: 'file_uploaded',
  PROJECT_CREATED: 'project_created',
  PROJECT_UPDATED: 'project_updated',
  USER_ASSIGNED: 'user_assigned',
};

export const NOTIFICATION_TYPES = {
  TASK_ASSIGNED: 'task_assigned',
  TASK_DUE: 'task_due',
  COMMENT_MENTION: 'comment_mention',
  PROJECT_UPDATE: 'project_update',
  SYSTEM_ALERT: 'system_alert',
};

export const AUTOMATIONS_TRIGGERS = {
  TASK_COMPLETED: 'task_completed',
  TASK_OVERDUE: 'task_overdue',
  COMMENT_ADDED: 'comment_added',
  PROJECT_CREATED: 'project_created',
};

export const AUTOMATION_ACTIONS = {
  NOTIFY_MANAGER: 'notify_manager',
  SEND_EMAIL: 'send_email',
  SEND_SLACK: 'send_slack',
  CREATE_TASK: 'create_task',
};

export const PAGINATION_LIMIT = 10;
export const MAX_FILE_SIZE = parseInt(process.env.MAX_FILE_SIZE) || 10485760; // 10MB