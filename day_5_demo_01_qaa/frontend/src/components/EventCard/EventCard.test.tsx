import { render, screen } from '@testing-library/react'
import { EventCard } from './EventCard'
import type { Event } from '../../types'

const baseEvent: Event = {
  id: 1,
  title: 'Enchanted Trail Challenge',
  date: '2025-04-05',
  location: 'Forest Trail, South Paddock',
  category: 'trail',
  description: 'A timed 8km trail ride with natural obstacles.',
  spotsTotal: 30,
  spotsRegistered: 21,
  isActive: true,
}

describe('EventCard', () => {
  it('renders the event title and location', () => {
    render(<EventCard event={baseEvent} />)
    expect(screen.getByText('Enchanted Trail Challenge')).toBeInTheDocument()
    expect(screen.getByText(/Forest Trail, South Paddock/)).toBeInTheDocument()
  })

  it('shows spots remaining when not full', () => {
    render(<EventCard event={baseEvent} />)
    expect(screen.getByText('9 spots left')).toBeInTheDocument()
  })
})
