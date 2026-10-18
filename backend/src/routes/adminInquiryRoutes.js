import { Router } from 'express';
import { requireAdmin } from '../middleware/auth.js';
import { validateBody } from '../middleware/validate.js';
import { updateInquirySchema } from '../validators/inquiryValidators.js';
import {
  listInquiries,
  getInquiry,
  updateInquiry,
  deleteInquiry,
} from '../controllers/inquiryController.js';

const router = Router();
router.use(requireAdmin);

router.get('/', listInquiries);
router.get('/:id', getInquiry);
router.patch('/:id', validateBody(updateInquirySchema), updateInquiry);
router.delete('/:id', deleteInquiry);

export default router;
