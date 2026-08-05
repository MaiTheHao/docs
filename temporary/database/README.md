# Database Internals — MVCC, Index & Case Studies

## Table of Contents

- [Tổng quan Tài liệu](#tổng-quan-tài-liệu)
- [Cấu trúc Các Chương](#cấu-trúc-các-chương)
- [Điểm Nổi bật & Cập nhật Mới](#điểm-nổi-bật--cập-nhật-mới)

---

## Tổng quan Tài liệu

Tài liệu này phân tích chuyên sâu các cơ chế nội tại của CSDL quan hệ (RDBMS): từ cơ chế Multi-Version Concurrency Control (MVCC), cấu trúc B+Tree Index, kỹ thuật Covering Index, sự tiến hóa của VACUUM, đến các kết quả Benchmark thực nghiệm (PostgreSQL 17 vs MySQL 9) và Case Study Uber Migration.

---

## Cấu trúc Các Chương

| Chương | Tiêu đề | Nội dung trọng tâm | Details |
| :--- | :--- | :--- | :--- |
| **[Chương 1](01_mvcc.md)** | [MVCC — Multi-Version Concurrency Control](01_mvcc.md) | So sánh Append-Only Heap (PG) vs In-place + Undo Log (MySQL), triết lý thiết kế và Sự tiến hóa của VACUUM (PG 13 - 17). | Cơ chế cô lập & dọn rác. |
| **[Chương 2](02_index_internals.md)** | [Index Internals & Covering Index](02_index_internals.md) | Cấu trúc B+Tree, Clustered Index vs Secondary Index, B-Tree Deduplication (PG12+), On-the-fly Index Vacuum (PG14+) và Covering Index `INCLUDE`. | Tối ưu hóa truy vấn & chỉ mục. |
| **[Chương 3](03_use_cases_and_tradeoffs.md)** | [Workload Use Cases & Architecture Trade-offs](03_use_cases_and_tradeoffs.md) | Phân loại Read/Write Heavy Workload, Báo cáo thực nghiệm Benchmark PG 17 vs MySQL 9, Uber Migration Case Study và Khung quyết định kiến trúc hiện đại. | So sánh thực nghiệm & sản xuất. |

---

## Điểm Nổi bật & Cập nhật Mới

* **Phân tích Thực nghiệm PostgreSQL 17 vs MySQL 9:** Đối chiếu chi tiết kết quả benchmark Ingestion (`INSERT` ~19k QPS vs ~10k QPS) và Query/Join (`SELECT` ~32k QPS vs ~18k QPS).
* **Tiến hóa VACUUM (v13 - v17):** Giải mã chi tiết các nâng cấp Parallel Vacuum, On-the-fly Index Cleaning và Cost-Limit Fine-tuning giúp Postgres thu hẹp rào cản I/O Spike & Table Bloat.
* **Tối ưu B-Tree Index:** Kỹ thuật B-Tree Deduplication (PG 12+) giúp tiết kiệm 30-50% dung lượng index và Covering Index mang payload `INCLUDE`.

---

[← Quay lại trang chủ](../../README.md)
