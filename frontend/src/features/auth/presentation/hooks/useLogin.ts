/**
 * @module features/auth/presentation/hooks
 * @description Hook para manejar el login con React Query
 */
import { useMutation } from '@tanstack/react-query';
import { authRepository } from '../../data/repositories';
import type { LoginCredentials, AuthResponse } from '../../domain/interfaces';
import { useAuthStore } from '../store';
import { ApiError } from '@/infrastructure/api';

interface UseLoginOptions {
  onSuccess?: (data: AuthResponse) => void;
  onError?: (error: ApiError) => void;
}

/**
 * Hook para realizar el login del usuario
 * Utiliza React Query para manejar el estado de la mutación
 */
export const useLogin = (options?: UseLoginOptions) => {
  const mutation = useMutation<AuthResponse, ApiError, LoginCredentials>({
    mutationFn: (credentials) => authRepository.login(credentials),
    onSuccess: (data) => {
      useAuthStore.getState().login(data.token);
      options?.onSuccess?.(data);
    },
    onError: (error) => {
      options?.onError?.(error);
    },
  });

  return {
    login: mutation.mutate,
    loginAsync: mutation.mutateAsync,
    isLoading: mutation.isPending,
    error: mutation.error,
    isError: mutation.isError,
    isSuccess: mutation.isSuccess,
    reset: mutation.reset,
  };
};
