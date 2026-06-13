import { calculateTotal, calculateVat, applyDiscount, formatPrice } from '../../src/core/pricing';
import { CartItem } from '../../src/core/cart';

const ITEMS: CartItem[] = [
  { productId: 'PROD-001', quantity: 2, unitPrice: 10.00 },
  { productId: 'PROD-002', quantity: 1, unitPrice: 5.00 },
];

describe('calculateTotal', () => {
  test('returns sum of quantity × price', () => {
    expect(calculateTotal(ITEMS)).toBe(25);
  });

  test('returns 0 for empty items', () => {
    expect(calculateTotal([])).toBe(0);
  });
});

describe('calculateVat', () => {
  test('applies 20% VAT', () => {
    expect(calculateVat(100)).toBe(20);
  });
});

describe('applyDiscount', () => {
  test('applies 10% discount', () => {
    expect(applyDiscount(100, 10)).toBe(90);
  });

  test('throws for discount outside 0–100', () => {
    expect(() => applyDiscount(100, -1)).toThrow();
    expect(() => applyDiscount(100, 101)).toThrow();
  });
});

describe('formatPrice', () => {
  test('formats with £ and 2 decimal places', () => {
    expect(formatPrice(9.5)).toBe('£9.50');
  });
});
