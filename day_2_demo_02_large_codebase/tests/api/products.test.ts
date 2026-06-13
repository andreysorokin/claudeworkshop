import { listProducts, getProduct } from '../../src/api/products';
import { NotFoundError } from '../../src/utils/errors';

describe('listProducts', () => {
  test('returns all products when no category given', () => {
    const products = listProducts();
    expect(products.length).toBeGreaterThan(0);
  });

  test('filters by category', () => {
    const electronics = listProducts('electronics');
    expect(electronics.every((p) => p.category === 'electronics')).toBe(true);
  });
});

describe('getProduct', () => {
  test('returns product by id', () => {
    const product = getProduct('PROD-001');
    expect(product.name).toBe('Wireless Headphones');
  });

  test('throws NotFoundError for unknown id', () => {
    expect(() => getProduct('PROD-999')).toThrow(NotFoundError);
  });
});
