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
        {/* ISSUE: h1 jumps directly to h3 inside stat cards — heading hierarchy a11y target */}
        <h1 className="page-title">Dashboard</h1>
        <p className="page-subtitle">Overview of events and volunteers</p>
      </div>

      <div className="stats-grid">
        <div className="stat-card stat-accent-indigo">
          <div className="stat-value">{stats?.totalEvents ?? '—'}</div>
          {/* ISSUE: skips h2 level — goes h1 → h3 */}
          <h3 className="stat-label">Total Events</h3>
        </div>
        <div className="stat-card stat-accent-emerald">
          <div className="stat-value">{stats?.totalVolunteers ?? '—'}</div>
          <h3 className="stat-label">Volunteers</h3>
        </div>
        <div className="stat-card stat-accent-amber">
          <div className="stat-value">{stats?.openSpots ?? '—'}</div>
          <h3 className="stat-label">Open Spots</h3>
        </div>
        <div className="stat-card stat-accent-rose">
          <div className="stat-value">{stats?.filledSpots ?? '—'}</div>
          <h3 className="stat-label">Spots Filled</h3>
        </div>
      </div>
    </div>
  )
}
