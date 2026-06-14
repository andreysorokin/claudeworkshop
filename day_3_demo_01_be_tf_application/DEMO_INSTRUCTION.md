# Demo: Backend API, Terraform & the Full Agentic Loop

---

## The Story

You're the first engineer at the Enchanted Stables. Someone handed you a half-finished horse registry API, a blank CLAUDE.md, and a list of features to ship. Over the day you'll understand the code, document it, extend it, debug a real bug, and generate Azure infrastructure — without ever losing your place.

Every session flows from the one before it.

---

## Setup

```bash
cd day_3_demo_01_be_tf_application
dotnet build
dotnet test   # all 9 tests should pass
dotnet run --project src/StableApi   # http://localhost:5000/swagger
```

---

## Part 1 — Repo Tour: Natural-Language Navigation (30 min)

### 1a. First impression

> 💬 Ask: "What does this project do? Give me a 2-sentence summary."

Watch Claude read `CLAUDE.md` first (even though it's a stub), then scan the source. It will describe the horse registry and in-memory store.

**The point:** Claude always loads CLAUDE.md. Even a stub tells it the shape of the project.

### 1b. Explore the layers

> 💬 Ask: "Walk me through the layers of this API. What lives in Controllers, Services, and Models?"

Claude describes the thin-controller / service-logic / data-container split.

### 1c. Trace a call chain

> 💬 Ask: "Where is the business logic for registering a horse? Show me the full call path from HTTP request to in-memory store."

Watch Claude navigate `HorsesController → IHorseService → HorseService` without being told where to look.

### 1d. Ask for critique — no fixes yet

> 💬 Ask: "Review HorsesController and tell me what quality issues you see. Don't change anything."

Claude finds the three labelled issues (`GetById`, `Create`, `Delete`) and the manual validation. This sets up Part 4.

**The point:** Natural-language questions work as well as `cat`. Claude builds a mental model across reads — you don't feed it files one by one.

---

## Part 2 — Writing CLAUDE.md: Making Context Permanent (35 min)

### 2a. Show the scaffold

Open `CLAUDE.md`. Point out:
- Line 3: `@import .claude/code-style.md` — already active, loads every session
- The `<!-- TODO -->` sections — what participants fill in

Open `.claude/code-style.md` alongside.

> "The `@import` directive separates concerns. Project rules in CLAUDE.md; team coding standards in code-style.md — shared across repos."

### 2b. Fill in Architecture and Domain Model

> 💬 Ask: "Explore the project and fill in the Architecture and Domain Model sections of CLAUDE.md."

Claude inspects `Controllers/`, `Services/`, `Models/`, and `Program.cs`, then writes factual entries. Review together — correct anything imprecise.

### 2c. Document test patterns

> 💬 Ask: "Read HorsesControllerTests.cs and document the testing patterns in the Test Patterns section of CLAUDE.md."

Claude describes Arrange/Act/Assert, Moq usage, and the `MethodName_Scenario_ExpectedBehaviour` naming format.

### 2d. Confirm it loads

```
/clear
```

> 💬 Ask: "What HTTP status code should a successful DELETE return according to our code style?"

Claude reads `CLAUDE.md` (which imports `code-style.md`) and answers `204 No Content` — from the style guide, not memory.

**The point:** Write CLAUDE.md once. Every future session and every team member benefits.

---

## Part 3 — Adding a New Endpoint: Spec → Model → Service → Controller → Tests (70 min)

### 3a. Plan it first

> 💬 Ask: "I need to add a POST /api/horses/{id}/retire endpoint. The body carries a Reason string. Returns 200 with the updated horse, or 404 if not found. Walk me through the plan before writing any code."

Review the plan. Redirect if needed. Approve.

### 3b. Add the model

> 💬 Ask: "Add a RetireRequest record to HorseRequests.cs with a single Reason property."

### 3c. Extend the service

> 💬 Ask: "Add a Retire(int id, RetireRequest request) method to IHorseService and implement it in HorseService. Mark the horse inactive and store the reason."

Claude will add a `RetirementReason` property to `Horse` too — that's the expected flow.

### 3d. Add the controller action

> 💬 Ask: "Add the POST /api/horses/{id}/retire action to HorsesController."

### 3e. Add FluentValidation

> 💬 Ask: "Add FluentValidation to the project. Create a RetireRequestValidator that requires Reason to be between 5 and 200 characters. Register it in Program.cs."

Watch Claude add the NuGet package, create the validator, register it, and update the action.

### 3f. Write tests

> 💬 Ask: "Add unit tests for the retire endpoint to HorsesControllerTests.cs. Cover: valid request returns 200, short reason returns 400, horse not found returns 404."

The PostToolUse hook fires after the test file is saved — `dotnet test` runs automatically. Claude self-corrects if anything fails.

**The point:** Full spec-to-test workflow in one session. The hook closes the feedback loop — no manual terminal switching.

---

## Part 4 — Refactoring: One Issue at a Time (45 min)

### 4a. Recall the findings

> 💬 Ask: "Earlier you found quality issues in HorsesController. Fix them one at a time. Start with GetById returning 200 for a missing horse."

### 4b. Fix: GetById → 404

Claude adds the null-check and returns `NotFound()`. The format hook fires.

> 💬 Ask: "Add a test: GetById_NonExistentHorse_ReturnsNotFound"

Test hook fires. All pass.

### 4c. Fix: Create → 201 Created

> 💬 Ask: "Fix Create to return 201 Created with a Location header pointing to the new horse."

Claude changes to `CreatedAtAction(nameof(GetById), ...)`. Update the test expectation.

### 4d. Fix: Delete → 204 No Content

> 💬 Ask: "Fix Delete to return 204 No Content."

Update the test expectation.

### 4e. Replace manual validation

> 💬 Ask: "The Create action has inline string validation. Replace it with a CreateHorseRequestValidator using FluentValidation — same rules: Name ≥ 2 characters, OwnerEmail must contain @."

Claude creates the validator, registers it, strips the manual checks.

### 4f. Final review

> 💬 Ask: "Review HorsesController again. Anything left to improve?"

**The point:** Identify → confirm → change one thing → verify. Hooks make verification free.

---

## Part 5 — Terraform: Generate Infrastructure from Requirements (40 min)

### 5a. Show the requirements comment

Open `infrastructure/main.tf`. The comment block describes what to build:
- Azure Resource Group, App Service Plan (B1, Linux), .NET 8 Web App
- SQL Server + Basic database
- `ASPNETCORE_ENVIRONMENT` app setting
- Outputs for hostname and SQL FQDN

### 5b. Generate

> 💬 Ask: "Read the requirements comment in infrastructure/main.tf and generate all the Azure resources. Use variables from variables.tf."

Claude writes the resource group, service plan, web app, SQL server, database, and outputs.

### 5c. Review and explain

> 💬 Ask: "Explain the azurerm_linux_web_app block — what does each attribute do?"

### 5d. Add a staging slot

> 💬 Ask: "Add a staging deployment slot to the web app."

### 5e. Secure the connection string

> 💬 Ask: "The SQL connection string is a plain app setting. Show me how to reference it from Azure Key Vault instead."

Claude introduces `azurerm_key_vault` and a `@Microsoft.KeyVault(...)` reference. Discuss: Claude generates the pattern; the engineer owns the security review.

**The point:** Generate → review → iterate. Claude produces valid HCL from plain English. The engineer signs off on security.

---

## Part 6 — Debugging: Inspect → Red Test → Fix (35 min)

### 6a. Surface the complaint

> "Users report that GET /api/horses?page=1&pageSize=2 returns horses 3 and 4 instead of 1 and 2."

> 💬 Ask: "We have a pagination bug. GET /api/horses?page=1&pageSize=2 returns the wrong horses. Help me find it."

### 6b. Watch the inspection

Claude reads `HorsesController.GetAll` → traces to `HorseService.GetPaged` → spots the discrepancy: doc comment says "1-based" but code does `Skip(page * pageSize)` (0-based).

> "This is the inspect phase. Claude found the exact line where the spec and the code disagree."

### 6c. Write a failing test first

> 💬 Ask: "Before fixing, write a failing unit test in HorseServiceTests.cs that proves page 1 returns the first two horses and currently fails."

Hook fires. `dotnet test` shows the new test failing.

> "Red first. The failing test is the proof of the bug."

### 6d. Fix

> 💬 Ask: "Fix the pagination bug so the test passes."

Claude changes `Skip(page * pageSize)` to `Skip((page - 1) * pageSize)`. All tests go green.

### 6e. The loop

```
inspect → hypothesise → red test → fix → green test
```

**The point:** The loop is the same whether the bug took 30 seconds or 3 hours. You don't close it until it's green.

---

## Part 7 — Assignment (20 min)

**Add a `Race` entity with full CRUD:**

```
A Race has: Id, Name, TrackName, StartDate, EndDate, IsActive.

1. Model + request DTOs (CreateRaceRequest, UpdateRaceRequest)
2. IRaceService and RaceService with in-memory storage
3. RacesController — GET (all, paged), GET by id, POST, PUT, DELETE
4. FluentValidation: Name required, StartDate must be before EndDate
5. Unit tests for all controller actions
6. Terraform: Azure Storage Account for race photo uploads
```

Suggested opening prompt:

```
I need to add a Race entity to this API. Start with a plan —
list every file you'll create or modify before touching anything.
```

---

## What This Demo Teaches

| Session | Capability |
|---|---|
| Repo tour | Natural-language exploration without reading every file |
| CLAUDE.md | Permanent layered context; `@import` for modular standards |
| Add endpoint | Full spec-to-test workflow in one agentic session |
| Refactor | One issue at a time, hooks verify each change |
| Terraform | Valid HCL from a plain-English requirements description |
| Debugging | inspect → red test → fix → green loop |
| Assignment | Independent end-to-end practice |

---

## Reset After Demo

Restore intentional issues in `HorsesController.cs`:

```csharp
// GetById — return Ok(horse) unconditionally (remove null check)
return Ok(horse);

// Create — return Ok(horse) instead of CreatedAtAction
return Ok(horse);

// Delete — return Ok() instead of NoContent()
return Ok();
```

Delete files created during Part 3 (`RetireRequest`, validators, new tests).

Remove FluentValidation from `StableApi.csproj` if added live.

Delete `tests/StableApi.Tests/HorseServiceTests.cs` if written during Part 6.

Restore `HorseService.GetPaged` to the buggy version:

```csharp
.Skip(page * pageSize)
```

---

## Files

```
DEMO_INSTRUCTION.md                         — this file
CLAUDE.md                                   — project scaffold (stub, filled in during Part 2)
.editorconfig                               — formatting rules
.claude/settings.json                       — PostToolUse hooks (format + test) + deny rules
.claude/code-style.md                       — coding standards imported by CLAUDE.md
StableApi.sln                               — solution file
src/StableApi/Program.cs                    — DI registration, middleware pipeline
src/StableApi/StableApi.csproj              — project file (Swashbuckle; FluentValidation added in Part 3)
src/StableApi/Controllers/HorsesController.cs   — 3 intentional issues (GetById, Create, Delete)
src/StableApi/Services/IHorseService.cs     — service contract
src/StableApi/Services/HorseService.cs      — in-memory impl; pagination bug in GetPaged
src/StableApi/Models/Horse.cs               — domain entity
src/StableApi/Models/HorseRequests.cs       — request DTOs
src/StableApi/appsettings.json              — base config
src/StableApi/appsettings.Development.json  — dev overrides
src/StableApi/appsettings.Production.json   — BLOCKED: Claude cannot edit this file
tests/StableApi.Tests/StableApi.Tests.csproj
tests/StableApi.Tests/HorsesControllerTests.cs  — 9 passing unit tests
infrastructure/main.tf                      — provider scaffold + requirements comment
infrastructure/variables.tf                 — project_name, location, sql_admin_password
```
