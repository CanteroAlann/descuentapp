/**
 * Configuración de Jest para el proyecto React Native con Expo + pnpm workspaces
 * @see https://docs.expo.dev/develop/unit-testing/
 */
const path = require('path');

module.exports = {
  // Usar preset de jest-expo
  preset: 'jest-expo',
  
  // Extensiones de archivos
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json'],
  
  // Alias de módulos (igual que tsconfig)
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '^@features/(.*)$': '<rootDir>/src/features/$1',
    '^@shared/(.*)$': '<rootDir>/src/shared/$1',
    '^@infrastructure/(.*)$': '<rootDir>/src/infrastructure/$1',
  },
  
  // Archivos de setup
  setupFilesAfterEnv: [
    '<rootDir>/jest.setup.js',
  ],
  
  // Patrón de archivos de test
  testMatch: [
    '**/__tests__/**/*.[jt]s?(x)',
    '**/?(*.)+(spec|test).[jt]s?(x)',
  ],
  
  // Directorios a ignorar
  testPathIgnorePatterns: [
    '/node_modules/',
    '/android/',
    '/ios/',
  ],
  
  // Configuración específica para pnpm workspaces
  // Resolver node_modules tanto en el paquete como en la raíz del workspace
  moduleDirectories: [
    'node_modules',
    path.join(__dirname, 'node_modules'),
    path.join(__dirname, '..', 'node_modules'),
  ],
  
  // Transformar módulos ESM - incluir pnpm flat structure
  transformIgnorePatterns: [
    // Transformar todo excepto los paquetes específicos
    '<rootDir>/../../node_modules/(?!((jest-)?react-native|@react-native|expo|@expo|@unimodules|unimodules|native-base|react-native-svg|@tanstack|zustand|zod|axios)/)',
  ],
  
  // Cobertura de código
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/**/*.d.ts',
    '!src/**/index.ts',
    '!src/**/*.stories.{ts,tsx}',
  ],
  
  // Tiempo máximo por test
  testTimeout: 10000,
  
  // Variables globales
  globals: {
    __DEV__: true,
  },
  
  // Limpiar mocks automáticamente entre tests
  clearMocks: true,
  
  // Restaurar mocks automáticamente
  restoreMocks: true,
  
  // Forzar salida después de los tests (evita el warning de operaciones pendientes)
  forceExit: true,
};
