import { z } from 'zod';

export const SignupSchema = z.object({
    plan: z.enum(["free", "achiever", "superhuman"]),
    firstName: z.string().min(1, { message: 'First name is required' }).max(50, { message: 'First name must be less than 50 characters' }),
    lastName: z.string().min(1, { message: 'Last name is required' }).max(50, { message: 'Last name must be less than 50 characters' }),
    email: z.string().email({ message: 'Invalid email address' }),
    password: z.string().min(6, { message: 'Password must be at least 6 characters long' }).regex(/[a-zA-Z]/, { message: 'Password must contain at least one letter' })
});

export const LoginSchema = z.object({
    email: z.string().email({ message: 'Invalid email address' }),
    password: z.string().min(6, { message: 'Password must be at least 6 characters long' }).regex(/[a-zA-Z]/, { message: 'Password must contain at least one letter' })
})

export type FormState =
    | {
        errors?: {
            plan?: string | string[],
            firstName?: string[],
            lastName?: string[],
            email?: string[],
            password?: string[]
        }
        message?: string
    }
    | undefined


export type SessionPayload = {
    userId: number;
};