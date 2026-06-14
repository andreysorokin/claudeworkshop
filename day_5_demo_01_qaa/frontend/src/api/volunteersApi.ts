import type { StaffMember, CreateStaffPayload } from '../types'

const BASE_URL = import.meta.env['VITE_API_URL'] ?? ''

export async function fetchStaff(): Promise<StaffMember[]> {
  const res = await fetch(`${BASE_URL}/api/staff`)
  if (!res.ok) throw new Error(`Failed to fetch staff: ${res.status}`)
  return res.json() as Promise<StaffMember[]>
}

export async function fetchStaffRoles(): Promise<string[]> {
  const res = await fetch(`${BASE_URL}/api/staff/roles`)
  if (!res.ok) throw new Error(`Failed to fetch roles: ${res.status}`)
  return res.json() as Promise<string[]>
}

export async function createStaffMember(payload: CreateStaffPayload): Promise<StaffMember> {
  const res = await fetch(`${BASE_URL}/api/staff`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
  if (!res.ok) throw new Error(`Failed to create staff member: ${res.status}`)
  return res.json() as Promise<StaffMember>
}
