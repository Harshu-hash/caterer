import { Router } from 'express';
import {
  getSiteSettings,
  listServices,
  getServiceBySlug,
  listMenuCategories,
  listMenuItems,
  listPackages,
  listGalleryItems,
  listTestimonials,
  listEvents,
  listReviews,
} from '../controllers/publicController.js';
import { createInquiry } from '../controllers/inquiryController.js';
import { createReview } from '../controllers/reviewController.js';
import { validateBody } from '../middleware/validate.js';
import { createInquirySchema } from '../validators/inquiryValidators.js';
import { createReviewSchema } from '../validators/reviewValidators.js';
import { inquiryLimiter, reviewLimiter } from '../middleware/rateLimit.js';

const router = Router();

router.get('/health', (_req, res) => res.json({ success: true, message: 'ok' }));

router.get('/site-settings', getSiteSettings);
router.get('/services', listServices);
router.get('/services/:slug', getServiceBySlug);
router.get('/menu-categories', listMenuCategories);
router.get('/menu-items', listMenuItems);
router.get('/packages', listPackages);
router.get('/gallery', listGalleryItems);
router.get('/testimonials', listTestimonials);
router.get('/events', listEvents);
router.get('/reviews', listReviews);

router.post('/inquiries', inquiryLimiter, validateBody(createInquirySchema), createInquiry);
router.post('/reviews', reviewLimiter, validateBody(createReviewSchema), createReview);

export default router;
