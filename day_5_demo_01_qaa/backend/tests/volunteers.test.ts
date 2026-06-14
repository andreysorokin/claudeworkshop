import { describe, it, expect, beforeEach } from 'vitest'
import request from 'supertest'
import { app } from '../src/index'
import { resetStore } from '../src/data'

describe('GET /api/staff', () => {
  beforeEach(() => resetStore())

  it('returns all active staff members', async () => {
    const res = await request(app).get('/api/staff')
    expect(res.status).toBe(200)
    expect(res.body).toHaveLength(10)
  })
})

describe('GET /api/staff/roles', () => {
  it('returns the list of available roles', async () => {
    const res = await request(app).get('/api/staff/roles')
    expect(res.status).toBe(200)
    expect(Array.isArray(res.body)).toBe(true)
    expect(res.body.length).toBeGreaterThan(0)
    expect(res.body).toContain('Stable Manager')
  })
})
