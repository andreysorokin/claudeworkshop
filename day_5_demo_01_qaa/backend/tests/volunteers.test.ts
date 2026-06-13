import { describe, it, expect, beforeEach } from 'vitest'
import request from 'supertest'
import { app } from '../src/index'
import { resetStore } from '../src/data'

describe('GET /api/volunteers', () => {
  beforeEach(() => resetStore())

  it('returns all active volunteers', async () => {
    const res = await request(app).get('/api/volunteers')
    expect(res.status).toBe(200)
    expect(res.body).toHaveLength(10)
  })
})

describe('GET /api/volunteers/roles', () => {
  it('returns the list of available roles', async () => {
    const res = await request(app).get('/api/volunteers/roles')
    expect(res.status).toBe(200)
    expect(Array.isArray(res.body)).toBe(true)
    expect(res.body.length).toBeGreaterThan(0)
    expect(res.body).toContain('Coordinator')
  })
})
