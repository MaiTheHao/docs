# Chương 3. Workload Use Cases & Architecture Trade-offs

## Table of Contents

- [Phân loại Workload: Read-Heavy vs Write-Heavy](#phân-loại-workload-read-heavy-vs-write-heavy)
- [Báo cáo Thực nghiệm Benchmark: PostgreSQL 17 vs MySQL 9](#báo-cáo-thực-nghiệm-benchmark-postgresql-17-vs-mysql-9)
- [Case Study: Uber Migration từ PostgreSQL sang MySQL](#case-study-uber-migration-từ-postgresql-sang-mysql)
- [Khung Quyết định Kiến trúc và Đánh giá Hiện đại](#khung-quyết-định-kiến-trúc-và-đánh-giá-hiện-đại)

---

## Phân loại Workload: Read-Heavy vs Write-Heavy

Mỗi ứng dụng có mẫu truy cập dữ liệu (Traffic Pattern) khác nhau. Việc hiểu rõ đặc tính Workload là yếu tố quyết định lựa chọn Storage Engine và hệ CSDL phù hợp.

```mermaid
accTitle: Phan loai Workload va CSDL khuyen nghi
accDescr: So do minh hoa nhanh phan loai Workload Read-Heavy va Write-Heavy cho PostgreSQL va MySQL InnoDB.
graph TD
    workloadType["Đặc tính Workload"] --> readHeavy["Read-Heavy / Ingestion Heavy"]
    workloadType --> writeHeavy["Write / Update-Heavy (Dòng cũ)"]

    readHeavy --> pgTarget["PostgreSQL<br/>(Heap Table, Extensibility, Rich Types)"]
    writeHeavy --> myTarget["MySQL InnoDB<br/>(In-place Update, No Secondary Index Amplification)"]
```

| Loại Workload | Đặc điểm chính | CSDL khuyến nghị | Lý do kiến trúc | Details |
| :--- | :--- | :--- | :--- | :--- |
| **Read-Heavy / Ingestion** | Tần suất `SELECT` cao, `INSERT` chèn mới dữ liệu, truy vấn phức tạp (`JOIN`, CTE, Aggregation). | **PostgreSQL** | Heap Table + Index đa dạng hỗ trợ Ingestion nhanh và Optimizer mạnh mẽ. | Phù hợp TMĐT, CRM, Analytics. |
| **Update-Heavy** | Tần suất `UPDATE` dòng cũ liên tục từng giây (GPS tracking, Sensor data, E-commerce cart). | **MySQL InnoDB** | In-place update trên Clustered Index không gây Write Amplification trên Secondary Index. | Phù hợp IoT, vị trí thực thời. |

---

## Báo cáo Thực nghiệm Benchmark: PostgreSQL 17 vs MySQL 9

Số liệu đo đạc thực nghiệm trên cùng cấu hình phần cứng giữa **PostgreSQL 17.0** và **MySQL 9.0** (Anton Putra Benchmark) cung cấp góc nhìn định lượng về hiệu năng thực tế:

| Bài kiểm tra | PostgreSQL 17.0 | MySQL 9.0 | So sánh / Nhận xét | Details |
| :--- | :---: | :---: | :--- | :--- |
| **Ingestion (Insert)** | **~19.000 QPS** | ~10.000 QPS | **Postgres nhanh gấp ~2 lần**, độ trễ thấp hơn, tiêu tốn ít CPU và IOPS hơn. | Postgres dùng Append-Only Heap. |
| **Query / Join (Read)** | **~32.000 QPS** | ~18.000 - 20.000 QPS | **Postgres đạt throughput cao hơn 60%** trước khi chạm mốc 90% CPU. MySQL chạm ngưỡng 100% CPU. | Query Optimizer Postgres vượt trội. |
| **Process RAM (RSS)** | Mức báo cáo thấp hơn | Mức báo cáo cao hơn nhiều | Postgres giao phần lớn đệm cho **Linux OS Page Cache**; MySQL ôm RAM vào `innodb_buffer_pool`. | Khác biệt về cơ chế quản lý bộ nhớ. |

> [!NOTE]
> Kết quả benchmark trên khẳng định PostgreSQL 17.0 không hề "nặng" hay "chậm" hơn MySQL trong các ứng dụng web tiêu chuẩn, mà ngược lại đạt throughput và độ trễ tối ưu hơn đáng kể.

---

## Case Study: Uber Migration từ PostgreSQL sang MySQL

Năm 2016, nhóm kỹ sư Uber Engineering đăng tải bài viết gây chú ý lớn trong cộng đồng công nghệ: **"Why Uber Engineering Switched from Postgres to MySQL"**.

### Bối cảnh bài toán của Uber

Dịch vụ Uber xử lý vị trí GPS của hàng triệu tài xế và hành khách. Vị trí di chuyển được **cập nhật liên tục từng giây** trên các bảng chứa nhiều Secondary Index để phục vụ tìm kiếm chuyến đi.

```mermaid
accTitle: Bon nguyen nhan Uber chuyen sang MySQL
accDescr: So do minh hoa 4 van de ky thuat Uber gap phai tren PostgreSQL 9x nam 2016.
graph TD
    driverApp["Tài xế GPS update mỗi giây"] --> dbPostgres["PostgreSQL 9.x<br/>(Write/Update-Heavy)"]

    dbPostgres --> prob1["1. Write Amplification<br/>(Secondary Indexes ctid)"]
    dbPostgres --> prob2["2. Table Bloat & I/O<br/>(AUTOVACUUM nghẽn đĩa)"]
    dbPostgres --> prob3["3. Replication Lag<br/>(Physical WAL phình theo bloat)"]
    dbPostgres --> prob4["4. Major Upgrade<br/>(Downtime phức tạp)"]
```

### Bốn nguyên nhân kỹ thuật cốt lõi

#### 1. Write Amplification trên Secondary Index

* **Trong PostgreSQL:** Khi tọa độ tài xế thay đổi, tuple mới được ghi vào Heap Page làm `ctid` thay đổi. Postgres bắt buộc phải cập nhật `ctid` mới này lên **TẤT CẢ** Secondary Index của bảng — gây ra hiện tượng khuếch đại ghi (Write Amplification) gấp hàng chục lần.
* **Trong MySQL InnoDB:** Tọa độ `UPDATE` in-place trực tiếp trên Clustered Index. Vì Primary Key không đổi, các Secondary Index chứa Logical Pointer (Primary Key) **hoàn toàn không bị ảnh hưởng hay phải ghi lại**.

#### 2. Table Bloat và AUTOVACUUM Nghẽn I/O

Tần suất `UPDATE` khủng khiếp tạo ra hàng triệu Dead Tuples mỗi phút trong PostgreSQL Heap Pages. Trên phiên bản Postgres 9.x thời đó, tiến trình `AUTOVACUUM` chưa có Parallel Vacuum hay Cost-Limit tuning hiện đại, dẫn đến bùng nổ I/O đĩa và làm suy giảm hiệu năng toàn hệ thống.

#### 3. Physical Replication vs Logical Replication

PostgreSQL (thời điểm 2016) chủ yếu dùng **Physical WAL Replication** (sao chép cấp độ Byte đĩa). Khi Master bị Bloat, toàn bộ lượng dữ liệu phình bị đẩy qua mạng sang các Read Replicas, gây **Replication Lag** nghiêm trọng. MySQL sử dụng **Logical Row-Based Replication** gọn nhẹ hơn.

#### 4. Major Version Upgrade Downtime

Việc nâng cấp phiên bản lớn (Major Version Upgrade) trên PostgreSQL 9.x đòi hỏi Downtime kéo dài hoặc hạ tầng phụ trợ phức tạp, trong khi MySQL hỗ trợ nâng cấp mượt mà hơn cho các cụm CSDL phân tán.

---

## Khung Quyết định Kiến trúc và Đánh giá Hiện đại

> [!IMPORTANT]
> Bài viết của Uber phản ảnh thực tế trên **PostgreSQL 9.x vào năm 2016**. Từ PostgreSQL 10 đến 17, cộng đồng đã nâng cấp vượt bậc (Logical Replication mặc định, B-Tree Deduplication, Parallel Vacuum, Memory Optimization), thu hẹp đáng kể các nhược điểm lịch sử này.

Ma trận đánh giá và khung quyết định lựa chọn CSDL cho hệ thống hiện đại:

| Tiêu chí Đánh giá | Chọn PostgreSQL (v14 - v17) khi... | Chọn MySQL InnoDB (v8.0 - v9.0) when... | Details |
| :--- | :--- | :--- | :--- |
| **Tính toàn vẹn & Query Phức tạp** | Cần tuân thủ chuẩn SQL nghiêm ngặt, truy vấn `JOIN` nhiều bảng, CTE, Window Functions. | Ưu tiên tốc độ xử lý OLTP CRUD đơn giản theo Primary Key. | Postgres Query Optimizer vượt trội. |
| **Mô hình Ghi dữ liệu (Write)** | Thao tác `INSERT` chèn mới dữ liệu (Ingestion/Append-only) hoặc `UPDATE` vừa phải. | Thao tác `UPDATE` liên tục với tần suất cực cao trên các bảng chứa nhiều Index. | MySQL tránh Write Amplification trên Index. |
| **Transactional DDL** | Cần gom các câu lệnh `ALTER TABLE` vào `BEGIN...COMMIT/ROLLBACK` an toàn. | Thao tác DDL đơn lẻ, không cần rollback cấu trúc bảng trong giao dịch. | Postgres an toàn hơn cho Schema Migration. |
| **Mở rộng Kiểu dữ liệu** | Cần hỗ trợ JSONB, PostGIS (bản đồ/địa lý), `pgvector` (Vector Search cho AI). | Chủ yếu sử dụng các kiểu dữ liệu quan hệ truyền thống. | Postgres mạnh về Extensibility. |
| **Quản trị & Mở rộng Cụm** | Cần các extension mạnh mẽ (TimescaleDB, Citus, pgvector). | Cần giải pháp sharding phân tán sẵn có (MySQL InnoDB Cluster, Vitess). | MySQL phổ biến ở hạ tầng phân tán khổng lồ. |

---

[← Back to README](README.md)
