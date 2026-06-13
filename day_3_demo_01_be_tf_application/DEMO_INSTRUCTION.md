# Demo: Backend API, Terraform & the Full Agentic Loop

---

## The Story

You're the first engineer on a charity's donor-registry API. Someone handed you a half-finished codebase, a blank CLAUDE.md, and a list of features to ship. Over the course of the day you'll use Claude Code to understand the code, document it, extend it, clean it up, generate its Azure infrastructure, and chase down a real bug — without ever losing your place.

Every session flows from the one before it. By the end, participants will have run the full agentic loop from zero to production-ready.

---

## Setup (before the session)

```bash
cd day_3_demo_01_be_tf_application
dotnet build
dotnet test   # all 9 tests should pass
dotnet run --project src/CharityApi   # http://localhost:5000/swagger
```

Open Claude Code in the `day_3_demo_01_be_tf_application` directory.

---

## Part 1 — Repo Tour: Natural-Language Navigation (30 min)

### 1a. First impression

Ask Claude:

```
What does this project do? Give me a 2-sentence summary.
```

Watch Claude read `CLAUDE.md` first (even though it's mostly a stub) then scan the source files. It will describe the donor registry and in-memory store.

> "Claude Code always loads CLAUDE.md automatically. Even an empty scaffold tells Claude the shape of the project."

### 1b. Explore the architecture

```
Walk me through the layers of this API. What lives in Controllers, Services, and Models and how do they relate?
```

Claude should describe the thin-controller / service-logic / data-container split.

### 1c. Trace a call chain

```
Where is the business logic for creating a donor? Show me the full call path from HTTP request to the in-memory store.
```

Point out: Claude navigates by reading key files, not by guessing. Watch it grep or read `DonorsController → IDonorService → DonorService`.

### 1d. Ask for critique — without asking for a fix

```
Review DonorsController and tell me what quality issues you see. Don't change anything yet.
```

Claude will find the three labelled issues (`GetById`, `Create`, `Delete`) and likely the manual validation. This sets up Part 4.

**Teaching point**: Natural-language questions work as well as `cat`. Claude builds a mental model of the codebase across reads so you don't have to feed it file-by-file.

---

## Part 2 — Writing CLAUDE.md: Making the Context Permanent (35 min)

### 2a. Show the scaffold

Open `CLAUDE.md`. Point out:

- Line 3: `@import .claude/code-style.md` — the import is already active; coding standards load every session without pasting anything
- The `<!-- TODO -->` sections — these are what participants will fill in

Open `.claude/code-style.md` alongside.

> "The `@import` directive lets you separate concerns. Project-specific rules stay in CLAUDE.md; team-wide coding standards live in code-style.md and are shared across repos."

### 2b. Fill in Architecture and Domain Model

```
Explore the project and fill in the Architecture and Domain Model sections of CLAUDE.md based on what you see.
```

Claude will inspect `Controllers/`, `Services/`, `Models/`, and `Program.cs` then write factual entries. Review the output together — correct anything imprecise.

### 2c. Document the test patterns

```
Read DonorsControllerTests.cs and document the testing patterns we use in the Test Patterns section of CLAUDE.md.
```

Claude should describe the Arrange/Act/Assert convention, Moq usage, and the naming format `MethodName_Scenario_ExpectedBehaviour`.

### 2d. Confirm it loads

```
/clear
```

Then ask without pointing to any file:

```
What HTTP status code should a successful DELETE return according to our code style?
```

Claude reads `CLAUDE.md` (which imports `code-style.md`) and answers `204 No Content` — from the style guide, not from memory.

**Teaching point**: Write CLAUDE.md once. Every future session — and every team member — benefits. This is project infrastructure, not a prompt you paste.

---

## Part 3 — Adding a New Endpoint: Spec → Model → Service → Controller → Validation → Tests (70 min)

### 3a. Spec the feature

Ask Claude:

```
I need to add a POST /api/donors/{id}/deactivate endpoint. The request body carries a Reason string (why the donor is being deactivated). It should return 200 with the updated donor, or 404 if the donor doesn't exist. Walk me through the plan before writing any code.
```

Review the plan. Correct anything before approving.

### 3b. Add the model

```
Add a DeactivateRequest record to DonorRequests.cs with a single Reason property.
```

### 3c. Extend the service

```
Add a Deactivate(int id, DeactivateRequest request) method to IDonorService and implement it in DonorService. Mark the donor inactive and store the reason.
```

Because `Donor` has no `DeactivationReason` yet, Claude will add that property too. Let it — that's the expected flow.

### 3d. Add the controller action

```
Add the POST /api/donors/{id}/deactivate action to DonorsController using the new service method.
```

### 3e. Add FluentValidation

FluentValidation is not yet in the project:

```
Add FluentValidation to the project. Create a DeactivateRequestValidator that requires Reason to be between 5 and 200 characters. Register it in Program.cs and wire it into the controller action.
```

Watch Claude: add the NuGet package to the `.csproj`, create the validator class, register it, and update the action to return 400 on validation failure.

### 3f. Write tests

```
Add unit tests for the deactivate endpoint to DonorsControllerTests.cs. Cover: valid request returns 200, missing/short reason returns 400, donor not found returns 404.
```

The PostToolUse hook fires after the test file is saved and runs `dotnet test` automatically. Output appears in Claude's context. If anything fails, Claude self-corrects.

**Teaching point**: The full workflow — model, service, controller, validation, tests — in one scoped session. The hook closes the feedback loop without any manual `dotnet test` invocations.

---

## Part 4 — Refactoring: Identify Issues → Plan → Scoped Edits → Verify (45 min)

### 4a. Pull up the findings from Part 1

```
Earlier you identified quality issues in DonorsController. Let's fix them one at a time. Start with GetById returning 200 for a missing donor.
```

### 4b. Fix: GetById → 404

Claude changes `return Ok(donor)` to a null-check with `return NotFound()`. The formatter hook runs `dotnet format` automatically after the edit.

Ask after the fix:

```
Add a test: GetById_NonExistentDonor_ReturnsNotFound
```

The test hook runs. All tests pass.

### 4c. Fix: Create → 201 Created

```
Fix Create to return 201 Created with a Location header pointing to the new donor.
```

Claude changes `return Ok(donor)` to `return CreatedAtAction(nameof(GetById), new { id = donor.Id }, donor)`. Update the matching test expectation to `CreatedAtActionResult`.

### 4d. Fix: Delete → 204 No Content

```
Fix Delete to return 204 No Content instead of 200 OK.
```

Update the test expectation to `NoContentResult`.

### 4e. Migrate manual validation to FluentValidation

```
The Create action has inline string validation. Replace it with a CreateDonorRequestValidator using FluentValidation — same rules: Name at least 2 characters, Email must contain @.
```

Claude creates the validator, registers it, and strips the manual checks from the controller. Tests pass because the mock service bypasses the validator in unit tests (teach this distinction).

### 4f. Reflect

```
Review DonorsController again. Is there anything left to improve?
```

Claude should now report a clean bill of health — or surface something subtle (e.g., no `[ProducesResponseType]` attributes). Discuss whether to fix it.

**Teaching point**: Refactoring with Claude is identify → confirm → change one thing → verify. The hooks make verification free — no context-switching to the terminal.

---

## Part 5 — Terraform: Generate Infrastructure from Requirements (40 min)

### 5a. Show the requirements comment

Open `infrastructure/main.tf`. The comment block at the top describes what needs to be built:

```
Azure Resource Group, App Service Plan (B1, Linux), .NET 8 Web App,
SQL Server + Basic database, ASPNETCORE_ENVIRONMENT app setting, outputs.
```

### 5b. Generate the resources

```
Read the requirements comment in infrastructure/main.tf and generate all the Azure resources listed. Use the variables from variables.tf for naming and location.
```

Claude writes the resource group, service plan, web app, SQL server, database, app settings, and outputs.

### 5c. Review together

Scroll through the generated HCL with the group. Ask Claude to explain each resource block:

```
Explain the azurerm_linux_web_app block — what does each attribute do?
```

### 5d. Iterate — add a deployment slot

```
Add a staging deployment slot to the web app so we can test before swapping to production.
```

### 5e. Iterate — sensitive config via Key Vault

```
The SQL connection string is currently a plain app setting. Show me how to reference it from Azure Key Vault instead, so the password never appears in the Terraform state in plaintext.
```

Claude introduces `azurerm_key_vault` and a `@Microsoft.KeyVault(...)` reference. Discuss: Claude generates the pattern; a human reviews the security implications before `terraform apply`.

**Teaching point**: Generate → review → iterate. Claude produces valid HCL from plain English. The value is the first draft and the explanation; the engineer owns the security review.

---

## Part 6 — Debugging: Inspect → Hypothesise → Fix (35 min)

### 6a. Surface the complaint

Present the scenario:

> "Users report that GET /api/donors?page=1&pageSize=2 returns donors 3 and 4 instead of donors 1 and 2."

Ask Claude:

```
We have a pagination bug. GET /api/donors?page=1&pageSize=2 returns the wrong donors — it skips the first two. Help me find it.
```

### 6b. Watch the inspection

Claude will read `DonorsController.GetAll` → trace to `DonorService.GetPaged` → spot the discrepancy: the XML doc comment says "1-based" but the implementation does `Skip(page * pageSize)`, which is 0-based.

> "This is the inspect phase. Claude found the exact line where the spec and the code disagree."

### 6c. Hypothesise before fixing

```
Before we fix it, write a failing unit test in a new file DonorServiceTests.cs that proves page 1 returns the first two donors and currently fails.
```

The test hook fires after the file is written. `dotnet test` output shows the new test failing. Show this to the group.

> "Red first. The failing test is the proof of the bug. Now we know exactly what 'fixed' means."

### 6d. Fix

```
Fix the pagination bug so the test passes.
```

Claude changes `Skip(page * pageSize)` to `Skip((page - 1) * pageSize)`. Hook fires. All tests pass — including the new one.

### 6e. Reflect on the loop

Draw the loop on a whiteboard or on screen:

```
inspect → hypothesise → red test → fix → green test
```

> "The loop is the same whether the bug took 30 seconds to find or 3 hours. The test is the contract. You don't close the loop until it's green."

---

## Part 7 — Assignment Briefing (20 min)

### The task

Participants extend the API independently using everything from Parts 3–6. No further demo — just the brief.

**Add a `Campaign` entity with full CRUD:**

```
A Campaign has: Id, Name, Description, StartDate, EndDate, IsActive.

1. Add the model and request DTOs (CreateCampaignRequest, UpdateCampaignRequest)
2. Add ICampaignService and CampaignService with in-memory storage
3. Add CampaignsController with GET (all, paged), GET by id, POST, PUT, DELETE
4. Add FluentValidation: Name required, StartDate must be before EndDate
5. Unit tests for all controller actions
6. Add a Terraform resource: Azure Storage Account for campaign asset uploads
```

Suggested approach (share with participants):

```
I need to add a Campaign entity to this API. Start with a plan — list every file you'll create or modify before touching anything.
```

Then approve the plan and let Claude execute it end-to-end.

---

## What This Demo Teaches

| Session | Capability |
|---|---|
| Repo tour | Natural-language codebase exploration without reading every file |
| CLAUDE.md | Permanent layered context; `@import` for modular standards |
| Add endpoint | Full spec-to-test workflow in a single agentic session |
| Refactor | Identify → confirm → change one thing → verify with hooks |
| Terraform | Generate valid HCL from a written requirements description |
| Debugging | inspect → hypothesise → red test → fix → green loop |
| Assignment | Independent end-to-end practice across all patterns |

**The pattern**: each session builds on the last. CLAUDE.md written in Part 2 guides the code Claude writes in Part 3. The refactor patterns from Part 4 are the quality bar for the assignment. The debugging loop from Part 6 is usable the next morning on a real bug.

---

## Resetting After the Demo

If Claude modified `DonorsController.cs` during Parts 3 or 4, restore the intentional issues:

```csharp
// Restore in GetById — remove the null check, return Ok(donor) unconditionally
return Ok(donor);

// Restore in Create — return Ok(donor) instead of CreatedAtAction
return Ok(donor);

// Restore in Delete — return Ok() instead of NoContent()
return Ok();
```

Delete any files Claude created during Part 3 (`DeactivateRequest` additions, validators, updated tests).

Remove the FluentValidation package from `CharityApi.csproj` if it was added live.

Delete `tests/CharityApi.Tests/DonorServiceTests.cs` if written during Part 6.

Restore `DonorService.GetPaged` to the buggy version:

```csharp
.Skip(page * pageSize)
```

---

## Files

```
DEMO_INSTRUCTION.md                          — this file
CLAUDE.md                                    — project scaffold (stub, filled in during Part 2)
.editorconfig                                — formatting rules read by dotnet format
.claude/settings.json                        — PostToolUse hooks (format + test) + deny rules
.claude/code-style.md                        — coding standards imported by CLAUDE.md
CharityApi.sln                               — solution file
src/CharityApi/Program.cs                    — DI registration, middleware pipeline
src/CharityApi/CharityApi.csproj             — project file (Swashbuckle only; FluentValidation added in Part 3)
src/CharityApi/Controllers/DonorsController.cs   — 3 intentional issues (GetById, Create, Delete)
src/CharityApi/Services/IDonorService.cs     — service contract
src/CharityApi/Services/DonorService.cs      — in-memory impl; pagination bug in GetPaged
src/CharityApi/Models/Donor.cs               — domain entity
src/CharityApi/Models/DonorRequests.cs       — request DTOs
src/CharityApi/appsettings.json              — base config
src/CharityApi/appsettings.Development.json  — dev overrides
src/CharityApi/appsettings.Production.json   — BLOCKED: Claude cannot edit this file
tests/CharityApi.Tests/CharityApi.Tests.csproj
tests/CharityApi.Tests/DonorsControllerTests.cs  — 9 passing unit tests (pagination untested — added in Part 6)
infrastructure/main.tf                       — provider scaffold + requirements comment (resources generated in Part 5)
infrastructure/variables.tf                  — project_name, location, sql_admin_password
```
