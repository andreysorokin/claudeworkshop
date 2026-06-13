import { render, screen } from '@testing-library/react'
import { vi } from 'vitest'
import { VolunteerList } from './VolunteerList'
import * as useVolunteersModule from '../../hooks/useVolunteers'
import type { Volunteer } from '../../types'

vi.mock('../../hooks/useVolunteers')

const baseVolunteer: Volunteer = {
  id: 1,
  name: 'Alice Johnson',
  email: 'alice@example.com',
  role: 'Coordinator',
  joinedAt: '2024-01-15',
  isActive: true,
  eventsCount: 5,
}

describe('VolunteerList', () => {
  it('shows a loading indicator while fetching', () => {
    vi.spyOn(useVolunteersModule, 'useVolunteers').mockReturnValue({
      volunteers: [],
      loading: true,
      error: null,
    })
    render(<VolunteerList />)
    expect(screen.getByText('Loading volunteers...')).toBeInTheDocument()
  })

  it('renders all volunteer names when loaded', () => {
    vi.spyOn(useVolunteersModule, 'useVolunteers').mockReturnValue({
      volunteers: [baseVolunteer, { ...baseVolunteer, id: 2, name: 'Bob Smith' }],
      loading: false,
      error: null,
    })
    render(<VolunteerList />)
    expect(screen.getByText('Alice Johnson')).toBeInTheDocument()
    expect(screen.getByText('Bob Smith')).toBeInTheDocument()
  })
})
