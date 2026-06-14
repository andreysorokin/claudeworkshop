import express from 'express'
import cors from 'cors'
import swaggerUi from 'swagger-ui-express'
import { readFileSync } from 'fs'
import { join } from 'path'
import YAML from 'js-yaml'
import { eventsRouter } from './routes/events'
import { staffRouter } from './routes/staff'
import { store } from './data'

const app = express()
const PORT = process.env['PORT'] ?? 3001

const openapiSpec = YAML.load(readFileSync(join(__dirname, '../openapi.yaml'), 'utf8'))

app.use(cors({ origin: 'http://localhost:5173' }))
app.use(express.json())
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(openapiSpec as Record<string, unknown>))

app.use('/api/events', eventsRouter)
app.use('/api/staff', staffRouter)

app.get('/api/stats', (_req, res) => {
  const activeEvents = store.events.filter(e => e.isActive)
  const activeStaff  = store.staff.filter(s => s.isActive)
  const filledSpots  = activeEvents.reduce((n, e) => n + e.spotsRegistered, 0)
  const totalSpots   = activeEvents.reduce((n, e) => n + e.spotsTotal, 0)
  res.json({
    totalEvents: activeEvents.length,
    totalStaff:  activeStaff.length,
    openSpots:   totalSpots - filledSpots,
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
    // eslint-disable-next-line no-console
    console.log(`API docs:  http://localhost:${PORT}/api-docs`)
  })
}
