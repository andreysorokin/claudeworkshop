import type { Event } from '../types'

const BASE_URL = import.meta.env['VITE_API_URL'] ?? ''

export async function fetchEvents(category?: string): Promise<Event[]> {
  const url = category
    ? `${BASE_URL}/api/events?category=${encodeURIComponent(category)}`
    : `${BASE_URL}/api/events`
  const res = await fetch(url)
  if (!res.ok) throw new Error(`Failed to fetch events: ${res.status}`)
  return res.json() as Promise<Event[]>
}

export async function fetchEventById(id: number): Promise<Event> {
  const res = await fetch(`${BASE_URL}/api/events/${id}`)
  if (!res.ok) throw new Error(`Event not found: ${res.status}`)
  return res.json() as Promise<Event>
}
