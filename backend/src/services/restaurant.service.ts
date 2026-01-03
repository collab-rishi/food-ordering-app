import prisma from '../db'; 

export const createNewRestaurant = async (data: { name: string; regionId: number } ) => {
        return await prisma.restaurant.create({
            data,
        });
};

export const getRestaurantsByFilter = async (filter: { regionId?: number } = {}) => {
    return await prisma.restaurant.findMany({
        where: filter,
        include: {
            menuItems: true,
            region: { select: { name: true } },
        },
    });
};

export const findRestaurantById = async (id: number) => {
    return await prisma.restaurant.findUnique({
        where: { id },
    });
};



