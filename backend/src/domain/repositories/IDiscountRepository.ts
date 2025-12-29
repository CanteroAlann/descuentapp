import type { Discount } from '../entities/Discount';
import type { Location } from '../value-objects/Location';

export interface IDiscountRepository {
  findNearby(location: Location, radiusInKm: number): Promise<Discount[]>;
}
