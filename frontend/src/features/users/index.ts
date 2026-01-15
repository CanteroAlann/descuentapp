/**
 * @module users
 * @description Public API de la feature de usuarios
 * Exporta todo lo necesario para usar esta feature desde fuera.
 */

// Domain
export * from './domain';

// Data (solo lo necesario para configuración/testing)
export { createUserRepository } from './data';

// Presentation
export * from './presentation';
