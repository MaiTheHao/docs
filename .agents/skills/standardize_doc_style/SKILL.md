---
name: standardize_doc_style
description: Enforce consistent structure, formatting, naming, diagrams, tables, and natural technical writing for Markdown documentation.
---

# Purpose

Apply this specification to every Markdown document created or modified.

---

# Naming

- Root directories: `##_snake_case`
- Child directories/files: `snake_case`
- Lowercase only.
- No spaces or special characters.
- Store static assets in `assets/`.

---

# Document Structure

- Exactly one `# H1`.
- `## Table of Contents` immediately after H1.
- TOC links only H2 sections.
- Insert `---` before every H2.
- Footer:

```markdown
---
[← Back to README](README.md)
```

---

# Code Blocks

- Every code block requires a language tag.
- Add a concise description before every code block.

---

# Mermaid

## Rendering

- Plain Mermaid only.
- No themes.
- No colors.
- No `style`.
- No `classDef`.
- No `linkStyle`.

## Nodes

- IDs use `camelCase`.
- Never use reserved ID `end`.
- Avoid IDs starting with `o` or `x`.
- Quote every label.

```mermaid
nodeId["Node Label"]
```

- Use `<br/>` for line breaks.
- Declare graph direction (`TD`, `TB`, `LR`).

## Accessibility

Every diagram includes

```text
accTitle:
accDescr:
```

## Layout

- Keep diagrams compact.
- Preferred: 5-15 nodes.
- Maximum: 25 nodes.

## Shapes

Use consistent semantics.

| Shape | Meaning |
|-------|---------|
| `[...]` | Process |
| `{...}` | Decision |
| `[(...)]` | Database |
| `([...])` | Start / End |

---

# Tables

Complex diagrams or workflows require an explanatory table.

```markdown
| Component | Purpose | Details |
| :--- | :--- | :--- |
```

Rules

- Bold for domain terminology.
- Inline code for filenames, commands, classes, variables and types.

---

# GitHub Alerts

Prefer GitHub Alerts over blockquotes.

- NOTE
- TIP
- IMPORTANT
- WARNING

---

# Natural Technical Writing

## Transition Diversity

Avoid repeated transitions.

Forbidden patterns

- "The diagram below..."
- "The table below..."
- "The following diagram..."

A repeated transition may appear at most twice per document.

---

## Section Diversity

Avoid identical section layouts.

Mix structures such as

- Context → Definition
- Example → Definition
- Diagram → Explanation
- Table → Analysis
- Tradeoff → Conclusion

---

## Context First

Present

```
Context
→ Motivation
→ Definition
```

instead of

```
Definition
→ Explanation
```

Every section should contain at least one real-world context.

---

## Technical Storytelling

Preferred flow

```
Why
→ How
→ Where
→ Tradeoff
```

Include at least one engineering observation per section.

---

## Sentence Rhythm

Mix short and long sentences.

Avoid uniform paragraph lengths.

---

## Quantitative Language

Prefer measurable statements over vague adjectives.

Prefer

- latency
- throughput
- memory
- complexity
- benchmark
- percentage

Avoid excessive use of

- very
- extremely
- significant
- powerful
- comprehensive

---

## Captions

Captions should describe value, not existence.

Prefer

- AES round transformation
- Mathematical foundation of RSA
- TLS hybrid encryption workflow

Avoid

- Diagram
- Illustration
- Overview

---

## Engineering Insight

Each section should include one or two implementation insights beyond textbook definitions.

Examples

- production behavior
- common pitfalls
- engineering tradeoffs
- performance implications
- architectural rationale

---

# Validation Checklist

A document is valid only if all conditions hold.

- One H1.
- TOC immediately after H1.
- Valid internal links.
- Language tag on every code block.
- Mermaid follows plain style.
- Labels quoted.
- Accessibility metadata present.
- Workflow tables provided where required.
- Footer navigation exists.
- Consistent terminology.
- Transition repetition ≤ 2.
- Diverse section layouts.
- Context precedes definition.
- Mixed sentence rhythm.
- Quantitative wording preferred.
- Engineering insights included.