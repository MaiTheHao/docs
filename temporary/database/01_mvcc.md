# Chương 1. MVCC — Multi-Version Concurrency Control

## Table of Contents

- [Vấn đề của Concurrency Control Truyền thống](#vấn-đề-của-concurrency-control-truyền-thống)
- [Kỷ nguyên Single-Version và Cơ chế Khóa 2PL](#kỷ-nguyên-single-version-và-cơ-chế-khóa-2pl)
- [MVCC trong PostgreSQL — Append-Only Heap](#mvcc-trong-postgresql--append-only-heap)
- [MVCC trong MySQL InnoDB — In-place và Undo Log](#mvcc-trong-mysql-innodb--in-place-và-undo-log)
- [Sự Tiến hóa của VACUUM trong PostgreSQL (v13 - v17)](#sự-tiến-hóa-của-vacuum-trong-postgresql-v13---v17)
- [Các Cấp độ Cô lập Transaction](#các-cấp-độ-cô-lập-transaction)
- [Bảng So sánh Kiến trúc MVCC](#bảng-so-sánh-kiến-trúc-mvcc)

---

## Vấn đề của Concurrency Control Truyền thống

Trong các hệ CSDL truyền thống, cơ chế khóa (Lock-based Concurrency Control) sử dụng **Shared Lock (S-Lock)** cho truy vấn Đọc và **Exclusive Lock (X-Lock)** cho truy vấn Ghi. Điều này dẫn đến hiện tượng nghẽn cổ chai kinh điển:

> [!WARNING]
> **"Reader blocks Writer, Writer blocks Reader"**

MVCC ra đời để giải quyết triệt để vấn đề này bằng nguyên lý cốt lõi:

> [!NOTE]
> **"Readers never block Writers, and Writers never block Readers"**

---

## Kỷ nguyên Single-Version và Cơ chế Khóa 2PL

Trước khi có MVCC, dữ liệu chỉ tồn tại ở **duy nhất 1 phiên bản vật lý (Single Version)** trên đĩa. Cơ chế **Two-Phase Locking (2PL)** kiểm soát đồng thời bằng cách:

* Mọi câu lệnh **Đọc (READ)** phải xin **Shared Lock (S-Lock)**.
* Mọi câu lệnh **Ghi (WRITE)** phải xin **Exclusive Lock (X-Lock)**.
* Thao tác `WRITE` chặn tất cả `READ`/`WRITE` khác trên cùng dòng hoặc bảng đó.

| Trạng thái | Mô tả & Hành vi | Details |
| :--- | :--- | :--- |
| **Active** | Transaction đang thi hành câu lệnh, liên tục xin `S-Lock` hoặc `X-Lock`. | Trạng thái khởi tạo mặc định. |
| **Partially Committed** | Câu lệnh cuối đã chạy xong nhưng thay đổi vẫn ở Buffer Pool, chưa flush xuống đĩa. Vẫn giữ toàn bộ Locks. | Đang chờ flush WAL/Redo Log. |
| **Committed** | Dữ liệu đã ghi đè in-place lên đĩa. Transaction giải phóng toàn bộ Locks. | Hoàn tất giao dịch an toàn. |
| **Failed** | Xảy ra lỗi (Deadlock, vi phạm ràng buộc) khi đang ở trạng thái Active hoặc Partially Committed. | Cần hủy bỏ giao dịch. |
| **Aborted** | Rollback về trạng thái ban đầu bằng Undo Log, sau đó giải phóng tất cả Locks. | Khôi phục trạng thái nhất quán. |

---

## MVCC trong PostgreSQL — Append-Only Heap

### Bối cảnh: Triết lý "Never Overwrite" của Stonebraker

Năm 1986, Giáo sư **Michael Stonebraker** (UC Berkeley, giải Turing Award) khởi xướng dự án POSTGRES với triết lý: **không bao giờ nên ghi đè lên dữ liệu cũ**. Stonebraker tin rằng việc giữ lại toàn bộ lịch sử phiên bản ngay trong bảng dữ liệu sẽ mở ra khả năng truy vấn thời gian (Time-travel queries) và phục hồi sự cố tức thì.

Triết lý này dẫn đến lựa chọn kỹ thuật **Append-Only Heap**: một thiết kế giàu tính mở rộng nhưng tạo ra điểm yếu về **phình bảng (Table Bloat)** và xung đột I/O khi gặp bài toán `UPDATE` tải cao.

### Cơ chế Append-Only Heap

PostgreSQL áp dụng mô hình **Append-Only** trên bảng Heap. Dữ liệu cũ **không bao giờ bị ghi đè trực tiếp** — một phiên bản tuple mới sẽ được ghi thêm (append) vào Heap Page.

### Các cột ẩn hệ thống trong mỗi Tuple

| Cột ẩn | Ý nghĩa | Details |
| :--- | :--- | :--- |
| `xmin` | Transaction ID (`XID`) của giao dịch đã tạo ra tuple này (`INSERT`/`UPDATE`). | 32-bit integer XID. |
| `xmax` | `XID` của giao dịch đã xóa hoặc cập nhật tuple này. Nếu tuple còn sống, `xmax = 0`. | Đánh dấu tuple đã chết/thay thế. |
| `cmin`/`cmax` | Command Identifier — thứ tự câu lệnh bên trong cùng một Transaction. | Giúp phân định thứ tự lệnh nội bộ. |
| `ctid` | Con trỏ vị trí vật lý `(Block_Number, Tuple_Index)` trong Heap Page. | Địa chỉ vật lý của tuple trên đĩa. |

### Quy trình DML

Mỗi thao tác DML trong Postgres không ghi đè mà tạo ra các phiên bản tuple mới:

```text
INSERT -> Tạo tuple mới: xmin = XID_hiện_tại, xmax = 0
DELETE -> Không xóa vật lý, chỉ đánh dấu: xmax = XID_hiện_tại
UPDATE -> DELETE (gán xmax) + INSERT (tạo tuple mới với xmin mới)
```

| Trạng thái | Điều kiện | Details |
| :--- | :--- | :--- |
| **In-Progress** | `xmin` đang chạy. Chỉ transaction đó mới thấy tuple này. | Chưa commit toàn cục. |
| **Committed & Visible** | `xmin` đã Committed, `xmax = 0` hoặc `xmax` thuộc transaction Aborted. | Tuple hợp lệ cho truy vấn đọc. |
| **Dead / Garbage** | `xmax` đã Committed và cũ hơn oldest active `XID` $\rightarrow$ chờ `AUTOVACUUM` dọn. | Cần thu hồi dung lượng đĩa. |

---

## MVCC trong MySQL InnoDB — In-place và Undo Log

### Bối cảnh: InnoDB ra đời từ nhu cầu thực tiễn

Năm 1995, **Michael "Monty" Widenius** phát triển MySQL với engine MyISAM — dùng Table-level Locking, đọc nhanh cho Web 2.0. Khi các ứng dụng tài chính và TMĐT yêu cầu tính toàn vẹn dữ liệu (ACID), **Heikki Tuuri** (Innobase Oy) tạo ra Storage Engine **InnoDB** với triết lý: **ghi đè in-place, dữ liệu cũ đẩy sang vùng nhớ riêng (Undo Log)**. Thiết kế này tối ưu cho workload OLTP — đọc nhanh, ghi nhanh, ít bloat.

### Cơ chế In-place + Undo Log

MySQL InnoDB lưu trữ dữ liệu theo cấu trúc **Clustered Index (B+Tree sắp xếp theo Primary Key)**. Dữ liệu được **ghi đè tại chỗ (in-place)** trên B+Tree, còn các phiên bản dữ liệu cũ được đẩy vào **Undo Log**.

### Các cột ẩn hệ thống trong Clustered Index Record

| Cột ẩn | Kích thước | Ý nghĩa | Details |
| :--- | :---: | :--- | :--- |
| `DB_TRX_ID` | 6 bytes | Transaction ID của giao dịch cuối cùng thay đổi dòng này. | Định danh transaction chỉnh sửa cuối. |
| `DB_ROLL_PTR` | 7 bytes | Con trỏ cuộn (Roll Pointer) trỏ tới bản ghi cũ trong Undo Log Segment. | Liên kết chuỗi phiên bản cũ. |
| `DB_ROW_ID` | 6 bytes | Primary Key ẩn, tự sinh nếu bảng không khai báo PK rõ ràng. | Định danh dòng khi thiếu PK. |

### Cơ chế Read View & Undo Log Chain

Khi một Transaction thực hiện `SELECT`, InnoDB tạo ra một **Read View** (chứa danh sách các `TRX_ID` đang hoạt động). Nếu bản ghi hiện tại có `DB_TRX_ID` chưa Commit, InnoDB theo con trỏ `DB_ROLL_PTR` lội ngược chuỗi **Undo Log Chain** để tái tạo phiên bản dữ liệu nhất quán tại thời điểm Transaction bắt đầu.

| Trạng thái | Mô tả | Details |
| :--- | :--- | :--- |
| **Latest Committed Record** | Bản ghi mới nhất nằm trực tiếp trên Clustered Index B+Tree. | Trạng thái hiển thị hiện tại. |
| **Active Undo Version** | Bản ghi cũ nằm trong Undo Log, liên kết qua `DB_ROLL_PTR`. Dùng để Rollback. | Cần thiết cho cô lập transaction. |
| **Purgeable Undo Version** | Bản ghi Undo cũ hơn Read View của transaction lâu nhất đang chạy $\rightarrow$ Purge Threads giải phóng. | Thu hồi tài nguyên tự động. |

---

## Sự Tiến hóa của VACUUM trong PostgreSQL (v13 - v17)

Nhược điểm phình bảng (*Table Bloat*) và nghẽn I/O do `AUTOVACUUM` gây ra trên các phiên bản cũ (Postgres 9.x) đã được giải quyết qua các đợt nâng cấp hạ tầng VACUUM từ v13 đến v17:

```mermaid
accTitle: Tien hoa VACUUM trong PostgreSQL
accDescr: So do minh hoa cac tinh nang cai tien cua VACUUM qua cac phien ban PostgreSQL tu v13 den v17.
graph TD
    V1314["Parallel VACUUM & Index Cleaning (v13, v14)<br/>Tận dụng đa nhân CPU dọn dẹp Index song song"] --> V14["B-Tree Index Vacuuming (v14+)<br/>Loại bỏ dead tuples ngay trong lúc SELECT"]
    V14 --> V16["Buffer Usage & Cost Limit Fine-Tuning (v16+)<br/>Nâng vacuum_cost_limit từ vài MB lên vài GB"]
    V16 --> V17["Auto-tuning / Micro-vacuuming (v17)<br/>Điều tiết tần suất linh hoạt theo nhịp tải"]
```

Cấu hình tối ưu và tác động hiệu năng của các tính năng VACUUM mới:

| Tính năng | Phiên bản | Tác động Hiệu năng | Details |
| :--- | :---: | :--- | :--- |
| **Parallel Index Vacuum** | Postgres 13+ | Giảm **40% - 60%** thời gian VACUUM trên các bảng có từ 3 Secondary Indexes trở lên. | Sử dụng worker processes để quét song song. |
| **On-the-fly Index Clean** | Postgres 14+ | Phát hiện và xóa dead tuples trên B-Tree Index ngay khi chạy truy vấn `SELECT`. | Ngăn ngừa Index Bloat trước khi VACUUM chạy. |
| **Cost Limit Scale** | Postgres 16+ | `vacuum_cost_limit` cho phép tăng từ 200 lên vài nghìn units trên SSD/NVMe. | Tránh nghẽn I/O nhân tạo do ngưỡng mặc định cũ. |
| **Memory Vacuum Opt** | Postgres 17+ | Giảm tiêu thụ RAM của tiến trình Autovacuum xuống **30%**. | Xử lý danh sách dead tuples hiệu quả hơn. |

> [!IMPORTANT]
> MySQL vốn **không sử dụng VACUUM** vì dùng kiến trúc Undo Log + In-place update (Purge Threads dọn ngầm Undo Log). Việc nâng cấp VACUUM trên Postgres 13-17 không phải để "vượt qua" MySQL ở khoản VACUUM, mà là **thu hẹp đáng kể khoảng cách về rào cản I/O Spike và Table Bloat**, đáp ứng tốt các hệ thống OLTP tải cao.

---

## Các Cấp độ Cô lập Transaction

Với MVCC, khái niệm "trạng thái dữ liệu của một Transaction" không dựa vào Locks mà dựa vào **Visibility State** thông qua Transaction Snapshot / Read View:

| Isolation Level | Cơ chế Snapshot | Vấn đề tránh được | Details |
| :--- | :--- | :--- | :--- |
| **Read Uncommitted** | Không dùng Snapshot | Không tránh được | Gây Dirty Read. |
| **Read Committed** | Snapshot theo từng câu lệnh (Statement-level) | Tránh Dirty Read | Mặc định trên cả PG và MySQL. |
| **Repeatable Read** | Snapshot tại thời điểm Transaction bắt đầu (Transaction-level) | Tránh Non-repeatable Read | Tránh Phantom Read trên InnoDB nhờ Gap Lock. |
| **Serializable** | Postgres dùng SSI (Serializable Snapshot Isolation) theo dõi SIREAD locks | Tránh cả Write Skew | Cấp độ cô lập cao nhất. |

---

## Bảng So sánh Kiến trúc MVCC

| Tiêu chí | PostgreSQL (Append-Only + VACUUM) | MySQL InnoDB (In-place + Undo Log) | Details |
| :--- | :--- | :--- | :--- |
| **Triết lý nguồn gốc** | "Never Overwrite" — Michael Stonebraker (1986) | OLTP thực tiễn — Heikki Tuuri (~2001) | Sự khác biệt triết học thiết kế. |
| **Vị trí lưu tuple cũ** | Trực tiếp trong Heap Page cùng tuple mới. | Vùng đệm riêng biệt (**Undo Log Segment**). | Quyết định cơ chế dọn dẹp rác. |
| **Cơ chế UPDATE** | Tạo Tuple mới hoàn toàn + Cập nhật tất cả Secondary Indexes (trừ khi đạt HOT). | Ghi đè in-place trên Clustered Index + Đẩy bản cũ vào Undo Log. | MySQL tránh Write Amplification trên Secondary Index. |
| **Thao tác dọn rác** | `AUTOVACUUM` quét Data Pages (v13-17 hỗ trợ Parallel Vacuum). | **Purge Threads** tự động xóa Undo Log ngầm — bảng chính không bloat. | Postgres cần tuning Autovacuum trên bảng lớn. |
| **Secondary Index Pointer** | Lưu con trỏ vật lý `ctid`. Khi tuple đổi vị trí, Secondary Indexes phải cập nhật. | Lưu giá trị Primary Key (Logical Pointer). `UPDATE` không đổi PK thì Secondary Index giữ nguyên. | MySQL tối ưu hơn cho bài toán High-frequency Update. |
| **Rollback Transaction** | Rất nhanh: chỉ đổi trạng thái `XID` thành `ABORTED`. | Lâu hơn: đọc Undo Log để khôi phục lại Clustered Index. | Postgres ưu thế ở tốc độ Hủy giao dịch. |

---

[← Back to README](README.md)
