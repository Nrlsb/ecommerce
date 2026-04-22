import { z } from 'zod';

// Product validation
export const productSchema = z.object({
  id: z.string(),
  name: z.string().min(1, 'Nombre requerido'),
  price: z.number().positive('Precio debe ser positivo'),
  stock: z.number().int().nonnegative('Stock no puede ser negativo'),
  category_id: z.string().optional(),
  description: z.string().optional(),
});

export type Product = z.infer<typeof productSchema>;

// Cart item validation
export const cartItemSchema = z.object({
  product_id: z.string(),
  quantity: z.number().int().positive('Cantidad debe ser mayor a 0'),
  price: z.number().positive(),
});

export type CartItem = z.infer<typeof cartItemSchema>;

// Search validation
export const searchParamsSchema = z.object({
  q: z.string().max(100).optional(),
  category: z.string().optional(),
  sort: z.enum(['featured', 'price-asc', 'price-desc', 'newest']).optional(),
  page: z.number().int().positive().optional(),
});

export type SearchParams = z.infer<typeof searchParamsSchema>;

// Auth validation
export const loginSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'Contraseña debe tener al menos 6 caracteres'),
});

export type LoginInput = z.infer<typeof loginSchema>;

// Safely parse data with fallback
export const safeValidate = <T,>(schema: z.ZodSchema<T>, data: unknown): T | null => {
  try {
    return schema.parse(data);
  } catch (error) {
    console.error('Validation error:', error);
    return null;
  }
};
