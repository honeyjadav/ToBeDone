import { body, param } from 'express-validator';

export const createProjectValidator = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Project name is required')
    .isLength({ min: 3 })
    .withMessage('Project name must be at least 3 characters'),
  body('description')
    .optional()
    .trim(),
];

export const updateProjectValidator = [
  param('id')
    .matches(/^[0-9a-fA-F]{24}$/)
    .withMessage('Invalid project ID'),
  body('name')
    .optional()
    .trim()
    .isLength({ min: 3 })
    .withMessage('Project name must be at least 3 characters'),
  body('description')
    .optional()
    .trim(),
];