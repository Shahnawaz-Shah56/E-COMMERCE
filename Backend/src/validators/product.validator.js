import { z } from 'zod'
export const productSchema = z.object({
    name: z.string().min(3),
    description: z.string().min(10),
    price: z.number().min(0),
    category: z.string(),
    stock: z.number().min(0)
})