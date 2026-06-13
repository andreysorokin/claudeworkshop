import type { Event, EventCategory } from '../../types'

interface EventCardProps {
  event: Event
}

const CATEGORY_LABELS: Record<EventCategory, string> = {
  fundraising: 'Fundraising',
  awareness:   'Awareness',
  community:   'Community',
  training:    'Training',
}

export function EventCard({ event }: EventCardProps) {
  const spotsLeft = event.spotsTotal - event.spotsRegistered

  return (
    <div className="event-card">
      <div className="event-card-top">
        <span className={`category-badge category-${event.category}`}>
          {CATEGORY_LABELS[event.category]}
        </span>
        <span className="event-date">{event.date}</span>
      </div>
      <h3 className="event-title">{event.title}</h3>
      <p className="event-meta">{event.location}</p>
      <div className="event-footer">
        <span className={spotsLeft > 0 ? 'spots-available' : 'spots-full'}>
          {spotsLeft > 0 ? `${spotsLeft} spots left` : 'FULL'}
        </span>
      </div>
    </div>
  )
}
