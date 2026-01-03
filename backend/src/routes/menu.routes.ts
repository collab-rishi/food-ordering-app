import { Router } from 'express';
import { authenticate, authorize } from '../middleware/auth.middleware';
import { addMenuItem } from '../controllers/menu.controller';
import { asyncHandler } from '../utils/asyncHandler';

const router = Router();

router.post('/', authenticate, authorize(['ADMIN', 'MANAGER']), asyncHandler(addMenuItem));

export default router;