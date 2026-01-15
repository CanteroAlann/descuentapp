/**
 * @module users/presentation/components
 * @description Formulario de registro de usuarios.
 * Permite crear un nuevo usuario con validación de campos.
 */
import React, { useState } from 'react';
import { View, Text, TextInput, Alert } from 'react-native';
import { Button } from '../../../../shared/components/ui';
import { useCreateUser } from '../hooks/use-users';
import type { CreateUserInput } from '../../domain';

interface RegisterFormProps {
  onSuccess?: (email: string) => void;
  onCancel?: () => void;
  testID?: string;
}

/**
 * Componente RegisterForm - Formulario para crear nuevos usuarios
 * 
 * @example
 * ```tsx
 * <RegisterForm 
 *   onSuccess={(email) => console.log('Usuario creado:', email)}
 *   onCancel={() => navigation.goBack()}
 * />
 * ```
 */
export const RegisterForm: React.FC<RegisterFormProps> = ({
  onSuccess,
  onCancel,
  testID = 'register-form',
}) => {
  const [formData, setFormData] = useState<CreateUserInput>({
    fullName: '',
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState<Partial<CreateUserInput>>({});
  
  const createUser = useCreateUser();

  /**
   * Valida los campos del formulario
   */
  const validateForm = (): boolean => {
    const newErrors: Partial<CreateUserInput> = {};

    // Validar nombre
    if (!formData.fullName.trim()) {
      newErrors.fullName = 'El nombre es requerido';
    } else if (formData.fullName.trim().length < 3) {
      newErrors.fullName = 'El nombre debe tener al menos 3 caracteres';
    }

    // Validar email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      newErrors.email = 'El email es requerido';
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Email inválido';
    }

    // Validar password
    if (!formData.password) {
      newErrors.password = 'La contraseña es requerida';
    } else if (formData.password.length < 6) {
      newErrors.password = 'La contraseña debe tener al menos 6 caracteres';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /**
   * Maneja el envío del formulario
   */
  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      const user = await createUser.mutateAsync(formData);
      Alert.alert(
        'Éxito',
        `Usuario ${user.fullName} creado correctamente`,
        [{ text: 'OK', onPress: () => onSuccess?.(user.email) }]
      );
      
      // Limpiar formulario
      setFormData({ fullName: '', email: '', password: '' });
      setErrors({});
    } catch (error: any) {
      const errorMessage = error.message || 'Error al crear el usuario';
      Alert.alert('Error', errorMessage);
    }
  };

  return (
    <View testID={testID} className="w-full px-6">
      {/* Campo: Nombre Completo */}
      <View className="mb-4">
        <Text className="text-foreground font-medium mb-2">
          Nombre Completo
        </Text>
        <TextInput
          testID={`${testID}-fullname-input`}
          className={`
            border rounded-xl px-4 py-3 text-base bg-input text-foreground
            ${errors.fullName ? 'border-red-500' : 'border-border'}
          `}
          placeholder="Ej: Juan Pérez"
          value={formData.fullName}
          onChangeText={(text) => {
            setFormData({ ...formData, fullName: text });
            if (errors.fullName) {
              setErrors({ ...errors, fullName: undefined });
            }
          }}
          autoCapitalize="words"
          editable={!createUser.isPending}
        />
        {errors.fullName && (
          <Text className="text-red-500 text-sm mt-1">
            {errors.fullName}
          </Text>
        )}
      </View>

      {/* Campo: Email */}
      <View className="mb-4">
        <Text className="text-foreground font-medium mb-2">
          Email
        </Text>
        <TextInput
          testID={`${testID}-email-input`}
          className={`
            border rounded-xl px-4 py-3 text-base bg-input text-foreground
            ${errors.email ? 'border-red-500' : 'border-border'}
          `}
          placeholder="ejemplo@email.com"
          value={formData.email}
          onChangeText={(text) => {
            setFormData({ ...formData, email: text });
            if (errors.email) {
              setErrors({ ...errors, email: undefined });
            }
          }}
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
          editable={!createUser.isPending}
        />
        {errors.email && (
          <Text className="text-red-500 text-sm mt-1">
            {errors.email}
          </Text>
        )}
      </View>

      {/* Campo: Contraseña */}
      <View className="mb-6">
        <Text className="text-foreground font-medium mb-2">
          Contraseña
        </Text>
        <TextInput
          testID={`${testID}-password-input`}
          className={`
            border rounded-xl px-4 py-3 text-base bg-input text-foreground
            ${errors.password ? 'border-red-500' : 'border-border'}
          `}
          placeholder="Mínimo 6 caracteres"
          value={formData.password}
          onChangeText={(text) => {
            setFormData({ ...formData, password: text });
            if (errors.password) {
              setErrors({ ...errors, password: undefined });
            }
          }}
          secureTextEntry
          autoCapitalize="none"
          autoCorrect={false}
          editable={!createUser.isPending}
        />
        {errors.password && (
          <Text className="text-red-500 text-sm mt-1">
            {errors.password}
          </Text>
        )}
      </View>

      {/* Botones de acción */}
      <View className="gap-3">
        <Button
          testID={`${testID}-submit-button`}
          title="Crear Usuario"
          onPress={handleSubmit}
          variant="primary"
          size="lg"
          loading={createUser.isPending}
          disabled={createUser.isPending}
        />
        
        {onCancel && (
          <Button
            testID={`${testID}-cancel-button`}
            title="Cancelar"
            onPress={onCancel}
            variant="ghost"
            size="lg"
            disabled={createUser.isPending}
          />
        )}
      </View>
    </View>
  );
};
