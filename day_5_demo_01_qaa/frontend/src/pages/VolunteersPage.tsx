import { VolunteerList } from '../components/VolunteerList/VolunteerList'

export function VolunteersPage() {
  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Volunteers</h1>
        <p className="page-subtitle">Manage registered volunteers</p>
      </div>
      <VolunteerList />
    </div>
  )
}
