# Chiến Lược Lựa Chọn Cấu Trúc Cho Thực Tế

## Mục lục

-   [1. Định luật Conway và chiến thuật Inverse Conway Maneuver](#1-định-luật-conway-và-chiến-thuật-inverse-conway-maneuver)
-   [2. Tải nhận thức (Cognitive Load) của Team](#2-tải-nhận-thức-cognitive-load-của-team)
-   [3. Ma trận quyết định (Decision Matrix)](#3-ma-trận-quyết-định-decision-matrix)
-   [4. Chiến lược "Monolith First"](#4-chiến-lược-monolith-first)

---

## 1. Định luật Conway và chiến thuật Inverse Conway Maneuver

Melvin Conway đã phát biểu năm 1967:

> **Công thức:**
> "Các tổ chức thiết kế hệ thống bị ràng buộc phải tạo ra các thiết kế là bản sao của cấu trúc giao tiếp trong tổ chức đó."

### 1.1. Ý nghĩa

Nếu tổ chức của bạn được chia thành các team kỹ thuật chuyên biệt (Team DB, Team Backend, Team Frontend), bạn sẽ gần như chắc chắn tạo ra một kiến trúc **Phân lớp (Layered Architecture)**. Bất kỳ nỗ lực nào để xây dựng Microservices hay Modular Monolith với cấu trúc tổ chức này đều sẽ gặp trở ngại lớn về giao tiếp và quy trình.

### 1.2. Inverse Conway Maneuver (Chiến thuật Đảo ngược)

Để đạt được kiến trúc mong muốn (ví dụ: Modular Monolith với các ranh giới rõ ràng), bạn phải **thay đổi cấu trúc tổ chức trước**.

1. Thành lập các **"Stream-aligned teams"** (Team hướng theo dòng chảy giá trị)
2. Bao gồm đủ các vai trò (BE, FE, QA, Product) cùng chịu trách nhiệm cho một module nghiệp vụ (ví dụ: Team Checkout)
3. Khi cấu trúc giao tiếp thay đổi, kiến trúc phần mềm sẽ tự nhiên biến đổi theo để phù hợp

---

## 2. Tải nhận thức (Cognitive Load) của Team

Cuốn sách "Team Topologies" đưa ra khái niệm quan trọng: **Cognitive Load**. Mỗi team có một giới hạn về lượng thông tin và độ phức tạp mà họ có thể xử lý hiệu quả.

-   **Kiến trúc quá phức tạp** (ví dụ: hàng trăm Microservices cho một team nhỏ): Team sẽ bị quá tải (Cognitive Overload), dẫn đến giảm chất lượng và tốc độ.

-   **Kiến trúc quá nguyên khối** (Monolith khổng lồ không chia module): Team sẽ mất quá nhiều thời gian để hiểu tác động của một dòng code sửa đổi.

**Chiến lược:**

1. Sử dụng kiến trúc Modular Monolith để chia nhỏ hệ thống thành các phần vừa vặn với Cognitive Load của từng team
2. Sử dụng các nền tảng hỗ trợ (Platform Engineering) để ẩn đi sự phức tạp của hạ tầng, giúp team tập trung vào logic nghiệp vụ

---

## 3. Ma trận quyết định (Decision Matrix)

Dưới đây là khung tham chiếu để lựa chọn cấu trúc dựa trên đặc thù dự án:

| Loại Dự Án                           | Quy Mô Team       | Độ Phức Tạp Domain   | Chiến Lược Kiến Trúc Khuyên Dùng         | Lý Do Cốt Lõi                                                                                                 |
| ------------------------------------ | ----------------- | -------------------- | ---------------------------------------- | ------------------------------------------------------------------------------------------------------------- |
| **MVP / Startup giai đoạn đầu**      | < 5 người         | Thấp - Trung bình    | Modular Monolith (Lỏng lẻo)              | Tối ưu Time-to-market. Chưa cần Clean Arch quá nghiêm ngặt. Tránh Microservices bằng mọi giá.                 |
| **Sản phẩm Doanh nghiệp (SaaS/B2B)** | 10 - 50 người     | Cao (Logic phức tạp) | Modular Monolith + DDD + Clean Arch      | Cần bảo trì dài hạn. Ranh giới module giúp nhiều team làm việc song song. Clean Arch bảo vệ core logic.       |
| **Hệ thống E-commerce / Scale lớn**  | > 50 người        | Rất cao              | Microservices (Tách từ Modular Monolith) | Cần scale độc lập các module nóng (ví dụ: Order, Inventory). Chỉ tách service khi đã hiểu rõ Bounded Context. |
| **Dự án Outsource / Ngắn hạn**       | Thay đổi liên tục | Thấp (CRUD)          | Layered Architecture                     | Dễ chuyển giao, nhân sự dễ nắm bắt, chi phí phát triển thấp.                                                  |

---

## 4. Chiến lược "Monolith First"

Một sai lầm phổ biến là bắt đầu dự án mới bằng Microservices với hy vọng sẽ "dễ scale sau này". Thực tế chứng minh điều ngược lại.

> **Vấn đề:** Khi dự án mới bắt đầu, chúng ta chưa hiểu rõ về Domain, chưa biết đâu là ranh giới đúng giữa các module. Việc chia tách sớm (Premature Decomposition) dẫn đến việc tạo ra các ranh giới sai, khiến các service phải gọi nhau liên tục (chatty services), hiệu năng giảm sút và refactor cực kỳ khó khăn.

Martin Fowler và các chuyên gia đều khuyến nghị chiến lược **"Monolith First"**:

1. **Xây dựng một Monolith**
2. **Giữ cho nó Modular** (sử dụng Spring Modulith hoặc NestJS Modules)
3. **Chỉ tách ra thành Microservice** khi một module cụ thể gặp vấn đề về hiệu năng độc lập hoặc cần công nghệ riêng biệt
