# Các Thành phần Cốt lõi của Spring: Bean, Context và SpEL

## Giới thiệu

Trong các bài học trước, chúng ta đã thảo luận về **Inversion of Control (IoC)** và **Dependency Injection (DI)**, cũng như cách Spring Framework sử dụng chúng để đạt được sự ghép nối lỏng (loose coupling) và những lợi ích mà nó mang lại trong phát triển ứng dụng web.

Bài viết này sẽ tập trung vào các thành phần quan trọng khác bên trong **Spring Core**, giúp bạn có cái nhìn chi tiết hơn về cấu trúc của nó. Cụ thể, chúng ta sẽ đi sâu vào ba khái niệm: **Bean**, **Context**, và **Spring Expression Language (SpEL)**.

## Mục lục

-   [1. Spring Bean là gì?](#1-spring-bean-la-gi)
-   [2. Spring Context là gì?](#2-spring-context-la-gi)
-   [3. Spring Expression Language (SpEL) là gì?](#3-spring-expression-language-spel-la-gi)
-   [4. Tổng kết](#4-tong-ket)

---

## 1. Spring Bean là gì?

Trong thế giới Spring, bạn sẽ nghe rất nhiều về "Bean". Lý do là vì mọi thứ trong Spring đều hoạt động dựa trên việc cấu hình và tự động kết nối (autowiring) các Bean.

Nói một cách đơn giản, **Spring Bean** là một đối tượng Java thông thường (POJO - Plain Old Java Object) được khởi tạo, lắp ráp và quản lý vòng đời bởi **Spring IoC Container**.

> **Ghi nhớ:** Khi một lớp Java được quản lý bởi Spring Container, nó sẽ trở thành một **Bean**.

Không phải tất cả các lớp trong dự án của bạn đều cần được Spring quản lý. Ví dụ, các lớp tiện ích (utility classes) chứa các phương thức tĩnh như lấy ngày hiện tại hoặc tính toán không cần phải là Bean. Thay vào đó, chúng ta chỉ muốn Spring quản lý các lớp Java cốt lõi, thuộc về logic nghiệp vụ của ứng dụng, ví dụ như `Vehicle`, `Product`, hay `Employee`.

### Làm thế nào Spring biết lớp nào cần quản lý?

Với vai trò là lập trình viên, chúng ta có trách nhiệm chỉ định cho Spring IoC Container biết lớp nào cần được quản lý thông qua các **cấu hình (configurations)**. Các cấu hình này có thể được thực hiện bằng hai cách chính:

-   **XML Configurations**: Cách tiếp cận truyền thống.
-   **Annotations**: Cách tiếp cận hiện đại và phổ biến hơn.

Dựa trên các cấu hình này, Spring Container sẽ khởi tạo, lắp ráp và quản lý vòng đời của các Bean, bao gồm phạm vi (scope) của chúng và việc tiêm các phụ thuộc cần thiết bằng mẫu Dependency Injection.

---

## 2. Spring Context là gì?

**Spring Context**, hay cụ thể hơn là `ApplicationContext`, có thể được hình dung như một "không gian bộ nhớ" của ứng dụng web. Đây là nơi chứa tất cả các đối tượng (Bean) đã được Spring IoC Container khởi tạo và quản lý.

Mặc định, Spring không tự động biết về tất cả các lớp Java trong dự án của bạn. Trong quá trình khởi động ứng dụng, Spring IoC Container sẽ đọc các cấu hình mà chúng ta đã cung cấp, tạo ra các đối tượng tương ứng và đặt chúng vào trong Context.

> **Lưu ý quan trọng:** Nếu một đối tượng không tồn tại trong Spring Context, Spring Framework sẽ không thể quản lý nó. Context là trung tâm chứa thông tin về tất cả các Bean và các mối quan hệ phụ thuộc giữa chúng.

---

## 3. Spring Expression Language (SpEL) là gì?

Khi Spring quản lý hàng trăm, hàng nghìn Bean cùng với các phương thức và thuộc tính của chúng, chúng ta cần một công cụ mạnh mẽ để truy vấn và thao tác với các đối tượng này tại thời điểm chạy (runtime).

**Spring Expression Language (SpEL)** chính là công cụ đó. Nó là một ngôn ngữ biểu thức mạnh mẽ cho phép thực hiện các tác vụ như:

-   Lấy và gán giá trị thuộc tính (property).
-   Gọi phương thức (method invocation).
-   Thực hiện các phép toán logic và số học.
-   Truy cập các phần tử trong collection và map.

SpEL cung cấp một cú pháp linh hoạt để tương tác với đồ thị đối tượng (object graph) được quản lý bởi Spring Container.

---

## 4. Tổng kết

-   **Spring Bean**: Là một đối tượng Java được khởi tạo và quản lý bởi Spring IoC Container. Đây là thành phần xây dựng cơ bản nhất của một ứng dụng Spring.
-   **Spring Context**: Là nơi chứa và quản lý tất cả các Bean. Nếu một đối tượng không có trong Context, Spring sẽ không biết đến sự tồn tại của nó.
-   **Spring Expression Language (SpEL)**: Là một ngôn ngữ biểu thức mạnh mẽ dùng để truy vấn và thao tác với các Bean và thuộc tính của chúng tại thời điểm chạy.
