/**
 * @module users/presentation/screens
 * @description Pantalla de registro de usuarios.
 * Permite crear una nueva cuenta de usuario.
 */
import React from 'react';
import { View, Text, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { RegisterForm } from '../components/RegisterForm';

interface RegisterScreenProps {
  onSuccess?: (email: string) => void;
  onCancel?: () => void;
}

/**
 * Header de la pantalla de registro
 */
const RegisterHeader: React.FC = () => (
  <View className="px-6 pb-6">
    <Text className="text-3xl font-bold text-foreground mb-2">
      Crear Cuenta
    </Text>
    <Text className="text-muted text-base">
      Completa el formulario para registrarte
    </Text>
  </View>
);

/**
 * Pantalla RegisterScreen - Registro de nuevos usuarios
 * 
 * @example
 * ```tsx
 * // En el navigator
 * <Stack.Screen 
 *   name="Register" 
 *   component={RegisterScreen}
 *   options={{ headerShown: false }}
 * />
 * ```
 * 
 * @example
 * ```tsx
 * // Con navegación
 * <RegisterScreen 
 *   onSuccess={(email) => {
 *     navigation.navigate('Login', { email });
 *   }}
 *   onCancel={() => navigation.goBack()}
 * />
 * ```
 */
export const RegisterScreen: React.FC<RegisterScreenProps> = ({
  onSuccess,
  onCancel,
}) => {
  const handleSuccess = (email: string) => {
    console.log('Usuario registrado con email:', email);
    onSuccess?.(email);
  };

  const handleCancel = () => {
    console.log('Registro cancelado');
    onCancel?.();
  };

  return (
    <SafeAreaView className="flex-1 bg-background" edges={['top']}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
      >
        <ScrollView
          className="flex-1"
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View className="flex-1 justify-center py-8">
            <RegisterHeader />
            <RegisterForm 
              onSuccess={handleSuccess}
              onCancel={handleCancel}
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};
