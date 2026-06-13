# Community Hub Portal

@import .claude/code-style.md

## Architecture

Two-app monorepo — run each independently:

- **`backend/`** — Express 4 + TypeScript REST API on port 3001; in-memory store; Zod validation
- **`frontend/`** — React 18 + Vite + TypeScript SPA on port 5173; proxies `/api` to the backend

## Domain Model

Two entities managed by the charity's staff portal:

**`Event`** — a charity event with limited spots:

| Field | Type | Notes |
|---|---|---|
| `id` | `number` | Auto-assigned |
| `title` | `string` | Event name |
| `date` | `string` | ISO 8601 date |
| `location` | `string` | Venue / URL |
| `category` | `'fundraising' \| 'awareness' \| 'community' \| 'training'` | |
| `description` | `string` | Full description |
| `spotsTotal` | `number` | Capacity |
| `spotsRegistered` | `number` | Booked so far |
| `isActive` | `boolean` | Soft-delete flag |

**`Volunteer`** — a registered volunteer:

| Field | Type | Notes |
|---|---|---|
| `id` | `number` | Auto-assigned |
| `name` | `string` | Display name |
| `email` | `string` | Contact email |
| `role` | `string` | One of `VOLUNTEER_ROLES` |
| `joinedAt` | `string` | ISO 8601 date |
| `isActive` | `boolean` | Soft-delete flag |
| `eventsCount` | `number` | Events attended |

Seed data: 8 events, 10 volunteers — loaded at startup, reset between tests via `resetStore()`.

## Running the Project

```bash
# Install (once per app)
cd backend && npm install && cd ../frontend && npm install

# Start backend  →  http://localhost:3001
cd backend && npm run dev

# Start frontend  →  http://localhost:5173
cd frontend && npm run dev

# Tests
cd backend && npm test
cd frontend && npm test

# Lint (frontend)
cd frontend && npm run lint
```

## Solution Structure

```
backend/
  src/index.ts             — Express app + server bootstrap (export { app } for tests)
  src/data.ts              — seed data + mutable store + resetStore()
  src/routes/events.ts     — /api/events CRUD (has intentional issues — refactor target)
  src/routes/volunteers.ts — /api/volunteers read-only routes
  tests/events.test.ts     — route integration tests (Supertest + Vitest)

frontend/
  src/types.ts                          — Event, Volunteer, payload types
  src/api/eventsApi.ts                  — fetch wrappers
  src/hooks/useEvents.ts                — data-fetching hook (has a bug — debugging target)
  src/components/EventCard/             — single-event display (clean)
  src/components/EventList/             — list component (has intentional issues — refactor target)
  src/App.tsx                           — root layout
```

## Key Files

<!-- TODO (workshop exercise): highlight the most important files and explain why -->

## Test Patterns

<!-- TODO (workshop exercise): describe how tests are structured in this project -->
