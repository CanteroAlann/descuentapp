/**
 * @module discounts/domain
 * @description Interfaces puras del dominio para la feature de descuentos.
 * Estas interfaces representan los contratos que la UI necesita, 
 * independientes de la implementación de la API.
 */

/**
 * Coordenadas geográficas para ubicación de descuentos
 */
export interface Location {
  latitude: number;
  longitude: number;
}

/**
 * Entidad de dominio Discount - representa un descuento en la UI
 * Es inmutable y contiene solo datos limpios necesarios para la presentación
 */
export interface Discount {
  readonly id: string;
  readonly title: string;
  readonly description: string;
  readonly discountPercentage: number;
  readonly storeName: string;
  readonly validUntil: Date;
  readonly isActive: boolean;
  readonly location?: Location;
}

/**
 * Filtros para búsqueda de descuentos
 */
export interface DiscountFilters {
  readonly nearLocation?: Location;
  readonly radiusInKm?: number;
  readonly storeNameContains?: string;
  readonly minDiscountPercentage?: number;
  readonly onlyActive?: boolean;
}

/**
 * Resultado paginado de descuentos
 */
export interface PaginatedDiscounts {
  readonly data: Discount[];
  readonly total: number;
  readonly page: number;
  readonly pageSize: number;
  readonly hasMore: boolean;
}

/**
 * Contrato del repositorio de descuentos
 * Define las operaciones disponibles sin importar la implementación
 */
export interface IDiscountRepository {
  getAll(filters?: DiscountFilters): Promise<Discount[]>;
  getById(id: string): Promise<Discount | null>;
  getNearby(location: Location, radiusInKm: number): Promise<Discount[]>;
}
