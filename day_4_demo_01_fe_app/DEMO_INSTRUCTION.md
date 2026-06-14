# Demo: Frontend Development with Claude Code

---

## The Story

The Enchanted Stables API is live. Now build the staff portal that sits in front of it — routing wired, events loading, a few bugs hiding in the scaffolding. Spend the day building, refactoring, debugging, and integrating, session by session, in a real browser.

---

## Setup

```bash
# Terminal 1 — backend  →  http://localhost:3001
cd day_4_demo_01_fe_app/backend && npm install && npm run dev

# Terminal 2 — frontend  →  http://localhost:5173
cd day_4_demo_01_fe_app/frontend && npm install && npm run dev

# Verify tests pass
cd backend && npm test    # 8 route tests
cd frontend && npm test   # 9 component tests
```

Open `http://localhost:5173`. You'll see the portal with a dark sidebar, three routes (Dashboard, Events, Staff), and events listed in the wrong order — that's the debugging exercise later.

---

## Session 1 — Repo Tour (30 min)

### 1a. Map the backend

> 💬 Ask: "What does this backend do? What routes are available and what does each one return?"

Claude reads `CLAUDE.md`, then `src/index.ts`, `src/routes/events.ts`, `src/data.ts`. It describes the seed data, the soft-delete pattern, and the `// ISSUE` comments in the POST route.

### 1b. Map the frontend component tree

> 💬 Ask: "Walk me through the frontend — what renders on screen, what data it loads, how components connect."

Claude traces: `App.tsx` → `Sidebar` → three page components → `EventList` → `useEvents` → `eventsApi.ts`.

### 1c. Ask for critique — no fixes yet

> 💬 Ask: "Review both apps and tell me what quality issues you see. Don't fix anything."

Expected findings:
- Backend `events.ts`: unsafe body cast, wrong status on POST, no validation on PUT
- Frontend `EventList.tsx`: inline styles, `key={index}`, no empty state, doesn't use `EventCard`
- Frontend `useEvents.ts`: sorts by `spotsRegistered` not `date`
- Frontend `Dashboard.tsx`: heading jumps h1→h3
- Frontend `EventCard.tsx`, `Sidebar.tsx`: contrast issue and missing `aria-label` (preview for Session 6)

**The point:** Claude reads `CLAUDE.md` first and uses `.claude/code-style.md` as the yardstick — not guesswork.

---

## Session 2 — Write CLAUDE.md (35 min)

Open `CLAUDE.md`. Show the `@import .claude/code-style.md` and the `<!-- TODO -->` sections.

> 💬 Ask: "Explore the project and fill in the Key Files and Test Patterns sections of CLAUDE.md."

Claude scans both apps and writes factual entries.

Then:

```
/clear
```

> 💬 Ask: "What test name format does this project use?"

Claude reads `CLAUDE.md` → imports `code-style.md` → answers `it('does X when Y')`. From the style guide, not memory.

**The point:** Write `CLAUDE.md` once. Every session, every team member benefits.

---

## Session 3 — Build StaffList (70 min)

### 3a. Spec first

> 💬 Ask: "I need a StaffList component that fetches from GET /api/staff and renders each member's name, role, and events count. Show me the plan before writing code."

Review the plan. Approve before code is written.

### 3b. Build end-to-end

> 💬 Ask: "Build StaffList end-to-end: API wrapper, hook, component, and tests. Follow the same patterns as EventList and eventsApi."

Watch Claude:
1. Add `fetchStaff` to `src/api/volunteersApi.ts`
2. Create `src/hooks/useStaff.ts`
3. Create `src/components/StaffList/StaffList.tsx`
4. Create `src/components/StaffList/StaffList.test.tsx`

The PostToolUse hook runs `npm test` after each test file edit. If a test fails, Claude self-corrects.

### 3c. Wire it in

> 💬 Ask: "Replace the placeholder in VolunteersPage.tsx with the new StaffList component."

Show the result in the browser at `/staff`.

**The point:** Spec → plan → approve → execute. Hooks close the test-feedback loop without manual invocations.

---

## Break (15 min)

---

## Session 4 — Component Tests: Generate, Red → Green (45 min)

### 4a. Generate from an existing example

Point at `EventCard.test.tsx`:

> 💬 Ask: "Using EventCard.test.tsx as the pattern, generate tests for StaffList. Cover: loading state, renders all names, shows error, empty-list state."

