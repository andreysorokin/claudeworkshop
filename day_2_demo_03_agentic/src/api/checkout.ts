import { CartItem } from '../core/cart';
import { calculateTotal } from '../core/pricing';
import { reserveStock } from '../core/inventory';
import { saveOrder, Order } from '../db/orders';
import { logger } from '../utils/logger';

export interface CheckoutRequest {
  customerId: string;
  items: CartItem[];
  shippingAddress: string;
}

// TODO: add input validation before processing
// Hint: see validateBody() in src/api/middleware.ts
export async function processCheckout(request: CheckoutRequest): Promise<Order> {
  logger.info('Processing checkout', { customerId: request.customerId });

  const total = calculateTotal(request.items);

  for (const item of request.items) {
    reserveStock(item.productId, item.quantity);
  }

  const order = saveOrder({
    customerId: request.customerId,
    items: request.items,
    total,
    shippingAddress: request.shippingAddress,
  });

  logger.info('Checkout complete', { orderId: order.id, total });
  return order;
}
