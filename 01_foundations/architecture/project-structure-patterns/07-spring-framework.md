# Spring Framework: Từ Phân Lớp Đến Modular Monolith

## Mục lục

-   [1. Bản chất kiến trúc: Tại sao Spring mặc định là Layered?](#1-bản-chất-kiến-trúc-tại-sao-spring-mặc-định-là-layered)
-   [2. Chiến lược tổ chức thư mục](#2-chiến-lược-tổ-chức-thư-mục)
-   [3. Spring Modulith: Chuẩn hóa Modular Monolith](#3-spring-modulith-chuẩn-hóa-modular-monolith)

---

## 1. Bản chất kiến trúc: Tại sao Spring mặc định là Layered?

Trong hơn 20 năm, Spring Boot thường được gắn liền với **Layered Architecture** (Controller -> Service -> Repository). Không phải ngẫu nhiên mà cấu trúc này trở thành tiêu chuẩn, nó xuất phát từ cơ chế hoạt động cốt lõi của Framework:

1.  **Transaction Script Pattern:** Sức mạnh lớn nhất của Spring là quản lý Transaction thông qua AOP (`@Transactional`). Mô hình này hoạt động hiệu quả nhất khi bạn có một lớp `Service` (Stateless Singleton) thực hiện một chuỗi các thao tác thay đổi dữ liệu từ đầu đến cuối.
2.  **Anemic Domain Model:** Kết hợp với JPA/Hibernate, các Entity thường biến thành các vật chứa dữ liệu (Getters/Setters). Logic nghiệp vụ bị đẩy ra ngoài Service để tận dụng khả năng của Spring Container. Mặc dù DDD coi đây là Anti-pattern, nhưng với Spring, đây là cách thực dụng nhất để phát triển nhanh.

> **Kết luận:** Nếu chọn Spring cho dự án vừa và nhỏ, đừng cố ép Clean Architecture quá sớm. Hãy tận dụng sức mạnh của **Layered Architecture** vì Framework được tối ưu cho nó.

---

## 2. Chiến lược tổ chức thư mục

Tùy vào quy mô, bạn có hai lựa chọn cấu trúc phổ biến trong Spring:

### 2.1. Package-by-Layer (Truyền thống)

Phù hợp cho dự án nhỏ, team < 5 người, logic CRUD đơn giản.

```text
com.example.project/
├── controllers/       # Tất cả Controller nằm ở đây
├── services/          # Tất cả Service nằm ở đây
├── repositories/      # Tất cả Repository nằm ở đây
└── entities/          # Tất cả Entity nằm ở đây
```

Ưu điểm: Dễ hiểu, dễ tìm file theo loại kỹ thuật.

Nhược điểm: Khi dự án lớn lên, tính năng bị xé lẻ. Muốn sửa tính năng "Order" phải nhảy qua 4 packages khác nhau.

### 2.2. Package-by-Feature (Khuyên dùng)

Phù hợp cho dự án doanh nghiệp, hướng tới Modular Monolith.

```text
com.example.project/
├── order/             # Mọi thứ liên quan đến Order
│   ├── OrderController.java
│   ├── OrderService.java
│   └── OrderRepository.java
├── inventory/         # Mọi thứ liên quan đến Inventory
└── payment/           # Mọi thứ liên quan đến Payment
```

Lợi ích: Tăng Functional Cohesion (Sự kết dính chức năng). Code thay đổi cùng nhau nằm cùng nhau.

---

> **Lời khuyên:** Với Spring Boot 3+, hãy bắt đầu ngay với cấu trúc Package-by-Feature. Đây là bước đệm hoàn hảo để giữ Monolith sạch sẽ trước khi cần tách Microservices.
