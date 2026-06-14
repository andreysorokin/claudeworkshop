import { useVolunteers } from '../../hooks/useVolunteers'
import { VolunteerCard } from '../VolunteerCard/VolunteerCard'
import type { StaffMember } from '../../types'

export function VolunteerList() {
  const { staff, loading, error } = useVolunteers()

  if (loading) return <p className="loading-state">Loading staff...</p>
  if (error) return <p className="error-state">Error: {error}</p>

  return (
    <div>
      <h2 className="section-heading">Staff ({staff.length})</h2>
      <div className="events-grid">
        {staff.map((member: StaffMember) => (
          <VolunteerCard key={member.id} member={member} />
        ))}
      </div>
    </div>
  )
}
