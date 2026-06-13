import { addItem, removeItem, cartTotal, isEmpty, CartItem } from '../../src/core/cart';

const HEADPHONES: CartItem = { productId: 'PROD-001', quantity: 1, unitPrice: 79.99 };
const KEYBOARD: CartItem   = { productId: 'PROD-002', quantity: 2, unitPrice: 129.99 };

describe('addItem', () => {
  test('adds a new item to an empty cart', () => {
    const result = addItem([], HEADPHONES);
    expect(result).toHaveLength(1);
    expect(result[0]).toEqual(HEADPHONES);
  });

  test('merges quantity for an existing product', () => {
    const cart = [HEADPHONES];
    const result = addItem(cart, { ...HEADPHONES, quantity: 2 });
    expect(result).toHaveLength(1);
    expect(result[0].quantity).toBe(3);
  });

  test('adds a different product as a new line', () => {
    const result = addItem([HEADPHONES], KEYBOARD);
    expect(result).toHaveLength(2);
  });
});

describe('removeItem', () => {
  test('removes the specified product', () => {
    const cart = [HEADPHONES, KEYBOARD];
    expect(removeItem(cart, 'PROD-001')).toHaveLength(1);
  });

  test('no-ops when product is not in cart', () => {
    expect(removeItem([HEADPHONES], 'PROD-999')).toHaveLength(1);
  });
});

describe('cartTotal', () => {
  test('returns 0 for empty cart', () => {
    expect(cartTotal([])).toBe(0);
  });

  test('sums quantity × unitPrice across items', () => {
    expect(cartTotal([HEADPHONES, KEYBOARD])).toBeCloseTo(79.99 + 2 * 129.99);
  });
});

describe('isEmpty', () => {
  test('true for empty cart', () => expect(isEmpty([])).toBe(true));
  test('false for non-empty cart', () => expect(isEmpty([HEADPHONES])).toBe(false));
});
