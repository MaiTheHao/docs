# Tổng Hợp Các Khẳng Định Từ Chuyên Gia

## Mục lục

-   [1. Martin Fowler (ThoughtWorks)](#1-martin-fowler-thoughtworks)
-   [2. Simon Brown (Tác giả C4 Model)](#2-simon-brown-tác-giả-c4-model)
-   [3. Robert C. Martin (Uncle Bob)](#3-robert-c-martin-uncle-bob)
-   [4. Shopify Engineering Team](#4-shopify-engineering-team)
-   [5. Kamil Myśliwiec (Tác giả NestJS)](#5-kamil-myśliwiec-tác-giả-nestjs)

---

## 1. Martin Fowler (ThoughtWorks)

> **"Quy luật thứ nhất của thiết kế đối tượng phân tán: Đừng phân tán các đối tượng."**
>
> (First Law of Distributed Object Design: Don't distribute your objects)

-   Ông nhấn mạnh: sự phân tán tăng **độ phức tạp theo cấp số nhân**, không phải tuyến tính.
-   Triết lý này cảnh báo về **microservices overkill** – nhiều dự án microservice thất bại vì phân tán quá sớm, thiếu hiểu biết về domain.

> **"Hầu hết các trường hợp xây dựng microservice từ đầu đều thất bại."**

-   Khuyến nghị: nên xây dựng **monolith vững chắc trước**, rồi mới tách ra nếu thực sự cần.

---

## 2. Simon Brown (Tác giả C4 Model)

> **"Nếu bạn không thể xây dựng một monolith có cấu trúc tốt, thì microservices cũng chẳng giúp được gì."**
>
> (If you can't build a well-structured monolith, what makes you think microservices is the answer?)

-   Microservices = **Modular Monolith bị phân tán**.
-   Nếu chưa có discipline trong codebase, microservices chỉ nhân lên rủi ro và phức tạp.
-   Ông khuyến cáo: **học cách kiểm soát module trong monolith trước khi nghĩ đến phân tán**.

---

## 3. Robert C. Martin (Uncle Bob)

> **"Một kiến trúc tốt cho phép bạn trì hoãn các quyết định quan trọng."**
>
> (A good architecture allows you to defer critical decisions)

-   **Clean Architecture** tách domain logic khỏi infrastructure, DB, UI.
-   Lợi ích: team có thể **thay đổi framework, database, hay UI mà không phá vỡ business logic**.
-   Hướng dẫn rõ ràng cho những dự án cần **flexibility và maintainability lâu dài**.

---

## 4. Shopify Engineering Team

> **"Boring is brilliant."**
>
> (Sự nhàm chán là sự xuất sắc)

-   Shopify chọn **Modular Monolith** thay vì chạy theo microservices hype.
-   Công cụ: [`packwerk`](https://github.com/Shopify/packwerk) – cưỡng chế ranh giới module, tương tự **Spring Modulith** cho Ruby.
-   Chứng minh: **monolith vẫn có thể scale cực tốt nếu thiết kế cẩn thận**, dễ maintain, debug và deploy.

---

## 5. Kamil Myśliwiec (Tác giả NestJS)

> **"Microservices không phải là con đường duy nhất để đạt được sự module hóa. Modular Monolith là điểm cân bằng hiệu quả."**

-   NestJS hỗ trợ **cả microservices lẫn monolith modular**.
-   Thiết kế module hướng dev: **phân tách ranh giới ngay trong monolith**, chuẩn bị cho scale nếu cần.
-   Thông điệp: **module hóa thông minh > chạy theo microservices**.

---

## 🔑 Takeaways

1. **Monolith > Microservices nếu chưa sẵn sàng**: kiểm soát codebase tốt trước khi phân tán.
2. **Modular Monolith** là lựa chọn cân bằng, dễ maintain, dễ scale.
3. **Architecture linh hoạt** cho phép defer quyết định về DB, framework hay UI.
4. **Tooling + discipline** quan trọng hơn hype.
5. "Nhàm chán nhưng vững chắc" thường là chiến lược thông minh hơn so với chasing trends.
