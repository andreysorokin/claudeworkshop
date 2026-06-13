import { useEvents } from '../../hooks/useEvents'
import type { Event } from '../../types'

// ISSUE: renders all event details inline — should delegate to EventCard
// ISSUE: uses array index as React key (breaks reconciliation on reorder/filter)
// ISSUE: no empty-state message when the list is empty
// ISSUE: inline styles throughout — use CSS classes from App.css
export function EventList() {
  const { events, loading, error } = useEvents()

  if (loading) return <p>Loading events...</p>
  if (error) return <p style={{ color: 'red' }}>Error: {error}</p>

  return (
    <div>
      <h2 style={{ marginBottom: '1rem' }}>Upcoming Events ({events.length})</h2>
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {events.map((event: Event, index: number) => (
          // ISSUE: key should be event.id, not index
          <li
            key={index}
            style={{
              border: '1px solid #ddd',
              borderRadius: '8px',
              padding: '1rem',
              marginBottom: '0.75rem',
              background: 'white',
            }}
          >
            {/* ISSUE: copy-pasted layout instead of <EventCard event={event} /> */}
            <h3 style={{ margin: '0 0 0.25rem' }}>{event.title}</h3>
            <p style={{ color: '#555', margin: '0 0 0.5rem', fontSize: '0.9rem' }}>
              {event.date} &mdash; {event.location}
            </p>
            <span
              style={{
                background: '#e8f5e9',
                borderRadius: '4px',
                padding: '2px 8px',
                fontSize: '0.8rem',
              }}
            >
              {event.category}
            </span>
            <span
              style={{
                marginLeft: '1rem',
                fontWeight: 600,
                color: event.spotsTotal - event.spotsRegistered > 0 ? '#2e7d32' : '#c62828',
              }}
            >
              {event.spotsTotal - event.spotsRegistered > 0
                ? `${event.spotsTotal - event.spotsRegistered} spots left`
                : 'FULL'}
            </span>
          </li>
        ))}
      </ul>
    </div>
  )
}
