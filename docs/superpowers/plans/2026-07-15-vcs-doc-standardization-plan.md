# Splitting & Standardizing Version Control System Docs Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Split the master `rawcontent.txt` file into 15 separate modular markdown files (14 chapters + 1 appendix), update `README.md` to link to them, and format all files strictly according to the repository's `standardize_doc_style` guidelines.

**Architecture:** Each file will contain exactly one chapter. Every file will have a single H1, a Table of Contents (TOC), horizontal divider lines (`---`) separating H2 sections, adaptive Mermaid diagrams, standardized explanation tables, GitHub alerts, and footer navigation back to `README.md`.

**Tech Stack:** Markdown, Mermaid.js, Git.

## Global Constraints
- Each file must have exactly one H1 at the very top.
- A Table of Contents under `## Mục lục` must immediately follow the H1.
- Each H2 section must be preceded by a horizontal line `---`.
- Mermaid diagrams must be dark/light theme compatible, with no hardcoded theme styles.
- Footer navigation `[← Quay lại mục lục](README.md)` is mandatory at the end of every child file.
- All detail files must be named in lowercase `snake_case` with a two-digit prefix.

---

## Proposed Changes

### Version Control System Document Component

#### [MODIFY] [README.md](file:///home/maithehao/Workspace/projects/doc/version_control_system/README.md)
#### [DELETE] [rawcontent.txt](file:///home/maithehao/Workspace/projects/doc/version_control_system/rawcontent.txt)
#### [NEW] [01_vcs_introduction.md](file:///home/maithehao/Workspace/projects/doc/version_control_system/01_vcs_introduction.md)
#### [NEW] [02_git_overview.md](file:///home/maithehao/Workspace/projects/doc/version_control_system/02_git_overview.md)
#### [NEW] [03_git_architecture.md](file:///home/maithehao/Workspace/projects/doc/version_control_system/03_git_architecture.md)
#### [NEW] [04_github_and_gitlab.md](file:///home/maithehao/Workspace/projects/doc/version_control_system/04_github_and_gitlab.md)
#### [NEW] [05_git_vs_github_vs_gitlab.md](file:///home/maithehao/Workspace/projects/doc/version_control_system/05_git_vs_github_vs_gitlab.md)
#### [NEW] [06_installation.md](file:///home/maithehao/Workspace/projects/doc/version_control_system/06_installation.md)
#### [NEW] [07_basic_commands.md](file:///home/maithehao/Workspace/projects/doc/version_control_system/07_basic_commands.md)
#### [NEW] [08_branch_management.md](file:///home/maithehao/Workspace/projects/doc/version_control_system/08_branch_management.md)
#### [NEW] [09_history_manipulation.md](file:///home/maithehao/Workspace/projects/doc/version_control_system/09_history_manipulation.md)
#### [NEW] [10_remote_repository.md](file:///home/maithehao/Workspace/projects/doc/version_control_system/10_remote_repository.md)
#### [NEW] [11_github_workflow.md](file:///home/maithehao/Workspace/projects/doc/version_control_system/11_github_workflow.md)
#### [NEW] [12_common_workflows.md](file:///home/maithehao/Workspace/projects/doc/version_control_system/12_common_workflows.md)
#### [NEW] [13_advanced_git.md](file:///home/maithehao/Workspace/projects/doc/version_control_system/13_advanced_git.md)
#### [NEW] [14_best_practices.md](file:///home/maithehao/Workspace/projects/doc/version_control_system/14_best_practices.md)
#### [NEW] [15_appendix.md](file:///home/maithehao/Workspace/projects/doc/version_control_system/15_appendix.md)

---

## Task Decomposition

### Task 1: Reconstruct README.md as the main index

**Files:**
- Modify: `version_control_system/README.md`

- [ ] **Step 1: Rewrite README.md contents**
  Write a high-quality main landing page with an H1, brief overview, and standard Vietnamese markdown links to all 15 chapter pages.
- [ ] **Step 2: Commit changes**
  Run:
  ```bash
  git add version_control_system/README.md
  git commit -m "docs(vcs): update README.md to act as chapter index"
  ```

---

### Task 2: Create Chapters 1 to 3 (Foundations)

**Files:**
- Create: `version_control_system/01_vcs_introduction.md`
- Create: `version_control_system/02_git_overview.md`
- Create: `version_control_system/03_git_architecture.md`

- [ ] **Step 1: Extract, format, and save Chapter 1**
  Extract Chapter 1 from `rawcontent.txt` (lines 29-135) to `01_vcs_introduction.md`. Clean up text to match formatting rules:
  - Add Single H1: `# Chương 1. Giới thiệu về Version Control System (VCS)`
  - Add TOC block after H1.
  - Insert `---` before H2 sections.
  - Adapt Timeline Mermaid chart: remove any theme configuration, double-quote node labels containing special characters.
  - Use GitHub alert syntax `> [!NOTE]` and `> [!WARNING]` instead of simple text.
  - Add footer: `[← Quay lại mục lục](README.md)`.
- [ ] **Step 2: Extract, format, and save Chapter 2**
  Extract Chapter 2 from `rawcontent.txt` (lines 137-271) to `02_git_overview.md`. Apply same styling: H1, TOC, H2 separations, quotes on Mermaid labels, GitHub alerts, footer.
- [ ] **Step 3: Extract, format, and save Chapter 3**
  Extract Chapter 3 from `rawcontent.txt` (lines 273-342) to `03_git_architecture.md`. Apply style guidelines.
- [ ] **Step 4: Commit new foundation files**
  Run:
  ```bash
  git add version_control_system/01_vcs_introduction.md version_control_system/02_git_overview.md version_control_system/03_git_architecture.md
  git commit -m "docs(vcs): add chapters 1, 2, and 3 on VCS and Git foundations"
  ```

