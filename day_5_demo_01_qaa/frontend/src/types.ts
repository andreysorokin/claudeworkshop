export type EventCategory = 'show' | 'trail' | 'clinic' | 'grooming'

export interface Event {
  id: number
  title: string
  date: string
  location: string
  category: EventCategory
  description: string
  spotsTotal: number
  spotsRegistered: number
  isActive: boolean
}

export interface StaffMember {
  id: number
  name: string
  email: string
  role: string
  joinedAt: string
  isActive: boolean
  eventsCount: number
}

export interface CreateStaffPayload {
  name: string
  email: string
  role: string
}
