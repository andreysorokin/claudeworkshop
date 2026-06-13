# Day 5 — QAA: AI-Assisted Test Suite Development

---

## The Story

The staff portal from Day 4 is live and working. Now a new team member asks: "How do we know this thing doesn't break?"

Your job today: build a professional test suite from scratch — API integration tests, E2E browser tests, and test data management — using Claude Code to generate, review, and improve tests faster than writing by hand.

The app has six tests today. By end of session you'll have sixty.

---

## Setup (before the session)

```bash
# Terminal 1 — backend  →  http://localhost:3001
cd day_5_demo_01_qaa/backend
npm install
npm run dev

# Terminal 2 — frontend  →  http://localhost:5173
cd day_5_demo_01_qaa/frontend
npm install
npm run dev

# Verify starting state
cd backend  && npm test          # 4 tests pass (events: 3, volunteers: 2)
cd ../frontend && npm test       # 8 tests pass (2 per component)

# Install Playwright browsers (once)
cd frontend && npx playwright install chromium
```

Open `http://localhost:5173`. The portal shows Dashboard, Events (8 cards), and Volunteers (10 cards).
Open `http://localhost:3001/api-docs`. Swagger UI shows the complete API spec.

---

## Module 1: Repo Tour (30 min)

**Learning objective**: Map an unfamiliar codebase and quantify test gaps using Claude Code.

### 1a. Explore the API structure

```
Walk me through the backend. What endpoints exist, what do they accept,
and what do they return? Use the OpenAPI spec and source code both.
```

Claude reads `CLAUDE.md` → `openapi.yaml` → `src/routes/events.ts` → `src/routes/volunteers.ts`.
Expect: a table of all 14 endpoint paths with their HTTP verbs, request schemas, and response codes.

### 1b. Quantify the existing test coverage

```
What tests already exist? How many routes are tested versus documented in the spec?
List the gaps.
```

Claude reads `tests/events.test.ts` (4 tests) and `tests/volunteers.test.ts` (2 tests).
It compares against the 14 paths in `openapi.yaml`.

Expected output: ~6/14 paths have any tests; PUT, 404 paths, POST error cases, and individual volunteer routes are all untested.

### 1c. Explore the frontend tests

```
What frontend tests exist? Which component behaviours are covered and which are missing?
```

Claude finds 8 unit tests across 4 components. Missing: error states, empty states, hook tests, E2E tests (only 1 example).

### 1d. Check the engineering harness

```
What happens if I edit a backend test file? Show me the hooks in .claude/settings.json.
```

Claude reads `.claude/settings.json` and describes the PostToolUse hooks — each edit to a test file auto-runs the test suite.

**Teaching point**: Claude builds a mental model from both human-readable (openapi.yaml) and executable (test files) artifacts. Start every QAA engagement this way — understand what exists before generating anything.

---

## Module 2: Write CLAUDE.md (35 min)

**Learning objective**: Encode test strategy as permanent context that improves every subsequent session.

### 2a. Fill in the Test Strategy section

```
Explore the project structure, then fill in the Test Strategy section of CLAUDE.md.
Cover: which routes need integration tests, which components need unit tests,
which user stories from user-stories.md should become E2E tests,
and what coverage threshold we should aim for.
```

Claude reads `user-stories.md`, then writes a concrete test strategy.

### 2b. Fill in the Naming Conventions section

```
Look at the existing tests and establish naming conventions in CLAUDE.md.
Cover: describe block naming, it() string format, and test file locations.
```

Claude reads `tests/events.test.ts` and component tests, then writes conventions that match what already exists.

### 2c. Fill in the Shared Fixtures section

```
Add the Shared Fixtures section. Cover: where fixtures live, when to use a fixture
vs a factory, how test.each uses fixture data, and how resetStore() works.
```

Claude reads `tests/fixtures/events.json` and the `resetStore()` import pattern in existing tests.

### 2d. Fill in Environment Config section

```
Add the Environment Config and Secrets section. Cover .env.example, why .env files
are deny-listed, TEST_BASE_URL for Playwright, and safe practices for test data.
```

### 2e. Prove the context loaded

Type `/clear`, then without pointing to any file:

```
What test naming format does this project use?
```

Claude reads `CLAUDE.md` → `@import .claude/code-style.md` → answers with `it('does X when Y')`.

**Teaching point**: Write CLAUDE.md once. Every test generation request this afternoon will automatically follow the conventions you just encoded.

---

## Module 3: API Test Generation (70 min)

**Learning objective**: Derive comprehensive API tests from an OpenAPI spec; iterate on coverage until gaps are closed.

### 3a. Generate from the spec — success paths

```
Read openapi.yaml and backend/src/routes/events.ts.
Generate integration tests for all GET /api/events paths that aren't covered yet.
Follow the patterns in backend/tests/events.test.ts.
```

PostToolUse hook fires after each file save. Show the test output.

