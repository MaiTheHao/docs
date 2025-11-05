# So sánh Jakarta EE và Spring Framework: Lịch sử và Vai trò

## Giới thiệu

Spring ra đời như một giải pháp thay thế cho **Java Enterprise Edition (Java EE)** và nhanh chóng trở nên phổ biến, vượt qua cả Java EE chỉ trong vài năm. Bài viết này sẽ đi sâu vào việc phân biệt giữa **Jakarta EE** (tên gọi hiện tại của Java EE) và **Spring Framework**, đồng thời làm rõ vai trò và trách nhiệm của chúng trong hệ sinh thái phát triển ứng dụng web bằng Java.

## Mục lục

1.  [Lịch sử phát triển](#1-lịch-sử-phát-triển)
2.  [So sánh Jakarta EE và Spring](#2-so-sánh-jakarta-ee-và-spring)
3.  [Mối quan hệ cộng sinh](#3-mối-quan-hệ-cộng-sinh)
4.  [Sự phát triển của Spring Framework](#4-sự-phát-triển-của-spring-framework)
5.  [Tổng kết](#5-tổng-kết)

---

## 1. Lịch sử phát triển

Để hiểu rõ sự khác biệt, trước tiên chúng ta cần nhìn lại dòng thời gian phát hành của cả hai.

### 1.1. Java Enterprise Edition (J2EE / Java EE / Jakarta EE)

Hành trình của Enterprise Edition có thể được tóm tắt qua các giai đoạn sau:

1.  **Giai đoạn J2EE (1999 - 2003):** Phiên bản đầu tiên ra mắt năm 1999 với tên gọi `J2EE`. Các phiên bản 1.3 (2001) và 1.4 (2003) tiếp tục được phát hành dưới tên này.
2.  **Giai đoạn Java EE (2006 - 2017):** Kể từ phiên bản 5, tên gọi được đổi thành **Java EE**. Lý do là để làm rõ ràng hơn rằng đây là phiên bản dành cho doanh nghiệp của ngôn ngữ Java, thay vì chỉ dùng chữ "J" khó hiểu. Các phiên bản 5, 6, 7, và 8 lần lượt ra đời trong giai đoạn này.
3.  **Giai đoạn Jakarta EE (2019 - nay):** Sau phiên bản 8, Oracle nhận thấy sự thống trị của Spring trong cộng đồng. Họ quyết định chuyển giao Java EE cho cộng đồng mã nguồn mở quản lý.

> **Vấn đề:** Oracle sở hữu thương hiệu "Java", vì vậy họ không thể chuyển giao nền tảng với tên gọi `Java Enterprise Edition`.
> **Giải pháp:** Nền tảng được đổi tên thành **Jakarta Enterprise Edition**. Một thay đổi kỹ thuật quan trọng là tất cả các gói (packages) đều được đổi tên từ `javax.*` thành `jakarta.*`.

### 1.2. Spring Framework

-   **Năm 2002:** Rod Johnson giới thiệu các ý tưởng ban đầu về Spring trong cuốn sách "Expert One-on-One J2EE Design and Development".
-   **Năm 2003:** Phiên bản beta đầu tiên được phát hành.
-   **Năm 2004:** Phiên bản ổn định 1.0 chính thức ra mắt, đánh dấu sự khởi đầu của một giải pháp thay thế mạnh mẽ cho sự phức tạp của J2EE.

---

## 2. So sánh Jakarta EE và Spring

### 2.1. Jakarta EE là gì?

**Jakarta EE** là một tập hợp các **đặc tả kỹ thuật (specifications)** và **API** để xây dựng các ứng dụng web cấp doanh nghiệp. Nó mở rộng từ **Java Standard Edition (Java SE)** bằng cách cung cấp các công nghệ nâng cao như:

-   Servlets
-   JavaServer Pages (JSP)
-   Enterprise JavaBeans (EJB)
-   Java Persistence API (JPA)
-   Java Message Service (JMS)

> **Vấn đề:** Các phiên bản đầu của Java EE (đặc biệt là J2EE) cực kỳ phức tạp. Lập trình viên phải xử lý rất nhiều cấu hình và viết một lượng lớn code lặp đi lặp lại (boilerplate code) cho các tác vụ không liên quan trực tiếp đến logic nghiệp vụ.
>
> **Ví dụ:** Để truy vấn cơ sở dữ liệu, lập trình viên không chỉ viết câu lệnh SQL mà còn phải tự quản lý việc lấy kết nối, đóng kết nối, xử lý ngoại lệ, quản lý giao dịch (transaction),...

### 2.2. Spring Framework là gì?

**Spring Framework** ra đời như một giải pháp để giải quyết sự phức tạp của Java EE. Nó không phải là một sự thay thế hoàn toàn, mà là một framework xây dựng **trên nền tảng** các đặc tả của Jakarta EE, giúp việc phát triển trở nên đơn giản và hiệu quả hơn rất nhiều.

> **Giải pháp của Spring:** Spring che giấu đi sự phức tạp. Lập trình viên chỉ cần tập trung vào logic nghiệp vụ cốt lõi.
>
> **Ví dụ:** Vẫn với tác vụ truy vấn cơ sở dữ liệu, với Spring, bạn chỉ cần cung cấp thông tin kết nối. Spring sẽ tự động xử lý toàn bộ quy trình lấy/đóng kết nối, quản lý giao dịch và xử lý ngoại lệ. Điều này được thực hiện thông qua các nguyên lý cốt lõi như **Đảo ngược Điều khiển (Inversion of Control - IoC)** và **Tiêm phụ thuộc (Dependency Injection - DI)**.

### 2.3. Bảng so sánh tổng quan

| Tiêu chí         | Jakarta EE                                                                             | Spring Framework                                                                                 |
| :--------------- | :------------------------------------------------------------------------------------- | :----------------------------------------------------------------------------------------------- |
| **Bản chất**     | Tập hợp các **đặc tả** và API.                                                         | Một **framework** hoàn chỉnh cung cấp các **hiện thực hóa (implementations)** cho các đặc tả đó. |
| **Mục tiêu**     | Định nghĩa một tiêu chuẩn chung cho phát triển ứng dụng Java doanh nghiệp.             | Đơn giản hóa việc phát triển bằng cách giảm thiểu code lặp và cấu hình phức tạp.                 |
| **Sự phức tạp**  | Cao, đặc biệt ở các phiên bản đầu. Yêu cầu lập trình viên xử lý nhiều tác vụ nền.      | Thấp. Che giấu sự phức tạp, cho phép lập trình viên tập trung vào logic nghiệp vụ.               |
| **Sự linh hoạt** | Kém linh hoạt hơn, thường gắn liền với các máy chủ ứng dụng (Application Servers) lớn. | Rất linh hoạt, có thể chạy trên các servlet container nhẹ như Tomcat, Jetty.                     |

---

## 3. Mối quan hệ cộng sinh

Một hiểu lầm phổ biến là Spring và Jakarta EE là hai đối thủ cạnh tranh trực tiếp.

> **Câu hỏi hay:** Liệu Spring có thể tồn tại mà không cần Jakarta EE không?
> **Trả lời:** **Không**. Spring không tự mình tạo ra mọi thứ từ đầu. Nó tận dụng và xây dựng dựa trên các đặc tả nền tảng do Jakarta EE định nghĩa. Ví dụ, **Spring MVC** được xây dựng trên nền tảng của **Servlet API** (một phần của Jakarta EE). **Spring Data JPA** là một lớp trừu tượng hóa mạnh mẽ hơn trên nền tảng của **JPA Specification**.

Vì vậy, chúng không phải là đối thủ mà là hai thực thể **cùng tồn tại và bổ trợ cho nhau**. Vai trò của Jakarta EE là đưa ra các tiêu chuẩn, còn vai trò của Spring là cung cấp một cách thức ưu việt để hiện thực hóa các tiêu chuẩn đó.

---

## 4. Sự phát triển của Spring Framework

Một lý do quan trọng giúp Spring trở nên phổ biến là khả năng liên tục phát triển và thích ứng với xu hướng thị trường. Spring không chỉ là một module duy nhất mà là một hệ sinh thái gồm nhiều dự án con (sub-projects):

-   **Spring MVC:** Hỗ trợ xây dựng ứng dụng web theo mô hình MVC.
-   **Spring Security:** Cung cấp các cơ chế bảo mật mạnh mẽ như xác thực, phân quyền, OAuth2.
-   **Spring Data:** Đơn giản hóa việc tương tác với cơ sở dữ liệu, hỗ trợ cả SQL và NoSQL.
-   **Spring Boot:** Một cuộc cách mạng giúp tạo và cấu hình ứng dụng Spring một cách cực kỳ nhanh chóng, với triết lý "convention over configuration" (ưu tiên quy ước hơn cấu hình).
-   **Spring Cloud:** Cung cấp các công cụ để xây dựng các hệ thống microservices, tích hợp với Docker và Kubernetes.
-   **Spring Batch:** Hỗ trợ xử lý các tác vụ hàng loạt (batch processing).

Sự ra đời của **Spring Boot** và **Spring Cloud** đã giúp các nhà phát triển dễ dàng xây dựng và triển khai các ứng dụng **microservices**, một kiến trúc đang rất thịnh hành hiện nay.

---

## 5. Tổng kết

-   **Jakarta EE** là một bộ **tiêu chuẩn (specifications)**, trong khi **Spring** là một **framework** cung cấp các **hiện thực hóa (implementations)** giúp đơn giản hóa việc áp dụng các tiêu chuẩn đó.
-   Spring không phải là đối thủ mà **xây dựng dựa trên** và **tận dụng** các API nền tảng của Jakarta EE (như Servlet, JPA).
-   Lý do chính khiến Spring chiến thắng là nó đã giải quyết được **sự phức tạp** cố hữu của Java EE, cho phép lập trình viên tập trung vào logic nghiệp vụ thay vì các cấu hình và code lặp.
-   Hệ sinh thái Spring, đặc biệt là với **Spring Boot**, đã liên tục phát triển để đáp ứng các xu hướng mới nhất của ngành như **microservices**, giúp nó duy trì vị thế dẫn đầu trong cộng đồng Java.
