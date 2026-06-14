import { render, screen } from '@testing-library/react'
import { vi } from 'vitest'
import { EventList } from './EventList'
import * as useEventsModule from '../../hooks/useEvents'
import type { Event } from '../../types'

vi.mock('../../hooks/useEvents')

const mockEvents: Event[] = [
  {
    id: 1,
    title: 'Moonlit Midnight Ride',
    date: '2025-02-15',
    location: 'Enchanted Stables, North Paddock',
    category: 'trail',
    description: '',
    spotsTotal: 12,
    spotsRegistered: 9,
    isActive: true,
  },
  {
    id: 2,
    title: 'Spring Foal Showcase',
    date: '2025-03-08',
    location: 'Main Arena, Enchanted Stables',
    category: 'show',
    description: '',
    spotsTotal: 80,
    spotsRegistered: 55,
    isActive: true,
  },
]

describe('EventList', () => {
  it('shows a loading indicator while fetching', () => {
    vi.spyOn(useEventsModule, 'useEvents').mockReturnValue({
      events: [],
      loading: true,
      error: null,
    })
    render(<EventList />)
    expect(screen.getByText('Loading events...')).toBeInTheDocument()
  })

  it('renders event titles when loaded', () => {
    vi.spyOn(useEventsModule, 'useEvents').mockReturnValue({
      events: mockEvents,
      loading: false,
      error: null,
    })
    render(<EventList />)
    expect(screen.getByText('Moonlit Midnight Ride')).toBeInTheDocument()
    expect(screen.getByText('Spring Foal Showcase')).toBeInTheDocument()
  })
})
