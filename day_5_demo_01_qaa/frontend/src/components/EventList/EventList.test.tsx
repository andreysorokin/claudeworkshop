import { render, screen } from '@testing-library/react'
import { vi } from 'vitest'
import { EventList } from './EventList'
import * as useEventsModule from '../../hooks/useEvents'
import type { Event } from '../../types'

vi.mock('../../hooks/useEvents')

const mockEvents: Event[] = [
  {
    id: 1,
    title: 'Winter Fundraising Gala',
    date: '2025-02-15',
    location: 'The Grand Ballroom, London',
    category: 'fundraising',
    description: '',
    spotsTotal: 200,
    spotsRegistered: 145,
    isActive: true,
  },
  {
    id: 2,
    title: 'Community Blood Donation Drive',
    date: '2025-03-08',
    location: 'City Community Centre, Manchester',
    category: 'awareness',
    description: '',
    spotsTotal: 50,
    spotsRegistered: 38,
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
    expect(screen.getByText('Winter Fundraising Gala')).toBeInTheDocument()
    expect(screen.getByText('Community Blood Donation Drive')).toBeInTheDocument()
  })
})