Expected additions: `GET /api/events/:id` 404 case, category filter with no matches.

### 3b. Generate POST tests

```
Generate tests for POST /api/events. Cover:
- 201 on a valid payload
- Response body matches the Event schema from openapi.yaml
- 400 when required fields are missing
- 400 when category is not one of the four valid values
```

Point out: Claude derives which fields are required and which values are valid directly from the schema — this is why the spec is the source of truth.

### 3c. Generate PUT and DELETE tests

```
Generate tests for PUT /api/events/:id and DELETE /api/events/:id.
Include both success and 404 paths for each.
```

### 3d. Run coverage and iterate

```
Run npm run test:coverage in the backend. Which branches in routes/events.ts
are still uncovered? Generate tests for those branches.
```

Show the coverage text report. After this step, events.ts should be >80% covered.

### 3e. Extend to volunteers

```
Generate integration tests for all /api/volunteers routes using the same patterns.
Aim for at least 80% line coverage on volunteers.ts.
```

**Teaching point**: The OpenAPI spec is the contract. Tests generated from it are both more complete and more aligned to the actual specification than tests written by reading code. When the spec and the code disagree, that's a bug.

---

## Break (15 min)

---

## Module 4: Playwright E2E Tests (45 min)

**Learning objective**: Write page objects and test scenarios from user stories; handle flakiness with proper waiting strategies.

### 4a. Read the user stories

```
Read user-stories.md. Which stories should become E2E tests?
Rank them by value — which ones test critical user journeys
that unit tests cannot catch?
```

Claude reads `user-stories.md` and identifies 4–5 high-value E2E candidates.

### 4b. Extend the EventsPage page object

```
Read frontend/tests/e2e/pages/EventsPage.ts. Extend it to support:
- Waiting for events to load (no loading spinner visible)
- Getting the count of visible event cards
- Checking whether a specific event title is present on the page
```

Show the updated POM before running tests.

### 4c. Write test scenarios

```
Using the EventsPage page object, write Playwright tests for these user stories:
- I can view all 8 upcoming events
- I can see the title of the first event is "Winter Fundraising Gala"
Use proper waitFor strategies — don't assume the data loads instantly.
```

PostToolUse hook fires and runs the Playwright test.

**Note**: Requires both servers running. If the hook fails, run `cd frontend && npm run test:e2e` manually.

### 4d. Write the VolunteersPage tests

```
Create frontend/tests/e2e/volunteers.spec.ts. Write a test for:
"I can view the volunteers list and see Sarah Chen's name."
Use the VolunteersPage page object pattern.
```

### 4e. Discuss flakiness

```
What could make these tests flaky in CI? Give me 3 specific risks
and how Playwright's built-in mechanisms address each one.
```

Expected answer: network latency (auto-waiting), timing of state updates (waitForSelector), and test isolation (beforeEach navigation).

**Teaching point**: Page objects isolate test logic from DOM selectors. When the UI changes, you update one page object, not every test that uses it.

---

## Module 5: Test Data Management (40 min)

**Learning objective**: Eliminate hard-coded test data using fixtures, factories, and parameterised tests.

### 5a. Identify hard-coded data

```
Look at backend/tests/events.test.ts and the frontend component tests.
List every place where test data is hard-coded inside the test body.
What are the risks of leaving it there?
```

Expected: inline event payloads in POST tests, inline mock events in component tests.

### 5b. Introduce parameterised tests with test.each

```
Convert the POST /api/events validation tests to use test.each.
The data should come from backend/tests/fixtures/events.json.
Each row in the array is a valid event payload; add a row for each
validation error case (missing field, wrong category).
```

Show how `test.each` makes adding new cases trivial — one line of data per test case.

### 5c. Create an event factory

```
Create backend/tests/factories/eventFactory.ts.
It should export a function that returns a valid CreateEventRequest with
sensible defaults, accepting a partial override object.
Use it in the POST /api/events success test.
```

Pattern to follow:
```typescript
export function buildEvent(overrides?: Partial<CreateEventRequest>): CreateEventRequest {
  return {
    title: 'Test Event',
    date: '2025-07-01',
    location: 'Test Venue',
    category: 'community',
    description: 'A test event.',
    spotsTotal: 30,
    ...overrides,
  }
}
```

### 5d. Discuss .env and secrets

```
How should we handle test credentials, API keys, and external service URLs
so they don't end up hard-coded in tests or committed to source control?
Show me the .env.example approach and explain the deny rule.
```

Point to `.env.example` and `.claude/settings.json` deny rules. Show that `Write(**/.env)` is blocked.

**Teaching point**: Test data belongs in files and factories, not in prompts or test bodies. When a test requirement changes, you update the fixture, not every test that used the data.

---

## Break (10 min)

---

## Module 6: Coverage Review (35 min)

**Learning objective**: Use coverage reports to identify untested paths, prioritise the gaps, and make reasoned decisions about what to leave uncovered.

