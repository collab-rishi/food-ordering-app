import { Router } from 'express';
import { authenticate, authorize } from '../middleware/auth.middleware';
import { createRestaurant, listRestaurants } from '../controllers/restaurant.controller';
import { asyncHandler } from '../utils/asyncHandler';

const router = Router();

router.get('/', authenticate, asyncHandler(listRestaurants));

router.post('/', authenticate, authorize(['ADMIN', 'MANAGER']), asyncHandler(createRestaurant));


export default router;