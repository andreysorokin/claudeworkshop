# System Architecture

Two deployable apps, one shared contract.

```
┌─────────────┐     HTTP/JSON      ┌─────────────┐
│  frontend   │ ─────────────────► │  backend    │
│ React + Vite│   GET /api/health  │ Express API │
└─────────────┘ ◄───────────────── └─────────────┘
```

## Repos

- **backend/** — Express + TypeScript API. Owns the HTTP contract and business logic.
- **frontend/** — React + Vite + TypeScript UI. Consumes the backend API.
- **shared/** — this repo. No runtime code; it ships standards + a knowledge hub.

## The API contract

The backend exposes JSON over HTTP. The current surface:

| Method | Path          | Response                                   |
|--------|---------------|--------------------------------------------|
| GET    | `/api/health` | `200 { "status": "ok", "service": "..." }` |

When a feature crosses the boundary, define the request/response shape here first, then implement
the backend route and the frontend caller against it. Keep this table the single source of truth
for the contract.

## Conventions

All repos follow the same code style, enforced by the `org-standards` plugin's lint hook and
documented in the `/org-standards:code-style` skill. See `glossary.md` for shared terms.
