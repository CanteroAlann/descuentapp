/**
 * @module discounts
 * @description Public API de la feature de descuentos
 * Exporta todo lo necesario para usar esta feature desde fuera.
 */

// Domain
export * from './domain';

// Data (solo lo necesario para configuración/testing)
export { createDiscountRepository } from './data';

// Presentation
export * from './presentation';
