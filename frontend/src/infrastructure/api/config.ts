/**
 * @module infrastructure/api
 * @description Configuración centralizada de la API.
 * Define constantes y configuraciones de red.
 */

/**
 * URL base de la API - se obtiene de variables de entorno
 */
export const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000';

/**
 * Configuración de la API
 */
export const apiConfig = {
  baseURL: API_BASE_URL,
  timeout: 15000, // 15 segundos
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
} as const;

/**
 * Endpoints de la API organizados por feature
 */
export const API_ENDPOINTS = {
  // Auth
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/users',
    REFRESH: '/auth/refresh',
  },
  // Users
  USERS: {
    BASE: '/users',
    BY_ID: (id: string) => `/users/${id}`,
  },
  // Discounts
  DISCOUNTS: {
    BASE: '/discounts',
    BY_ID: (id: string) => `/discounts/${id}`,
    NEARBY: '/discounts/nearby',
  },
  // Health
  HEALTH: '/health',
} as const;

/**
 * Códigos de error conocidos de la API
 */
export const API_ERROR_CODES = {
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  VALIDATION_ERROR: 422,
  SERVER_ERROR: 500,
} as const;

export type ApiErrorCode = typeof API_ERROR_CODES[keyof typeof API_ERROR_CODES];
