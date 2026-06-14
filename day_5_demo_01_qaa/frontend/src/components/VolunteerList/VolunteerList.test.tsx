import { render, screen } from '@testing-library/react'
import { vi } from 'vitest'
import { VolunteerList } from './VolunteerList'
import * as useVolunteersModule from '../../hooks/useVolunteers'
import type { StaffMember } from '../../types'

vi.mock('../../hooks/useVolunteers')

const baseMember: StaffMember = {
  id: 1,
  name: 'Elara Moss',
  email: 'elara.moss@enchantedstables.com',
  role: 'Stable Manager',
  joinedAt: '2023-01-15',
  isActive: true,
  eventsCount: 8,
}

describe('VolunteerList', () => {
  it('shows a loading indicator while fetching', () => {
    vi.spyOn(useVolunteersModule, 'useVolunteers').mockReturnValue({
      staff: [],
      loading: true,
      error: null,
    })
    render(<VolunteerList />)
    expect(screen.getByText('Loading staff...')).toBeInTheDocument()
  })

  it('renders all staff names when loaded', () => {
    vi.spyOn(useVolunteersModule, 'useVolunteers').mockReturnValue({
      staff: [baseMember, { ...baseMember, id: 2, name: 'Finn Archer' }],
      loading: false,
      error: null,
    })
    render(<VolunteerList />)
    expect(screen.getByText('Elara Moss')).toBeInTheDocument()
    expect(screen.getByText('Finn Archer')).toBeInTheDocument()
  })
})
