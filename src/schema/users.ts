import { z } from 'zod';

export const SignUpSchema = z.object({
    name: z.string(),
    email: z.string().email(),
    password: z.string().min(6)
})

export const AddressSchema = z.object({
    lineOne: z.string(),
    lineTwo: z.string().optional(),
    pinCode: z.string().length(6),
    country: z.string(),
    city: z.string(),
})

export const UpdateUserSchema = z.object({
    name: z.string().optional(),
    defaultShipingAddress: z.number().optional(),
    defaultBillingAddress: z.number().optional(),
})