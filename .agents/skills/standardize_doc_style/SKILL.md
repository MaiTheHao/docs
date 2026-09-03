---
name: standardize_doc_style
description: Enforce consistent structure, formatting, naming, diagrams, tables, and natural technical writing across Markdown documentation.
---

# Purpose
Apply this specification to every Markdown document created or modified.

## Table of Contents
- [Naming](#naming)
- [Document Structure](#document-structure)
- [Code Blocks](#code-blocks)
- [Mermaid](#mermaid)
- [Tables](#tables)
- [GitHub Alerts](#github-alerts)
- [Typography and Special Content Formatting](#typography-and-special-content-formatting)
- [Natural Technical Writing](#natural-technical-writing)
- [Validation Checklist](#validation-checklist)

---

## Naming
Use `##_snake_case` for root directories and `snake_case` for child directories and files. Use lowercase only, with no spaces or special characters. Store static assets in `assets/`.

---

## Document Structure
Use exactly one `# H1`. Place `## Table of Contents` immediately after the H1 and include links only to H2 sections. Insert `---` before every H2. End the document with:
```markdown
---
[← Back to README](README.md)
```

---

## Code Blocks

Every code block must include a language tag and a concise description immediately before it. All Vietnamese text, comments, and strings inside code blocks must use fully accented Vietnamese; never use unaccented Vietnamese.

---

## Mermaid

Use plain Mermaid only: no themes, colors, `style`, `classDef`, or `linkStyle`. Node IDs must use `camelCase`, must not be `end`, and should not start with `o` or `x`. Quote every node label, for example:

```mermaid
nodeId["Node Label"]
```

Use `<br/>` for label line breaks and explicitly declare the graph direction as `LR`, `TD`, or `TB`; prefer `LR` whenever feasible to reduce vertical space and improve page flow. Every diagram must include `accTitle:` and `accDescr:` accessibility metadata. Keep diagrams compact: prefer 5–15 nodes and never exceed 25. Use shapes consistently: `[... ]` for processes, `{...}` for decisions, `[(...)]` for databases, and `([...])` for start/end nodes.

---

## Tables

Complex diagrams and workflows must include an explanatory table:

```markdown
| Component | Purpose | Details |
| :--- | :--- | :--- |
```

Use bold formatting for domain terminology and inline code for filenames, commands, classes, variables, and types.

---

## GitHub Alerts

Prefer GitHub Alerts over blockquotes. Use `NOTE`, `TIP`, `IMPORTANT`, and `WARNING` when appropriate.

---

## Typography and Special Content Formatting

Apply terminology styling consistently throughout the document.

| Content Type                                | Formatting                       | Markdown Syntax         | Examples                                                                                   |
| :------------------------------------------ | :------------------------------- | :---------------------- | :----------------------------------------------------------------------------------------- |
| Domain and technical terminology            | **Bold**                         | `**Terminology**`       | **Trade-off**, **Coupling**, **Cohesion**, **Fitness Functions**, **Architecture Quantum** |
| Authors and people                          | Regular                          | Plain text              | Mark Richards, Neal Ford, Martin Fowler                                                    |
| Book titles, papers, and publications       | *Italics*                        | `*Title*`               | *Fundamentals of Software Architecture*, *Clean Architecture*                              |
| Direct quotes, laws, and named antipatterns | Double quotes or **bold quotes** | `"Quote"` / `**"Law"**` | **"Why is more important than how"**, "Big Ball of Mud"                                    |
| Code, files, commands, tools, and metrics   | Inline code                      | `` `code` ``            | `archunit`, `02_laws_and_expectations.md`, `Kafka`, `latency`, `throughput`                |

### Language and Terminology Rules

Write technical documentation in natural English and avoid unnecessary bilingual constructions such as "architectural characteristics (đặc tính kiến trúc)" or "trade-offs (sự đánh đổi)". Use established technical terms in their original English form, especially **Trade-off**, **Fitness Functions**, **Technical Breadth**, **Elastic Leadership**, **Coupling**, **Cohesion**, **Microservices**, **Monolith**, **ADR**, and **CI/CD**. Translate concepts into concise natural English when a clear equivalent exists, rather than adding redundant parenthetical terminology. Write decisively and directly, favoring engineering reasoning over lengthy explanation. Highlight key takeaways, axioms, and laws with quotes and bold formatting, and maintain consistent terminology throughout the document.

---

## Natural Technical Writing

### Transition Diversity

Avoid repetitive transitions, especially "The diagram below...", "The table below...", and "The following diagram...". Any repeated transition pattern may appear at most twice per document.

### Section Diversity

Avoid identical section structures. Vary patterns such as Context → Definition, Example → Definition, Diagram → Explanation, Table → Analysis, and Trade-off → Conclusion.

### Context First

Prefer `Context → Motivation → Definition` over `Definition → Explanation`. Every section should establish at least one relevant real-world context before presenting abstract concepts.

### Technical Storytelling

Prefer the flow `Why → How → Where → Trade-off`. Include at least one engineering observation per section, such as production behavior, common pitfalls, performance implications, architectural rationale, or implementation constraints.

### Sentence Rhythm

Mix short and long sentences. Avoid uniform paragraph lengths and repetitive sentence structures.

### Quantitative Language

Prefer measurable engineering language such as `latency`, `throughput`, `memory`, `complexity`, `benchmark`, and `percentage`. Avoid excessive use of vague modifiers such as "very", "extremely", "significant", "powerful", and "comprehensive".

### Captions

Captions should communicate value or function rather than merely identify an artifact. Prefer "AES round transformation", "Mathematical foundation of RSA", and "TLS hybrid encryption workflow" over generic captions such as "Diagram", "Illustration", or "Overview".

### Engineering Insight

Each section should include one or two implementation-level insights beyond textbook definitions. Prioritize production behavior, common pitfalls, engineering trade-offs, performance implications, and architectural rationale.

---

## Validation Checklist

A document is valid only when all applicable requirements are satisfied: exactly one H1; `## Table of Contents` immediately follows the H1; TOC links only to H2 sections; internal links are valid; every H2 is preceded by `---`; every code block has a language tag and concise description; Mermaid uses plain styling, quoted labels, valid IDs, explicit direction, accessibility metadata, compact layouts, and consistent shapes; required workflow tables are present; the footer navigation exists; terminology formatting is consistent; books and publications are italicized; laws and direct quotes use quotation marks or bold quotes; domain terminology is bold; code-related symbols use inline code; transition repetition does not exceed two occurrences; section layouts vary; context precedes definition; sentence rhythm is varied; quantitative language is preferred; each section contains engineering insight; and all Vietnamese text inside code blocks uses full diacritics.