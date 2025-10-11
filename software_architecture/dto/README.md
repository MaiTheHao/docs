# Tổng quan về Data Transfer Object (DTO)

---

## 1. Định nghĩa DTO

DTO (Data Transfer Object) là một design pattern dùng để vận chuyển dữ liệu giữa các tiến trình hoặc các tầng trong ứng dụng.

-   DTO là đối tượng đơn giản, chỉ chứa fields và các getters/setters, **không có business logic**.
-   Được ví như "túi chứa dữ liệu" để truyền từ tầng này sang tầng khác, đóng gói và truyền tải.

---

## 2. Động lực ra đời

-   **Giảm số lượng remote calls** trong hệ thống phân tán.
-   Trong kiến trúc client-server, mỗi request đều đi kèm với latency và overhead.
-   DTO tổng hợp dữ liệu vào một đối tượng duy nhất, **giảm round-trips** giữa client và server.

| Thuật ngữ    | Giải thích                                                                   |
| :----------- | :--------------------------------------------------------------------------- |
| remote calls | Các cuộc gọi từ xa, ví dụ API calls, database calls, ...                     |
| round-trips  | Số lần gửi và nhận dữ liệu qua mạng, ví dụ từ client đến server và ngược lại |

---

## 3. Động lực hiện tại

-   Động lực ban đầu vẫn giữ nguyên.
-   Ngày nay, DTO còn giúp **tách biệt các tầng**, giảm sự phụ thuộc giữa các lớp.

---

## 4. So sánh DTO với các khái niệm

| Khái niệm          | Đặc điểm chính                                                                   |
| :----------------- | :------------------------------------------------------------------------------- |
| Entity             | Có identity fields, chứa business logic, liên quan đến persistence.              |
| Value Object       | Không có identity fields, immutable, đại diện cho một khái niệm, có thể có logic |
| Data Access Object | Cung cấp interface CRUD nguồn dữ liệu, không chứa dữ liệu.                       |
| Mapper             | Chuyển đổi dữ liệu giữa Entity <-> DTO hoặc các định dạng khác.                  |
| Model              | Đại diện dữ liệu trong ứng dụng, có thể bao gồm business logic.                  |
| View Model         | Giống DTO nhưng có thể có logic trình bày.                                       |

---

## 5. Nguyên tắc tách biệt giao diện (ISP - SOLID)

-   Client **không nên bị ép buộc** phải phụ thuộc vào các interface không sử dụng.
-   Nếu Entity có quá nhiều fields, client có thể bị ép tải dữ liệu không cần thiết, **giảm bảo mật**.

---

## 6. Best Practices sử dụng DTO

-   Giao tiếp qua remote calls (API, microservices). Trong microservices, nơi latency và overhead cao, DTO **tối ưu hiệu năng** và giúp bảo trì, mở rộng dễ dàng.
-   **Giảm sự phụ thuộc** và tách rời các layer (Controller, Service, Repository).
-   Định nghĩa interface ổn định, dễ mở rộng và bảo trì.
-   **Tổng hợp dữ liệu**, giảm round-trips.

---

## 7. Worth Noting khi sử dụng DTO

-   Trong cùng layer.
-   CRUD đơn giản.
-   Với ứng dụng monolith, các calls giữa thành phần có cost thấp, dùng DTO có thể dẫn đến verbose và boilerplate.
-   Khi chỉ copy-paste cấu trúc dữ liệu từ thực thể mà **không có biến đổi, che giấu thông tin hoặc bảo mật**.
