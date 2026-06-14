export interface Order {
  id: string
  amount: number
  customerId: string
  collectionId: string
  timestamp: Date
  loyaltyMember: boolean
}

export interface LoyaltyResult {
  baseAmount: number
  loyaltyAmount: number
  total: number
}

export interface ProcessResult {
  success: boolean
  orderId: string
  error?: string
}
