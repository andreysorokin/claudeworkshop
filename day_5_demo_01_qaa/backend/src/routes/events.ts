import { Router } from 'express'
import { z } from 'zod'
import { store } from '../data'

export const eventsRouter = Router()

const createEventSchema = z.object({
  title:       z.string().min(1),
  date:        z.string().min(1),
  location:    z.string().min(1),
  category:    z.enum(['fundraising', 'awareness', 'community', 'training']),
  description: z.string().min(1),
  spotsTotal:  z.number().int().positive(),
})

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
  const result = createEventSchema.safeParse(req.body)
  if (!result.success) {
    return res.status(400).json({ error: result.error.errors[0]?.message ?? 'Validation failed' })
  }
  const newEvent = {
    id: store.nextEventId++,
    ...result.data,
    spotsRegistered: 0,
    isActive: true,
  }
  store.events.push(newEvent)
  res.status(201).json(newEvent)
})

eventsRouter.put('/:id', (req, res) => {
  const idx = store.events.findIndex(e => e.id === Number(req.params['id']))
  if (idx === -1) return res.status(404).json({ error: 'Event not found' })
  const result = createEventSchema.partial().safeParse(req.body)
  if (!result.success) {
    return res.status(400).json({ error: result.error.errors[0]?.message ?? 'Validation failed' })
  }
  store.events[idx] = { ...store.events[idx], ...result.data, id: store.events[idx].id }
  res.json(store.events[idx])
})

eventsRouter.delete('/:id', (req, res) => {
  const idx = store.events.findIndex(e => e.id === Number(req.params['id']))
  if (idx === -1) return res.status(404).json({ error: 'Event not found' })
  store.events[idx].isActive = false
  res.status(204).send()
})
