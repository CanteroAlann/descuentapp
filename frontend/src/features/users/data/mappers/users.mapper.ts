// /**
//  * @module discounts/data/mappers
//  * @description Mappers para transformar DTOs de la API a entidades del dominio.
//  * Separa la representación externa (API) de la interna (UI).
//  */
// import type { Discount, Location } from '../../domain';
// import type { DiscountDTO } from '../schemas/discount.schema';

// /**
//  * Mapea un DTO de descuento de la API a la entidad de dominio
//  * @param dto - Objeto DTO validado desde la API
//  * @returns Entidad Discount lista para usar en la UI
//  */
// export const mapDiscountDTOToDomain = (dto: DiscountDTO): Discount => {
//   // Construir ubicación solo si hay coordenadas válidas
//   const location: Location | undefined = 
//     dto.latitude !== null && 
//     dto.latitude !== undefined && 
//     dto.longitude !== null && 
//     dto.longitude !== undefined
//       ? { latitude: dto.latitude, longitude: dto.longitude }
//       : undefined;

//   return {
//     id: dto.id,
//     title: dto.title,
//     description: dto.description,
//     discountPercentage: dto.discountPercentage,
//     storeName: dto.storeName,
//     validUntil: new Date(dto.validUntil), // Convertir string ISO a Date
//     isActive: dto.isActive,
//     location,
//   };
// };

// /**
//  * Mapea un array de DTOs a entidades de dominio
//  * @param dtos - Array de DTOs validados
//  * @returns Array de entidades Discount
//  */
// export const mapDiscountsDTOToDomain = (dtos: DiscountDTO[]): Discount[] => {
//   return dtos.map(mapDiscountDTOToDomain);
// };
