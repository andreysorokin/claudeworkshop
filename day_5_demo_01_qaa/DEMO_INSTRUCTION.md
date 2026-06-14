# Demo: QA & Testing with Claude Code

---

## The Story

The Enchanted Stables portal is live — events, staff, a dashboard. What it lacks is test coverage. The backend has two sparse test files; the frontend has a handful of component tests but no E2E suite. Time to fix that.

The app starts with six tests. By end of session: sixty.

---

## Setup

```bash
# Terminal 1 — backend  →  http://localhost:3001
cd day_5_demo_01_qaa/backend && npm install && npm run dev

# Terminal 2 — frontend  →  http://localhost:5173
cd day_5_demo_01_qaa/frontend && npm install && npm run dev

# Verify baseline
cd backend  && npm test           # 4 tests pass
cd ../frontend && npm test        # 8 component tests
cd frontend && npx playwright install chromium  # once
```

Open `http://localhost:3001/api-docs` — Swagger UI shows every endpoint that needs a test.

---

## Module 1 — Map the Gaps (25 min)

### 1a. Orient from the spec

> 💬 Ask: "Read openapi.yaml and both test files. Which routes have integration tests and which are completely untested? Give me a table."

Claude cross-references the 14 paths in `openapi.yaml` against the six existing tests. Expected: PUT, individual-resource 404 paths, POST validation errors, and `/api/staff` routes are all missing.

### 1b. Prioritise

> 💬 Ask: "Which missing tests carry the most risk? Rank the top 3 and explain why."

Expected ranking: POST /api/events (creates data, has validation), DELETE (soft-delete correctness), POST /api/staff (Zod validation path untested).

**The point:** Claude audits coverage from the API contract — same as a QA engineer reading a spec before touching the code.

---

## Module 2 — Write the Test Strategy (30 min)

Open `CLAUDE.md` — the four `## Test Strategy`, `## Naming Conventions`, `## Shared Fixtures`, and `## Environment Config` sections are all `<!-- TODO -->` stubs.

> 💬 Ask: "Explore the project and fill in all four TODO sections of CLAUDE.md. Be precise — use naming conventions that already exist in the tests."

Then:

```
/clear
```

> 💬 Ask: "What test naming format does this project use for describe blocks?"

Claude reads `CLAUDE.md` → `@import .claude/code-style.md` → answers correctly without re-reading the test files.

**The point:** Write the strategy once. Every test generation request from this point forward follows the conventions you just encoded.

---

## Break (10 min)

---

## Module 3 — API Integration Tests (60 min)

### 3a. Success paths from the spec

> 💬 Ask: "Generate integration tests for the missing GET /api/events paths. Follow the patterns in events.test.ts."

PostToolUse hook fires after each save. Show the green output.

### 3b. POST validation tests

> 💬 Ask: "Generate tests for POST /api/events: valid creation returns 201, missing fields return 400, invalid category returns 400."

Point out: Claude derives required fields and valid category values directly from the OpenAPI schema — no need to inspect the route code.

### 3c. Extend to staff

> 💬 Ask: "Generate integration tests for all /api/staff routes. Match the pattern in volunteers.test.ts. Target 80% branch coverage."

### 3d. Run coverage and close gaps

```bash
cd backend && npm run test:coverage
```

> 💬 Ask: "Here's the coverage output. Which uncovered branches in routes/events.ts represent real risk? Write tests for those."

**The point:** The OpenAPI spec is the contract. Tests derived from it catch spec-vs-code disagreements — those disagreements are bugs.

---

## Module 4 — Playwright E2E (40 min)

### 4a. Story-to-spec mapping

> 💬 Ask: "Read user-stories.md. Which stories are highest value as E2E tests? Pick three and explain why unit tests can't catch what they'd catch."

### 4b. Extend the EventsPage object

> 💬 Ask: "Read tests/e2e/pages/EventsPage.ts. Add: waiting for events to load, getting the visible card count, finding an event by title. Show me the updated object before running anything."

### 4c. Write the events spec

