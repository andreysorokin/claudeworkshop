export interface Donation {
  id: string
  amount: number
  donorId: string
  campaignId: string
  timestamp: Date
  giftAidEligible: boolean
}

export interface GiftAidResult {
  baseAmount: number
  giftAidAmount: number
  total: number
}

export interface ProcessResult {
  success: boolean
  donationId: string
  error?: string
}
