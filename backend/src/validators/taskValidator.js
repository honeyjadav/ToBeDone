import { body, param } from 'express-validator';
import { TASK_PRIORITY, TASK_STATUS } from '../utils/constants.js';

export const createTaskValidator = [
  body('title')
    .trim()
    .notEmpty()
    .withMessage('Task title is required')
    .isLength({ min: 3 })
    .withMessage('Task title must be at least 3 characters'),
  body('description')
    .optional()
    .trim(),
  body('priority')
    .optional()
    .isIn(Object.values(TASK_PRIORITY))
    .withMessage('Invalid priority'),
  body('projectId')
    .matches(/^[0-9a-fA-F]{24}$/)
    .withMessage('Invalid project ID'),
  body('dueDate')
    .optional()
    .isISO8601()
    .withMessage('Invalid due date format'),
];

export const updateTaskValidator = [
  param('id')
    .matches(/^[0-9a-fA-F]{24}$/)
    .withMessage('Invalid task ID'),
  body('title')
    .optional()
    .trim()
    .isLength({ min: 3 })
    .withMessage('Task title must be at least 3 characters'),
  body('status')
    .optional()
    .isIn(Object.values(TASK_STATUS))
    .withMessage('Invalid status'),
  body('priority')
    .optional()
    .isIn(Object.values(TASK_PRIORITY))
    .withMessage('Invalid priority'),
];