> 💬 Ask: "Write a Playwright test: navigate to /events, assert 8 event cards are visible, assert the first event is titled 'Moonlit Midnight Ride'."

### 4d. Write the staff spec

> 💬 Ask: "Using the VolunteersPage page object, write a Playwright test: navigate to /staff, assert the heading 'Staff' is visible, assert 10 staff cards are shown."

**The point:** Page objects isolate selectors from test logic. When the UI changes, you update one file, not every test that references that page.

---

## Break (10 min)

---

## Module 5 — Test Data Management (35 min)

### 5a. Find the hard-coded data

> 💬 Ask: "Look at the test files and list every place test data is hard-coded inside a test body. What's the risk?"

### 5b. Parameterise with test.each

> 💬 Ask: "Convert the POST /api/events validation tests to use test.each with data from tests/fixtures/events.json."

### 5c. Build a factory

> 💬 Ask: "Create tests/factories/eventFactory.ts that exports a buildEvent() function with sensible defaults and a Partial<> override. Use it in the POST success test."

```typescript
export function buildEvent(overrides?: Partial<CreateEventRequest>): CreateEventRequest {
  return {
    title: 'Test Trail Ride',
    date: '2025-07-01',
    location: 'North Paddock',
    category: 'trail',
    description: 'A test event.',
    spotsTotal: 20,
    ...overrides,
  }
}
```

**The point:** Test data belongs in files and factories. When requirements change, update the fixture — not every test that used the value.

---

## Module 6 — Coverage Review (25 min)

```bash
cd backend && npm run test:coverage
```

> 💬 Ask: "Here's the coverage report. Which uncovered lines represent real risk, and which are acceptable to leave? Write one test for the riskiest uncovered branch."

> 💬 Ask: "We're at ~85% branch coverage. Argue for why I should accept the remaining 15% gaps."

Expected acceptable gaps: the `console.log` in server startup, the `if (NODE_ENV !== 'test')` guard, the Swagger UI setup. These are infrastructure wiring, not business logic.

**The point:** 100% coverage does not mean the code is correct. A thoughtful 85% where you understand every gap beats a reflexive 100% where you don't.

---

## Assignment (25 min)

**Add a Staff Registration form and cover it end-to-end:**

1. **Backend** — Zod validation on `POST /api/staff`: `name` (min 2 chars), `email` (valid), `role` (must be in `STAFF_ROLES`). Update `openapi.yaml`.

2. **Frontend** — `StaffForm` component above `VolunteerList` on `/staff`: controlled form, inline validation on blur, POST → refresh → reset.

3. **API tests** — 201 on valid payload; 400 on short name, invalid email, unknown role.

4. **Playwright test** — Fill and submit the form; assert the new member's name appears in the list.

Opening prompt:

```
I'm adding a staff registration form. Before writing any code,
read CLAUDE.md and give me a test plan: which API tests and Playwright
E2E tests fully cover this feature? List every file to create or modify.
```

---

## What This Demo Teaches

| Module | Capability |
|---|---|
| Map the gaps | Audit coverage from an API contract, not from the code |
| Test strategy | Permanent conventions in CLAUDE.md; `@import` for shared style |
| API tests | Derive tests from OpenAPI; coverage-driven iteration |
| Playwright E2E | Page objects; user-story-driven scenarios |
| Test data | Fixtures, test.each, factories; secrets out of test bodies |
| Coverage review | Coverage as a risk map, not a metric |
| Assignment | End-to-end practice: new feature, full suite from spec to browser |

---

## Reset After Demo

```bash
# Restore sparse test files
git restore backend/tests/events.test.ts
git restore backend/tests/volunteers.test.ts

# Remove generated factories
rm -rf backend/tests/factories/

# Remove any StaffForm created during assignment
rm -rf frontend/src/components/StaffForm/

# Remove E2E specs added during sessions
git restore frontend/tests/e2e/

# Clear CLAUDE.md stubs
git restore CLAUDE.md

# Remove coverage output
rm -rf backend/coverage/ frontend/coverage/

# Verify starting state
cd backend && npm test    # 4 tests pass
cd ../frontend && npm test  # 8 tests pass
```
