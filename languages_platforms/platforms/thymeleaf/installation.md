# Hướng dẫn cài đặt Thymeleaf 3.1 trên Java Servlet với Maven

---

## Mục lục

-   [1. Khai báo phụ thuộc Maven (pom.xml)](#1-khai-báo-phụ-thuộc-maven-pomxml)
-   [2. Cấu hình Thymeleaf với ServletContextListener](#2-cấu-hình-thymeleaf-với-servletcontextlistener)
-   [3. Tạo Servlet để render template](#3-tạo-servlet-để-render-template)
-   [4. Tạo file template Thymeleaf](#4-tạo-file-template-thymeleaf)
-   [5. Cấu trúc dự án mẫu](#5-cấu-trúc-dự-án-mẫu)
-   [6. Chạy ứng dụng](#6-chạy-ứng-dụng)
-   [7. 📌 Ghi nhớ quan trọng](#7-ghi-nhớ-quan-trọng)

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

---

## 7. 📌 Ghi nhớ quan trọng

-   **Thymeleaf 3.1.3.RELEASE** hỗ trợ tốt cho namespace **Jakarta EE 9+** (`jakarta.*`) trên Tomcat 11.
-   Sử dụng `WebApplicationTemplateResolver` và `JakartaServletWebApplication` là cách cấu hình hiện đại cho Jakarta EE.
-   `TemplateEngine` chỉ khởi tạo một lần khi ứng dụng start để tối ưu hiệu năng.
