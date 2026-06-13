# Prompting Techniques — Hands-On Demo

A practical comparison of prompting techniques using Claude. For each example, run the prompt, observe the output, then run the improved version and compare.

---

## Concept Map

| Technique | When to use |
|---|---|
| Precise, direct commands | You know exactly what you want |
| Zero-shot / Few-shot | Format or style needs anchoring |
| Chain-of-Thought | Multi-step reasoning or structured output |
| XML tags | Complex inputs with distinct roles |

---

## Example 1 — Abstract vs Precise Command

**Anti-pattern (vague):**
```
Write a fairy tale.
```

**Better (precise, direct):**
```
Write a fairy tale in exactly 2 sentences.

Make it suitable for children aged 6–8.
Include a shy fox, a magical forest, and a kind ending.
Use simple language.
Do not make it scary.
```

**Why it works:** Constraints eliminate ambiguity. The model cannot guess wrong on length, audience, characters, tone, or safety.

**Exercise:** Run both prompts. Note differences in length, vocabulary complexity, and whether a shy fox appears.

---

## Example 2 — Zero-Shot vs Few-Shot

**Zero-shot (no example):**
```
Generate personal data of 3 patients
```

**Few-shot (one example anchors the format):**
```
Generate personal data of 3 patients.
An example is: Name: John Doe; DOB: 20/04/1980; Email: john.doe@fictious.net
```

**Why it works:** The single example fixes the schema (fields, order, separators, date format) without writing a specification. The model infers the rest.

**Exercise:** Compare outputs. Does zero-shot use the same fields? The same date format? Try adding a second example with a different name style and observe how the model generalises.

---

## Example 3 — Chain-of-Thought

**Prompt:**
```
Generate personal data of 3 patients.

Step 1. Choose names that are varied in ethnicity and gender (only create Name and Gender columns).
Step 2. Generate addresses from Norwich County.
Step 3. Assign correct postal code and phone number.
Step 4. Format the data in a table.
```

**Why it works:** Breaking the task into numbered steps forces the model to reason sequentially. Each step's output becomes the input for the next, reducing errors that occur when all constraints are applied at once.

**Exercise:** Run the full prompt, then run only Step 1. Check whether postal codes match Norwich (NR1–NR34). Observe how intermediate reasoning affects final accuracy.

---

## Example 4 — XML Tags for Structured Input

**Prompt:**
```xml
<instruction>
Explain the concern using both the clinical finding and the patient report.
Do not suggest treatment or next steps.
</instruction>

<output>
Bullet-point report referencing clinical_finding value and patient_report.
</output>

<clinical_finding>
Potassium is 5.8 mmol/L.
</clinical_finding>

<patient_report>
The patient feels weak and says their heart is skipping beats.
</patient_report>
```

**Why it works:** XML tags give each piece of content a distinct role. The model can separate *what to do* (instruction), *how to format* (output), and *what data to use* (clinical_finding, patient_report) without them bleeding into each other.

**Exercise:** Remove the `<instruction>` block and re-run. Does the model now suggest treatment? Add a second `<clinical_finding>` block with a different value and observe how the model handles multiple data inputs.

---

## Common Anti-Patterns

| Anti-pattern | Problem | Fix |
|---|---|---|
| "Write something good" | No acceptance criteria | Define length, audience, tone, constraints |
| Mixing instructions and data in plain text | Model may confuse context | Use XML tags to separate roles |
| One giant paragraph of requirements | Model deprioritises later clauses | Number steps or use bullet lists |
| No example when format matters | Model guesses structure | Add one few-shot example |
| Asking for everything at once | Reasoning errors compound | Use Chain-of-Thought steps |

---

## Refinement Loop (hands-on exercise)

1. Write a prompt from scratch for a task of your choice.
2. Run it and identify the first thing that is wrong or missing.
3. Add one targeted constraint or example to fix that specific issue.
4. Re-run and compare.
5. Repeat until the output meets your acceptance criteria.

The goal is not a perfect prompt on the first attempt — it is a fast, deliberate iteration cycle.
