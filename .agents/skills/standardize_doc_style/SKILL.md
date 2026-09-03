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
- **Vietnamese in code blocks**: All Vietnamese text, comments, and strings inside code blocks MUST use fully accented Vietnamese (`tiếng Việt có dấu đầy đủ`), never unaccented text.

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
- Declare graph direction (`LR`, `TD`, `TB`). **Prioritize `LR` (Left to Right)** whenever feasible to optimize vertical space and page compact flow.

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

# Typography & Special Content Formatting

Emphasize special elements consistently to enhance readability, clarity, and scannability:

| Content Type | Formatting Style | Markdown Syntax | Examples |
| :--- | :--- | :--- | :--- |
| **Domain & Technical Terminology** | **Bold** | `**Terminology**` | **Trade-off**, **Coupling**, **Cohesion**, **Fitness Functions**, **Architecture Quantum** |
| **Authors & People** | Regular / Contextual | Plain text | Mark Richards, Neal Ford, Martin Fowler |
| **Book Titles, Papers & Publications** | *Italics* | `*Title*` | *Fundamentals of Software Architecture*, *Clean Architecture* |
| **Direct Quotes, Laws & Named Antipatterns** | Double Quotes `""` / **Bold Quotes** | `"Quote"` or `**"Law"**` | **"Why is more important than how"**, "Big Ball of Mud" |
| **Code, Files, Commands, Tools & Metrics** | `Inline Code` | `` `code` `` | `archunit`, `02_laws_and_expectations.md`, `Kafka`, `latency`, `throughput` |

## Language & Terminology Rules

- **Hạn chế tối đa pattern `Tiếng Việt (tiếng Anh)`**: Tránh lối viết song ngữ kèm ngoặc đơn rườm rà (ví dụ: *"đặc tính kiến trúc (architecture characteristics)"*, *"sự đánh đổi (trade-offs)"*). Lối viết này làm câu văn dài dòng và đứt gãy mạch đọc.
- **Dùng nguyên văn thuật ngữ chuyên ngành**: Các khái niệm kỹ thuật cốt lõi đã thành chuẩn mực quốc tế nên dùng nguyên bản tiếng Anh (**in đậm** hoặc `inline code`), ví dụ: **Trade-off**, **Fitness Functions**, **Technical Breadth**, **Elastic Leadership**, **Coupling**, **Cohesion**, **Microservices**, **Monolith**, **ADR**, **CI/CD**.
- **Dùng tiếng Việt tự nhiên khi dịch đủ nghĩa**: Các từ có nghĩa tiếng Việt rõ ràng, quen thuộc và cô đọng thì dịch trực tiếp, không đính kèm từ tiếng Anh trong ngoặc (ví dụ: bối cảnh, ranh giới, quy luật, kiểm thử tự động, độ trễ, khả năng mở rộng, chi phí vận hành).
- **Văn phong dứt khoát, trọng tâm**: Viết gãy gọn, truyền tải trực diện tư duy kỹ nghệ thay vì diễn giải dài dòng.
- Highlight key takeaways, axioms, and laws using quotes and bold formatting.
- Maintain consistent terminology styling across the entire document.

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
- Special content formatting followed (Italic books, quoted laws/quotes, bold terminology, inline code symbols).
- Transition repetition ≤ 2.
- Diverse section layouts.
- Context precedes definition.
- Mixed sentence rhythm.
- Quantitative wording preferred.
- Engineering insights included.
- Vietnamese text and comments in code blocks are fully accented.