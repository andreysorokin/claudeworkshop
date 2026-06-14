import { Router } from 'express'
import type { StaffMember } from '../data'
import { store, STAFF_ROLES } from '../data'
import { z } from 'zod'

export const staffRouter = Router()

const createStaffSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  role: z.enum(['Stable Manager', 'Groom', 'Rider', 'Farrier', 'Photographer'], {
    errorMap: () => ({ message: 'Invalid role' }),
  }),
})

staffRouter.get('/roles', (_req, res) => {
  res.json(STAFF_ROLES)
})

staffRouter.get('/', (_req, res) => {
  res.json(store.staff.filter(s => s.isActive))
})

staffRouter.get('/:id', (req, res) => {
  const member = store.staff.find(s => s.id === Number(req.params['id']))
  if (!member || !member.isActive) return res.status(404).json({ error: 'Staff member not found' })
  res.json(member)
})

staffRouter.post('/', (req, res) => {
  const result = createStaffSchema.safeParse(req.body)
  if (!result.success) {
    return res.status(400).json({ error: result.error.errors[0]?.message ?? 'Validation failed' })
  }
  const { name, email, role } = result.data
  const newMember: StaffMember = {
    id: store.nextStaffId++,
    name,
    email,
    role,
    joinedAt: new Date().toISOString().split('T')[0] ?? '',
    isActive: true,
    eventsCount: 0,
  }
  store.staff.push(newMember)
  res.status(201).json(newMember)
})

staffRouter.put('/:id', (req, res) => {
  const idx = store.staff.findIndex(s => s.id === Number(req.params['id']))
  if (idx === -1) return res.status(404).json({ error: 'Staff member not found' })
  const result = createStaffSchema.partial().safeParse(req.body)
  if (!result.success) {
    return res.status(400).json({ error: result.error.errors[0]?.message ?? 'Validation failed' })
  }
  store.staff[idx] = { ...store.staff[idx], ...result.data, id: store.staff[idx].id }
  res.json(store.staff[idx])
})

staffRouter.delete('/:id', (req, res) => {
  const idx = store.staff.findIndex(s => s.id === Number(req.params['id']))
  if (idx === -1) return res.status(404).json({ error: 'Staff member not found' })
  store.staff[idx].isActive = false
  res.status(204).send()
})
