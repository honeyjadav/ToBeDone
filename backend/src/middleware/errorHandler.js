import logger from '../utils/logger.js';
import { HTTP_STATUS } from '../utils/constants.js';

export const errorHandler = (err, req, res, next) => {
  logger.error(`${err.message}`);

  const status = err.status || HTTP_STATUS.INTERNAL_SERVER_ERROR;
  const message = err.message || 'Internal Server Error';

  res.status(status).json({
    success: false,
    message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
};

export const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};  