import { Router } from 'express';
import { requireAdmin } from '../middleware/auth.js';
import { validateBody } from '../middleware/validate.js';
import { siteSettingsSchema } from '../validators/contentValidators.js';
import { getSettings, updateSettings } from '../controllers/settingsController.js';

const router = Router();
router.use(requireAdmin);

router.get('/', getSettings);
router.patch('/', validateBody(siteSettingsSchema), updateSettings);

export default router;
