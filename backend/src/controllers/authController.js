import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';
import { ApiError } from '../utils/ApiError.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ok } from '../utils/apiResponse.js';
import AdminUser from '../models/AdminUser.js';

function setAuthCookie(res, admin) {
  const token = jwt.sign({ sub: admin._id.toString() }, env.jwtSecret, {
    expiresIn: env.jwtExpiresIn,
  });

  res.cookie(env.cookieName, token, {
    httpOnly: true,
    secure: env.nodeEnv === 'production',
    sameSite: env.nodeEnv === 'production' ? 'strict' : 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000,
    path: '/',
  });
}

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const admin = await AdminUser.findOne({ email: email.toLowerCase() });
  if (!admin || !admin.isActive) {
    throw new ApiError(401, 'Invalid email or password');
  }

  const matches = await bcrypt.compare(password, admin.passwordHash);
  if (!matches) {
    throw new ApiError(401, 'Invalid email or password');
  }

  admin.lastLoginAt = new Date();
  await admin.save();

  setAuthCookie(res, admin);

  ok(res, { id: admin._id, name: admin.name, email: admin.email }, 'Logged in successfully');
});

export const logout = asyncHandler(async (req, res) => {
  res.clearCookie(env.cookieName, { path: '/' });
  ok(res, null, 'Logged out successfully');
});

export const me = asyncHandler(async (req, res) => {
  ok(res, { id: req.admin._id, name: req.admin.name, email: req.admin.email });
});
