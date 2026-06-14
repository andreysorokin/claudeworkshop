import { VolunteerList } from '../components/VolunteerList/VolunteerList'

export function VolunteersPage() {
  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Staff</h1>
        <p className="page-subtitle">Manage stable staff members</p>
      </div>
      <VolunteerList />
    </div>
  )
}
