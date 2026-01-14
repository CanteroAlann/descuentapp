/**
 * @module discounts/data/repositories
 * @description Implementación del repositorio de descuentos.
 * Conecta con la API, valida respuestas con Zod y mapea al dominio.
 */
import type { AxiosInstance } from 'axios';
import { 
  type Discount, 
  type DiscountFilters, 
  type IDiscountRepository, 
  type Location 
} from '../../domain';
import { DiscountDTOSchema, DiscountsArraySchema } from '../schemas/discount.schema';
import { mapDiscountDTOToDomain, mapDiscountsDTOToDomain } from '../mappers/discount.mapper';

/**
 * Endpoints de la API de descuentos
 */
const ENDPOINTS = {
  BASE: '/discounts',
  BY_ID: (id: string) => `/discounts/${id}`,
  NEARBY: '/discounts/nearby',
} as const;

/**
 * Crea una instancia del repositorio de descuentos
 * @param httpClient - Cliente HTTP (Axios) configurado
 * @returns Implementación de IDiscountRepository
 */
export const createDiscountRepository = (
  httpClient: AxiosInstance
): IDiscountRepository => {
  return {
    /**
     * Obtiene todos los descuentos, opcionalmente filtrados
     */
    async getAll(filters?: DiscountFilters): Promise<Discount[]> {
      const params = new URLSearchParams();
      
      if (filters?.onlyActive !== undefined) {
        params.append('onlyActive', String(filters.onlyActive));
      }
      if (filters?.minDiscountPercentage !== undefined) {
        params.append('minDiscount', String(filters.minDiscountPercentage));
      }
      if (filters?.storeNameContains) {
        params.append('store', filters.storeNameContains);
      }

      const queryString = params.toString();
      const url = queryString 
        ? `${ENDPOINTS.BASE}?${queryString}` 
        : ENDPOINTS.BASE;

      const response = await httpClient.get(url);
      
      // Validar respuesta con Zod
      const validatedData = DiscountsArraySchema.parse(response.data);
      
      // Mapear a entidades de dominio
      return mapDiscountsDTOToDomain(validatedData);
    },

    /**
     * Obtiene un descuento por su ID
     */
    async getById(id: string): Promise<Discount | null> {
      try {
        const response = await httpClient.get(ENDPOINTS.BY_ID(id));
        
        // Validar respuesta con Zod
        const validatedData = DiscountDTOSchema.parse(response.data);
        
        return mapDiscountDTOToDomain(validatedData);
      } catch (error: unknown) {
        // Si es 404, retornar null
        if (
          error && 
          typeof error === 'object' && 
          'response' in error && 
          error.response && 
          typeof error.response === 'object' && 
          'status' in error.response && 
          error.response.status === 404
        ) {
          return null;
        }
        throw error;
      }
    },

    /**
     * Obtiene descuentos cercanos a una ubicación
     */
    async getNearby(location: Location, radiusInKm: number): Promise<Discount[]> {
      const params = new URLSearchParams({
        lat: String(location.latitude),
        lng: String(location.longitude),
        radius: String(radiusInKm),
      });

      const response = await httpClient.get(
        `${ENDPOINTS.NEARBY}?${params.toString()}`
      );
      
      // Validar respuesta con Zod
      const validatedData = DiscountsArraySchema.parse(response.data);
      
      return mapDiscountsDTOToDomain(validatedData);
    },
  };
};
