# Design Spec: Tối ưu hóa Sơ đồ Mermaid & Nội dung Tài liệu NGINX

- **Ngày khởi tạo:** 2026-08-04
- **Thư mục mục tiêu:** `file:///home/maithehao/Workspace/projects/doc/nginx`
- **Mục tiêu:** Tối ưu hóa toàn bộ 19 sơ đồ Mermaid và nội dung của 9 tệp tài liệu NGINX theo skill `/mermaid` và `standardize_doc_style`.

---

## 1. Tổng quan & Mục tiêu Kỹ thuật

Tài liệu thiết kế này quy định chi tiết công việc chuẩn hóa và nâng cấp thư mục tài liệu `nginx`, bao gồm:
1. **Chuẩn hóa 100% sơ đồ Mermaid (19 sơ đồ):**
   - Khai báo đầy đủ `accTitle` và `accDescr` cho tính năng truy cập (Accessibility).
   - Bọc dấu nháy đôi `""` cho toàn bộ nhãn node chứa ký tự đặc biệt, khoảng trắng hoặc dấu ngoặc.
   - Thay thế toàn bộ ký tự `\n` thủ công trong nhãn node thành `<br/>`.
   - Chuẩn hóa ngữ nghĩa hình dạng Node (Process `[...]`, Terminal `(...)`, Database `[(...)]`, Decision `{...}`).
   - Tuyệt đối không dùng hardcode theme (`%%{init...}%%`) hay tùy chỉnh màu sắc cố định để đảm bảo tương thích tự động với cả Light/Dark theme trên VS Code và GitHub.
   - Bổ sung Bảng giải thích chi tiết (`| Thành phần/Bước | Vai trò/Mô tả | Chi tiết |`) ngay sau mỗi sơ đồ Mermaid chưa có bảng.

2. **Tối ưu hóa Nội dung & Phong cách:**
   - Chuẩn hóa văn phong kỹ thuật tiếng Việt, đảm bảo thuật ngữ nhất quán toàn bộ tài liệu.
   - Chuyển đổi các ghi chú/lưu ý thông thường thành **GitHub-style Alerts** (`> [!NOTE]`, `> [!TIP]`, `> [!IMPORTANT]`, `> [!WARNING]`).
   - Đảm bảo mỗi file chỉ chứa 1 thẻ `# (H1)`, có Mục lục `## Mục lục` và điều hướng chân trang `[← Quay lại mục lục](README.md)`.

---

## 2. Chi tiết Kế hoạch Thay đổi theo Tệp Tài liệu

### 2.1 `01_nginx_introduction.md`
- **Sơ đồ Mermaid 1 (Timeline Lịch sử NGINX):** Bổ sung `accTitle: Timeline Lịch sử phát triển NGINX`, `accDescr: Cột mốc phát triển NGINX từ 2002 đến 2019`. Bọc quote các nhãn sự kiện.
- **Sơ đồ Mermaid 2 (Mô hình truyền thống C10K):** Bổ sung `accTitle`, `accDescr`. Bọc quote nhãn. Chuẩn hóa hình dạng node Client/Thread.
- **Sơ đồ Mermaid 3 (Multi-worker & OS Kernel):** Bổ sung `accTitle`, `accDescr`. Bọc quote nhãn chứa dấu ngoặc. Bổ sung Bảng giải thích các thành phần Kernel/User space bên dưới sơ đồ.
- **Nội dung:** Bổ sung `> [!NOTE]` về bài toán C10K và `> [!IMPORTANT]` về cơ chế epoll/kqueue.

### 2.2 `02_architecture_and_core_concepts.md`
- **Sơ đồ Mermaid 1 (Master-Worker Architecture):** Bổ sung `accTitle`, `accDescr`. Chuẩn hóa node Master, Worker, Cache Loader/Manager. Bổ sung bảng giải thích tiến trình bên dưới sơ đồ.
- **Sơ đồ Mermaid 2 (Asynchronous Non-blocking Sequence Diagram):** Bổ sung `accTitle`, `accDescr`. Bọc nhãn note trình tự.
- **Sơ đồ Mermaid 3 (Graceful Reload Flowchart):** Bổ sung `accTitle`, `accDescr`. Sửa lỗi `\n` thành `<br/>`, bọc nhãn điều kiện decision.
- **Nội dung:** Bổ sung `> [!WARNING]` về hiện tượng Thundering Herd và `> [!TIP]` cho cấu hình `SO_REUSEPORT` và Thread Pools.

