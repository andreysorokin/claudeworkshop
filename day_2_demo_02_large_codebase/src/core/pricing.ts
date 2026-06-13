import { CartItem, cartTotal } from './cart';

export const VAT_RATE = 0.2;

export function calculateTotal(items: CartItem[]): number {
  return cartTotal(items);
}

export function calculateVat(subtotal: number): number {
  return Math.round(subtotal * VAT_RATE * 100) / 100;
}

export function applyDiscount(total: number, discountPercent: number): number {
  if (discountPercent < 0 || discountPercent > 100) {
    throw new Error(`Invalid discount: ${discountPercent}`);
  }
  return Math.round(total * (1 - discountPercent / 100) * 100) / 100;
}

export function formatPrice(amount: number): string {
  return `£${amount.toFixed(2)}`;
}
