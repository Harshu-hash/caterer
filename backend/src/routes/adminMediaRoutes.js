import { Router } from 'express';
import { requireAdmin } from '../middleware/auth.js';
import { upload } from '../middleware/upload.js';
import { uploadMedia, listMedia, deleteMedia } from '../controllers/mediaController.js';

const router = Router();
router.use(requireAdmin);

router.get('/', listMedia);
router.post('/', upload.single('file'), uploadMedia);
router.delete('/:id', deleteMedia);

export default router;
