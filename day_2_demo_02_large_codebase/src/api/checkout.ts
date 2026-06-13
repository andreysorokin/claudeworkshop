import { CartItem } from '../core/cart';
import { calculateTotal } from '../core/pricing';
import { reserveStock } from '../core/inventory';
import { saveOrder, Order } from '../db/orders';
import { validateBody } from './middleware';
import { logger } from '../utils/logger';

export interface CheckoutRequest {
  customerId: string;
  items: CartItem[];
  shippingAddress: string;
}

export async function processCheckout(request: CheckoutRequest): Promise<Order> {
  validateBody(request, {
    required: ['customerId', 'shippingAddress'],
    nonEmptyArray: ['items'],
  });

  for (const item of request.items) {
    validateBody(item, { positiveInteger: ['quantity'] });
  }

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
