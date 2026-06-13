import { render, screen } from '@testing-library/react'
import { VolunteerCard } from './VolunteerCard'
import type { Volunteer } from '../../types'

const baseVolunteer: Volunteer = {
  id: 1,
  name: 'Alice Johnson',
  email: 'alice@example.com',
  role: 'Coordinator',
  joinedAt: '2024-01-15',
  isActive: true,
  eventsCount: 5,
}

describe('VolunteerCard', () => {
  it('renders the volunteer name and role', () => {
    render(<VolunteerCard volunteer={baseVolunteer} />)
    expect(screen.getByText('Alice Johnson')).toBeInTheDocument()
    expect(screen.getByText('Coordinator')).toBeInTheDocument()
  })

  it('renders the events count', () => {
    render(<VolunteerCard volunteer={baseVolunteer} />)
    expect(screen.getByText('5 events')).toBeInTheDocument()
  })
})
