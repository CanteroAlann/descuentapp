/**
 * @module App
 * @description Punto de entrada de la aplicación DescuentApp.
 * Configura providers globales: QueryClient, SafeArea, Navigation.
 */
import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { QueryClientProvider } from '@tanstack/react-query';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { queryClient } from './src/infrastructure/query/query-client';
import { DiscountsScreen } from './src/features/discounts';

/**
 * Componente raíz de la aplicación
 * Envuelve la app con los providers necesarios:
 * - SafeAreaProvider: Manejo de áreas seguras (notch, home indicator)
 * - QueryClientProvider: TanStack Query para server state
 */
export default function App() {
  return (
    <SafeAreaProvider>
      <QueryClientProvider client={queryClient}>
        <DiscountsScreen />
        <StatusBar style="auto" />
      </QueryClientProvider>
    </SafeAreaProvider>
  );
}
