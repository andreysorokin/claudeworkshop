import { render, screen } from '@testing-library/react'
import { VolunteerCard } from './VolunteerCard'
import type { StaffMember } from '../../types'

const baseMember: StaffMember = {
  id: 1,
  name: 'Elara Moss',
  email: 'elara.moss@enchantedstables.com',
  role: 'Stable Manager',
  joinedAt: '2023-01-15',
  isActive: true,
  eventsCount: 8,
}

describe('VolunteerCard', () => {
  it('renders the staff member name and role', () => {
    render(<VolunteerCard member={baseMember} />)
    expect(screen.getByText('Elara Moss')).toBeInTheDocument()
    expect(screen.getByText('Stable Manager')).toBeInTheDocument()
  })

  it('renders the events count', () => {
    render(<VolunteerCard member={baseMember} />)
    expect(screen.getByText('8 events')).toBeInTheDocument()
  })
})
