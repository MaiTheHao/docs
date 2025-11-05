# Giới thiệu về Spring Core - Nền tảng của Spring Framework

Trong các bài học trước, chúng ta đã thảo luận ở mức độ tổng quan về Spring và mối quan hệ giữa Spring và Jakarta Enterprise Edition. Bây giờ, trước khi bắt tay vào việc tạo các ứng dụng Spring, chúng ta cần làm rõ một số khái niệm cốt lõi của Spring.

> **Lưu ý quan trọng:**
> Việc nắm vững các khái niệm lý thuyết của **Spring Core** là điều kiện tiên quyết để có thể xây dựng các ứng dụng Spring một cách hiệu quả. Mặc dù phần lý thuyết có thể hơi khô khan, nhưng đây là nền tảng không thể thiếu.

---

## 1. Spring không phải là một Framework đơn lẻ

Khi nói đến **Spring**, chúng ta không đề cập đến một framework duy nhất. **Spring** thực chất là một hệ sinh thái bao gồm hơn 50 framework con (thường được gọi là các dự án hoặc module), mỗi framework được thiết kế để giải quyết một bài toán cụ thể trong quá trình phát triển ứng dụng web.

Một số dự án tiêu biểu trong hệ sinh thái Spring bao gồm:

-   **Spring MVC:** Xây dựng ứng dụng web theo mô hình Model-View-Controller.
-   **Spring Data:** Đơn giản hóa việc truy cập dữ liệu từ các nguồn khác nhau.
-   **Spring Boot:** Giúp tạo và cấu hình ứng dụng Spring một cách nhanh chóng.
-   **Spring Cloud:** Cung cấp các công cụ để xây dựng các hệ thống phân tán (distributed systems).
-   **Spring Security:** Cung cấp các giải pháp xác thực và phân quyền cho ứng dụng.
-   **Spring AOP:** Hỗ trợ Lập trình hướng khía cạnh (Aspect-Oriented Programming).

Mỗi dự án này giúp các nhà phát triển giải quyết một vấn đề chuyên biệt. Ví dụ, **Spring Security** giúp triển khai bảo mật cho ứng dụng web hoặc di động, trong khi **Spring Boot** là công cụ đắc lực để xây dựng các ứng dụng vi dịch vụ (microservices).

---

## 2. Spring Core: Trái tim của hệ sinh thái Spring

Như bạn có thể thấy trong sơ đồ kiến trúc, **Spring Core** nằm ở vị trí trung tâm và là nền tảng cho tất cả các dự án khác trong hệ sinh thái Spring.

Vậy **Spring Core** là gì?
**Spring Core** là trái tim của toàn bộ hệ sinh thái Spring. Nó chứa các lớp, nguyên tắc và cơ chế nền tảng nhất của framework. Nếu không học và hiểu rõ các thành phần của **Spring Core**, chúng ta không thể thực sự xây dựng các ứng dụng Spring Web hay Spring Boot một cách hiệu quả.

Đây là lý do tại sao việc hiểu rõ các khái niệm cốt lõi sau đây là cực kỳ quan trọng đối với bất kỳ nhà phát triển nào:

-   **Đảo ngược Điều khiển** (Inversion of Control - IoC)
-   **Tiêm phụ thuộc** (Dependency Injection - DI)
-   **Beans** trong Spring
-   **Context** (Ngữ cảnh) trong Spring
-   **Ngôn ngữ Biểu thức Spring** (Spring Expression Language - SpEL)
-   **IoC Container**

---

## 3. Lộ trình tiếp theo

Trong vài bài học tới, chúng ta sẽ tập trung vào việc tìm hiểu sâu hơn về các khái niệm nền tảng của **Spring Core**. Tôi biết bạn đang rất hào hứng muốn bắt tay vào việc tạo ra các ứng dụng thực tế, và tôi cũng vậy. Tuy nhiên, hãy kiên nhẫn một chút, vì việc nắm vững những "thuật ngữ" và khái niệm này sẽ là chìa khóa giúp bạn thành công với Spring Framework.

Cảm ơn bạn và chúng ta sẽ tiếp tục thảo luận về Spring Core trong bài học tiếp theo.
