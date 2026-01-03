import { Response } from 'express';
import { successResponse, errorResponse } from '../utils/response';
import { createRestaurantSchema } from '../validators/restaurant.validator';
import * as RestaurantService from '../services/restaurant.service';
import prisma from '../db'


export const createRestaurant = async (req: any, res: Response) => {
    
    // validate req body
    const validatedData = createRestaurantSchema.parse(req.body);

    // get user data
    const { userId, role, regionId: userRegionId } = req.user;

    // manager cant create restnts outside their region
    if (role === 'MANAGER' && validatedData.regionId != userRegionId) {
        return errorResponse(res, 'Managers can only create restaurants in their assigned region.', 403);
    }

    // check if rest name already exists
    const existing = await prisma.restaurant.findUnique({
        where: { name: validatedData.name }
    });

    if (existing) return errorResponse(res, 'Restaurant name already exists', 409);

    // create restaurant
    const restaurant = await RestaurantService.createNewRestaurant(validatedData); 
    return successResponse(res, 'Restaurant created', restaurant, 201);

};


export const listRestaurants = async (req: any, res: Response) => {
  const { role, regionId: userRegionId } = req.user;

  const filter = role === 'MANAGER' ? { regionId: userRegionId } : {};
  
  const restaurants = await RestaurantService.getRestaurantsByFilter(filter);
  return successResponse(res, 'Restaurants fetched', restaurants);
};


