import { asyncHandler } from '../utils/asyncHandler.js';
import { ok } from '../utils/apiResponse.js';
import SiteSettings from '../models/SiteSettings.js';

export const getSettings = asyncHandler(async (_req, res) => {
  let settings = await SiteSettings.findOne();
  if (!settings) settings = await SiteSettings.create({});
  ok(res, settings);
});

export const updateSettings = asyncHandler(async (req, res) => {
  let settings = await SiteSettings.findOne();
  if (!settings) settings = new SiteSettings();

  Object.assign(settings, req.body);
  await settings.save();

  ok(res, settings, 'Settings updated successfully');
});
