/**
 * @module users/presentation/hooks
 * @description Custom hooks para la feature de usuarios.
 * Encapsulan la lógica de TanStack Query para consumir datos.
 */
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { User, CreateUserInput } from '../../domain';
import { createUserRepository } from '../../data';
import { httpClient } from '../../../../infrastructure/api/http-client';

/**
 * Query keys para invalidación y cache
 */
export const userQueryKeys = {
  all: ['users'] as const,
  lists: () => [...userQueryKeys.all, 'list'] as const,
  list: () => [...userQueryKeys.lists()] as const,
  details: () => [...userQueryKeys.all, 'detail'] as const,
  detail: (email: string) => [...userQueryKeys.details(), email] as const,
} as const;

// Instancia del repositorio (singleton para reutilización)
const userRepository = createUserRepository(httpClient);

/**
 * Hook para obtener lista de usuarios
 * @returns Query result con lista de usuarios
 * 
 * @example
 * ```tsx
 * const { data, isLoading, error } = useUsers();
 * ```
 */
export const useUsers = () => {
  return useQuery<User[], Error>({
    queryKey: userQueryKeys.list(),
    queryFn: () => userRepository.getAll(),
    staleTime: 5 * 60 * 1000, // 5 minutos
    gcTime: 10 * 60 * 1000, // 10 minutos
  });
};

/**
 * Hook para obtener un usuario por email
 * @param email - Email del usuario
 * @returns Query result con el usuario o null
 * 
 * @example
 * ```tsx
 * const { data: user, isLoading } = useUser('email@example.com');
 * ```
 */
export const useUser = (email: string) => {
  return useQuery<User | null, Error>({
    queryKey: userQueryKeys.detail(email),
    queryFn: () => userRepository.getByEmail(email),
    enabled: Boolean(email), // Solo ejecutar si hay email
    staleTime: 5 * 60 * 1000,
  });
};

/**
 * Hook para crear un nuevo usuario
 * @returns Mutation result con función para crear usuario
 * 
 * @example
 * ```tsx
 * const createUser = useCreateUser();
 * 
 * const handleSubmit = async (data: CreateUserInput) => {
 *   try {
 *     const user = await createUser.mutateAsync(data);
 *     console.log('Usuario creado:', user);
 *   } catch (error) {
 *     console.error('Error:', error);
 *   }
 * };
 * ```
 */
export const useCreateUser = () => {
  const queryClient = useQueryClient();

  return useMutation<User, Error, CreateUserInput>({
    mutationFn: (userInput: CreateUserInput) => userRepository.create(userInput),
    onSuccess: (newUser) => {
      // Invalidar la lista de usuarios para refrescar
      queryClient.invalidateQueries({ queryKey: userQueryKeys.lists() });
      
      // Actualizar el cache del usuario específico
      queryClient.setQueryData(
        userQueryKeys.detail(newUser.email),
        newUser
      );
    },
  });
};
