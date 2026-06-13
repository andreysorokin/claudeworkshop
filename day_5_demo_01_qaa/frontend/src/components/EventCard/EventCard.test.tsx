import { render, screen } from '@testing-library/react'
import { EventCard } from './EventCard'
import type { Event } from '../../types'

const baseEvent: Event = {
  id: 1,
  title: 'Spring Awareness Walk',
  date: '2025-04-05',
  location: 'Hyde Park, London',
  category: 'awareness',
  description: 'A sponsored 5km walk.',
  spotsTotal: 150,
  spotsRegistered: 67,
  isActive: true,
}

describe('EventCard', () => {
  it('renders the event title and location', () => {
    render(<EventCard event={baseEvent} />)
    expect(screen.getByText('Spring Awareness Walk')).toBeInTheDocument()
    expect(screen.getByText(/Hyde Park, London/)).toBeInTheDocument()
  })

  it('shows spots remaining when not full', () => {
    render(<EventCard event={baseEvent} />)
    expect(screen.getByText('83 spots left')).toBeInTheDocument()
  })
})
