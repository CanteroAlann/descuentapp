/**
 * @module discounts/tests
 * @description Datos de prueba (fixtures) para tests de descuentos
 */
import type { Discount } from '../domain';
import type { DiscountDTO } from '../data/schemas/discount.schema';

/**
 * DTO de descuento válido para tests
 */
export const validDiscountDTO: DiscountDTO = {
  id: '550e8400-e29b-41d4-a716-446655440000',
  title: '50% en Pizza',
  description: 'Descuento en todas las pizzas grandes los fines de semana',
  discountPercentage: 50,
  storeName: 'Pizza Palace',
  validUntil: '2025-12-31T23:59:59.000Z',
  isActive: true,
  latitude: -34.6037,
  longitude: -58.3816,
};

/**
 * Array de DTOs para tests de lista
 */
export const discountsDTOList: DiscountDTO[] = [
  validDiscountDTO,
  {
    id: '550e8400-e29b-41d4-a716-446655440001',
    title: '30% en Hamburguesas',
    description: 'Válido solo los martes',
    discountPercentage: 30,
    storeName: 'Burger House',
    validUntil: '2025-06-30T23:59:59.000Z',
    isActive: true,
    latitude: null,
    longitude: null,
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440002',
    title: '20% en Café',
    description: 'Café de especialidad con descuento',
    discountPercentage: 20,
    storeName: 'Coffee Lab',
    validUntil: '2025-03-15T23:59:59.000Z',
    isActive: false,
    latitude: -34.5875,
    longitude: -58.3772,
  },
];

/**
 * Entidad de dominio Discount para tests de componentes
 */
export const mockDiscount: Discount = {
  id: '550e8400-e29b-41d4-a716-446655440000',
  title: '50% en Pizza',
  description: 'Descuento en todas las pizzas grandes los fines de semana',
  discountPercentage: 50,
  storeName: 'Pizza Palace',
  validUntil: new Date('2025-12-31T23:59:59.000Z'),
  isActive: true,
  location: {
    latitude: -34.6037,
    longitude: -58.3816,
  },
};

/**
 * Lista de descuentos de dominio para tests
 */
export const mockDiscountsList: Discount[] = [
  mockDiscount,
  {
    id: '550e8400-e29b-41d4-a716-446655440001',
    title: '30% en Hamburguesas',
    description: 'Válido solo los martes',
    discountPercentage: 30,
    storeName: 'Burger House',
    validUntil: new Date('2025-06-30T23:59:59.000Z'),
    isActive: true,
    location: undefined,
  },
];

/**
 * Descuento expirado para tests
 */
export const expiredDiscount: Discount = {
  ...mockDiscount,
  id: '550e8400-e29b-41d4-a716-446655440099',
  title: 'Descuento Expirado',
  validUntil: new Date('2024-01-01T00:00:00.000Z'),
  isActive: false,
};

/**
 * Descuento próximo a vencer para tests
 */
export const expiringSoonDiscount: Discount = {
  ...mockDiscount,
  id: '550e8400-e29b-41d4-a716-446655440098',
  title: 'Por Vencer',
  validUntil: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // 2 días
};

/**
 * Factory para crear descuentos de prueba personalizados
 */
export const createMockDiscount = (overrides: Partial<Discount> = {}): Discount => ({
  ...mockDiscount,
  id: `mock-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
  ...overrides,
});

/**
 * Factory para crear DTOs de prueba personalizados
 */
export const createMockDiscountDTO = (overrides: Partial<DiscountDTO> = {}): DiscountDTO => ({
  ...validDiscountDTO,
  id: `550e8400-e29b-41d4-a716-${Date.now().toString(16).padStart(12, '0')}`,
  ...overrides,
});