### 6a. Run and read the coverage report

```
Run the backend coverage report and show me the output.
```

```bash
cd backend && npm run test:coverage
```

Walk through the text report:
- `%Stmts` = line/statement coverage
- `%Branch` = conditional branch coverage (most important for buggy code)
- `%Funcs` = function-level coverage
- Uncovered lines shown in the rightmost column

### 6b. Identify high-risk gaps

```
Based on the coverage report, which uncovered branches could hide real bugs?
List the top 3 in order of risk, and explain what could go wrong if each is untested.
```

Point out that not all uncovered code has equal risk — a missing else branch on validation vs. a missing branch on a security check are very different risks.

### 6c. Generate missing edge cases

```
Generate tests for the two highest-risk uncovered branches.
Before writing each test, tell me what bug it would catch if the code were wrong.
```

Watch Claude explain the risk before writing — this is the key practice.

### 6d. Evaluate what NOT to test

```
We're at 85% branch coverage. Which remaining 15% would you NOT bother testing and why?
Give me a reasoned argument for each gap you'd accept.
```

Expected: the swagger UI setup code, the `console.log` in server startup, the `if (NODE_ENV !== 'test')` guard. These are infrastructure code, not business logic.

**Teaching point**: Coverage is a signal, not a goal. 100% coverage does not mean the code is correct — it means every line ran at least once. A thoughtful 85% where you know the gaps beats a reflexive 100% where you don't.

---

## Assignment Briefing (5 min)

Participants build a complete test suite for a new feature independently.

### The Task

> **Add a Volunteer Registration form and cover it end-to-end:**
>
> 1. **Backend** — Add Zod validation to `POST /api/volunteers`:
>    `name` (min 2 chars), `email` (valid format), `role` (must be one of `VOLUNTEER_ROLES`).
>    Update `openapi.yaml` to document the new validation constraints.
>
> 2. **Frontend** — Add a `VolunteerForm` component above `VolunteerList` on `/volunteers`:
>    - Controlled form: Name, Email, Role (select populated from `GET /api/volunteers/roles`)
>    - Inline validation errors on blur
>    - On valid submit: `POST /api/volunteers`, refresh the list, reset the form
>
> 3. **API tests** — Derive from `openapi.yaml`:
>    - 201 on a valid payload
>    - 400 on short name, invalid email, unknown role
>
> 4. **Playwright test** — From user story "I can register a new volunteer":
>    - Fill and submit the form
>    - Verify the new volunteer's name appears in the list

### Suggested opening prompt

```
I'm adding a volunteer registration form. Before writing any code,
read CLAUDE.md and give me a test plan: which API tests and Playwright
E2E tests would fully cover this feature? List files to create/modify.
```

---

## What This Demo Teaches

| Session | Capability demonstrated |
|---|---|
| Repo tour | Map an unfamiliar codebase; quantify test gaps without running any code |
| Write CLAUDE.md | Encode test strategy as permanent context; conventions stick across all generations |
| API test generation | Derive tests from OpenAPI spec; coverage-driven iteration; spec-as-contract |
| Playwright E2E | Page object pattern; user-story-driven scenarios; flakiness strategies |
| Test data management | Fixtures; `test.each`; factories; `.env` hygiene; data out of prompts |
| Coverage review | Interpret coverage reports; prioritise by risk; accept acceptable gaps |
| Assignment | End-to-end practice: new feature, full test suite from spec to browser |

---

## Engineering Harness

| Hook | Trigger | Effect |
|---|---|---|
| PostToolUse tsc | `backend/src/**/*.ts` edited | TypeScript errors surface before running |
| PostToolUse test | `backend/tests/**/*.ts` edited | Integration test output shown immediately |
| PostToolUse lint | `frontend/src/**/*.{ts,tsx}` edited | ESLint violations shown; fixed in same turn |
| PostToolUse test | `frontend/src/**/*.test.{ts,tsx}` edited | Unit test output shown immediately |
| PostToolUse e2e | `frontend/tests/e2e/**/*.ts` edited | Playwright test fires (requires running dev servers) |
| Deny | `**/dist/**`, `**/coverage/**` | Cannot write compiled output or coverage reports |
| Deny | `**/.env` | Cannot write secrets files |

---

## Resetting After the Demo

```bash
# Remove generated test and factory files
rm -rf backend/tests/factories/
git restore backend/tests/events.test.ts
git restore backend/tests/volunteers.test.ts

# Remove any VolunteerForm created during assignment
rm -rf frontend/src/components/VolunteerForm/
git restore frontend/tests/e2e/

# Remove coverage reports
rm -rf backend/coverage/
rm -rf frontend/coverage/

# Clear the CLAUDE.md test strategy sections (restore stub)
git restore CLAUDE.md

# Verify starting state
cd backend  && npm test   # 4 tests pass
cd ../frontend && npm test  # 8 tests pass
```
