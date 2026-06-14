import type { StaffMember } from '../../types'

interface StaffCardProps {
  member: StaffMember
}

export function VolunteerCard({ member }: StaffCardProps) {
  return (
    <div className="event-card">
      <h3 className="event-title">{member.name}</h3>
      <p className="event-meta">{member.role}</p>
      <div className="event-footer">
        <span className="spots-available">{member.eventsCount} events</span>
      </div>
    </div>
  )
}
