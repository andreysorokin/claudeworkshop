import { calculateCartTotal, isValidCartItem, getDiscountedTotal, getProductById } from './shoppingCart';

const cart = [
  { productId: 'APPL001', quantity: 2 },
  { productId: 'MILK001', quantity: 1 },
  { productId: 'BRDS001', quantity: 3 },
];

console.log('Shopping Cart\n');

for (const item of cart) {
  const product = getProductById(item.productId);
  if (product) {
    console.log(`${product.name} x${item.quantity} @ $${product.price.toFixed(2)} — $${(product.price * item.quantity).toFixed(2)}`);
  }
}

const total = calculateCartTotal(cart);
const discounted = getDiscountedTotal(cart, 10);

console.log(`\nSubtotal:           $${total.toFixed(2)}`);
console.log(`After 10% discount: $${discounted.toFixed(2)}`);
