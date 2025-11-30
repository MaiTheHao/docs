# Các Mô hình Cấu hình Thay thế và Nâng cao trong Spring

## Mục lục

-   [1. Tạo Bean theo Lập trình (Programmatic Bean Creation)](#1-tạo-bean-theo-lập-trình-programmatic-bean-creation)
-   [2. Cấu hình Kế thừa: XML (XML Configurations)](#2-cấu-hình-kế-thừa-xml-xml-configurations)
-   [3. Tổng kết](#3-tổng-kết)

---

## 1. Tạo Bean theo Lập trình (Programmatic Bean Creation)

Trong một số kịch bản nâng cao, việc đăng ký bean cần phải xảy ra động (**dynamically**) tại thời điểm runtime, dựa trên các điều kiện không xác định tại thời điểm biên dịch. Kể từ **Spring 5**, ApplicationContext cung cấp một API chức năng để đăng ký bean theo lập trình.

**Cơ chế:**  
Phương thức **registerBean()** trên các triển khai ApplicationContext (như **AnnotationConfigApplicationContext** hoặc **GenericApplicationContext**) cho phép đăng ký một bean mới.

Ví dụ:

```java
// Giả sử 'context' là một đối tượng AnnotationConfigApplicationContext
// 1. Đăng ký cơ bản với một Supplier
context.registerBean("myDynamicService",
    MyService.class,
    () -> new MyService()); // Sử dụng lambda làm Supplier

// 2. Đăng ký nâng cao với tùy chỉnh (customization)
Supplier<MyService> serviceSupplier = MyService::new;

context.registerBean("myPrimaryService", MyService.class, serviceSupplier,
    bd -> {
        // Tùy chỉnh BeanDefinition
        bd.setPrimary(true); // Đặt bean này làm @Primary
        bd.setLazyInit(true);
    }
);
```

> **Ghi nhớ:** Việc đăng ký theo lập trình rất mạnh mẽ cho các kịch bản động, như đăng ký bean dựa trên môi trường, tạo nhiều bean từ một vòng lặp, hoặc tích hợp với thư viện bên thứ ba.

---

## 2. Cấu hình Kế thừa: XML (XML Configurations)

Trước khi cấu hình Java-based trở nên phổ biến, cấu hình dựa trên **XML** là cách duy nhất để định nghĩa các bean và phụ thuộc trong Spring. Mặc dù không còn là lựa chọn hàng đầu cho các dự án mới, cấu hình XML vẫn được hỗ trợ đầy đủ và rất quan trọng để bảo trì hoặc tích hợp với các hệ thống kế thừa (**legacy systems**).

**Tích hợp Hiện đại:**  
Một ứng dụng Spring hiện đại dựa trên @Configuration có thể tải các định nghĩa bean từ tệp XML bằng annotation **@ImportResource**.

```java
@Configuration
@ComponentScan
@ImportResource("classpath:legacy-beans.xml") // Tải bean từ tệp XML
public class AppConfig {
    // Các @Bean định nghĩa bằng Java có thể được kết hợp ở đây
}
```

**Cú pháp XML:**  
Trong tệp XML (thường là beans.xml hoặc applicationContext.xml), các bean được định nghĩa bằng thẻ `<bean>`.

```xml
<bean id="myService" class="com.example.MyServiceImpl" />
```

**Triển khai DI trong XML:**  
XML hỗ trợ đầy đủ cả hai loại Dependency Injection chính.

-   **Setter Injection:** Sử dụng thẻ `<property>`. Spring sẽ gọi phương thức set tương ứng trên bean.

```xml
<bean id="userService" class="com.example.UserService">
    <property name="userRepository" ref="userRepository" />
    <property name="appName" value="My App" />
</bean>

<bean id="userRepository" class="com.example.UserRepositoryImpl" />
```

-   **Constructor Injection:** Sử dụng thẻ `<constructor-arg>`. Spring sẽ tìm một constructor phù hợp và truyền các đối số.

```xml
<bean id="userService" class="com.example.UserService">
    <constructor-arg ref="userRepository" />
    <constructor-arg value="My App" />
</bean>
```

> **Ghi nhớ:** XML cung cấp một bức tranh tổng thể, tập trung về tất cả các bean của hệ thống ở một nơi, thay vì bị phân tán trong nhiều lớp @Configuration. Quan trọng nhất, cấu hình XML có thể được sửa đổi để thay đổi cách "dây" (**wiring**) của ứng dụng mà không cần biên dịch lại mã nguồn Java.

---

## 3. Tổng kết

-   Spring hỗ trợ đăng ký bean động bằng API lập trình hiện đại.
-   Cấu hình XML vẫn quan trọng cho hệ thống kế thừa và tích hợp.
-   Cấu hình Java-based là lựa chọn tốt nhất cho các ứng dụng mới.
