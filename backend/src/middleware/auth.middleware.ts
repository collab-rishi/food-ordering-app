import { Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { errorResponse } from '../utils/response';
import { asyncHandler } from '../utils/asyncHandler';

const JWT_SECRET = process.env.JWT_SECRET || 'secret';


export const authenticate = asyncHandler(async (req: any, res: Response, next: NextFunction) => {
   
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return errorResponse(res, 'Access denied. No token provided. ', 401);
    }

    const token = authHeader.split(' ')[1];

    const decoded = jwt.verify(token, JWT_SECRET) as any;

    req.user = {
        userId: decoded.userId,
        role: decoded.role,
        regionId: decoded.regionId
    };

    next();
    
});


export const authorize = (roles: string[]) => {
    return (req: any, res: Response, next: NextFunction) => {
        if (!req.user || !roles.includes(req.user.role)) {
            return errorResponse(res, 'Access denied. Insufficient permissions. ', 403);
        }
        next();
    };
};