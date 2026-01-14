/**
 * @module discounts/presentation/hooks
 * @description Custom hooks para la feature de descuentos.
 * Encapsulan la lógica de TanStack Query para consumir datos.
 */
import { useQuery, useQueryClient } from '@tanstack/react-query';
import type { Discount, DiscountFilters, Location } from '../../domain';
import { createDiscountRepository } from '../../data';
import { httpClient } from '../../../../infrastructure/api/http-client';

/**
 * Query keys para invalidación y cache
 */
export const discountQueryKeys = {
  all: ['discounts'] as const,
  lists: () => [...discountQueryKeys.all, 'list'] as const,
  list: (filters?: DiscountFilters) => [...discountQueryKeys.lists(), filters] as const,
  details: () => [...discountQueryKeys.all, 'detail'] as const,
  detail: (id: string) => [...discountQueryKeys.details(), id] as const,
  nearby: (location: Location, radius: number) => 
    [...discountQueryKeys.all, 'nearby', location, radius] as const,
} as const;

// Instancia del repositorio (singleton para reutilización)
const discountRepository = createDiscountRepository(httpClient);

/**
 * Hook para obtener lista de descuentos
 * @param filters - Filtros opcionales
 * @returns Query result con lista de descuentos
 * 
 * @example
 * ```tsx
 * const { data, isLoading, error } = useDiscounts({ onlyActive: true });
 * ```
 */
export const useDiscounts = (filters?: DiscountFilters) => {
  return useQuery<Discount[], Error>({
    queryKey: discountQueryKeys.list(filters),
    queryFn: () => discountRepository.getAll(filters),
    staleTime: 5 * 60 * 1000, // 5 minutos
    gcTime: 10 * 60 * 1000, // 10 minutos (antes cacheTime)
  });
};

/**
 * Hook para obtener un descuento por ID
 * @param id - ID del descuento
 * @returns Query result con el descuento o null
 * 
 * @example
 * ```tsx
 * const { data: discount, isLoading } = useDiscount('uuid-here');
 * ```
 */
export const useDiscount = (id: string) => {
  return useQuery<Discount | null, Error>({
    queryKey: discountQueryKeys.detail(id),
    queryFn: () => discountRepository.getById(id),
    enabled: Boolean(id), // Solo ejecutar si hay ID
    staleTime: 5 * 60 * 1000,
  });
};

/**
 * Hook para obtener descuentos cercanos a una ubicación
 * @param location - Coordenadas de ubicación
 * @param radiusInKm - Radio de búsqueda en kilómetros
 * @returns Query result con descuentos cercanos
 * 
 * @example
 * ```tsx
 * const { data: nearbyDiscounts } = useNearbyDiscounts(
 *   { latitude: -34.6037, longitude: -58.3816 },
 *   5 // 5 km
 * );
 * ```
 */
export const useNearbyDiscounts = (
  location: Location | null, 
  radiusInKm: number = 10
) => {
  return useQuery<Discount[], Error>({
    queryKey: location 
      ? discountQueryKeys.nearby(location, radiusInKm) 
      : ['discounts', 'nearby', 'disabled'],
    queryFn: () => {
      if (!location) throw new Error('Location required');
      return discountRepository.getNearby(location, radiusInKm);
    },
    enabled: Boolean(location), // Solo ejecutar si hay ubicación
    staleTime: 2 * 60 * 1000, // 2 minutos (datos de ubicación cambian más)
  });
};

/**
 * Hook para prefetch de descuentos (optimización)
 * @returns Función para prefetch manual
 */
export const usePrefetchDiscounts = () => {
  const queryClient = useQueryClient();

  const prefetchDiscounts = async (filters?: DiscountFilters) => {
    await queryClient.prefetchQuery({
      queryKey: discountQueryKeys.list(filters),
      queryFn: () => discountRepository.getAll(filters),
      staleTime: 5 * 60 * 1000,
    });
  };

  return { prefetchDiscounts };
};
