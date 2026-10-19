import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';
import { ApiError } from '../utils/ApiError.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ok } from '../utils/apiResponse.js';
import AdminUser from '../models/AdminUser.js';

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

  // Token goes straight in the response body and the client attaches it as
  // an `Authorization: Bearer` header on every request. No cookie involved,
  // so there's nothing for SameSite rules, third-party-cookie blocking, or
  // a stale cache to break — the frontend explicitly controls when the
  // token is sent.
  const token = jwt.sign({ sub: admin._id.toString() }, env.jwtSecret, {
    expiresIn: env.jwtExpiresIn,
  });

  ok(res, { token, id: admin._id, name: admin.name, email: admin.email }, 'Logged in successfully');
});

export const logout = asyncHandler(async (_req, res) => {
  // Nothing to clear server-side — the client just discards its stored token.
  ok(res, null, 'Logged out successfully');
});

export const me = asyncHandler(async (req, res) => {
  ok(res, { id: req.admin._id, name: req.admin.name, email: req.admin.email });
});
