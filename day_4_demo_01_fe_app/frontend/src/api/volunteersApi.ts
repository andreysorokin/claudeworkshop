import type { Volunteer, CreateVolunteerPayload } from '../types'

const BASE_URL = import.meta.env['VITE_API_URL'] ?? ''

export async function fetchVolunteers(): Promise<Volunteer[]> {
  const res = await fetch(`${BASE_URL}/api/volunteers`)
  if (!res.ok) throw new Error(`Failed to fetch volunteers: ${res.status}`)
  return res.json() as Promise<Volunteer[]>
}

export async function fetchVolunteerRoles(): Promise<string[]> {
  const res = await fetch(`${BASE_URL}/api/volunteers/roles`)
  if (!res.ok) throw new Error(`Failed to fetch roles: ${res.status}`)
  return res.json() as Promise<string[]>
}

export async function createVolunteer(payload: CreateVolunteerPayload): Promise<Volunteer> {
  const res = await fetch(`${BASE_URL}/api/volunteers`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
  if (!res.ok) throw new Error(`Failed to create volunteer: ${res.status}`)
  return res.json() as Promise<Volunteer>
}
