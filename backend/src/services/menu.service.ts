import prisma from '../db';

export const createMenuItem = async (data: {
    name: string;
    description?: string;
    price: number;
    restaurantId: number;
}) => {

    return await prisma.menuItem.create({
        data,
    });

};

export const getMenuItemsByRestaurant = async (restaurantId: number) => {
    return await prisma.menuItem.findMany({
        where: { restaurantId },
    });
};

export const deleteMenuItem = async (id: number) => {
    return await prisma.menuItem.delete({
        where: { id },
    });
};