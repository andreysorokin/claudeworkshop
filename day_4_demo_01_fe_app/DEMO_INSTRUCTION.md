# Demo: Frontend Development with Claude Code

---

## The Story

The charity's event API is live. Now build the staff portal that sits in front of it.
You start with a running backend and a React scaffold — routing wired up, a working `EventList` that already has issues — and spend the day building, refactoring, debugging, and integrating, session by session, in a real browser.

---

## Setup (before the session)

```bash
# Terminal 1 — backend  →  http://localhost:3001
cd day_4_demo_01_fe_app/backend
npm install
npm run dev

# Terminal 2 — frontend  →  http://localhost:5173
cd day_4_demo_01_fe_app/frontend
npm install
npm run dev

# Verify tests pass
cd backend  && npm test          # 8 route tests
cd ../frontend && npm test       # 9 component tests
```

Open `http://localhost:5173`. You'll see the portal with a dark sidebar, three routes (Dashboard, Events, Volunteers), and events listed in the wrong order (that's the debugging exercise later).

---

## Repo Tour: Explore Both Apps (30 min)

### 1a. Map the backend

```
What does this backend do? What routes are available and what does each one return?
```

Claude reads `CLAUDE.md`, then `src/index.ts`, `src/routes/events.ts`, `src/data.ts`.
It describes the seed data, the soft-delete pattern, and the `// ISSUE` comments in the POST route.

### 1b. Map the frontend component tree

```
Walk me through the frontend. What renders on the screen, what data it loads, and how the components connect.
```

Claude traces: `App.tsx` → `BrowserRouter` + `Sidebar` → three page components → `EventList` → `useEvents` → `eventsApi.ts`.

### 1c. Trace the routing

```
What routes does the app have? What component renders at each one?
```

Claude reads `App.tsx` and explains the `<Routes>` setup, the `Sidebar` `NavLink` active styling, and the placeholder `VolunteersPage`.

### 1d. Ask for a critique

```
Review both apps and tell me what quality issues you see. Don't fix anything yet.
```

Expected findings:
- Backend `events.ts`: unsafe body cast, wrong status code on POST, no validation on PUT
- Frontend `EventList.tsx`: inline styles, `key={index}`, no empty state, doesn't use `EventCard`
- Frontend `useEvents.ts`: sorts by `spotsRegistered` not `date`
- Frontend `Dashboard.tsx`: heading hierarchy jumps h1→h3
- Frontend `EventCard.tsx`, `Sidebar.tsx`: colour-contrast and missing `aria-label` (preview for the a11y session)

**Teaching point**: Claude reads `CLAUDE.md` first and uses `.claude/code-style.md` as the yardstick — not guesswork.

---

## Write CLAUDE.md: Permanent Context (35 min)

### 2a. Show the scaffold

Open `CLAUDE.md`. Point out:
- `@import .claude/code-style.md` on line 3 — coding standards load every session automatically
- The `<!-- TODO -->` sections participants will fill in during this step

### 2b. Fill in Key Files and Test Patterns

```
Explore the project and fill in the Key Files and Test Patterns sections of CLAUDE.md.
```

Claude scans both apps and writes factual entries.

### 2c. Prove the context loaded

```
/clear
```

Then, without pointing to any file:

```
What test name format does this project use?
```

Claude reads `CLAUDE.md` → `@import .claude/code-style.md` → answers `it('does X when Y')`.
It learned this from the style guide, not from memory.

**Teaching point**: Write `CLAUDE.md` once. Benefit every session, every team member.

---

## Build a New Feature: VolunteerList (70 min)

### 3a. Spec it first

```
I need a VolunteerList component that fetches from GET /api/volunteers and renders
each volunteer's name, role, and events count. Show me the plan before writing code.
```

Review the plan. Approve before code is written.

### 3b. Build end-to-end

```
Build VolunteerList end-to-end: API wrapper, hook, component, and tests.
Follow the same patterns as EventList and eventsApi.
```

