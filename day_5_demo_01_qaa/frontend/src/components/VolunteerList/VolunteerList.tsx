import { useVolunteers } from '../../hooks/useVolunteers'
import { VolunteerCard } from '../VolunteerCard/VolunteerCard'
import type { Volunteer } from '../../types'

export function VolunteerList() {
  const { volunteers, loading, error } = useVolunteers()

  if (loading) return <p className="loading-state">Loading volunteers...</p>
  if (error) return <p className="error-state">Error: {error}</p>

  return (
    <div>
      <h2 className="section-heading">Volunteers ({volunteers.length})</h2>
      <div className="events-grid">
        {volunteers.map((volunteer: Volunteer) => (
          <VolunteerCard key={volunteer.id} volunteer={volunteer} />
        ))}
      </div>
    </div>
  )
}