---

### Task 3: Create Chapters 4 & 5 (Git Hosting & Comparison)

**Files:**
- Create: `version_control_system/04_github_and_gitlab.md`
- Create: `version_control_system/05_git_vs_github_vs_gitlab.md`

- [ ] **Step 1: Extract and format Chapter 4**
  Extract from `rawcontent.txt` (lines 344-434) to `04_github_and_gitlab.md`. Format standard headers, Tables, and Alerts.
- [ ] **Step 2: Extract and format Chapter 5**
  Extract from `rawcontent.txt` (lines 436-491) to `05_git_vs_github_vs_gitlab.md`. Format tables properly (bold text, inline code for commands).
- [ ] **Step 3: Commit files**
  Run:
  ```bash
  git add version_control_system/04_github_and_gitlab.md version_control_system/05_git_vs_github_vs_gitlab.md
  git commit -m "docs(vcs): add chapters 4 and 5 on git hosting platforms"
  ```

---

### Task 4: Create Chapters 6 to 8 (Git Basics)

**Files:**
- Create: `version_control_system/06_installation.md`
- Create: `version_control_system/07_basic_commands.md`
- Create: `version_control_system/08_branch_management.md`

- [ ] **Step 1: Extract and format Chapter 6**
  Extract from `rawcontent.txt` (lines 493-539) to `06_installation.md`. Format with correct code blocks.
- [ ] **Step 2: Extract and format Chapter 7**
  Extract from `rawcontent.txt` (lines 541-631) to `07_basic_commands.md`. Specify language tags for bash commands.
- [ ] **Step 3: Extract and format Chapter 8**
  Extract from `rawcontent.txt` (lines 633-740) to `08_branch_management.md`. Ensure GitGraph Mermaid script has no styling overrides.
- [ ] **Step 4: Commit files**
  Run:
  ```bash
  git add version_control_system/06_installation.md version_control_system/07_basic_commands.md version_control_system/08_branch_management.md
  git commit -m "docs(vcs): add chapters 6, 7, and 8 on git basics and branching"
  ```

---

### Task 5: Create Chapters 9 & 10 (Git History & Remote)

**Files:**
- Create: `version_control_system/09_history_manipulation.md`
- Create: `version_control_system/10_remote_repository.md`

- [ ] **Step 1: Extract and format Chapter 9**
  Extract from `rawcontent.txt` (lines 742-824) to `09_history_manipulation.md`. Make sure tables are cleanly formatted.
- [ ] **Step 2: Extract and format Chapter 10**
  Extract from `rawcontent.txt` (lines 826-861) to `10_remote_repository.md`.
- [ ] **Step 3: Commit files**
  Run:
  ```bash
  git add version_control_system/09_history_manipulation.md version_control_system/10_remote_repository.md
  git commit -m "docs(vcs): add chapters 9 and 10 on history and remote repositories"
  ```

---

### Task 6: Create Chapters 11 & 12 (Workflows)

**Files:**
- Create: `version_control_system/11_github_workflow.md`
- Create: `version_control_system/12_common_workflows.md`

- [ ] **Step 1: Extract and format Chapter 11**
  Extract from `rawcontent.txt` (lines 863-916) to `11_github_workflow.md`. Format Mermaid flowchart.
- [ ] **Step 2: Extract and format Chapter 12**
  Extract from `rawcontent.txt` (lines 918-1001) to `12_common_workflows.md`. Ensure correct parsing of the GitGraph Mermaid script.
- [ ] **Step 3: Commit files**
  Run:
  ```bash
  git add version_control_system/11_github_workflow.md version_control_system/12_common_workflows.md
  git commit -m "docs(vcs): add chapters 11 and 12 on workflow strategies"
  ```

---

### Task 7: Create Chapters 13 & 14 (Advanced & Best Practices)

**Files:**
- Create: `version_control_system/13_advanced_git.md`
- Create: `version_control_system/14_best_practices.md`

- [ ] **Step 1: Extract and format Chapter 13**
  Extract from `rawcontent.txt` (lines 1003-1109) to `13_advanced_git.md`. Keep bash examples clean and well annotated.
- [ ] **Step 2: Extract and format Chapter 14**
  Extract from `rawcontent.txt` (lines 1111-1234) to `14_best_practices.md`.
- [ ] **Step 3: Commit files**
  Run:
  ```bash
  git add version_control_system/13_advanced_git.md version_control_system/14_best_practices.md
  git commit -m "docs(vcs): add chapters 13 and 14 on advanced git features and best practices"
  ```

---

### Task 8: Create Appendix & Clean up rawcontent.txt

**Files:**
- Create: `version_control_system/15_appendix.md`
- Delete: `version_control_system/rawcontent.txt`

- [ ] **Step 1: Extract and format Appendix**
  Extract from `rawcontent.txt` (lines 1236-1365) to `15_appendix.md`. Ensure the FAQ section and References tables are fully structured.
- [ ] **Step 2: Delete rawcontent.txt**
  Delete the now redundant `version_control_system/rawcontent.txt` file.
- [ ] **Step 3: Commit files**
  Run:
  ```bash
  git rm version_control_system/rawcontent.txt
  git add version_control_system/15_appendix.md
  git commit -m "docs(vcs): add appendix and remove rawcontent.txt draft"
  ```

---

## Verification Plan

### Automated/Tool Verification
- Verify formatting layout of each page: check for single H1, presence of TOC, presence of footer links.
- Confirm all markdown paths and links resolve (no dead relative references).
- Verify git branch status is clean after commits.

### Manual Verification
- Review Mermaid charts locally inside VS Code markdown viewer to ensure there are no parsing/compilation errors.
