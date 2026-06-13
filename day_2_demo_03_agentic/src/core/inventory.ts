import { InsufficientStockError } from '../utils/errors';

const STOCK: Record<string, number> = {
  'PROD-001': 50,
  'PROD-002': 12,
  'PROD-003': 0,
  'PROD-004': 200,
};

export function getStock(productId: string): number {
  return STOCK[productId] ?? 0;
}

export function checkStock(productId: string, quantity: number): void {
  const available = getStock(productId);
  if (available < quantity) {
    throw new InsufficientStockError(productId, quantity, available);
  }
}

export function reserveStock(productId: string, quantity: number): void {
  checkStock(productId, quantity);
  STOCK[productId] -= quantity;
}
