import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { healthRouter } from '../routes/health.ts';

describe('healthRouter', () => {
  it('builds a router for the given service -> returns a function', () => {
    const router = healthRouter('backend');
    assert.equal(typeof router, 'function');
  });
});
