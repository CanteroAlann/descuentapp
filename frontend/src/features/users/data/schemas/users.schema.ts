/**
 * @module discounts/data/schemas
 * @description Esquemas Zod para validación de datos de la API.
 * Valida la respuesta del servidor antes de mapear al dominio.
 */
import { z } from 'zod';

/**
 * Schema para ubicación geográfica
 */
export const LocationSchema = z.object({
  latitude: z.number(),
  longitude: z.number(),
});

/**
 * Schema del DTO de descuento desde la API
 * Valida el formato exacto que devuelve el backend
 */
export const DiscountDTOSchema = z.object({
  id: z.string().uuid(),
  title: z.string().min(1),
  description: z.string(),
  discountPercentage: z.number().min(0).max(100),
  storeName: z.string().min(1),
  validUntil: z.string().datetime(), // ISO 8601 string desde la API
  isActive: z.boolean(),
  latitude: z.number().nullable().optional(),
  longitude: z.number().nullable().optional(),
});

/**
 * Schema para array de descuentos
 */
export const DiscountsArraySchema = z.array(DiscountDTOSchema);

/**
 * Schema para respuesta paginada de la API
 */
export const PaginatedDiscountsResponseSchema = z.object({
  data: DiscountsArraySchema,
  total: z.number(),
  page: z.number(),
  pageSize: z.number(),
});

/**
 * Tipos inferidos desde los schemas
 */
export type DiscountDTO = z.infer<typeof DiscountDTOSchema>;
export type DiscountsArrayDTO = z.infer<typeof DiscountsArraySchema>;
export type PaginatedDiscountsResponseDTO = z.infer<typeof PaginatedDiscountsResponseSchema>;
