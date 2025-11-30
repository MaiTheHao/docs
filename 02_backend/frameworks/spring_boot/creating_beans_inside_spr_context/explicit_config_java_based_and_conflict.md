# Cấu hình Java-Based Tường minh và Quản lý Xung đột trong Spring

## Mục lục

-   [1. Định nghĩa Bean Tường minh: @Configuration và @Bean](#1-định-nghĩa-bean-tường-minh-configuration-và-bean)
-   [2. Triển khai Phụ thuộc Liên-Bean (Inter-Bean Dependencies)](#2-triển-khai-phụ-thuộc-liên-bean-inter-bean-dependencies)
-   [3. Giải quyết Xung đột: Phân tích NoUniqueBeanDefinitionException](#3-giải-quyết-xung-đột-phân-tích-nouniquebeandefinitionexception)
-   [4. Tổng kết](#4-tổng-kết)

---

## 1. Định nghĩa Bean Tường minh: @Configuration và @Bean

Hai annotation này là trụ cột của cấu hình dựa trên Java.

-   **@Configuration**: Đây là một annotation cấp lớp. Nó đánh dấu một lớp là nguồn của các định nghĩa bean (**bean definitions**). Các lớp được chú thích bằng @Configuration được **Spring container** xử lý để tạo ra các bean và quản lý các phụ thuộc của chúng.
-   **@Bean**: Đây là một annotation cấp phương thức. Khi được sử dụng bên trong một lớp @Configuration, nó thông báo cho Spring rằng phương thức này sẽ sản xuất (produce) một đối tượng và đối tượng đó phải được Spring container quản lý. Đối tượng được trả về bởi phương thức sẽ được đăng ký làm một bean trong **ApplicationContext**.

> **Ghi nhớ:** Theo mặc định, tên của bean được đăng ký sẽ giống hệt với tên của phương thức đã sản xuất ra nó.

```java
@Configuration
public class AppConfig {

    @Bean
    public MyService myService() {
        return new MyServiceImpl();
    }
}
```

---

## 2. Triển khai Phụ thuộc Liên-Bean (Inter-Bean Dependencies)

Một ứng dụng thực tế hiếm khi chỉ có các bean độc lập. Thông thường, các bean phụ thuộc lẫn nhau (ví dụ: **OrderService** cần một **OrderRepository**). Cấu hình Java-based cung cấp hai cách chính để "dây" (**wire**) các phụ thuộc này.

### 2.1. Gọi Phương thức (Method-Call)

Một phương thức @Bean có thể gọi trực tiếp một phương thức @Bean khác trong cùng một lớp @Configuration để lấy một phụ thuộc.

```java
@Configuration
public class AppConfig {

    @Bean
    public IFirstService firstService() {
        return new FirstServiceImpl();
    }

    @Bean
    public ISecondService secondService() {
        // Gọi trực tiếp phương thức @Bean khác
        return new SecondServiceImpl(firstService());
    }
}
```

> **Lưu ý quan trọng:** Khi một lớp được chú thích bằng @Configuration, Spring tạo ra một proxy CGLIB (một lớp con động) của lớp đó. Proxy này chặn (intercepts) các cuộc gọi đến các phương thức @Bean để đảm bảo phạm vi singleton.

### 2.2. Tham số Phương thức (Method Parameter) - Cách ưu tiên

Một phương pháp gọn gàng hơn và được ưu tiên hơn là khai báo phụ thuộc dưới dạng một tham số trong phương thức @Bean.

```java
@Configuration
public class AppConfig {

    @Bean
    public IFirstService firstService() {
        return new FirstServiceImpl();
    }

    // Spring sẽ tự động tìm bean 'firstService' và tiêm nó vào đây
    @Bean
    public ISecondService secondService(IFirstService firstService) {
        return new SecondServiceImpl(firstService);
    }
}
```

> **Ghi nhớ:** Cách tiếp cận này hoạt động tương tự như **constructor-based dependency injection** và rõ ràng hơn về mặt khai báo.

---

## 3. Giải quyết Xung đột: Phân tích NoUniqueBeanDefinitionException

Khi một ứng dụng Spring khởi động, **ApplicationContext** sẽ cố gắng giải quyết tất cả các phụ thuộc. Một vấn đề phổ biến xảy ra khi Spring cố gắng **autowire** (tự động kết nối) một bean theo loại (**by type**) nhưng lại tìm thấy nhiều hơn một bean ứng cử phù hợp. Khi điều này xảy ra, Spring không thể tự quyết định nên chọn bean nào và sẽ thất bại khi khởi động với một **NoUniqueBeanDefinitionException**.

Ví dụ:

```java
public interface Animal {... }

@Configuration
public class AnimalConfig {
    @Bean
    public Animal dog() { return new Dog(); } // Bean 1 loại Animal
    @Bean
    public Animal cat() { return new Cat(); } // Bean 2 loại Animal
}

@Service
public class PetStore {
    @Autowired
    private Animal animal; // Lỗi! Spring tìm thấy 'dog' và 'cat'
}
```

Có ba giải pháp chính cho vấn đề này:

### 3.1. Tên Bean Tùy chỉnh (với @Qualifier)

Đặt tên cho các bean và sau đó yêu cầu một tên cụ thể tại điểm tiêm.

```java
@Configuration
public class AnimalConfig {
    @Bean(name = "dogBean")
    public Animal dog() { return new Dog(); }

    @Bean(name = "catBean")
    public Animal cat() { return new Cat(); }
}

@Service
public class PetStore {
    @Autowired
    @Qualifier("catBean") // Chỉ định rõ ràng bean 'catBean'
    private Animal animal;
}
```

### 3.2. Annotation @Primary

Nếu có một bean nên được coi là lựa chọn mặc định khi có sự mơ hồ, nó có thể được đánh dấu bằng **@Primary**.

```java
@Configuration
public class AnimalConfig {
    @Bean
    public Animal dog() { return new Dog(); }

    @Bean
    @Primary // 'cat' bây giờ là lựa chọn mặc định
    public Animal cat() { return new Cat(); }
}

@Service
public class PetStore {
    @Autowired
    private Animal animal; // Sẽ tự động tiêm 'cat' vì nó là @Primary
}
```

### 3.3. Khớp tên (Fallback)

Nếu không có @Primary hoặc @Qualifier, Spring sẽ cố gắng giải quyết sự mơ hồ bằng cách khớp tên của biến (field name) tại điểm tiêm với tên của bean.

```java
@Service
public class PetStore {
    @Autowired
    private Animal cat; // Tên biến 'cat' khớp với tên bean 'cat'
}
```

> **Ghi nhớ:** Thứ tự ưu tiên phân giải phụ thuộc:  
> **@Qualifier** (cụ thể nhất) > Theo Tên Biến > **@Primary** (mặc định được chỉ định)

---

## 4. Tổng kết

-   **@Configuration** và **@Bean** là trụ cột của cấu hình Java-based trong Spring.
-   Có hai cách chính để khai báo phụ thuộc liên-bean: gọi phương thức hoặc dùng tham số phương thức.
-   Khi có nhiều bean cùng loại, sử dụng **@Qualifier**, **@Primary**, hoặc khớp tên biến để giải quyết xung đột.
