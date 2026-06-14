import { NavLink } from 'react-router-dom'

interface NavIconProps {
  path: string
}

function NavIcon({ path }: NavIconProps) {
  return (
    <svg className="nav-icon" viewBox="0 0 24 24" aria-hidden="true">
      <path d={path} />
    </svg>
  )
}

const DASHBOARD_PATH = 'M3 3h7v7H3zM13 3h7v7h-7zM3 13h7v7H3zM13 13h7v7h-7z'
const EVENTS_PATH    = 'M8 2v3m8-3v3M3 8h18M5 4h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z'
const PEOPLE_PATH    = 'M16 11c1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3 1.34 3 3 3zm-8 0c1.66 0 3-1.34 3-3S9.66 5 8 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5C15 14.17 10.33 13 8 13zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z'
const MENU_PATH      = 'M4 6h16M4 12h16M4 18h16'

export function Sidebar() {
  return (
    <nav className="sidebar">
      <div className="sidebar-logo">
        <p className="sidebar-logo-title">Enchanted Stables</p>
        <p className="sidebar-logo-sub">Staff Portal</p>
      </div>

      <div className="sidebar-nav">
        <NavLink to="/" end className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}>
          <NavIcon path={DASHBOARD_PATH} />
          Dashboard
        </NavLink>
        <NavLink to="/events" className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}>
          <NavIcon path={EVENTS_PATH} />
          Events
        </NavLink>
        <NavLink to="/staff" className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}>
          <NavIcon path={PEOPLE_PATH} />
          Staff
        </NavLink>
      </div>

      {/* ISSUE: no aria-label on this button — a11y target */}
      <button className="sidebar-menu-btn">
        <NavIcon path={MENU_PATH} />
      </button>
    </nav>
  )
}