### 2.3 `03_roles_and_use_cases.md`
- **Sơ đồ Mermaid 1 (Static Web Server sendfile):** Bổ sung `accTitle`, `accDescr`. Chuẩn hóa flow LR.
- **Sơ đồ Mermaid 2 (Reverse Proxy Architecture):** Bổ sung `accTitle`, `accDescr`. Bọc quote nhãn subgraph & microservices. Bổ sung bảng phân tích các protocol bên dưới.
- **Sơ đồ Mermaid 3 (Keep-Alive Connection Pool Sequence):** Bổ sung `accTitle`, `accDescr`.
- **Sơ đồ Mermaid 4 (Layer 4 vs Layer 7 Load Balancer):** Bổ sung `accTitle`, `accDescr`.
- **Sơ đồ Mermaid 5 (PROXY Protocol Sequence):** Bổ sung `accTitle`, `accDescr`.
- **Sơ đồ Mermaid 6 (Edge Caching Flowchart):** Bổ sung `accTitle`, `accDescr`.
- **Sơ đồ Mermaid 7 (proxy_cache_lock Sequence):** Bổ sung `accTitle`, `accDescr`.
- **Nội dung:** Bổ sung `> [!IMPORTANT]` cho cấu hình Keep-Alive và `> [!TIP]` cho kTLS & `proxy_cache_lock`.

### 2.4 `04_configuration_structure.md`
- **Sơ đồ Mermaid 1 (Context Hierarchy Flowchart):** Bổ sung `accTitle`, `accDescr`. Bọc quote toàn bộ các nhãn context `main`, `events`, `http`, `server`, `location`.
- **Nội dung:** Chuyển các chú thích nạp file cấu hình Debian vs RHEL thành `> [!NOTE]`.

### 2.5 `05_location_matching_algorithm.md`
- **Sơ đồ Mermaid 1 (Location Matching Algorithm Flowchart):**
  - Bổ sung `accTitle: Thuật toán Khớp Location 5 Bước`, `accDescr: Sơ đồ luồng quyết định chọn location trong NGINX`.
  - Thay thế toàn bộ ký tự `\n` trong nhãn node bằng `<br/>`.
  - Bọc nhãn node trong dấu nháy đôi `""` (đặc biệt các nhãn chứa `=`, `^~`, `~*`).
- **Nội dung:** Bổ sung `> [!WARNING]` về sự khác biệt nguy hiểm giữa `root` và `alias`.

### 2.6 `06_reverse_proxy_and_load_balancing.md`
- **Sơ đồ Mermaid 1 (Upstream Load Balancing Flowchart):** Bổ sung `accTitle`, `accDescr`. Bọc quote nhãn server weights/backup.
- **Nội dung:** Bổ sung `> [!TIP]` cho các thuật toán load balancing (`least_conn`, `ip_hash`) và `> [!IMPORTANT]` cho WebSocket proxy headers.

### 2.7 `07_caching_and_performance_tuning.md`
- **Sơ đồ Mermaid 1 (Traditional Copy vs Zero-Copy sendfile):** Bổ sung `accTitle`, `accDescr`. Sửa các nhãn copy/send.
- **Nội dung:** Bổ sung `> [!TIP]` cho Microcaching 1s và `> [!NOTE]` cho `tcp_nopush` / `tcp_nodelay`.

### 2.8 `08_security_and_ssl_tls.md`
- **Sơ đồ Mermaid 1 (Protocol Evolution Timeline):** Bổ sung `accTitle`, `accDescr`. Bọc quote mô tả timeline.
- **Sơ đồ Mermaid 2 (Leaky Bucket Rate Limiting Flowchart):** Bổ sung `accTitle`, `accDescr`. Chuẩn hóa node decision & drop action.
- **Nội dung:** Bổ sung `> [!SECURITY]` / `> [!WARNING]` cho cấu hình SSL/TLS ciphers và Rate Limiting.

---

## 3. Checklist Tự Kiểm tra Chất lượng (Self-Review Checklist)

- [ ] Cả 19 sơ đồ Mermaid có cú pháp hợp lệ, chạy tốt trên Mermaid preview.
- [ ] Không có sơ đồ nào dùng hardcode theme `%%{init...}%%` hay inline `style`/`classDef`.
- [ ] 100% sơ đồ Mermaid có `accTitle` và `accDescr`.
- [ ] 100% nhãn chứa ký tự đặc biệt được bọc trong dấu nháy đôi `""`.
- [ ] Không còn ký tự `\n` trong nhãn Mermaid, thay bằng `<br/>`.
- [ ] Mọi sơ đồ Mermaid đều đi kèm bảng giải thích chi tiết ở ngay bên dưới.
- [ ] Mọi file `.md` có đầy đủ tiêu đề H1, Mục lục và Footer Navigation.
