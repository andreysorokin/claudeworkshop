import { describe, it, expect } from 'vitest';
import { calculateCartTotal, isValidCartItem, getDiscountedTotal } from './shoppingCart';

describe('Shopping Cart', () => {
  it('calculates total for a single item', () => {
    const items = [{ productId: 'APPL001', quantity: 2 }];
    expect(calculateCartTotal(items)).toBe(7.98); // 3.99 * 2
  });

  it('calculates total for multiple items', () => {
    const items = [
      { productId: 'APPL001', quantity: 1 },
      { productId: 'MILK001', quantity: 2 }
    ];
    expect(calculateCartTotal(items)).toBe(12.49); // 3.99 + (4.25 * 2)
  });

  it('returns 0 for empty cart', () => {
    expect(calculateCartTotal([])).toBe(0);
  });

  it('validates cart items within stock limits', () => {
    expect(isValidCartItem({ productId: 'APPL001', quantity: 5 })).toBe(true);
  });

  it('rejects cart items exceeding stock', () => {
    expect(isValidCartItem({ productId: 'APPL001', quantity: 15 })).toBe(false);
  });

  it('rejects items for non-existent products', () => {
    expect(isValidCartItem({ productId: 'NONEXIST', quantity: 1 })).toBe(false);
  });

  it('applies discount correctly', () => {
    const items = [{ productId: 'MILK001', quantity: 1 }];
    const subtotal = calculateCartTotal(items);
    expect(getDiscountedTotal(items, 10)).toBe(subtotal * 0.9);
  });
});
