# Enchanted Stables Portal — Test Suite

@import .claude/code-style.md

## Architecture

Two-app monorepo — run each independently:

- **`backend/`** — Express 4 + TypeScript REST API on port 3001; in-memory store; Zod validation; OpenAPI 3.0 spec
- **`frontend/`** — React 18 + Vite + TypeScript SPA on port 5173; proxies `/api` to the backend; Playwright E2E

## Domain Model

**`Event`** — a stable event with limited spots:

| Field | Type | Notes |
|---|---|---|
| `id` | `number` | Auto-assigned |
| `title` | `string` | Event name |
| `date` | `string` | ISO 8601 date |
| `location` | `string` | Venue |
| `category` | `'show' \| 'trail' \| 'clinic' \| 'grooming'` | |
| `description` | `string` | Full description |
| `spotsTotal` | `number` | Capacity |
| `spotsRegistered` | `number` | Booked so far |
| `isActive` | `boolean` | Soft-delete flag |

**`StaffMember`** — a stable staff member:

| Field | Type | Notes |
|---|---|---|
| `id` | `number` | Auto-assigned |
| `name` | `string` | Display name |
| `email` | `string` | Contact email |
| `role` | `string` | One of `STAFF_ROLES` |
| `joinedAt` | `string` | ISO 8601 date |
| `isActive` | `boolean` | Soft-delete flag |
| `eventsCount` | `number` | Events attended |

`STAFF_ROLES = ['Stable Manager', 'Groom', 'Rider', 'Farrier', 'Photographer']`

Seed data: 8 events, 10 staff — loaded at startup, reset between tests via `resetStore()`.

## Running the Project

```bash
# Install (once per app)
cd backend && npm install
cd ../frontend && npm install

# Start backend  →  http://localhost:3001
cd backend && npm run dev

# Start frontend  →  http://localhost:5173
cd frontend && npm run dev

# API docs  →  http://localhost:3001/api-docs

# Tests
cd backend && npm test
cd backend && npm run test:coverage
cd frontend && npm test
cd frontend && npm run test:e2e   # requires both servers running
```

## Solution Structure

```
backend/
  openapi.yaml             — Complete OpenAPI 3.0 spec (source of truth for API contracts)
  src/index.ts             — Express app + Swagger UI at /api-docs
  src/data.ts              — seed data + mutable store + resetStore()
  src/routes/events.ts     — /api/events CRUD with Zod validation
  src/routes/staff.ts      — /api/staff CRUD
  tests/events.test.ts     — integration tests (Vitest + Supertest) — PARTIAL
  tests/volunteers.test.ts — integration tests — PARTIAL
  tests/fixtures/          — reusable test data (JSON)

frontend/
  playwright.config.ts               — E2E test config
  src/types.ts                       — Event, StaffMember, payload types
  src/api/eventsApi.ts               — fetch wrappers for events
  src/api/volunteersApi.ts           — fetch wrappers for staff
  src/hooks/useEvents.ts             — data-fetching hook
  src/hooks/useVolunteers.ts         — data-fetching hook
  src/components/EventCard/          — single-event display
  src/components/EventList/          — event grid
  src/components/VolunteerCard/      — single staff member display
  src/components/VolunteerList/      — staff grid
  src/pages/Dashboard.tsx            — stats overview
  tests/e2e/pages/                   — Playwright page objects
  tests/e2e/events.spec.ts           — E2E tests — PARTIAL
```

## Test Strategy

<!-- TODO: Written during session 2 (13:30) -->
<!-- Cover:
  - Which backend routes need integration tests (all routes — see openapi.yaml)
  - Which frontend components need unit tests
  - Which user stories from user-stories.md become E2E tests
  - How test data is managed (fixtures, factories, seed data)
  - What coverage threshold is acceptable and why
-->

## Naming Conventions

<!-- TODO: Written during session 2 (13:30) -->
<!-- Cover:
  - describe block naming for backend route tests
  - describe block naming for frontend component tests
  - it() string format (behaviour over implementation)
  - test file locations (backend tests/, frontend co-located for unit, tests/e2e/ for Playwright)
  - fixture file naming
  - page object class naming
-->

## Shared Fixtures

<!-- TODO: Written during session 2 (13:30) -->
<!-- Cover:
  - Where fixtures live (backend/tests/fixtures/, frontend co-located baseMember/baseEvent)
  - When to use a fixture vs a factory
  - How test.each uses fixture data
  - The resetStore() pattern for backend isolation
-->

## Environment Config and Secrets

<!-- TODO: Written during session 2 (13:30) -->
<!-- Cover:
  - .env.example documents every variable
  - Real .env files are deny-listed in .claude/settings.json — never committed
  - TEST_BASE_URL controls the Playwright target
  - PORT can be overridden for parallel test runs
  - Never put credentials, PII, or real email addresses in fixture files
-->
