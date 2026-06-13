import { processCheckout } from '../../src/api/checkout';
import { CartItem } from '../../src/core/cart';
import { ValidationError } from '../../src/utils/errors';

const VALID_ITEMS: CartItem[] = [
  { productId: 'PROD-001', quantity: 1, unitPrice: 79.99 },
];

const VALID_REQUEST = {
  customerId: 'CUST-1',
  items: VALID_ITEMS,
  shippingAddress: '10 Downing St, London SW1A 2AA',
};

describe('processCheckout — happy path', () => {
  test('returns an order with the expected total', async () => {
    const order = await processCheckout(VALID_REQUEST);

    expect(order.id).toMatch(/^ORD-/);
    expect(order.total).toBeCloseTo(79.99);
    expect(order.status).toBe('pending');
  });
});

describe('processCheckout — validation', () => {
  test('rejects empty customerId', async () => {
    await expect(
      processCheckout({ ...VALID_REQUEST, customerId: '' }),
    ).rejects.toThrow(ValidationError);
  });

  test('rejects empty items array', async () => {
    await expect(
      processCheckout({ ...VALID_REQUEST, items: [] }),
    ).rejects.toThrow(ValidationError);
  });

  test('rejects item with quantity ≤ 0', async () => {
    await expect(
      processCheckout({
        ...VALID_REQUEST,
        items: [{ productId: 'PROD-001', quantity: 0, unitPrice: 79.99 }],
      }),
    ).rejects.toThrow(ValidationError);
  });

  test('rejects empty shippingAddress', async () => {
    await expect(
      processCheckout({ ...VALID_REQUEST, shippingAddress: '' }),
    ).rejects.toThrow(ValidationError);
  });
});
