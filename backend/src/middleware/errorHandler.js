import { ApiError } from '../utils/ApiError.js';
import { env } from '../config/env.js';

export function notFoundHandler(req, res, next) {
  next(new ApiError(404, `Route not found: ${req.method} ${req.originalUrl}`));
}

export function errorHandler(err, req, res, _next) {
  let statusCode = err instanceof ApiError ? err.statusCode : 500;
  let message = err.message || 'Internal server error';
  let errors = err instanceof ApiError ? err.errors : [];

  if (err.name === 'ValidationError') {
    statusCode = 400;
    errors = Object.values(err.errors || {}).map((e) => ({ field: e.path, message: e.message }));
    message = 'Please correct the highlighted fields';
  }

  if (err.code === 11000) {
    statusCode = 409;
    const field = Object.keys(err.keyValue || {})[0] || 'field';
    message = `A record with this ${field} already exists`;
    errors = [{ field, message }];
  }

  if (err.name === 'CastError') {
    statusCode = 400;
    message = 'Invalid identifier supplied';
  }

  if (statusCode === 500 && env.nodeEnv === 'production') {
    message = 'Something went wrong. Please try again later.';
  }

  if (env.nodeEnv !== 'production' && statusCode === 500) {
    console.error(err);
  }

  res.status(statusCode).json({
    success: false,
    message,
    errors,
  });
}
