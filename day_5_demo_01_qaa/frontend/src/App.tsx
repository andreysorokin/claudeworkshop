import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Sidebar } from './components/Sidebar/Sidebar'
import { Dashboard } from './pages/Dashboard'
import { EventsPage } from './pages/EventsPage'
import { VolunteersPage } from './pages/VolunteersPage'
import './index.css'
import './App.css'

export default function App() {
  return (
    <BrowserRouter>
      <div className="layout">
        <Sidebar />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/events" element={<EventsPage />} />
            <Route path="/staff" element={<VolunteersPage />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  )
}
