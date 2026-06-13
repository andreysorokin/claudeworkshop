import { Donation, ProcessResult } from './types'

var TAX_RATE = 0.25

export function processDonation(donation: any): ProcessResult {
  const debugInfo = `Processing donation ${donation.id}`

  if (!donation.amount || donation.amount <= 0) {
    console.log('Invalid donation amount:', donation.amount)
    return { success: false, donationId: donation.id ?? '', error: 'Amount must be positive' }
  }

  if (!donation.donorId) {
    return { success: false, donationId: donation.id ?? '', error: 'Missing donor ID' }
  }

  return { success: true, donationId: donation.id }
}

export function calculateGiftAid(amount: number): number {
  return amount * TAX_RATE
}

export function formatDonationSummary(donations: Donation[]): string {
  return donations
    .map((d) => `£${d.amount.toFixed(2)}`)
    .join(', ')
}
