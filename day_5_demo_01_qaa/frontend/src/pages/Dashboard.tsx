import { useEffect, useState } from 'react'

interface Stats {
  totalEvents: number
  totalVolunteers: number
  openSpots: number
  filledSpots: number
}

export function Dashboard() {
  const [stats, setStats] = useState<Stats | null>(null)

  useEffect(() => {
    fetch('/api/stats')
      .then(r => r.json())
      .then(setStats)
      .catch(() => null)
  }, [])

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Dashboard</h1>
        <p className="page-subtitle">Overview of events and volunteers</p>
      </div>

      <div className="stats-grid">
        <div className="stat-card stat-accent-indigo">
          <div className="stat-value">{stats?.totalEvents ?? '—'}</div>
          <p className="stat-label">Total Events</p>
        </div>
        <div className="stat-card stat-accent-emerald">
          <div className="stat-value">{stats?.totalVolunteers ?? '—'}</div>
          <p className="stat-label">Volunteers</p>
        </div>
        <div className="stat-card stat-accent-amber">
          <div className="stat-value">{stats?.openSpots ?? '—'}</div>
          <p className="stat-label">Open Spots</p>
        </div>
        <div className="stat-card stat-accent-rose">
          <div className="stat-value">{stats?.filledSpots ?? '—'}</div>
          <p className="stat-label">Spots Filled</p>
        </div>
      </div>
    </div>
  )
}
