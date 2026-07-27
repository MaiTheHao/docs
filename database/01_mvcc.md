# Chương 1. MVCC — Multi-Version Concurrency Control

Chương này phân tích chi tiết cơ chế MVCC, sự tiến hóa từ mô hình Single-Version (khóa truyền thống) sang Multi-Version, và so sánh kiến trúc triển khai MVCC giữa PostgreSQL và MySQL InnoDB — cùng với bối cảnh lịch sử và triết lý thiết kế đã định hình từng lựa chọn.

## Mục lục

- [1.1 Vấn đề của Concurrency Control truyền thống](#11-vấn-đề-của-concurrency-control-truyền-thống)
- [1.2 Kỷ nguyên Single-Version: Cơ chế Khóa 2PL](#12-kỷ-nguyên-single-version-cơ-chế-khóa-2pl)
- [1.3 MVCC trong PostgreSQL — Append-Only Heap](#13-mvcc-trong-postgresql--append-only-heap)
- [1.4 MVCC trong MySQL InnoDB — In-place & Undo Log](#14-mvcc-trong-mysql-innodb--in-place--undo-log)
- [1.5 Các Cấp độ Cô lập Transaction](#15-các-cấp-độ-cô-lập-transaction)
- [1.6 Bảng So sánh Kiến trúc MVCC](#16-bảng-so-sánh-kiến-trúc-mvcc)

---

## 1.1 Vấn đề của Concurrency Control truyền thống

Trong các hệ CSDL truyền thống, cơ chế khóa (Lock-based Concurrency Control) sử dụng **Shared Lock (S-Lock)** cho truy vấn Đọc và **Exclusive Lock (X-Lock)** cho truy vấn Ghi. Điều này dẫn đến hiện tượng nghẽn cổ chai kinh điển:

> **"Reader blocks Writer, Writer blocks Reader"**

MVCC ra đời để giải quyết triệt để vấn đề này bằng nguyên lý cốt lõi:

> **"Readers never block Writers, and Writers never block Readers"**

---

## 1.2 Kỷ nguyên Single-Version: Cơ chế Khóa 2PL

Trước khi có MVCC, dữ liệu chỉ tồn tại ở **duy nhất 1 phiên bản vật lý (Single Version)** trên đĩa. Cơ chế Two-Phase Locking (2PL) kiểm soát đồng thời bằng cách:

- Mọi câu lệnh **Đọc (READ)** phải xin **Shared Lock (S-Lock)**.
- Mọi câu lệnh **Ghi (WRITE)** phải xin **Exclusive Lock (X-Lock)**.
- Thao tác WRITE chặn tất cả READ/WRITE khác trên cùng dòng/bảng đó.

### Các Transaction State trong mô hình Single-State

| Trạng thái | Mô tả & Hành vi |
| :--- | :--- |
| **Active** | Transaction đang thi hành câu lệnh, liên tục xin S-Lock hoặc X-Lock. |
| **Partially Committed** | Câu lệnh cuối đã chạy xong nhưng thay đổi vẫn ở Buffer Pool, chưa flush xuống đĩa. Vẫn giữ toàn bộ Locks. |
| **Committed** | Dữ liệu đã ghi đè in-place lên đĩa. Transaction giải phóng toàn bộ Locks. |
| **Failed** | Xảy ra lỗi (Deadlock, vi phạm ràng buộc) khi đang ở trạng thái Active hoặc Partially Committed. |
| **Aborted** | Rollback về trạng thái ban đầu bằng Undo Log, sau đó giải phóng tất cả Locks. |

---

## 1.3 MVCC trong PostgreSQL — Append-Only Heap

### Bối cảnh: Triết lý "Never Overwrite" của Stonebraker

Năm 1986, Giáo sư **Michael Stonebraker** (UC Berkeley, sau này nhận giải Turing Award) khởi xướng dự án POSTGRES với một niềm tin triết học: **không bao giờ nên ghi đè lên dữ liệu cũ**. Stonebraker tin rằng bộ nhớ trong tương lai sẽ đủ lớn, và việc giữ lại toàn bộ lịch sử phiên bản ngay trong bảng dữ liệu sẽ mở ra khả năng truy vấn thời gian (Time-travel queries) và phục hồi sự cố tức thì.

Triết lý này trực tiếp dẫn đến lựa chọn kỹ thuật **Append-Only Heap**: một kiệt tác về lý thuyết học thuật và extensibility, nhưng cũng mang theo điểm yếu tự nhiên về **phình bảng (Bloat)** khi gặp bài toán Update nặng.

### Cơ chế Append-Only Heap

PostgreSQL áp dụng mô hình **Append-Only** trên bảng Heap. Dữ liệu cũ **không bao giờ bị ghi đè trực tiếp** — một phiên bản tuple mới sẽ được ghi thêm (append) vào Heap Page.

### Các cột ẩn hệ thống trong mỗi Tuple

| Cột ẩn | Ý nghĩa |
| :--- | :--- |
| **`xmin`** | Transaction ID (XID) của giao dịch đã tạo ra tuple này (INSERT/UPDATE). |
| **`xmax`** | XID của giao dịch đã xóa/cập nhật tuple này. Nếu tuple còn sống, `xmax = 0`. |
| **`cmin/cmax`** | Command Identifier — thứ tự câu lệnh bên trong cùng một Transaction. |
| **`ctid`** | Con trỏ vị trí vật lý `(Block_Number, Tuple_Index)` trong Heap Page. |

### Quy trình DML

```
INSERT → Tạo tuple mới: xmin = XID_hiện_tại, xmax = 0
DELETE → Không xóa vật lý, chỉ đánh dấu: xmax = XID_hiện_tại
UPDATE → DELETE (gán xmax) + INSERT (tạo tuple mới với xmin mới)
```

### Trạng thái Visibility của Tuple

| Trạng thái | Điều kiện |
| :--- | :--- |
| **In-Progress** | `xmin` đang chạy. Chỉ transaction đó mới thấy tuple này. |
| **Committed & Visible** | `xmin` đã Committed, `xmax = 0` hoặc `xmax` thuộc transaction Aborted. |
| **Dead / Garbage** | `xmax` đã Committed và cũ hơn oldest active XID → chờ AUTOVACUUM dọn. |

### Tác động Hiệu năng

- **Table Bloat (Phình bảng):** UPDATE/DELETE liên tục tích lũy "Dead Tuples" làm phình file dữ liệu trên đĩa.
- **AUTOVACUUM:** Tiến trình ngầm quét Heap Pages để dọn Dead Tuples, cập nhật Free Space Map (FSM) và Visibility Map (VM). Dưới tải cao, AUTOVACUUM ngốn Disk I/O rất lớn.
- **HOT (Heap-Only Tuple):** Nếu tuple mới nằm cùng Data Page với tuple cũ **và** không có cột Secondary Index nào bị thay đổi, Postgres chỉ nối con trỏ nội bộ mà không tạo entry mới trên Secondary Index — giảm đáng kể hiện tượng phình Index.

---

## 1.4 MVCC trong MySQL InnoDB — In-place & Undo Log

### Bối cảnh: InnoDB ra đời từ nhu cầu thực tiễn

Năm 1995, **Michael "Monty" Widenius** phát triển MySQL với engine MyISAM — không có Transaction, không MVCC, dùng Table-level Locking. Điểm mạnh duy nhất: đọc cực nhanh, phù hợp Web 2.0 sơ khai.

Khi các ứng dụng tài chính và TMĐT yêu cầu tính toàn vẹn dữ liệu (ACID), kỹ sư người Phần Lan **Heikki Tuuri** (công ty Innobase Oy) đã tạo ra Storage Engine **InnoDB** với triết lý trái ngược hoàn toàn với Postgres: **ghi đè in-place, dữ liệu cũ đẩy sang vùng nhớ riêng (Undo Log)**. Thiết kế này tối ưu cho workload OLTP (Online Transaction Processing) điển hình — đọc nhanh, ghi nhanh, ít bloat.

Năm 2005, Oracle mua lại Innobase Oy. Năm 2010, Oracle thâu tóm Sun Microsystems (sở hữu MySQL). Do lo ngại Oracle độc quyền, Monty Widenius fork MySQL thành **MariaDB** — đặt tên theo con gái thứ hai của ông.

### Cơ chế In-place + Undo Log

MySQL InnoDB lưu trữ dữ liệu theo cấu trúc **Clustered Index (B+Tree sắp xếp theo Primary Key)**. Dữ liệu được **ghi đè tại chỗ (in-place)** trên B+Tree, còn các phiên bản dữ liệu cũ được đẩy vào **Undo Log**.

### Các cột ẩn hệ thống trong Clustered Index Record

| Cột ẩn | Kích thước | Ý nghĩa |
| :--- | :---: | :--- |
| **`DB_TRX_ID`** | 6 bytes | Transaction ID của giao dịch cuối cùng thay đổi dòng này. |
| **`DB_ROLL_PTR`** | 7 bytes | Con trỏ cuộn (Roll Pointer) trỏ tới bản ghi cũ trong Undo Log Segment. |
| **`DB_ROW_ID`** | 6 bytes | Primary Key ẩn, tự sinh nếu bảng không khai báo PK rõ ràng. |

### Cơ chế Read View & Undo Log Chain

Khi một Transaction thực hiện SELECT, InnoDB tạo ra một **Read View** (chứa danh sách các TRX_ID đang hoạt động). Nếu bản ghi hiện tại có `DB_TRX_ID` nằm trong danh sách đó (chưa Commit), InnoDB theo con trỏ `DB_ROLL_PTR` lội ngược chuỗi **Undo Log Chain** để tái tạo phiên bản dữ liệu nhất quán tại thời điểm Transaction bắt đầu.

### Trạng thái Record & Undo Chain

| Trạng thái | Mô tả |
| :--- | :--- |
| **Latest Committed Record** | Bản ghi mới nhất nằm trực tiếp trên Clustered Index B+Tree. |
| **Active/Uncommitted Undo Version** | Bản ghi cũ nằm trong Undo Log, liên kết qua `DB_ROLL_PTR`. Dùng để Rollback. |
| **Purgeable Undo Version** | Bản ghi Undo cũ hơn Read View của transaction lâu nhất đang chạy → Purge Threads giải phóng. |

### Dọn dẹp với Purge Threads

Bảng chính của InnoDB **luôn sạch sẽ** vì dữ liệu mới luôn đè dữ liệu cũ. Khi các Transaction hoàn tất, các **Purge Threads** ngầm sẽ giải phóng các Undo Log Segments không còn được tham chiếu.

---

## 1.5 Các Cấp độ Cô lập Transaction

Với MVCC, khái niệm "trạng thái dữ liệu của một Transaction" không còn dựa vào Locks mà dựa vào **Visibility State** thông qua Transaction Snapshot / Read View:

| Isolation Level | Cơ chế Snapshot | Vấn đề tránh được |
| :--- | :--- | :--- |
| **Read Uncommitted** | Không dùng Snapshot | Gây Dirty Read |
| **Read Committed** | Snapshot theo từng câu lệnh (Statement-level) | Tránh Dirty Read |
| **Repeatable Read** | Snapshot tại thời điểm Transaction bắt đầu (Transaction-level) | Tránh Non-repeatable Read |
| **Serializable** | Postgres dùng SSI (Serializable Snapshot Isolation) theo dõi SIREAD locks | Tránh cả Write Skew |

---

## 1.6 Bảng So sánh Kiến trúc MVCC

| Tiêu chí | PostgreSQL (Append-Only) | MySQL InnoDB (In-place + Undo Log) |
| :--- | :--- | :--- |
| **Triết lý nguồn gốc** | "Never Overwrite" — Stonebraker, UC Berkeley (1986) | OLTP thực tiễn — Heikki Tuuri, Innobase Oy (InnoDB ~2001) |
| **Vị trí lưu tuple cũ** | Nằm trực tiếp trong Heap Page cùng tuple mới. | Nằm ở vùng đệm riêng biệt (Undo Log Segment). |
| **Cơ chế UPDATE** | Tạo Tuple mới hoàn toàn + Cập nhật tất cả Secondary Indexes (trừ khi đạt HOT). | Ghi đè in-place trên Clustered Index + Đẩy bản cũ vào Undo Log. |
| **Thao tác dọn rác** | AUTOVACUUM quét Data Page — rất nặng I/O. | Purge Threads tự động xóa Undo Log — bảng chính không bị bloat. |
| **Secondary Index Pointer** | Lưu con trỏ vật lý `ctid`. Khi tuple đổi vị trí, tất cả Secondary Indexes phải cập nhật. | Lưu giá trị Primary Key (Logical Pointer). UPDATE không thay đổi PK thì Secondary Indexes không đổi. |
| **Rollback Transaction** | Rất nhanh: chỉ đổi trạng thái XID thành ABORTED. | Lâu hơn: phải đọc Undo Log để khôi phục Clustered Index. |

---
[← Quay lại mục lục](README.md)
