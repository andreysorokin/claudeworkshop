import { describe, it, expect } from 'vitest';
import { healthLabel } from './api.ts';

describe('healthLabel', () => {
  it('null health -> checking placeholder', () => {
    expect(healthLabel(null)).toBe('checking…');
  });

  it('ok health -> status with service name', () => {
    expect(healthLabel({ status: 'ok', service: 'backend' })).toBe('ok (backend)');
  });
});
