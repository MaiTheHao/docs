# Tự động Phát hiện và Quản lý Vòng đời Bean trong Spring

## Mục lục

-   [1. Tự động Phát hiện Bean: @Component và @ComponentScan](#1-tự-động-phát-hiện-bean-component-và-componentscan)
-   [2. Chuyên môn hóa: Các Annotation Stereotype](#2-chuyên-môn-hóa-các-annotation-stereotype)
-   [3. Phân tích So sánh: @Bean vs. @Component](#3-phân-tích-so-sánh-bean-vs-component)
-   [4. Callbacks Vòng đời Bean: @PostConstruct & @PreDestroy](#4-callbacks-vòng-đời-bean-postconstruct--predestroy)
-   [5. Tổng kết](#5-tổng-kết)

---

## 1. Tự động Phát hiện Bean: @Component và @ComponentScan

Thay vì khai báo mọi bean trong một lớp **@Configuration**, Spring có thể tự động phát hiện các lớp và đăng ký chúng làm bean.

-   **@Component**: Đây là annotation chung (generic stereotype) nhất, được áp dụng ở cấp độ lớp. Nó đánh dấu một lớp là "**ứng cử viên**" (candidate) để Spring tự động phát hiện và đăng ký làm bean trong **ApplicationContext**. Theo mặc định, tên bean sẽ là tên lớp với chữ cái đầu viết thường (ví dụ: lớp MyServiceImpl trở thành bean myServiceImpl).
-   **@ComponentScan**: Annotation này chỉ thị cho Spring nơi cần tìm kiếm các lớp @Component. Nó thường được đặt trên một lớp @Configuration. Nếu không có đối số nào được cung cấp (ví dụ: @ComponentScan), nó sẽ mặc định quét gói (package) của chính lớp @Configuration đó và tất cả các gói con của nó.

```java
// package com.example.app
@Configuration
@ComponentScan // Sẽ quét "com.example.app" và các gói con
public class AppConfig {... }

// package com.example.app.services
@Component
public class MyService {... } // Sẽ được tự động phát hiện
```

> **Ghi nhớ:** Trong các ứng dụng Spring Boot hiện đại, annotation **@SpringBootApplication** đã bao gồm @ComponentScan (cùng với @Configuration và @EnableAutoConfiguration), vì vậy việc quét thành phần (component scanning) được bật tự động, quét từ gói của lớp ứng dụng chính.

---

## 2. Chuyên môn hóa: Các Annotation Stereotype

Để cung cấp ý nghĩa ngữ nghĩa (semantic meaning) tốt hơn cho các lớp được tự động phát hiện và để phân biệt các tầng (layer) của một ứng dụng, Spring cung cấp các annotation stereotype chuyên biệt hóa từ **@Component**.

-   **@Service**: Đánh dấu một lớp trong tầng dịch vụ (**service layer**). Các lớp này thường chứa **logic nghiệp vụ** (business logic) cốt lõi của ứng dụng.
-   **@Repository**: Đánh dấu một lớp trong tầng truy cập dữ liệu (**data access layer**), còn được gọi là **Data Access Object (DAO)**. Annotation này không chỉ mang tính ngữ nghĩa; nó còn có một hành vi đặc biệt. Nó kích hoạt một **BeanPostProcessor** tự động dịch (translate) các ngoại lệ cụ thể của nền tảng persistence (ví dụ: HibernateException từ Hibernate) thành hệ thống phân cấp **DataAccessException** nhất quán, độc lập với nền tảng của Spring.
-   **@Controller**: Đánh dấu một lớp là một controller trong tầng web (**presentation layer**) của Spring MVC, chịu trách nhiệm xử lý các yêu cầu HTTP đến và trả về các tên view.
-   **@RestController**: Được giới thiệu trong Spring 4.0, đây là một annotation tiện lợi kết hợp @Controller và @ResponseBody.

> **Câu hỏi hay:** Sự khác biệt giữa @Controller và @RestController là gì?  
> **Trả lời:** Một phương thức trong @Controller truyền thống trả về một String, được hiểu là tên của một view (ví dụ: "home"), mà ViewResolver của Spring sẽ ánh xạ đến một tệp mẫu (ví dụ: home.html). Một phương thức trong @RestController (hoặc một phương thức @Controller được chú thích bằng @ResponseBody) sẽ bỏ qua việc phân giải view. Thay vào đó, nó tự động tuần tự hóa (serialize) đối tượng trả về (ví dụ: một User POJO) trực tiếp thành phần thân (body) của HTTP response, thường là ở định dạng JSON hoặc XML.

---

## 3. Phân tích So sánh: @Bean vs. @Component

Một trong những điểm gây nhầm lẫn phổ biến nhất là khi nào nên sử dụng **@Bean** và khi nào nên sử dụng **@Component**. Cả hai đều tạo ra bean, nhưng chúng phục vụ các mục đích khác nhau và đại diện cho các triết lý cấu hình khác nhau.

**Bảng 3.3: Phân tích So sánh @Bean và @Component**

| Đặc điểm                       | @Component (và các Stereotype)                                                 | @Bean                                                                                          |
| ------------------------------ | ------------------------------------------------------------------------------ | ---------------------------------------------------------------------------------------------- |
| **Cấp độ**                     | Cấp độ Lớp (Class-level)                                                       | Cấp độ Phương thức (Method-level)                                                              |
| **Cơ chế**                     | Tự động phát hiện (Auto-detection) thông qua Classpath Scanning                | Khai báo tường minh (Explicit Declaration) trong một lớp @Configuration                        |
| **Kiểm soát Mã nguồn**         | Yêu cầu khả năng chỉnh sửa mã nguồn của lớp (để thêm annotation)               | Không yêu cầu. Lý tưởng cho các lớp của bên thứ ba (third-party)                               |
| **Logic Khởi tạo**             | Thường đơn giản (dựa vào constructor mặc định hoặc constructor được autowired) | Có thể chứa logic khởi tạo phức tạp, có điều kiện hoặc tùy chỉnh bên trong phương thức         |
| **Khớp nối (Coupling)**        | Khớp nối lớp với Spring (phải import org.springframework.stereotype.Component) | Tách rời (Decoupled). Lớp được định nghĩa có thể là một POJO thuần túy (Plain Old Java Object) |
| **Trường hợp Sử dụng Cốt lõi** | Các lớp dịch vụ, repository, controller của ứng dụng mà bạn viết.              | Tạo bean cho các thư viện bên ngoài (ví dụ: DataSource, ObjectMapper, RestTemplate).           |

> **Ghi nhớ:** Sử dụng **@Component** (hoặc @Service, @Repository) cho các lớp trong ứng dụng của bạn mà bạn muốn Spring tự động quản lý. Đây là cách tiếp cận "**convention over configuration**" (ưu tiên quy ước hơn cấu hình).  
> Sử dụng **@Bean** khi bạn cần định nghĩa một bean cho một lớp mà bạn không sở hữu mã nguồn (ví dụ: từ một thư viện bên ngoài), hoặc khi bạn cần logic phức tạp để xây dựng đối tượng đó. Đây là cách tiếp cận "**explicit configuration**" (cấu hình tường minh).

---

## 4. Callbacks Vòng đời Bean: @PostConstruct & @PreDestroy

Spring quản lý toàn bộ vòng đời của một bean, nhưng nó cung cấp các "**hooks**" (điểm neo) cho phép các nhà phát triển thực thi logic tùy chỉnh tại các thời điểm quan trọng. Các annotation **JSR-250** (javax.annotation hoặc jakarta.annotation trong các phiên bản mới hơn) là cách được khuyến nghị để thực hiện việc này.

-   **@PostConstruct**: Spring thực thi phương thức được chú thích bằng @PostConstruct sau khi bean đã được khởi tạo và tất cả các phụ thuộc đã được tiêm (ví dụ: các trường @Autowired đã được thiết lập), nhưng trước khi bean được đưa vào sử dụng (tức là, được tiêm vào các bean khác).

> **Vấn đề:** Làm thế nào để thực hiện các tác vụ khởi tạo một lần cho bean?  
> **Giải pháp:** Sử dụng @PostConstruct để thực hiện các tác vụ như khởi tạo bộ đệm, điền dữ liệu mặc định, hoặc mở tài nguyên.

```java
@Component
public class DatabaseInitializer {
    @Autowired private UserRepository userRepository;

    @PostConstruct
    public void initializeData() {
        // userRepository đã được tiêm và sẵn sàng để sử dụng
        userRepository.save(new User("default-admin"));
        System.out.println("Database initialized with default user.");
    }
}
```

-   **@PreDestroy**: Phương thức được chú thích bằng @PreDestroy được gọi ngay trước khi ApplicationContext phá hủy bean và xóa nó khỏi container (ví dụ: khi ứng dụng tắt).

> **Vấn đề:** Làm thế nào để đảm bảo giải phóng tài nguyên khi bean bị hủy?  
> **Giải pháp:** Sử dụng @PreDestroy để đóng các kết nối mạng, dừng các luồng nền, hoặc dọn dẹp các tệp tạm thời.

```java
@Component
public class ResourceManager {
    private Connection connection;

    @PostConstruct
    public void start() {
        this.connection = Connection.open();
    }

    @PreDestroy
    public void shutdown() {
        // Được gọi khi Spring tắt, đảm bảo dọn dẹp
        if (this.connection != null) {
            this.connection.close();
        }
    }
}
```

> **Ghi nhớ:** Các annotation JSR-250 (@PostConstruct và @PreDestroy) được coi là thực tiễn tốt nhất vì chúng là một phần của tiêu chuẩn Java (JSR-250) và không làm khớp nối mã của bạn với các giao diện cụ thể của Spring.

Thứ tự thực thi khi sử dụng nhiều cơ chế:

1. **@PostConstruct** được gọi trước
2. Sau đó là **afterPropertiesSet()** (từ InitializingBean)
3. Cuối cùng là **init-method** tùy chỉnh

Thứ tự phá hủy:

1. **@PreDestroy** được gọi trước
2. Sau đó là **destroy()** (từ DisposableBean)
3. Cuối cùng là **destroy-method** tùy chỉnh

---

## 5. Tổng kết

-   **@Component** và các stereotype giúp Spring tự động phát hiện và quản lý bean.
-   **@Bean** dùng cho cấu hình tường minh, đặc biệt với các lớp bên ngoài.
-   Annotation **JSR-250** (@PostConstruct, @PreDestroy) là cách tốt nhất để quản lý vòng đời bean.
