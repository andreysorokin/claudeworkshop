import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    environment: 'node',
    globals: false,
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html'],
      exclude: ['dist/**', 'tests/**', 'vitest.config.ts'],
      thresholds: {
        lines: 50,
        functions: 50,
        branches: 50,
      },
    },
  },
})
