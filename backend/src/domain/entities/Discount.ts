
export class Discount {
  constructor(
    public readonly id: string,
    public readonly title: string,
    public readonly description: string,
    public readonly discountPercentage: number,
    public readonly storeName: string,
    public readonly validUntil: Date,
    public readonly isActive: boolean
  ) {}

  // Domain logic
  isValid(): boolean {
    return this.isActive && this.validUntil > new Date();
  }
}
