import { z } from 'zod';

export const createRestaurantSchema = z.object({
    name: z.string().min(2, "Restaurant Name is too short"),
    regionId: z.number().int().positive("A valid Region ID is required"),
});

export const updateRestaurantSchema = createRestaurantSchema.partial();