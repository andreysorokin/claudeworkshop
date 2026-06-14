import { EventList } from '../components/EventList/EventList'

export function EventsPage() {
  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Events</h1>
        <p className="page-subtitle">All upcoming stable events</p>
      </div>
      <EventList />
    </div>
  )
}
