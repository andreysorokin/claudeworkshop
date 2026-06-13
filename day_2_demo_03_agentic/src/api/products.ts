import { getAllProducts, getProductById, getProductsByCategory } from '../db/products';
import { validateBody } from './middleware';
import { NotFoundError } from '../utils/errors';

export function listProducts(category?: string) {
  return category ? getProductsByCategory(category) : getAllProducts();
}

export function getProduct(id: string) {
  validateBody({ id }, { required: ['id'] });
  const product = getProductById(id);
  if (!product) throw new NotFoundError('Product', id);
  return product;
}
