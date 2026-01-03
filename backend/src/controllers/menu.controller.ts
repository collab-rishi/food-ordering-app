import { Response } from 'express';
import { successResponse, errorResponse } from '../utils/response';
import * as MenuService from '../services/menu.service';
import * as RestaurantService from '../services/restaurant.service';


export const addMenuItem = async (req: any, res: Response) => {

    const { name, description, price, restaurantId } = req.body;
    const { role, regionId: userRegionId } = req.user;

    const restaurant = await RestaurantService.findRestaurantById(Number(restaurantId));
    if (!restaurant) return errorResponse(res, 'Restaurant not found', 404);

    if (role === 'MANAGER' && restaurant.regionId !== userRegionId) {
        return errorResponse(res, 'Forbidden: This restaurant is outside your region', 403);
    }

    const menuItem = await MenuService.createMenuItem({
        name,
        description,
        price: Number(price),
        restaurantId: Number(restaurantId),
    });

    return successResponse(res, 'Menu item added successfully', menuItem, 201);
};