import express from 'express'
import cors from 'cors'
import { eventsRouter } from './routes/events'
import { volunteersRouter } from './routes/volunteers'
import { store } from './data'

const app = express()
const PORT = process.env['PORT'] ?? 3001

app.use(cors({ origin: 'http://localhost:5173' }))
app.use(express.json())

app.use('/api/events', eventsRouter)
app.use('/api/volunteers', volunteersRouter)

app.get('/api/stats', (_req, res) => {
  const activeEvents     = store.events.filter(e => e.isActive)
  const activeVolunteers = store.volunteers.filter(v => v.isActive)
  const filledSpots      = activeEvents.reduce((n, e) => n + e.spotsRegistered, 0)
  const totalSpots       = activeEvents.reduce((n, e) => n + e.spotsTotal, 0)
  res.json({
    totalEvents:     activeEvents.length,
    totalVolunteers: activeVolunteers.length,
    openSpots:       totalSpots - filledSpots,
    filledSpots,
  })
})

app.get('/health', (_req, res) => {
  res.json({ status: 'ok' })
})

export { app }

if (process.env['NODE_ENV'] !== 'test') {
  app.listen(PORT, () => {
    // eslint-disable-next-line no-console
    console.log(`API running on http://localhost:${PORT}`)
  })
}