Watch Claude:
1. Add `fetchVolunteers` (note `src/api/volunteersApi.ts` already exists as a starting point)
2. Create `src/hooks/useVolunteers.ts`
3. Create `src/components/VolunteerList/VolunteerList.tsx`
4. Create `src/components/VolunteerList/VolunteerList.test.tsx`

The PostToolUse hook runs `npm test` after each test file edit. If a test fails, Claude self-corrects before continuing.

### 3c. Wire it into VolunteersPage

```
Replace the placeholder in VolunteersPage.tsx with the new VolunteerList component.
```

Show the result in the browser at `/volunteers`.

**Teaching point**: Spec → plan → approve → execute. The hook closes the test-feedback loop without manual test invocations.

---

## Break (15 min)

---

## Component Tests: Generate, Review, Fix (45 min)

### 4a. Generate from an existing example

Point at `EventCard.test.tsx` (5 passing tests):

```
Using EventCard.test.tsx as the pattern, generate tests for the VolunteerList component.
Cover: loading state, renders all volunteer names, shows error message, empty-list state.
```

Review what Claude generates before running. Ask: "Is each test testing behaviour, not implementation?"

### 4b. Run and fix

The PostToolUse hook fires. If any test fails, Claude explains the failure and fixes it.

### 4c. Write a failing test first (red → green)

```
Before we fix the sort bug in useEvents, write a test that proves the first event
returned is the February Gala (earliest date) — and confirm it currently fails.
```

Show the red output. Explain: the failing test is *proof of the bug*, not just documentation.

### 4d. Fix the sort

```
Fix the sort in useEvents so the test passes.
```

Claude changes `b.spotsRegistered - a.spotsRegistered` → `a.date.localeCompare(b.date)`. Hook fires. All green.
Refresh the browser — events now appear chronologically.

**Teaching point**: Good test prompts are specific about observable behaviour. "Renders volunteer names" is a test; "calls useVolunteers" is not.

---

## Refactor and Performance: Fix EventList (40 min)

### 5a. Pull up the Part 1 findings

```
Earlier you found four issues in EventList.tsx. Fix them one at a time.
Start with replacing the inline rendering with the EventCard component.
```

### 5b. Replace inline JSX with EventCard

Claude replaces the `<li>` block with `<EventCard event={event} />`. The ESLint hook fires. No new violations.

Verify in the browser — layout now uses the `.event-card` CSS class with hover animation.

### 5c. Fix the key prop

```
Fix the React key — use event.id instead of the array index.
```

Explain *why* `key={index}` breaks on reorder/filter before Claude fixes it.

### 5d. Add empty-state handling

```
Add an empty-state message: when no events are returned,
show "No upcoming events." instead of a blank list.
```

### 5e. Remove inline styles

```
Replace the remaining inline styles in EventList with CSS classes from App.css.
```

### 5f. Add a test for the new empty state

```
Add a test: when useEvents returns an empty array, EventList shows "No upcoming events."
```

All tests pass. Show the final clean `EventList.tsx` side-by-side with the original.

**Teaching point**: Refactor one thing at a time. The hooks make each change immediately verifiable. Each fix can be committed separately.

---

## Break (10 min)

---

## Accessibility and Code Review (35 min)

### 6a. Full a11y audit

```
Review this application for accessibility issues. Check: keyboard navigation, ARIA labels,
heading hierarchy, colour contrast, and semantic HTML. List every issue you find.
```

Expected findings (all planted):

