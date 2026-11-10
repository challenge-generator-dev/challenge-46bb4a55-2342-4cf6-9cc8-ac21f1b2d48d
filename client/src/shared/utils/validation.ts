import { z } from 'zod';

export const productSchema = z.object({
  name: z.string().min(1, 'El nombre del producto es requerido'),
  quantity: z.number().int().positive('La cantidad debe ser mayor a 0'),
  price: z.number().positive('El precio debe ser mayor a 0'),
});

export const createOrderSchema = z.object({
  customerId: z.string().min(1, 'El ID del cliente es requerido'),
  customerName: z.string().min(1, 'El nombre del cliente es requerido'),
  products: z
    .array(productSchema)
    .min(1, 'Debe incluir al menos un producto')
    .refine(
      (products) => {
        const names = products.map((p) => p.name.toLowerCase().trim());
        const uniqueNames = new Set(names);
        return names.length === uniqueNames.size;
      },
      {
        message: 'No se permiten productos duplicados en la orden',
      }
    ),
});

export const updateOrderSchema = z.object({
  customerId: z.string().min(1).optional(),
  customerName: z.string().min(1).optional(),
  products: z.array(productSchema).optional(),
  status: z.enum(['pending', 'processing', 'completed', 'cancelled']).optional(),
});

export type CreateOrderFormData = z.infer<typeof createOrderSchema>;
export type UpdateOrderFormData = z.infer<typeof updateOrderSchema>;
export type ProductFormData = z.infer<typeof productSchema>;

export function validateCreateOrder(data: unknown): { success: boolean; data?: CreateOrderFormData; error?: string } {
  const result = createOrderSchema.safeParse(data);
  
  if (result.success) {
    return { success: true, data: result.data };
  }
  
  const firstError = result.error.errors[0];
  return { success: false, error: `${firstError.path.join('.')}: ${firstError.message}` };
}

export function validateUpdateOrder(data: unknown): { success: boolean; data?: UpdateOrderFormData; error?: string } {
  const result = updateOrderSchema.safeParse(data);
  
  if (result.success) {
    return { success: true, data: result.data };
  }
  
  const firstError = result.error.errors[0];
  return { success: false, error: `${firstError.path.join('.')}: ${firstError.message}` };
}

export function hasDuplicateProducts(products: ProductFormData[]): boolean {
  const names = products.map((p) => p.name.toLowerCase().trim());
  const uniqueNames = new Set(names);
  return names.length !== uniqueNames.size;
}

export function getDuplicateProductNames(products: ProductFormData[]): string[] {
  const nameCounts = new Map<string, number>();
  const duplicates: string[] = [];
  
  products.forEach((product) => {
    const normalizedName = product.name.toLowerCase().trim();
    const count = nameCounts.get(normalizedName) || 0;
    nameCounts.set(normalizedName, count + 1);
  });
  
  nameCounts.forEach((count, name) => {
    if (count > 1) {
      duplicates.push(name);
    }
  });
  
  return duplicates;
}

export function calculateOrderTotal(products: ProductFormData[]): number {
  return products.reduce((total, product) => {
    return total + product.price * product.quantity;
  }, 0);
}

export function validateCustomerId(customerId: string): { valid: boolean; message?: string } {
  if (!customerId || customerId.trim().length === 0) {
    return { valid: false, message: 'El ID del cliente es requerido' };
  }
  
  if (customerId.length < 3) {
    return { valid: false, message: 'El ID del cliente debe tener al menos 3 caracteres' };
  }
  
  return { valid: true };
}

export function validateProductQuantity(quantity: number): { valid: boolean; message?: string } {
  if (!Number.isInteger(quantity)) {
    return { valid: false, message: 'La cantidad debe ser un número entero' };
  }
  
  if (quantity <= 0) {
    return { valid: false, message: 'La cantidad debe ser mayor a 0' };
  }
  
  if (quantity > 1000) {
    return { valid: false, message: 'La cantidad no puede exceder 1000 unidades' };
  }
  
  return { valid: true };
}

export function validateProductPrice(price: number): { valid: boolean; message?: string } {
  if (typeof price !== 'number' || isNaN(price)) {
    return { valid: false, message: 'El precio debe ser un número válido' };
  }
  
  if (price <= 0) {
    return { valid: false, message: 'El precio debe ser mayor a 0' };
  }
  
  if (price > 1000000) {
    return { valid: false, message: 'El precio no puede exceder 1,000,000' };
  }
  
  return { valid: true };
}

export interface ValidationRule<T> {
  validate: (value: T) => boolean;
  message: string;
}

export function createValidationChain<T>(rules: ValidationRule<T>[]): (value: T) => string | null {
  return (value: T): string | null => {
    for (const rule of rules) {
      if (!rule.validate(value)) {
        return rule.message;
      }
    }
    return null;
  };
}