# Glossary

Shared terms used across the backend and frontend repos.

- **Hub** — the `shared/` repo, run as an orchestrator with `--add-dir` over the app repos.
- **org-standards** — the single plugin every repo enables; carries skills, the commit command,
  and the lint/test hook.
- **org-shared** — the local directory marketplace (this repo) that serves the plugin.
- **Contract** — the HTTP/JSON interface between frontend and backend, defined in
  `architecture.md`.
- **Spec** — a short feature description with a repo-tagged task checklist, produced by
  `/org-standards:spec` and executed by `/org-standards:implement-spec`.
- **ADR** — Architecture Decision Record, stored per-repo under `docs/decisions/`.