| Location | Issue |
|---|---|
| `Sidebar.tsx` | Menu button has no `aria-label` |
| `EventCard.tsx` | Date/location text uses `--color-text-muted` (#9ca3af) on white — fails WCAG AA |
| `Dashboard.tsx` | Heading jumps from `<h1>` → `<h3>` — skips `<h2>` |
| `EventList.tsx` | After refactor: the wrapper `<div>` needs a `role` or be replaced with a semantic element |

### 6b. Apply the fixes

```
Fix all the accessibility issues you found.
```

Review each diff before accepting. Point out:
- `aria-label="Toggle sidebar"` added to the button
- Contrast fix: replace `--color-text-muted` with `--color-text-secondary` in `App.css`
- Add an `<h2>` between page title and stat cards in Dashboard
- Use `<ul>`/`<li>` or a `<section>` where appropriate

### 6c. Tab through the UI

With DevTools open, tab through the sidebar and event cards. Confirm focus ring is visible.

**Teaching point**: "Review for a11y issues" is one of the most reliable prompts in the workshop. Claude finds issues faster than manual audit, and every fix is reviewable.

---

## Assignment Briefing (20 min)

Participants extend the portal independently using everything from Parts 3–6.

### The task

> **Add a Volunteer Registration form to `/volunteers`:**
>
> 1. **Backend** — the POST route already exists in `volunteersRouter` with basic validation.
>    Add Zod validation: `name` (min 2 chars), `email` (valid format), `role` (one of `VOLUNTEER_ROLES`).
>
> 2. **Frontend** — add a `VolunteerForm` component above `VolunteerList`:
>    - Controlled form with fields: Name, Email, Role (select populated from `GET /api/volunteers/roles`)
>    - Client-side validation — show inline errors on blur
>    - On valid submit: `POST /api/volunteers`, refresh the list, reset the form
>    - Show a success banner or error message
>
> 3. **Tests** — write at least 3 component tests:
>    - Form renders with all fields
>    - Shows validation errors for blank/invalid input
>    - Calls the API and resets on valid submit

Suggested opening prompt (share with participants):

```
I need to add a volunteer registration form. Start with a plan —
list every file you'll create or modify before touching anything.
```

---

## What This Demo Teaches

| Session | Capability demonstrated |
|---|---|
| Repo tour | Navigate a full-stack app in natural language; identify issues without a brief |
| CLAUDE.md | Permanent context across both apps; `@import` for shared standards |
| Build VolunteerList | Spec → hook → component → tests in one flow; PostToolUse closes the feedback loop |
| Component tests | Generate tests from examples; red → green; distinguishing good test prompts |
| Refactor EventList | One fix at a time; ESLint hook validates inline; browser confirms rendering |
| A11y review | Single audit prompt surfaces real issues; every fix is a reviewable diff |
| Assignment | Independent end-to-end practice across both apps |

---

## Engineering Harness

| Hook | Trigger | Effect |
|---|---|---|
| PostToolUse lint | Any edit to `frontend/src/**` | ESLint output lands in Claude's context — violations fixed in the same turn |
| PostToolUse test | Any edit to `*.test.{ts,tsx}` | `npm test` output shows pass/fail immediately |
| PostToolUse tsc | Any edit to `backend/src/**` | TypeScript errors surface before the route is called |
| Deny rule | `dist/**`, `.env*` | Claude cannot write compiled output or secrets files |

---

## Resetting After the Demo

**Frontend** — restore the sort bug in `useEvents.ts`:
```typescript
// Restore this line:
const sorted = [...data].sort((a, b) => b.spotsRegistered - a.spotsRegistered)
```

Delete any files created during the session:
- `src/hooks/useEvents.test.ts` (written during Part 4)
- `src/components/VolunteerList/` (written during Part 3)
- Any `VolunteerForm` files from the assignment

Restore `EventList.tsx` to the intentional-issue version (inline styles, `key={index}`, no `EventCard`).

**Backend** — restore intentional issues in `src/routes/events.ts`:
```typescript
// Restore in POST handler:
const { ... } = req.body as Partial<Event>   // unsafe cast
res.json(newEvent)                           // not res.status(201)

// Restore in PUT handler — remove any Zod added during the session
store.events[idx] = { ...store.events[idx], ...req.body, id: store.events[idx].id }
```
