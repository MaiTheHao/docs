# So Sánh Chi Tiết Các Mô Hình Kiến Trúc

## Mục lục

-   [1. Nguyên tắc lựa chọn](#1-nguyên-tắc-lựa-chọn)
-   [2. Ma trận so sánh các đặc tính kỹ thuật](#2-ma-trận-so-sánh-các-đặc-tính-kỹ-thuật)
-   [3. Phân tích chi tiết các đánh đổi](#3-phân-tích-chi-tiết-các-đánh-đổi)

---

## 1. Nguyên tắc lựa chọn

Việc lựa chọn kiến trúc không phải là tìm ra giải pháp tốt nhất tuyệt đối, mà là tìm ra giải pháp **phù hợp nhất với bối cảnh**, đánh đổi giữa các yếu tố kỹ thuật và nhân sự.

---

## 2. Ma trận so sánh các đặc tính kỹ thuật

Bảng dưới đây tổng hợp các đặc tính cốt lõi của bốn mô hình kiến trúc phổ biến nhất hiện nay:

| Đặc Tính                     | Layered (N-Tier)             | Hexagonal/Clean (DDD)          | Modular Monolith                   | Microservices                    |
| ---------------------------- | ---------------------------- | ------------------------------ | ---------------------------------- | -------------------------------- |
| **Đơn vị tổ chức chính**     | Lớp kỹ thuật (Tech Layers)   | Miền nghiệp vụ (Domain)        | Module nghiệp vụ (Business Module) | Dịch vụ độc lập (Service)        |
| **Cơ chế giao tiếp**         | Gọi hàm trực tiếp (Top-down) | Qua Interface/Port (Inversion) | Qua Public API/Event (In-process)  | Qua Network (HTTP/gRPC/Queue)    |
| **Độ phức tạp khởi tạo**     | Thấp                         | Trung bình - Cao               | Trung bình                         | Rất cao                          |
| **Khả năng mở rộng (Scale)** | Thấp (Scale toàn bộ App)     | Trung bình (Scale toàn bộ App) | Tốt (Scale module logic)           | Rất tốt (Scale vật lý từng phần) |
| **Hiệu năng (Latency)**      | Rất cao (In-memory)          | Cao (In-memory)                | Cao (In-memory)                    | Thấp hơn (Network latency)       |
| **Tính toàn vẹn dữ liệu**    | Transaction ACID đơn giản    | Transaction ACID đơn giản      | Transaction ACID (trong module)    | Eventual Consistency (phức tạp)  |
| **Khả năng Test**            | Khó cô lập, phụ thuộc DB     | Dễ Unit Test logic cốt lõi     | Dễ Integration Test module         | Phức tạp (Contract Testing)      |
| **Chi phí triển khai (Ops)** | Thấp (1 Artifact)            | Thấp (1 Artifact)              | Thấp (1 Artifact)                  | Rất cao (Orchestration, K8s)     |

---

## 3. Phân tích chi tiết các đánh đổi

### 3.1. Layered vs. Modular Monolith

Sự chuyển dịch từ Layered sang Modular Monolith là sự thay đổi từ **"Technical Cohesion"** (Sự kết dính kỹ thuật) sang **"Functional Cohesion"** (Sự kết dính chức năng).

-   **Layered Architecture**: Các file liên quan đến nhau về mặt loại hình (ví dụ: tất cả các Controller) được đặt cạnh nhau. Thuận tiện khi muốn thay đổi cách controller hoạt động, nhưng gây khó khăn khi muốn thay đổi tính năng "Checkout" vì phải sửa file ở 3-4 thư mục khác nhau.

-   **Modular Monolith**: Gom nhóm theo tính năng, giúp việc sửa đổi nghiệp vụ trở nên cục bộ và ít rủi ro hơn. Giảm thiểu **"Cognitive Load"** tốt hơn cho các team lớn.

### 3.2. Monolith vs. Microservices

Martin Fowler và Simon Brown đã nhiều lần cảnh báo về **"Microservice Premium"** - cái giá phải trả khi áp dụng Microservices quá sớm.

**Microservices giải quyết:**

-   Vấn đề về quy mô tổ chức (organizational scaling)
-   Khả năng triển khai độc lập

**Microservices giới thiệu các vấn đề:**

-   Độ trễ mạng
-   Giao dịch phân tán (Saga pattern)
-   Sự khó khăn trong việc debug

> **Ghi nhớ:** Nếu bạn không thể xây dựng một hệ thống Modular tốt trong một codebase, bạn chắc chắn sẽ tạo ra một **"Distributed Big Ball of Mud"** (Đống bùn phân tán) khi chuyển sang Microservices.

Shopify là ví dụ điển hình cho việc duy trì Monolith (Modular) để xử lý lượng traffic khổng lồ mà vẫn giữ được hiệu suất phát triển cao.

### 3.3. Clean Architecture - Khi nào cần?

Không phải dự án nào cũng cần Clean Architecture.

-   **Không cần**: Với các ứng dụng CRUD đơn giản, việc tạo ra hàng loạt Interfaces, DTOs, Mappers chỉ để chuyển dữ liệu từ Database ra JSON là sự lãng phí (Over-engineering).

-   **Cần**: Clean Architecture tỏa sáng ở các dự án có **logic nghiệp vụ phức tạp (Enterprise Logic)**, nơi các quy tắc kinh doanh thay đổi thường xuyên hơn công nghệ lưu trữ.
