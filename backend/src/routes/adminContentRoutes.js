import { Router } from 'express';
import { requireAdmin } from '../middleware/auth.js';
import { validateBody } from '../middleware/validate.js';
import { buildAdminCrud } from '../controllers/adminCrudFactory.js';

import Service from '../models/Service.js';
import MenuCategory from '../models/MenuCategory.js';
import MenuItem from '../models/MenuItem.js';
import Package from '../models/Package.js';
import GalleryItem from '../models/GalleryItem.js';
import Testimonial from '../models/Testimonial.js';
import Event from '../models/Event.js';

import {
  serviceSchema,
  menuCategorySchema,
  menuItemSchema,
  packageSchema,
  galleryItemSchema,
  testimonialSchema,
  eventSchema,
} from '../validators/contentValidators.js';

const router = Router();
router.use(requireAdmin);

function registerCrudRoutes(basePath, Model, schema, options) {
  const { list, getOne, create, update, remove } = buildAdminCrud(Model, schema, options);
  router.get(basePath, list);
  router.get(`${basePath}/:id`, getOne);
  router.post(basePath, validateBody(schema), create);
  router.patch(`${basePath}/:id`, validateBody(schema.partial()), update);
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
registerCrudRoutes('/testimonials', Testimonial, testimonialSchema, { slugSource: 'customerName' });
registerCrudRoutes('/events', Event, eventSchema, { slugSource: 'title' });

export default router;
