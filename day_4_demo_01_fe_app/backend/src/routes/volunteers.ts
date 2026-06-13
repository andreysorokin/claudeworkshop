import { Router } from 'express'
import type { Volunteer } from '../data'
import { store, VOLUNTEER_ROLES } from '../data'

export const volunteersRouter = Router()

volunteersRouter.get('/roles', (_req, res) => {
  res.json(VOLUNTEER_ROLES)
})

volunteersRouter.get('/', (_req, res) => {
  res.json(store.volunteers.filter(v => v.isActive))
})

volunteersRouter.get('/:id', (req, res) => {
  const volunteer = store.volunteers.find(v => v.id === Number(req.params['id']))
  if (!volunteer || !volunteer.isActive) return res.status(404).json({ error: 'Volunteer not found' })
  res.json(volunteer)
})

volunteersRouter.post('/', (req, res) => {
  const { name, email, role } = req.body as Partial<Volunteer>
  if (!name || !email || !role) {
    return res.status(400).json({ error: 'name, email and role are required' })
  }
  if (!VOLUNTEER_ROLES.includes(role)) {
    return res.status(400).json({ error: 'Invalid role' })
  }
  const newVolunteer: Volunteer = {
    id: store.nextVolunteerId++,
    name,
    email,
    role,
    joinedAt: new Date().toISOString().split('T')[0],
    isActive: true,
    eventsCount: 0,
  }
  store.volunteers.push(newVolunteer)
  res.status(201).json(newVolunteer)
})

volunteersRouter.put('/:id', (req, res) => {
  const idx = store.volunteers.findIndex(v => v.id === Number(req.params['id']))
  if (idx === -1) return res.status(404).json({ error: 'Volunteer not found' })
  store.volunteers[idx] = { ...store.volunteers[idx], ...req.body, id: store.volunteers[idx].id }
  res.json(store.volunteers[idx])
})

volunteersRouter.delete('/:id', (req, res) => {
  const idx = store.volunteers.findIndex(v => v.id === Number(req.params['id']))
  if (idx === -1) return res.status(404).json({ error: 'Volunteer not found' })
  store.volunteers[idx].isActive = false
  res.status(204).send()
})
