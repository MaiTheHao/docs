# Bài giảng: Spring IOC Container

Giới thiệu ngắn: Bài này trình bày khái niệm, thành phần và hoạt động cơ bản của **Bộ chứa IOC của Spring (Spring IOC Container)**, cách nó quản lý các bean và khi nào nên dùng các triển khai khác nhau.

## Mục lục

-   [1. Tổng quan về Spring IOC Container](#1-tổng-quan-về-spring-ioc-container)
-   [2. Thành phần chính: Bean Factory vs ApplicationContext](#2-thành-phần-chính-bean-factory-vs-applicationcontext)
-   [3. Nguyên lý hoạt động của IOC](#3-nguyên-lý-hoạt-động-của-ioc)
-   [4. Luồng tạo và quản lý bean (Workflow)](#4-luồng-tạo-và-quản-lý-bean-workflow)
-   [5. Các kiểu cấu hình (XML / Annotation / Classpath)](#5-các-kiểu-cấu-hình-xml--annotation--classpath)
-   [6. Khi nào chọn BeanFactory vs ApplicationContext](#6-khi-nào-chọn-beanfactory-vs-applicationcontext)
-   [7. Ví dụ ngắn minh họa (Annotation + XML)](#7-ví-dụ-ngắn-minh-họa-annotation--xml)
-   [8. Tổng kết](#8-tổng-kết)

## 1. Tổng quan về Spring IOC Container

**Giải thích:**  
**Bộ chứa IOC của Spring (Spring IOC Container)** là thành phần của Spring Core chịu trách nhiệm tạo ra các **bean**, cấu hình chúng và quản lý sự phụ thuộc (dependency) giữa các đối tượng. Nói đơn giản, nó giống như "người quản lý đời sống" của các đối tượng trong ứng dụng: tạo, khởi tạo giá trị ban đầu, thực thi logic trước/khi hủy và tiêm phụ thuộc theo **Dependency Injection (DI)**.

> **Công thức:**  
> **IOC = Inversion of Control + Dependency Injection**

---

## 2. Thành phần chính: Bean Factory vs ApplicationContext

**Giải thích:**  
Spring cung cấp hai giao diện chính làm nền tảng cho IOC container: **Bean Factory (BeanFactory)** và **Application Context (ApplicationContext)**. Các triển khai khác nhau trong thư viện Spring sẽ cung cấp các behavior khác nhau dựa trên hai giao diện này.

> **Ghi nhớ:** BeanFactory là cơ bản; ApplicationContext kế thừa BeanFactory và bổ sung nhiều tính năng cho ứng dụng doanh nghiệp.

---

## 3. Nguyên lý hoạt động của IOC

**Giải thích:**  
Spring IOC hoạt động dựa trên bốn thông tin chính: thư viện core, nguyên lý thiết kế (IOC/DI), bộ cấu hình (context) và thông tin phụ thuộc giữa các lớp. Khi ứng dụng khởi động, IOC container đọc **Context** (vùng lưu trữ cấu hình: XML, annotation, v.v.), tạo các bean tương ứng và tiêm phụ thuộc bằng cách sử dụng cấu hình và đôi khi dùng **Spring Expression Language (SpEL)** để đánh giá biểu thức.

> **Vấn đề:** Thiếu cấu hình rõ ràng dẫn đến bean không được tạo đúng.  
> **Giải pháp:** Cung cấp cấu hình đầy đủ (tên bean, thuộc tính, dependency) hoặc dùng annotation rõ ràng.

---

## 4. Luồng tạo và quản lý bean (Workflow)

**Giải thích trước:** Dưới đây là các bước tổng quát mà IOC container thực hiện khi khởi tạo ứng dụng.

1. **Bước 1: Đọc cấu hình:** IOC container đọc các nguồn cấu hình (XML, annotation, file cấu hình).
2. **Bước 2: Khởi tạo metadata:** Phân tích và lưu metadata về các bean (class, scope, dependencies).
3. **Bước 3: Tạo bean:** Theo metadata, tạo instance cho các bean theo scope (singleton/prototype).
4. **Bước 4: Tiêm phụ thuộc:** Thực hiện **Dependency Injection (DI)** để nối các bean với nhau.
5. **Bước 5: Gọi lifecycle callbacks:** Gọi các phương thức khởi tạo (init) hoặc các listener nếu có.
6. **Bước 6: Quản lý runtime:** Trong suốt vòng đời ứng dụng, container xử lý events, context, và cuối cùng gọi các phương thức hủy (destroy) khi cần.

---

## 5. Các kiểu cấu hình (XML / Annotation / Classpath)

**Giải thích:**  
Spring hỗ trợ nhiều cách cung cấp thông tin cấu hình cho context:

-   **XML configuration:** Cấu hình truyền thống bằng file XML.
-   **Annotation-based configuration:** Dùng annotation như `@Component`, `@Autowired`, `@Configuration` để đánh dấu và tiêm phụ thuộc.
-   **Classpath scanning:** Spring quét các package để tìm component theo cấu hình.

> **Câu hỏi hay:** Khi nào nên dùng XML thay vì annotation?  
> **Trả lời:** XML hữu ích khi muốn tách cấu hình khỏi mã nguồn; annotation tiện lợi và ít boilerplate cho ứng dụng hiện đại.

---

## 6. Khi nào chọn BeanFactory vs ApplicationContext

**Giải thích:**

-   **BeanFactory:** Phù hợp cho các ứng dụng rất nhẹ, nơi chỉ cần chức năng cơ bản tạo và quản lý bean.
-   **ApplicationContext:** Khuyến nghị cho hầu hết ứng dụng (đặc biệt ứng dụng doanh nghiệp) vì cung cấp thêm features như event publication, internationalization, AOP integration, message source, v.v.

> **Ghi nhớ:**  
> **Lưu ý quan trọng:** Nếu cần xử lý lifecycle events hoặc các tính năng nâng cao, luôn dùng **ApplicationContext (ApplicationContext)**.

---

## 7. Ví dụ ngắn minh họa (Annotation + XML)

Giải thích trước: ví dụ cho thấy cách định nghĩa bean bằng annotation và cách khởi tạo ApplicationContext.

Java (annotation):

```java
// Java
@Component
public class HelloService {
    public String say() { return "Hello"; }
}

@Configuration
@ComponentScan("com.example")
public class AppConfig { }
```

XML (ví dụ cấu hình):

```xml
<!-- xml -->
<beans>
  <context:component-scan base-package="com.example"/>
</beans>
```

Giải thích sau code:

-   AppConfig hoặc file XML cung cấp thông tin cho context để container quét và tạo các bean có annotation `@Component`.
-   ApplicationContext (ví dụ: AnnotationConfigApplicationContext) được dùng để khởi tạo toàn bộ context và sẵn sàng trả về các bean.

---

## 8. Tổng kết

-   Spring IOC Container quản lý vòng đời và phụ thuộc của các bean bằng **Dependency Injection (DI)**.
-   Có hai giao diện nền tảng: **BeanFactory** (cơ bản) và **ApplicationContext** (nâng cao).
-   Chọn **ApplicationContext** cho hầu hết trường hợp sản xuất; chỉ dùng **BeanFactory** khi cần tối giản.
-   Cấu hình có thể ở dạng XML, annotation hoặc classpath scanning; luôn cung cấp cấu hình rõ ràng để container hoạt động chính xác.

> **Ghi nhớ:** Hiểu rõ cách container đọc context và tiêm phụ thuộc sẽ giúp bạn thiết kế ứng dụng Spring sạch và dễ bảo trì.
