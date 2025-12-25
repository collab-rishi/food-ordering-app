import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { registerSchema, loginSchema } from '../validators/auth.validator';
import { successResponse, errorResponse } from '../utils/response';

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || 'secret';


const generateToken = (userId: number, role: string, regionId: number) => {
    return jwt.sign(
        {
        userId,
        role,
        regionId
        },
        JWT_SECRET,
        { expiresIn: '1d' }
    );
};


const sanitizedUser = (user: any) => {
    const { password, ...rest } = user;
    return rest;
};



export const register = async (req: Request, res: Response) => {


    const validatedData = registerSchema.parse(req.body);

    const existingUser = await prisma.user.findUnique({
        where: { email: validatedData.email }
    });


    if (existingUser) {
        return errorResponse(res, 'Email already exists', 409);
    }

    const role = await prisma.role.findUnique({
        where: { name: validatedData.roleName  }
    });

    if (!role) return errorResponse(res, 'Invalid role specified', 400);

    const hashedPassword = await bcrypt.hash(validatedData.password, 12);


    const user = await prisma.user.create({
        data: {
            firstName: validatedData.firstName,
            lastName: validatedData.lastName,
            email: validatedData.email,
            password: hashedPassword,
            roleId: role.id,
            regionId: validatedData.regionId,
        },
            include: { role: true }
        });

   
    const token = generateToken(user.id, role.name, user.regionId);

 
    return successResponse(res, 'User registered successfully', {
        user: sanitizedUser(user),
        token,
        }, 201);
    };



export const login = async (req: Request, res: Response) => {
        
 
        const validatedData = loginSchema.parse(req.body);

        const user = await prisma.user.findUnique({
            where: { email: validatedData.email },
            include: { role: true, region: true }
        });

        if (!user) {
            return errorResponse(res, 'Invalid Credentials', 401);
        }


     const isMatch = await bcrypt.compare(validatedData.password, user.password);
       
        if(!isMatch) {
            return errorResponse(res, "Invalid email or password", 401);
        }

        
        const token = generateToken(user.id, user.role.name, user.regionId);

        return successResponse(res, 'Login successful', {
            user: sanitizedUser(user),
            token,
        });
       
};