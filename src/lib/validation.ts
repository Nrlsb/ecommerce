import { z } from 'zod';

// Product validation
export const productSchema = z.object({
  id: z.union([z.string(), z.number()]),
  nombre: z.string().min(1, 'Nombre requerido'),
  precio: z.number().positive('Precio debe ser positivo'),
  stock: z.number().int().nonnegative('Stock no puede ser negativo').optional().nullable(),
  marca: z.string().optional().nullable(),
  descripcion: z.string().optional().nullable(),
  imagen_url: z.string().optional().nullable(),
  categoria_id: z.union([z.string(), z.number()]).optional().nullable(),
  precio_con_descuento: z.number().optional().nullable(),
  descuento_porcentual: z.number().optional().nullable(),
});

export type Product = z.infer<typeof productSchema>;

// Cart item validation (as structured in CartContext client side)
export const cartItemSchema = z.object({
  id: z.union([z.string(), z.number()]),
  name: z.string().min(1, 'Nombre requerido'),
  price: z.number().positive('Precio debe ser positivo'),
  quantity: z.number().int().positive('Cantidad debe ser mayor a 0'),
  brand: z.string().optional().nullable(),
  imagen_url: z.string().optional().nullable(),
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
