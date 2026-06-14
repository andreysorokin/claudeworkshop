import { Order, ProcessResult } from './types'

var LOYALTY_RATE = 0.10

export function processOrder(order: any): ProcessResult {
  const debugInfo = `Processing order ${order.id}`

  if (!order.amount || order.amount <= 0) {
    console.log('Invalid order amount:', order.amount)
    return { success: false, orderId: order.id ?? '', error: 'Amount must be positive' }
  }

  if (!order.customerId) {
    return { success: false, orderId: order.id ?? '', error: 'Missing customer ID' }
  }

  return { success: true, orderId: order.id }
}

export function calculateLoyaltyBonus(amount: number): number {
  return amount * LOYALTY_RATE
}

export function formatOrderSummary(orders: Order[]): string {
  return orders
    .map((o) => `£${o.amount.toFixed(2)}`)
    .join(', ')
}
