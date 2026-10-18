import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';
import { ApiError } from '../utils/ApiError.js';
import AdminUser from '../models/AdminUser.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const requireAdmin = asyncHandler(async (req, res, next) => {
  const token = req.cookies?.[env.cookieName];

  if (!token) {
    throw new ApiError(401, 'Authentication required');
  }

  let payload;
  try {
    payload = jwt.verify(token, env.jwtSecret);
  } catch {
    throw new ApiError(401, 'Session expired. Please log in again.');
  }

  const admin = await AdminUser.findById(payload.sub);
  if (!admin || !admin.isActive) {
    throw new ApiError(401, 'Account not found or inactive');
  }

  req.admin = admin;
  next();
});
