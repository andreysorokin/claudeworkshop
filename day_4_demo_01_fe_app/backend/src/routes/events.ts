import { Router } from 'express'
import type { Event } from '../data'
import { store } from '../data'

export const eventsRouter = Router()

eventsRouter.get('/', (req, res) => {
  const { category } = req.query
  const result = category
    ? store.events.filter(e => e.isActive && e.category === category)
    : store.events.filter(e => e.isActive)
  res.json(result)
})

eventsRouter.get('/:id', (req, res) => {
  const event = store.events.find(e => e.id === Number(req.params['id']))
  if (!event || !event.isActive) return res.status(404).json({ error: 'Event not found' })
  res.json(event)
})

eventsRouter.post('/', (req, res) => {
  // ISSUE: unsafe cast — should use Zod to validate the request body
  const { title, date, location, category, description, spotsTotal } = req.body as Partial<Event>
  if (!title || !date || !location || !category || !description || !spotsTotal) {
    return res.status(400).json({ error: 'All fields are required' })
  }
  const newEvent: Event = {
    id: store.nextEventId++,
    title,
    date,
    location,
    category,
    description,
    spotsTotal: Number(spotsTotal),
    spotsRegistered: 0,
    isActive: true,
  }
  store.events.push(newEvent)
  // ISSUE: should return 201 Created, not 200
  res.json(newEvent)
})

eventsRouter.put('/:id', (req, res) => {
  const idx = store.events.findIndex(e => e.id === Number(req.params['id']))
  if (idx === -1) return res.status(404).json({ error: 'Event not found' })
  // ISSUE: no validation on req.body — any shape is accepted
  store.events[idx] = { ...store.events[idx], ...req.body, id: store.events[idx].id }
  res.json(store.events[idx])
})

eventsRouter.delete('/:id', (req, res) => {
  const idx = store.events.findIndex(e => e.id === Number(req.params['id']))
  if (idx === -1) return res.status(404).json({ error: 'Event not found' })
  store.events[idx].isActive = false
  res.status(204).send()
})
