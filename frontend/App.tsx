/**
 * @module App
 * @description Punto de entrada de la aplicación DescuentApp.
 * Configura providers globales: QueryClient, SafeArea, Navigation.
 */
import './global.css';
import React, { createContext, useContext, useState, useEffect } from 'react';
import { View, useColorScheme } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { QueryClientProvider } from '@tanstack/react-query';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { queryClient } from './src/infrastructure/query/query-client';
import { DiscountsScreen } from './src/features/discounts';
import { RegisterScreen } from './src/features/users';

// ============================================================================
// Theme Context
// ============================================================================

type ThemeMode = 'light' | 'dark' | 'system';

interface ThemeContextType {
  mode: ThemeMode;
  isDark: boolean;
  setMode: (mode: ThemeMode) => void;
  toggle: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
};

interface ThemeProviderProps {
  children: React.ReactNode;
}

const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const systemColorScheme = useColorScheme();
  const [mode, setMode] = useState<ThemeMode>('system');

  const isDark =
    mode === 'dark' || (mode === 'system' && systemColorScheme === 'dark');

  const toggle = () => {
    setMode((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  return (
    <ThemeContext.Provider value={{ mode, isDark, setMode, toggle }}>
      <View className={`flex-1 bg-background ${isDark ? 'dark' : ''}`}>
        {children}
      </View>
    </ThemeContext.Provider>
  );
};

// ============================================================================
// App
// ============================================================================

/**
 * Componente raíz de la aplicación
 * Envuelve la app con los providers necesarios:
 * - SafeAreaProvider: Manejo de áreas seguras (notch, home indicator)
 * - QueryClientProvider: TanStack Query para server state
 * - ThemeProvider: Soporte de modo claro/oscuro
 */
export default function App() {
  return (
    <SafeAreaProvider>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider>
          <RegisterScreen />
          <StatusBar style="auto" />
        </ThemeProvider>
      </QueryClientProvider>
    </SafeAreaProvider>
  );
}
