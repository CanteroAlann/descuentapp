/**
 * @module features/auth/data/schemas
 * @description Schemas de validación para autenticación (Zod)
 */
import { z } from 'zod';

/**
 * Schema para validar credenciales de login
 */
export const loginCredentialsSchema = z.object({
  email: z
    .string()
    .min(1, 'El email es requerido')
    .email('Email inválido'),
  password: z
    .string()
    .min(1, 'La contraseña es requerida')
    .min(6, 'La contraseña debe tener al menos 6 caracteres'),
});

/**
 * Schema para validar respuesta de autenticación
 */
export const authResponseSchema = z.object({
  success: z.boolean(),
  token: z.string(),
});

/**
 * Tipos inferidos de los schemas
 */
export type LoginCredentialsSchema = z.infer<typeof loginCredentialsSchema>;
export type AuthResponseSchema = z.infer<typeof authResponseSchema>;
