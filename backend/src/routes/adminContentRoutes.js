import { Router } from 'express';
import { requireAdmin } from '../middleware/auth.js';
import { validateBody } from '../middleware/validate.js';
import { buildAdminCrud } from '../controllers/adminCrudFactory.js';

import Service from '../models/Service.js';
import MenuCategory from '../models/MenuCategory.js';
import MenuItem from '../models/MenuItem.js';
import Package from '../models/Package.js';
import GalleryItem from '../models/GalleryItem.js';
import Event from '../models/Event.js';
import Review from '../models/Review.js';

import {
  serviceSchema,
  menuCategorySchema,
  menuItemSchema,
  packageSchema,
  galleryItemSchema,
  eventSchema,
  reviewSchema,
} from '../validators/contentValidators.js';

const router = Router();
router.use(requireAdmin);

// Stashes which keys the client actually sent before validateBody replaces
// req.body with the Zod-parsed (and default-filled) version — see the
// comment in adminCrudFactory.js's update handler for why this matters.
function captureRawBodyKeys(req, res, next) {
  req.rawBodyKeys = Object.keys(req.body || {});
  next();
}

function registerCrudRoutes(basePath, Model, schema, options) {
  const { list, getOne, create, update, remove } = buildAdminCrud(Model, schema, options);
  router.get(basePath, list);
  router.get(`${basePath}/:id`, getOne);
  router.post(basePath, validateBody(schema), create);
  router.patch(`${basePath}/:id`, captureRawBodyKeys, validateBody(schema.partial()), update);
  router.delete(`${basePath}/:id`, remove);
}

registerCrudRoutes('/services', Service, serviceSchema, { slugSource: 'title' });
registerCrudRoutes('/menu-categories', MenuCategory, menuCategorySchema, { slugSource: 'name' });
registerCrudRoutes('/menu-items', MenuItem, menuItemSchema, {
  slugSource: 'name',
  populate: { path: 'categoryId', select: 'name slug' },
});
registerCrudRoutes('/packages', Package, packageSchema, { slugSource: 'name' });
registerCrudRoutes('/gallery', GalleryItem, galleryItemSchema, { slugSource: 'title' });
registerCrudRoutes('/events', Event, eventSchema, {
  // No slugSource: Event has no `slug` field in its schema (it's linked to
  // publicly by _id, not slug) — see the warning in adminCrudFactory.js.
  populate: { path: 'dishes', select: 'name image dietaryTags' },
});
registerCrudRoutes('/reviews', Review, reviewSchema); // Review has no `slug` field either.

export default router;
