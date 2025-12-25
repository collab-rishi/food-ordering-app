import { z } from 'zod';

export const loginSchema = z.object({
    email: z.string().email("Invalid email format"),
    password: z.string().min(6, "Password must be at least 6 characters")
});

export const registerSchema = z.object({
  firstName: z.string().min(2, "First name is too short"),
  lastName: z.string().min(2, "Last name is too short"),
  email: z.string().email("Invalid email format"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  roleName: z.enum(['ADMIN', 'MANAGER', 'MEMBER']).optional().default('MEMBER'),
  regionId: z.number().positive("Invalid region ID format")
});
