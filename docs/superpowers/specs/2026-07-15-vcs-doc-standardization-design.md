# Design Spec: Standardizing and Splitting Version Control System Docs

- **Date**: 2026-07-15
- **Author**: Antigravity
- **Topic**: Version Control System Documentation Standardization

## 1. Goal
To reorganize and format the raw documentation content in `version_control_system/rawcontent.txt` into a clean, modular structure of 14 chapters and an appendix. All files will strictly conform to the repository's `standardize_doc_style` guidelines.

## 2. Document Structure
We will create 15 flat markdown files inside `/home/maithehao/Workspace/projects/doc/version_control_system/`, and update the `README.md` file to act as the main entry point (TOC).

### File Mapping
- `01_vcs_introduction.md`: Chapter 1 (Introduction to VCS)
- `02_git_overview.md`: Chapter 2 (Git Introduction & History)
- `03_git_architecture.md`: Chapter 3 (Three-Tree Architecture & Lifecycle)
- `04_github_and_gitlab.md`: Chapter 4 (Overview of hosting platforms)
- `05_git_vs_github_vs_gitlab.md`: Chapter 5 (Comparison matrix and feature analysis)
- `06_installation.md`: Chapter 6 (Git installation & setup)
- `07_basic_commands.md`: Chapter 7 (Basic command line operations)
- `08_branch_management.md`: Chapter 8 (Branches, Merging, Rebase, Cherry-picking)
- `09_history_manipulation.md`: Chapter 9 (Log, Reflog, Reset, Restore, Revert, Amend, Interactive Rebase)
- `10_remote_repository.md`: Chapter 10 (Remote tracking, origin vs upstream, Fetch vs Pull)
- `11_github_workflow.md`: Chapter 11 (Fork, clone, PR, review, merge flow)
- `12_common_workflows.md`: Chapter 12 (GitFlow, GitHub Flow, GitLab Flow, Trunk-Based Development)
- `13_advanced_git.md`: Chapter 13 (Stash, Tag, Bisect, Blame, Submodules, Subtree, Hooks, LFS)
- `14_best_practices.md`: Chapter 14 (Commit messages, branch naming, secrets safety, .gitignore)
- `15_appendix.md`: Phụ lục (Cheat Sheet, Terminology, FAQ, References, Books)

## 3. Formatting Standards (based on `standardize_doc_style`)
Each file must conform to:
1. **Single H1 Title**: Exactly one H1 at the very top of each file.
2. **Table of Contents (TOC)**: Located right after the H1 under the `## Mục lục` heading, with relative anchor links.
3. **Horizontal Rules (`---`)**: Added before every H2 section.
4. **Mermaid Diagrams**: Adapted to be adaptive for dark/light themes. No hardcoded theme configs. Wrap labels with special characters (like parentheses) in quotes.
5. **Tables**: Formatted with standard headers: `| Thành phần/Bước | Vai trò/Mô tả | Chi tiết |` where appropriate, using bold styling and inline code formatting for commands.
6. **Alert Boxes**: Using GitHub alert syntax (`[!NOTE]`, `[!TIP]`, `[!IMPORTANT]`, `[!WARNING]`).
7. **Footer Navigation**: Every child document must end with `---` and `[← Quay lại mục lục](README.md)`.

## 4. Verification Plan
We will inspect every generated file to verify:
- Links are valid and not broken.
- Only one H1 is present per page.
- Footer navigation works.
- Markdown syntax and Mermaid syntax are valid.
