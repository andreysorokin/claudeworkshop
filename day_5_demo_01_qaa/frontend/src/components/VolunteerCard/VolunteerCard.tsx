import type { Volunteer } from '../../types'

interface VolunteerCardProps {
  volunteer: Volunteer
}

export function VolunteerCard({ volunteer }: VolunteerCardProps) {
  return (
    <div className="event-card">
      <h3 className="event-title">{volunteer.name}</h3>
      <p className="event-meta">{volunteer.role}</p>
      <div className="event-footer">
        <span className="spots-available">{volunteer.eventsCount} events</span>
      </div>
    </div>
  )
}
