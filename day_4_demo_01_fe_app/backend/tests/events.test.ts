import { describe, it, expect, beforeEach } from 'vitest'
import request from 'supertest'
import { app } from '../src/index'
import { resetStore } from '../src/data'

describe('GET /api/events', () => {
  beforeEach(() => resetStore())

  it('returns all active events', async () => {
    const res = await request(app).get('/api/events')
    expect(res.status).toBe(200)
    expect(res.body).toHaveLength(8)
  })

  it('filters events by category', async () => {
    const res = await request(app).get('/api/events?category=training')
    expect(res.status).toBe(200)
    const categories: string[] = res.body.map((e: { category: string }) => e.category)
    expect(categories.every(c => c === 'training')).toBe(true)
  })
})

describe('GET /api/events/:id', () => {
  beforeEach(() => resetStore())

  it('returns the event when found', async () => {
    const res = await request(app).get('/api/events/1')
    expect(res.status).toBe(200)
    expect(res.body.id).toBe(1)
  })

  it('returns 404 for a non-existent event', async () => {
    const res = await request(app).get('/api/events/999')
    expect(res.status).toBe(404)
  })
})

describe('POST /api/events', () => {
  beforeEach(() => resetStore())

  it('creates an event', async () => {
    const payload = {
      title: 'Test Event',
      date: '2025-06-01',
      location: 'Test Venue',
      category: 'community',
      description: 'A new community gathering.',
      spotsTotal: 30,
    }
    const res = await request(app).post('/api/events').send(payload)
    expect(res.body.title).toBe('Test Event')
  })

  it('returns 400 when required fields are missing', async () => {
    const res = await request(app).post('/api/events').send({ title: 'Incomplete' })
    expect(res.status).toBe(400)
  })
})

describe('DELETE /api/events/:id', () => {
  beforeEach(() => resetStore())

  it('soft-deletes an event and returns 204', async () => {
    const res = await request(app).delete('/api/events/1')
    expect(res.status).toBe(204)

    const check = await request(app).get('/api/events/1')
    expect(check.status).toBe(404)
  })

  it('returns 404 for a non-existent event', async () => {
    const res = await request(app).delete('/api/events/999')
    expect(res.status).toBe(404)
  })
})
