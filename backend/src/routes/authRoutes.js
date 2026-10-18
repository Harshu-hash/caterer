import { Router } from 'express';
import { login, logout, me } from '../controllers/authController.js';
import { validateBody } from '../middleware/validate.js';
import { loginSchema } from '../validators/authValidators.js';
import { loginLimiter } from '../middleware/rateLimit.js';
import { requireAdmin } from '../middleware/auth.js';

const router = Router();

router.post('/login', loginLimiter, validateBody(loginSchema), login);
router.post('/logout', requireAdmin, logout);
router.get('/me', requireAdmin, me);

export default router;
