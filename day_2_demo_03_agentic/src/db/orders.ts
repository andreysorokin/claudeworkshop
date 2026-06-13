import { CartItem } from '../core/cart';

export interface Order {
  id: string;
  customerId: string;
  items: CartItem[];
  total: number;
  shippingAddress: string;
  createdAt: Date;
  status: 'pending' | 'confirmed' | 'dispatched' | 'delivered';
}

const orders: Order[] = [];

export function saveOrder(data: Omit<Order, 'id' | 'createdAt' | 'status'>): Order {
  const order: Order = {
    ...data,
    id: `ORD-${Date.now()}`,
    createdAt: new Date(),
    status: 'pending',
  };
  orders.push(order);
  return order;
}

export function getOrder(id: string): Order | undefined {
  return orders.find((o) => o.id === id);
}

export function getOrdersByCustomer(customerId: string): Order[] {
  return orders.filter((o) => o.customerId === customerId);
}
