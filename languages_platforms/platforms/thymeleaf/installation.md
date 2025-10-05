# Hướng dẫn cài đặt Thymeleaf 3.1 trên Java Servlet với Maven

---

## Mục lục

-   [1. Khai báo phụ thuộc Maven (pom.xml)](#1-khai-báo-phụ-thuộc-maven-pomxml)
-   [2. Cấu hình Thymeleaf với ServletContextListener](#2-cấu-hình-thymeleaf-với-servletcontextlistener)
-   [3. Tạo Servlet để render template](#3-tạo-servlet-để-render-template)
-   [4. Tạo file template Thymeleaf](#4-tạo-file-template-thymeleaf)
-   [5. Cấu trúc dự án mẫu](#5-cấu-trúc-dự-án-mẫu)
-   [6. Chạy ứng dụng](#6-chạy-ứng-dụng)
-   [7. Giải thích chi tiết đoạn mã khởi tạo và render Thymeleaf](#7-giải-thích-chi-tiết-đoạn-mã-khởi-tạo-và-render-thymeleaf)

---

## 1. Khai báo phụ thuộc Maven (pom.xml)

Thêm các dependency sau vào file `pom.xml`. Tomcat 11 sử dụng **Jakarta Servlet 6.0** (`jakarta.servlet` namespace).

```xml
<project>
    <modelVersion>4.0.0</modelVersion>
    <groupId>com.example</groupId>
    <artifactId>thymeleaf-servlet-demo</artifactId>
    <version>1.0.0</version>
    <packaging>war</packaging>

    <properties>
        <maven.compiler.source>17</maven.compiler.source>
        <maven.compiler.target>17</maven.compiler.target>
        <project.build.sourceEncoding>UTF-8</project.build.sourceEncoding>
        <thymeleaf.version>3.1.3.RELEASE</thymeleaf.version>
    </properties>

    <dependencies>
        <!-- Core Thymeleaf -->
        <dependency>
            <groupId>org.thymeleaf</groupId>
            <artifactId>thymeleaf</artifactId>
            <version>${thymeleaf.version}</version>
        </dependency>
        <!-- Jakarta Servlet API 6.0 (for Tomcat 11) -->
        <dependency>
            <groupId>jakarta.servlet</groupId>
            <artifactId>jakarta.servlet-api</artifactId>
            <version>6.0.0</version>
            <scope>provided</scope>
        </dependency>
    </dependencies>

    <build>
        <finalName>thymeleaf-demo</finalName>
    </build>
</project>
```

---

## 2. Cấu hình Thymeleaf với ServletContextListener

Tạo class cấu hình để khởi tạo `TemplateEngine` khi ứng dụng start, lưu vào ServletContext.

```java
@WebListener
public class ThymeleafConfig implements ServletContextListener {

        public static final String TEMPLATE_ENGINE_ATTR = "com.example.TemplateEngine";

        @Override
        public void contextInitialized(ServletContextEvent sce) {
                IWebApplication application = JakartaServletWebApplication.buildApplication(sce.getServletContext());

                WebApplicationTemplateResolver templateResolver = new WebApplicationTemplateResolver(application);
                templateResolver.setTemplateMode(TemplateMode.HTML);
                templateResolver.setPrefix("/WEB-INF/templates/");
                templateResolver.setSuffix(".html");
                templateResolver.setCharacterEncoding("UTF-8");
                templateResolver.setCacheable(true);

                TemplateEngine templateEngine = new TemplateEngine();
                templateEngine.setTemplateResolver(templateResolver);

                sce.getServletContext().setAttribute(TEMPLATE_ENGINE_ATTR, templateEngine);
        }
}
```

---

## 3. Tạo Servlet để render template

Tạo servlet sử dụng `TemplateEngine` để xử lý và render template Thymeleaf.

```java
@WebServlet("/hello")
public class HelloServlet extends HttpServlet {

        @Override
        protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
                TemplateEngine templateEngine = (TemplateEngine) getServletContext().getAttribute(ThymeleafConfig.TEMPLATE_ENGINE_ATTR);

                IWebExchange webExchange = JakartaServletWebApplication.buildApplication(getServletContext()).buildExchange(request, response);
                WebContext context = new WebContext(webExchange);

                context.setVariable("name", "Ojou-sama");

                templateEngine.process("hello", context, response.getWriter());
        }
}
```

---

## 4. Tạo file template Thymeleaf

Tạo file template tại `src/main/webapp/WEB-INF/templates/hello.html`:

```html
<!DOCTYPE html>
<html xmlns:th="http://www.thymeleaf.org">
	<head>
		<meta charset="UTF-8" />
		<title>Hello World</title>
	</head>
	<body>
		<h1>Hello, <span th:text="${name}">User</span>!</h1>
		<p>Đây là template Thymeleaf đầu tiên trên môi trường Servlet thuần.</p>
	</body>
</html>
```

---

## 5. Cấu trúc dự án mẫu

```
thymeleaf-servlet-demo/
├── src/
│   └── main/
│       ├── java/
│       │   └── com/
│       │       └── example/
│       │           ├── config/
│       │           │   └── ThymeleafConfig.java
│       │           └── web/
│       │               └── HelloServlet.java
│       ├── resources/
│       └── webapp/
│           └── WEB-INF/
│               └── templates/
│                   └── hello.html
└── pom.xml
```

---

## 6. Chạy ứng dụng

1. **Triển khai lên Tomcat 11**: Build dự án (`mvn clean package`) và deploy file WAR lên Tomcat 11.
2. **Truy cập Servlet**: Mở trình duyệt và truy cập `http://localhost:8080/thymeleaf-demo/hello`.

## 7. Giải thích chi tiết đoạn mã khởi tạo và render Thymeleaf

---

### 🛠️ Giải thích đoạn mã khởi tạo TemplateResolver

Đoạn mã sau cấu hình bộ giải quyết template (`TemplateResolver`), thành phần chịu trách nhiệm tìm kiếm và đọc các file template:

```java
WebApplicationTemplateResolver templateResolver = new WebApplicationTemplateResolver(application);
templateResolver.setTemplateMode(TemplateMode.HTML); // 1
templateResolver.setPrefix("/WEB-INF/templates/");   // 2
templateResolver.setSuffix(".html");                 // 3
templateResolver.setCharacterEncoding("UTF-8");      // 4
templateResolver.setCacheable(true);                 // 5
```

| Phương thức                          | Ý nghĩa                                                                                                    |
| :----------------------------------- | :--------------------------------------------------------------------------------------------------------- |
| `setTemplateMode(TemplateMode.HTML)` | Thiết lập chế độ xử lý template là HTML. Thymeleaf cũng hỗ trợ XML, TEXT, JAVASCRIPT, CSS.                 |
| `setPrefix("/WEB-INF/templates/")`   | Đặt thư mục gốc chứa các file template. Thymeleaf sẽ tìm kiếm trong `WEB-INF/templates/`.                  |
| `setSuffix(".html")`                 | Đặt phần mở rộng mặc định cho file template. Ví dụ: `hello` sẽ thành `hello.html`.                         |
| `setCharacterEncoding("UTF-8")`      | Đặt mã hóa ký tự là UTF-8, đảm bảo hiển thị chính xác tiếng Việt và các ngôn ngữ khác.                     |
| `setCacheable(true)`                 | Kích hoạt bộ nhớ đệm template để tăng hiệu suất. Production nên đặt `true`, phát triển có thể đặt `false`. |

---

### 🎯 Giải thích đoạn mã xử lý và render trong Servlet

Đoạn mã dưới thực thi trong Servlet để xử lý yêu cầu, chuẩn bị dữ liệu và render template HTML về cho trình duyệt:

```java
// 1. Lấy TemplateEngine từ ServletContext
TemplateEngine templateEngine = (TemplateEngine) getServletContext().getAttribute(ThymeleafConfig.TEMPLATE_ENGINE_ATTR);

// 2. Tạo đối tượng IWebExchange
IWebExchange webExchange = JakartaServletWebApplication.buildApplication(getServletContext()).buildExchange(request, response);

// 3. Tạo WebContext và truyền dữ liệu
WebContext context = new WebContext(webExchange);
context.setVariable("name", "Ojou-sama");

// 4. Render template
templateEngine.process("hello", context, response.getWriter());
```

| Bước thực hiện                     | Giải thích                                                                                                |
| :--------------------------------- | :-------------------------------------------------------------------------------------------------------- |
| Lấy `TemplateEngine`               | Đối tượng trung tâm của Thymeleaf, thực hiện xử lý template. Được khởi tạo và lưu trong `ServletContext`. |
| Tạo `IWebExchange`                 | Lớp trừu tượng hóa cho request/response HTTP, giúp Thymeleaf tương tác an toàn với các thành phần web.    |
| Tạo `WebContext` và truyền dữ liệu | Chứa dữ liệu cho template, kết hợp `IWebExchange` và các biến do lập trình viên định nghĩa.               |
| `setVariable("name", ...)`         | Đặt biến "name" vào ngữ cảnh, sử dụng trong template với cú pháp `${name}`.                               |
| Render template                    | Kết hợp template với dữ liệu và xuất kết quả HTML về trình duyệt thông qua `response.getWriter()`.        |

> 📌 **Ghi nhớ:** Cấu hình đúng TemplateResolver và truyền dữ liệu qua WebContext là bước quan trọng để Thymeleaf hoạt động chính xác trên Servlet.
