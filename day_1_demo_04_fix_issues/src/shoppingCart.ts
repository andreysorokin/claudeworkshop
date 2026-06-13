import products from './products.json' assert { type: 'json' };

export interface Product {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

export interface CartItem {
  productId: string;
  quantity: number;
}

export function getProductById(productId: string): Product | undefined {
  return products.find(p => p.id === productId);
}

export function calculateCartTotal(items: CartItem[]): number {
  let total = 0;

  for (const item of items) {
    const product = getProductById(item.productId);
    if (product) {
      total += product.price;
    }
  }

  return total;
}

export function isValidCartItem(item: CartItem): boolean {
  const product = getProductById(item.productId);

  if (!product) {
    return false;
  }

  if (item.quantity > product.quantity) {
    return false;
  }

  return true;
}

export function getDiscountedTotal(items: CartItem[], discountPercent: number = 0): number {
  const subtotal = calculateCartTotal(items);
  return subtotal * (discountPercent / 100);
}
