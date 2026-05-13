# Kết Luận

## Mục lục

-   [1. Tổng kết](#1-tổng-kết)
-   [2. Khuyến nghị thực hành](#2-khuyến-nghị-thực-hành)

---

## 1. Tổng kết

Hành trình tìm kiếm kiến trúc phần mềm "hoàn hảo" thực chất không có một đích đến cố định. Nó là **sự cân bằng động** giữa ràng buộc kỹ thuật, con người, thời gian và nhu cầu kinh doanh.

Qua phân tích các mô hình từ **Layered Architecture** đến **Modular Monolith**, cùng so sánh hai hệ sinh thái lớn **Spring** và **NestJS**, chúng ta rút ra các kết luận cốt lõi:

> **Điểm then chốt:** **Modular Monolith** là "Sweet Spot" của kiến trúc phần mềm hiện đại.
>
> -   Mang lại **tổ chức module rõ ràng**, khả năng maintain và scale như microservices.
> -   Không gánh chịu sự **phức tạp hạ tầng và operational overhead** của hệ thống phân tán.
> -   Cho phép team **trì hoãn quyết định công nghệ** mà không ảnh hưởng domain logic.

Nhìn chung, Modular Monolith không phải là điểm dừng, mà là **nền tảng vững chắc để tiến tới microservices khi thật sự cần thiết**.

---

## 2. Khuyến nghị thực hành

### 2.1. Dự án NestJS

-   Tận dụng hệ thống **Module** có sẵn kết hợp với công cụ **Sheriff** hoặc **Nx** để **cưỡng chế ranh giới module**.
-   Thiết kế module theo **feature hoặc domain**, tránh Layered cứng nhắc.
-   Đảm bảo codebase **dễ đọc, dễ test và dễ scale** mà không cần microservices quá sớm.

### 2.2. Dự án Spring Framework

-   Chuyển từ **Layered Architecture** sang **Package-by-Feature** để **giảm cognitive load** và tăng khả năng maintain.
-   Áp dụng **modular boundaries** ngay trong monolith, chuẩn bị cho scale sau này.
-   Tận dụng Spring Boot + Spring Modulith để **giữ hệ thống đơn giản nhưng linh hoạt**.

### 2.3. Nguyên tắc chung

Dù lựa chọn framework hay mô hình nào, hãy đảm bảo kiến trúc:

-   Phản ánh **ngôn ngữ nghiệp vụ (Ubiquitous Language)**.
-   Phù hợp với **khả năng nhận thức (Cognitive Load)** của team.
-   Cho phép **thay đổi công nghệ hoặc mở rộng scale mà không phá vỡ domain logic**.
-   Giữ sự **nhàm chán nhưng ổn định** – đôi khi boring thật sự là brilliant.

> **Tóm lại:** Kiến trúc tốt không phải là thứ bạn "triển khai" một lần, mà là **khuôn khổ duy trì và phát triển phần mềm bền vững**, giúp team tập trung vào business value hơn là infrastructure.
