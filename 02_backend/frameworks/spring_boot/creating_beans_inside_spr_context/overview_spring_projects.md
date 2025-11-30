# Bối cảnh Hệ sinh thái: Giới thiệu về Các Dự án Spring

## Mục lục

-   [1. Spring Boot](#1-spring-boot)
-   [2. Spring Data JPA](#2-spring-data-jpa)
-   [3. Spring Security](#3-spring-security)
-   [4. Spring Cloud](#4-spring-cloud)
-   [5. Tổng kết](#5-tổng-kết)

---

## 1. Spring Boot

**Spring Boot** là dự án phổ biến nhất trong hệ sinh thái Spring và là điểm khởi đầu cho hầu hết các ứng dụng Spring hiện đại.

-   **Mối quan hệ:** Spring Boot là một phần mở rộng (**extension**) được xây dựng trên đỉnh của **Spring Framework**.
-   **Mục tiêu:** Loại bỏ phần lớn cấu hình **boilerplate** và thiết lập thủ công, cho phép phát triển nhanh chóng. Nó có một "**quan điểm**" (opinionated) về cách xây dựng các ứng dụng sẵn sàng cho sản xuất.

**Các Tính năng Chính:**

-   **Auto-Configuration (Tự động Cấu hình):** Boot kiểm tra các tệp JAR trên classpath và tự động cấu hình các bean cần thiết.
-   **Opinionated "Starters":** Các bộ mô tả phụ thuộc tiện lợi trong Maven/Gradle, kéo các phụ thuộc cần thiết với phiên bản tương thích.
-   **Embedded Servers (Máy chủ Nhúng):** Cho phép đóng gói ứng dụng dưới dạng một tệp jar thực thi duy nhất, chứa máy chủ (Tomcat, Jetty, Undertow) bên trong.

---

## 2. Spring Data JPA

**Spring Data** là một dự án bao trùm nhằm đơn giản hóa việc truy cập dữ liệu. **Spring Data JPA** là một mô-đun con đặc biệt phổ biến.

-   **Mục tiêu:** Cung cấp một lớp trừu tượng (**abstraction layer**) phía trên **Java Persistence API (JPA)**, giảm mã boilerplate cho các hoạt động cơ sở dữ liệu.

**Ngăn xếp Trừu tượng:**

| Lớp                 | Vai trò                                                |
| ------------------- | ------------------------------------------------------ |
| **Spring Data JPA** | Cung cấp các giao diện Repository và tự động tạo proxy |
| **JPA**             | Đặc tả (specification) - bộ giao diện và quy tắc       |
| **Hibernate**       | Triển khai thực tế của JPA                             |
| **JDBC**            | API Java cấp thấp để thực thi SQL                      |

**Cơ chế Hoạt động:**  
Thay vì viết lớp DAO, chỉ cần định nghĩa một giao diện kế thừa từ **JpaRepository**.

```java
@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    // Không cần mã ở đây cho CRUD!
}
```

> **Ghi nhớ:** Spring Data tự động tạo ra một bean proxy cho mỗi giao diện Repository, đăng ký nó trong ApplicationContext.

---

## 3. Spring Security

**Spring Security** là framework tiêu chuẩn để bảo mật các ứng dụng Spring.

-   **Mục tiêu:** Cung cấp cả hai dịch vụ **Authentication** (Xác thực - "Bạn là ai?") và **Authorization** (Ủy quyền - "Bạn được phép làm gì?").
-   **Cơ chế:** Tích hợp vào vòng đời xử lý yêu cầu web thông qua chuỗi các **Servlet Filter**.
-   **Tính năng:** Bảo vệ chống lại các cuộc tấn công phổ biến như **CSRF**, **Session Fixation**, **Clickjacking**; tích hợp với LDAP, OAuth2, JWT.

---

## 4. Spring Cloud

**Spring Cloud** cung cấp bộ công cụ để xây dựng và điều phối các hệ thống phân tán phức tạp (**microservices**).

-   **Service Discovery:** (Spring Cloud Netflix Eureka) - "cuốn danh bạ điện thoại" động cho các dịch vụ.
-   **Centralized Configuration:** (Spring Cloud Config) - quản lý cấu hình tập trung cho nhiều dịch vụ.
-   **API Gateway:** (Spring Cloud Gateway) - điểm vào duy nhất, xử lý định tuyến, bảo mật, cân bằng tải.
-   **Fault Tolerance:** (Resilience4j) - triển khai các mẫu như **Circuit Breaker** để chịu lỗi.

> **Ghi nhớ:** Toàn bộ hệ sinh thái Spring đều được xây dựng dựa trên core IoC container. Spring Framework cung cấp cơ chế cơ bản (**IoC** và **DI**). Spring Boot cung cấp hệ thống runtime và tự động cấu hình. Các dự án Spring Data, Spring Security, Spring Cloud đều là các tập hợp bean và cấu hình được quản lý bởi cùng một container cốt lõi.

---

## 5. Tổng kết

-   **Spring Boot** giúp khởi tạo và cấu hình ứng dụng nhanh chóng.
-   **Spring Data JPA** đơn giản hóa truy cập dữ liệu và CRUD.
-   **Spring Security** bảo vệ ứng dụng khỏi các mối nguy phổ biến.
-   **Spring Cloud** hỗ trợ xây dựng hệ thống microservices hiện đại.
