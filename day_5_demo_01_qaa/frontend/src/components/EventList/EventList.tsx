import { useEvents } from '../../hooks/useEvents'
import { EventCard } from '../EventCard/EventCard'

export function EventList() {
  const { events, loading, error } = useEvents()

  if (loading) return <p className="loading-state">Loading events...</p>
  if (error) return <p className="error-state">Error: {error}</p>
  if (events.length === 0) return <p className="empty-state">No upcoming events.</p>

  return (
    <div>
      <h2 className="section-heading">Upcoming Events ({events.length})</h2>
      <div className="events-grid">
        {events.map(event => (
          <EventCard key={event.id} event={event} />
        ))}
      </div>
    </div>
  )
}