Review before running. Ask: "Is each test checking behaviour, not implementation?"

### 4b. Write a failing test first

> 💬 Ask: "Before fixing the sort bug in useEvents, write a test that proves the first event returned is the Moonlit Midnight Ride (earliest date) — and confirm it currently fails."

Show the red output.

> "The failing test is proof of the bug, not just documentation."

### 4c. Fix the sort

> 💬 Ask: "Fix the sort in useEvents so the test passes."

Claude changes `b.spotsRegistered - a.spotsRegistered` → `a.date.localeCompare(b.date)`. Hook fires. All green. Refresh the browser — events now appear chronologically.

**The point:** Good test prompts specify observable behaviour. "Renders staff names" is a test; "calls useStaff" is not.

---

## Session 5 — Refactor EventList (40 min)

> 💬 Ask: "Earlier you found four issues in EventList.tsx. Fix them one at a time. Start with replacing inline rendering with EventCard."

One fix at a time:
1. Replace `<li>` block with `<EventCard event={event} />` — verify in browser
2. Replace `key={index}` with `key={event.id}` — explain why before fixing
3. Add empty-state: "No upcoming events."
4. Replace inline styles with CSS classes from App.css
5. Add test: "shows 'No upcoming events.' when list is empty"

**The point:** One change, one commit, one verification. ESLint hook validates inline. Browser confirms rendering.

---

## Break (10 min)

---

## Session 6 — Accessibility Audit (35 min)

> 💬 Ask: "Review this application for accessibility issues. Check: keyboard navigation, ARIA labels, heading hierarchy, colour contrast, semantic HTML. List every issue."

Expected findings (all planted):

| Location | Issue |
|---|---|
| `Sidebar.tsx` | Menu button has no `aria-label` |
| `EventCard.tsx` | Date/location uses `--color-text-muted` (#9ca3af) on white — WCAG AA fail |
| `Dashboard.tsx` | Heading jumps h1→h3, skips h2 |

> 💬 Ask: "Fix all the accessibility issues you found."

Review each diff. Tab through the UI with DevTools open — confirm focus ring visible.

**The point:** One audit prompt surfaces real issues faster than manual review. Every fix is a reviewable diff.

---

## Assignment (20 min)

**Add a Staff Registration form to `/staff`:**

1. **Backend** — POST `/api/staff` already exists. Add Zod validation: `name` (min 2 chars), `email` (valid format), `role` (one of `STAFF_ROLES`).

2. **Frontend** — add a `StaffForm` component above `StaffList`:
   - Controlled form: Name, Email, Role (select from `GET /api/staff/roles`)
   - Client-side validation — inline errors on blur
   - On valid submit: POST `/api/staff`, refresh list, reset form
   - Success banner or error message

3. **Tests** — at least 3 component tests:
   - Form renders with all fields
   - Shows validation errors for blank/invalid input
   - Calls the API and resets on valid submit

Opening prompt:

```
I need to add a staff registration form. Start with a plan —
list every file you'll create or modify before touching anything.
```

---

## What This Demo Teaches

| Session | Capability |
|---|---|
| Repo tour | Navigate a full-stack app in natural language; identify issues without a brief |
| CLAUDE.md | Permanent context across both apps; `@import` for shared standards |
| Build StaffList | Spec → hook → component → tests; PostToolUse closes the feedback loop |
| Component tests | Generate from examples; red → green; what makes a good test prompt |
| Refactor EventList | One fix at a time; ESLint hook validates inline; browser confirms |
| A11y audit | Single prompt finds planted issues; every fix is a reviewable diff |
| Assignment | Independent end-to-end practice across both apps |

---

## Reset After Demo

**Frontend** — restore the sort bug in `useEvents.ts`:

```typescript
const sorted = [...data].sort((a, b) => b.spotsRegistered - a.spotsRegistered)
```

Delete session files:
- `src/hooks/useEvents.test.ts`
- `src/components/StaffList/`
- Any `StaffForm` files from the assignment

Restore `EventList.tsx` to the intentional-issue version (inline styles, `key={index}`, no `EventCard`).

**Backend** — restore in `src/routes/events.ts`:

```typescript
// POST handler:
const { ... } = req.body as Partial<Event>   // unsafe cast
res.json(newEvent)                           // not 201

// PUT handler — remove any Zod added during the session
store.events[idx] = { ...store.events[idx], ...req.body, id: store.events[idx].id }
```
