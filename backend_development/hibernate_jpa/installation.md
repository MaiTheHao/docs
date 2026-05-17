# Installation: Thiết lập Hibernate JPA cơ bản cho Java Servlet

Hướng dẫn này tập trung vào các bước **cài đặt và cấu hình Hibernate JPA** cho dự án Java Servlet thuần, giúp bạn khởi tạo môi trường kết nối cơ sở dữ liệu nhanh chóng.

---

## 1. Cấu hình Maven

Thêm các dependency cần thiết vào file `pom.xml`:

| Thư viện                | Mục đích                       | Maven Artifact            |
| :---------------------- | :----------------------------- | :------------------------ |
| **Jakarta Persistence** | API JPA                        | `jakarta.persistence-api` |
| **Hibernate Core**      | Triển khai JPA                 | `hibernate-core`          |
| **JDBC Driver**         | Kết nối CSDL (mặc định: MySQL) | `mysql-connector-j`       |

```xml
<dependency>
    <groupId>jakarta.persistence</groupId>
    <artifactId>jakarta.persistence-api</artifactId>
    <version>3.1.0</version>
</dependency>
<dependency>
    <groupId>org.hibernate</groupId>
    <artifactId>hibernate-core</artifactId>
    <version>6.3.1.Final</version>
</dependency>
<dependency>
    <groupId>com.mysql</groupId>
    <artifactId>mysql-connector-j</artifactId>
    <version>8.3.0</version>
</dependency>
```

> 📌 **Ghi nhớ:** Nếu dùng CSDL khác (PostgreSQL, SQL Server...), hãy thay JDBC driver tương ứng.

Sau khi thêm, chạy lệnh:

```shell
mvn clean install
```

---

## 2. Cấu hình Hibernate JPA (`persistence.xml`)

Tạo file `src/main/resources/META-INF/persistence.xml` với nội dung tối giản sau:

```xml
<persistence xmlns="https://jakarta.ee/xml/ns/persistence"
             xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
             xsi:schemaLocation="https://jakarta.ee/xml/ns/persistence https://jakarta.ee/xml/ns/persistence/persistence_3_0.xsd"
             version="3.0">
    <persistence-unit name="main" transaction-type="RESOURCE_LOCAL">
        <provider>org.hibernate.jpa.HibernatePersistenceProvider</provider>
        <properties>
            <property name="jakarta.persistence.jdbc.driver" value="com.mysql.cj.jdbc.Driver"/>
            <property name="jakarta.persistence.jdbc.url" value="jdbc:mysql://localhost:3306/your_database?useSSL=false&amp;serverTimezone=UTC"/>
            <property name="jakarta.persistence.jdbc.user" value="user_name"/>
            <property name="jakarta.persistence.jdbc.password" value="your_password"/>

            <property name="hibernate.hbm2ddl.auto" value="update"/>
            <property name="hibernate.show_sql" value="true"/>
            <property name="hibernate.format_sql" value="true"/>
        </properties>
    </persistence-unit>
</persistence>
```

| Thuộc tính               | Ý nghĩa                                                                                                |
| :----------------------- | :----------------------------------------------------------------------------------------------------- |
| `jdbc.driver`            | Driver JDBC (mặc định: MySQL)                                                                          |
| `jdbc.url`               | Đường dẫn kết nối CSDL                                                                                 |
| `jdbc.user` / `password` | Tài khoản truy cập CSDL                                                                                |
| `hibernate.hbm2ddl.auto` | Kiểm soát cách Hibernate xử lý schema CSDL:<br>- `none`, `validate`, `update`, `create`, `create-drop` |
| `hibernate.show_sql`     | Hiển thị câu lệnh SQL trên console                                                                     |

> **Mẹo:** Không lưu thông tin nhạy cảm (mật khẩu) trực tiếp trong file này ở môi trường production.  
> **Khuyến nghị:** Sử dụng biến môi trường.
