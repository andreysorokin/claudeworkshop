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
    expect(res.body.title).toBe('Winter Fundraising Gala')
  })
})

describe('DELETE /api/events/:id', () => {
  beforeEach(() => resetStore())

  it('soft-deletes an event and returns 204', async () => {
    const del = await request(app).delete('/api/events/1')
    expect(del.status).toBe(204)

    const check = await request(app).get('/api/events/1')
    expect(check.status).toBe(404)
  })
})
