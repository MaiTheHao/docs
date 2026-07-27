# Database Internals — MVCC, Index & Case Studies

Tài liệu này phân tích chuyên sâu các cơ chế nội tại của CSDL quan hệ: từ lịch sử tiến hóa mô hình concurrency control, cấu trúc B+Tree Index, kỹ thuật Covering Index, đến bối cảnh lịch sử hình thành MySQL/PostgreSQL và Case Study Uber Migration kinh điển.

---

## Mục lục

<details>
<summary><strong>1. MVCC & Transaction States</strong></summary>

- [Chương 1. MVCC — Multi-Version Concurrency Control](01_mvcc.md)

</details>

<details>
<summary><strong>2. Index Internals</strong></summary>

- [Chương 2. Index Internals & Covering Index](02_index_internals.md)

</details>

<details>
<summary><strong>3. Bối cảnh Lịch sử</strong></summary>

- [Chương 3. Lịch sử MySQL & PostgreSQL](03_history_mysql_postgresql.md)
- [Chương 4. Case Study: Uber Migration từ PostgreSQL sang MySQL (2016)](04_uber_migration_case_study.md)

</details>

---
[← Quay lại mục lục chính](../README.md)
