# Chương 2. Index Internals & Covering Index

## Table of Contents

- [Bản chất của Index trong Cơ sở dữ liệu](#bản-chất-của-index-trong-cơ-sở-dữ-liệu)
- [Clustered Index vs Secondary Index](#clustered-index-vs-secondary-index)
- [Covering Index và Index-Only Scan](#covering-index-và-index-only-scan)

---

## Bản chất của Index trong Cơ sở dữ liệu

Trong cơ sở dữ liệu, **Index (chỉ mục)** là một cấu trúc dữ liệu phụ trợ được thiết kế nhằm tăng tốc độ tìm kiếm, truy xuất và sắp xếp dữ liệu mà không cần phải quét tuần tự toàn bộ bảng.

Tương tự như **mục lục ở cuối một cuốn sách**, thay vì phải lật đọc từng trang từ đầu đến cuối để tìm một từ khóa, bạn chỉ cần tra mục lục để biết chính xác số trang cần mở. Khi áp dụng vào CSDL:
* Index trích xuất giá trị của một hoặc nhiều cột cần tra cứu, sắp xếp chúng theo một trật tự xác định và lưu kèm con trỏ trỏ tới vị trí dòng dữ liệu thực tế trên đĩa.
* Giúp hệ quản trị CSDL chuyển đổi độ phức tạp tìm kiếm từ quét toàn bộ $O(N)$ xuống tra cứu có định hướng $O(\log N)$.
* **Sự đánh đổi (Trade-off):** Index giúp tăng tốc độ đọc (`SELECT`), nhưng sẽ làm tăng dung lượng lưu trữ đĩa và làm chậm các thao tác ghi dữ liệu (`INSERT`, `UPDATE`, `DELETE`) vì CSDL phải đồng thời cập nhật cả bảng dữ liệu lẫn các cây chỉ mục tương ứng.

---

## Clustered Index vs Secondary Index

### Trong MySQL InnoDB

Bảng dữ liệu **chính là Clustered Index** — toàn bộ dữ liệu của từng dòng được sắp xếp vật lý và lưu trữ trực tiếp theo khóa chính (`Primary Key`).

* **Clustered Index (Primary Index):** Lưu trữ toàn bộ các cột dữ liệu của bảng theo thứ tự của `Primary Key`.
* **Secondary Index:** Mỗi nút lá chỉ lưu cặp `(Index_Key, Primary_Key)`.
* **Cơ chế Bookmark Lookup:** Khi tìm kiếm bằng Secondary Index mà câu truy vấn cần lấy thêm các cột dữ liệu không nằm trong chỉ mục, MySQL sẽ thực hiện tra cứu qua 2 bước:
  1. **Bước 1:** Quét Secondary Index để tìm ra `Primary_Key`.
  2. **Bước 2 (Bookmark Lookup):** Dùng `Primary_Key` vừa tìm được để tra cứu tiếp vào Clustered Index nhằm lấy đầy đủ các cột dữ liệu của dòng.

| Thành phần | Cấu trúc lưu trữ | Mô tả |
| :--- | :--- | :--- |
| **Clustered Index** | `[Primary Key] -> [Toàn bộ dữ liệu dòng]` | Bảng và Index được tổ chức chung làm một (Index-Organized Table). |
| **Secondary Index** | `[Index Key] -> [Primary Key]` | Chỉ lưu con trỏ logic là giá trị Primary Key. |
| **Bookmark Lookup** | Tra 2 bước: `Secondary Index` $\rightarrow$ `Clustered Index` | Phát sinh thêm chi phí I/O tra cứu nếu Index không bao phủ (Cover) hết các cột cần lấy. |

### Trong PostgreSQL

Dữ liệu được lưu trữ tại **bảng Heap độc lập**. Tất cả Index (chính hay phụ) đều có vai trò kỹ thuật ngang nhau và hoạt động như các Secondary Index.

* Nút lá của Index trong PostgreSQL chứa `(Index_Key, ctid)`.
* `ctid` là con trỏ vật lý trỏ trực tiếp đến vị trí `(Block_Number, Offset)` của bản ghi trong bảng Heap.
* **Đặc điểm khi UPDATE:** Khi một dòng dữ liệu thay đổi vị trí trên đĩa (do cơ chế MVCC tạo tuple mới), `ctid` thay đổi $\rightarrow$ PostgreSQL buộc phải cập nhật `ctid` mới vào **tất cả** các Index của bảng đó (trừ trường hợp tối ưu HOT — Heap-Only Tuples).

### Bảng So sánh Cấu trúc Index

| Tiêu chí | MySQL InnoDB | PostgreSQL | Chi tiết |
| :--- | :--- | :--- | :--- |
| **Cấu trúc lưu trữ chính** | Clustered Index | Heap Table độc lập | Kiến trúc lưu trữ nền tảng khác biệt. |
| **Nút lá của Primary Index** | Chứa đầy đủ dữ liệu các cột | Chứa `(Index_Key, ctid)` | MySQL tập trung dữ liệu tại PK; PostgreSQL lưu vào Heap. |
| **Nút lá của Secondary Index** | Chứa `(Index_Key, Primary_Key)` | Chứa `(Index_Key, ctid)` | MySQL lưu khóa logic, PostgreSQL lưu con trỏ vật lý `ctid`. |
| **Ảnh hưởng khi UPDATE** | Chỉ cập nhật Secondary Index khi Primary Key đổi | Luôn phải cập nhật `ctid` trên mọi Index (trừ khi đạt HOT) | MySQL giảm thiểu Write Amplification khi cập nhật các cột không phải PK. |

---

## Covering Index và Index-Only Scan

**Covering Index** là trạng thái tối ưu truy vấn: Hệ quản trị CSDL lấy được **toàn bộ dữ liệu cần thiết ngay tại nút lá của Index** mà không cần tốn chi phí Disk I/O để truy xuất lại bảng chính (bỏ qua Heap Scan hoặc Clustered Index Lookup).

### Điều kiện kích hoạt Covering Index

Tất cả các cột được sử dụng trong câu truy vấn phải **nằm hoàn toàn trong** tập hợp các cột của Index:

```text
SELECT_columns ∪ WHERE_columns ∪ ORDER_BY_columns ∪ GROUP_BY_columns ⊆ Index_columns
```

### Triển khai trên PostgreSQL — Từ khóa `INCLUDE`

Từ khóa `INCLUDE` cho phép tách biệt rõ ràng giữa **Cột dùng để tìm kiếm (Key)** và **Cột dữ liệu mang theo (Payload)**:

```sql
-- Tạo Covering Index mang theo payload status và total_amount
CREATE INDEX idx_orders_user ON orders(user_id)
INCLUDE (status, total_amount);
```

* `user_id`: Nằm ở các nút định tuyến của cây Index, phục vụ việc tìm kiếm và lọc dữ liệu nhanh chóng.
* `status`, `total_amount`: Chỉ lưu tại nút lá làm payload mang theo, không tốn tài nguyên so sánh hay sắp xếp trên cây Index.

> [!IMPORTANT]
> Để kích hoạt **Index-Only Scan**, PostgreSQL cần kiểm tra **Visibility Map (VM)**. Nếu VM xác nhận Data Page là `ALL-VISIBLE` (mọi tuple đều đã committed và không có dead tuple), PostgreSQL sẽ bỏ qua việc đọc Heap Page. Nếu chưa `ALL-VISIBLE`, PostgreSQL vẫn phải đọc Heap Page để kiểm tra cờ hiển thị giao dịch (`xmin`/`xmax`).

### Triển khai trên MySQL — Composite Index

MySQL không hỗ trợ cú pháp `INCLUDE`. Thay vào đó, ta sử dụng **Composite Index** chứa toàn bộ các cột cần thiết:

```sql
-- Composite Index bao phủ toàn bộ cột cần thiết trong truy vấn
CREATE INDEX idx_orders_user_status_total
ON orders(user_id, status, total_amount);
```

Khi kiểm tra bằng lệnh `EXPLAIN`, nếu cột `Extra` xuất hiện giá trị **`Using index`**, điều đó xác nhận MySQL đã thực hiện Index-Only Scan thành công và loại bỏ hoàn toàn bước Bookmark Lookup về Clustered Index.

---

[← Back to README](README.md)

