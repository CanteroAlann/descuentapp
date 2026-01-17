/**
 * @module features/auth/presentation/screens
 * @description Pantalla de inicio de sesión
 */
import React, { useState, useCallback } from 'react';
import { 
  View, 
  Text, 
  KeyboardAvoidingView, 
  Platform,
  ScrollView,
  Alert,
} from 'react-native';
import { Card, Button, Input } from '@/shared/components/ui';
import { useLogin } from '../hooks/useLogin';
import { loginCredentialsSchema } from '../../data/schemas';
import { ZodError } from 'zod';

interface FormErrors {
  email?: string;
  password?: string;
}

/**
 * Pantalla de Login
 * Permite al usuario iniciar sesión con email y contraseña
 */
export const LoginScreen: React.FC = () => {
  // Estado del formulario
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [formErrors, setFormErrors] = useState<FormErrors>({});

  // Hook de login conectado al backend
  const { login, isLoading, error, reset } = useLogin({
    onSuccess: (data) => {
      Alert.alert(
        '¡Bienvenido!', 
        'Has iniciado sesión correctamente.',
        [{ text: 'OK' }]
      );
      // TODO: Navegar a la pantalla principal
      // navigation.navigate('Home');
      console.log('Token recibido:', data.token);
    },
    onError: (error) => {
      Alert.alert(
        'Error de autenticación',
        error.message || 'No se pudo iniciar sesión. Verifica tus credenciales.',
        [{ text: 'OK' }]
      );
    },
  });

  /**
   * Valida los campos del formulario
   */
  const validateForm = useCallback((): boolean => {
    try {
      loginCredentialsSchema.parse({ email, password });
      setFormErrors({});
      return true;
    } catch (err) {
      if (err instanceof ZodError) {
        const errors: FormErrors = {};
        err.issues.forEach((issue) => {
          const field = issue.path[0] as keyof FormErrors;
          errors[field] = issue.message;
        });
        setFormErrors(errors);
      }
      return false;
    }
  }, [email, password]);

  /**
   * Maneja el envío del formulario
   */
  const handleLogin = useCallback(() => {
    // Limpiar errores previos del servidor
    reset();

    // Validar formulario
    if (!validateForm()) {
      return;
    }

    // Ejecutar login
    login({ email, password });
  }, [email, password, login, validateForm, reset]);

  /**
   * Limpia el error de un campo al escribir
   */
  const handleEmailChange = useCallback((text: string) => {
    setEmail(text);
    if (formErrors.email) {
      setFormErrors(prev => ({ ...prev, email: undefined }));
    }
  }, [formErrors.email]);

  const handlePasswordChange = useCallback((text: string) => {
    setPassword(text);
    if (formErrors.password) {
      setFormErrors(prev => ({ ...prev, password: undefined }));
    }
  }, [formErrors.password]);

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      className="flex-1 bg-background"
    >
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps="handled"
      >
        <View className="flex-1 justify-center items-center px-6 py-12">
          {/* Header */}
          <View className="items-center mb-8">
            <Text className="text-4xl mb-2">🔐</Text>
            <Text className="text-foreground text-2xl font-bold">
              Iniciar Sesión
            </Text>
            <Text className="text-muted text-center mt-2">
              Ingresa tus credenciales para continuar
            </Text>
          </View>

          {/* Formulario */}
          <Card 
            style={{ width: '100%', maxWidth: 400 }}
            testID="login-card"
          >
            <View className="gap-4">
              {/* Email Input */}
              <Input
                label="Correo electrónico"
                placeholder="tu@email.com"
                value={email}
                onChangeText={handleEmailChange}
                error={formErrors.email}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                autoComplete="email"
                textContentType="emailAddress"
                editable={!isLoading}
                testID="email-input"
              />

              {/* Password Input */}
              <Input
                label="Contraseña"
                placeholder="••••••••"
                value={password}
                onChangeText={handlePasswordChange}
                error={formErrors.password}
                secureTextEntry
                autoCapitalize="none"
                autoCorrect={false}
                autoComplete="password"
                textContentType="password"
                editable={!isLoading}
                testID="password-input"
              />

              {/* Error del servidor */}
              {error && (
                <View className="bg-red-50 border border-red-200 rounded-xl p-3">
                  <Text className="text-red-600 text-sm text-center">
                    {error.message}
                  </Text>
                </View>
              )}

              {/* Botón de Login */}
              <Button
                title="Iniciar Sesión"
                onPress={handleLogin}
                loading={isLoading}
                disabled={isLoading}
                size="lg"
                testID="login-button"
                style={{ marginTop: 8 }}
              />

              {/* Link de registro */}
              <View className="flex-row justify-center mt-4">
                <Text className="text-muted">
                  ¿No tienes cuenta?{' '}
                </Text>
                <Text 
                  className="text-primary font-semibold"
                  // TODO: Implementar navegación a registro
                  // onPress={() => navigation.navigate('Register')}
                >
                  Regístrate
                </Text>
              </View>
            </View>
          </Card>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};
