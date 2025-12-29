export type Discount = Readonly<{
  id: string;
  title: string;
  description: string;
  discountPercentage: number;
  storeName: string;
  validUntil: Date;
  isActive: boolean;
}>;

export type CreateDiscountParams = Readonly<Discount>;

export const createDiscount = (params: CreateDiscountParams): Discount => ({ ...params });

export const isDiscountValid = (discount: Discount, now: Date = new Date()): boolean =>
  discount.isActive && discount.validUntil > now;
