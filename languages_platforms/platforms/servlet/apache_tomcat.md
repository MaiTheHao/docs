# Định nghĩa và Vai trò của Apache Tomcat trong Mô hình Servlet

## 1. Định nghĩa

Apache Tomcat là một **Servlet Container** (hay Web Container) mã nguồn mở, được phát triển bởi Apache Software Foundation. Cụ thể:

-   **Bản chất**: Tomcat là một triển khai (implementation) của các đặc tả Jakarta Servlet, Jakarta Expression Language và JavaServer Pages (JSP)
-   **Môi trường thực thi**: Chạy trên JVM và cung cấp HTTP connectors để nhận request; cung cấp các runtime services cần thiết để thực thi Java web applications (Servlet/JSP)
-   **Định vị**: Là một Servlet container / Web application container, **không phải** là một full Java EE application server.

## 2. Vai trò trong Mô hình Servlet

### 2.1. Servlet Container (Web Container)

Tomcat đóng vai trò là **Servlet Container** với các chức năng chính:

-   **Quản lý vòng đời Servlet**: Khởi tạo (init), gọi các phương thức xử lý request (service), và hủy Servlet (destroy)
-   **URL Mapping**: Điều hướng HTTP request đến đúng Servlet được cấu hình
-   **Quản lý luồng**: Sử dụng thread pool để xử lý request đồng thời
-   **Cách ly ứng dụng**: Mỗi webapp có classloader riêng để tránh xung đột
-   **Cung cấp môi trường runtime**: Cho các thành phần web Java như Servlet, JSP, Filter, ...

### 2.2. Các thành phần chính

Theo kiến trúc Tomcat:

-   **Catalina**: Core servlet container, quản lý lifecycle và context isolation
-   **Coyote**: HTTP connector hỗ trợ HTTP/1.1 và HTTP/2 (tuỳ cấu hình connector)
-   **Jasper**: JSP Engine, compile JSP thành Java servlet code tại runtime

### 2.3. Threading Model

Tomcat sử dụng **thread pool** để xử lý nhiều HTTP request đồng thời. Các connector (BIO, NIO, NIO2, APR) quyết định cách quản lý kết nối và hiệu năng. Các tham số cấu hình như `maxThreads`, `acceptCount`, và `maxConnections` ảnh hưởng đến khả năng phục vụ đồng thời và độ trễ.

**Lưu ý:** Servlet instance được chia sẻ giữa các thread, nên cần đảm bảo thread safety khi lập trình. Để hiểu chi tiết về các loại connector và cách cấu hình tối ưu, hãy tham khảo [Tomcat Threading Documentation](https://tomcat.apache.org/tomcat-9.0-doc/config/http.html).

## 3. Tại sao Tomcat không phải là Web Server truyền thống?

### 3.1. Tomcat là Servlet Container

Tomcat là **Servlet Container / Web Application Container**:

-   Chuyên hosting Java web applications (Servlet/JSP)
-   Quản lý và thực thi các thành phần Java web
-   Cung cấp HTTP processing và servlet lifecycle management

### 3.2. Không phải Web Server truyền thống

Tomcat **không phải** Web Server theo nghĩa truyền thống:

-   **Web Server truyền thống** (Apache HTTP, Nginx): Tối ưu cho nội dung tĩnh, TLS termination, load balancing
-   **Tomcat**: Tối ưu cho xử lý Java applications, chạy trên JVM

## 4. Sự khác biệt giữa Tomcat và Servlet Java

### 4.1. Servlet Java

-   **Định nghĩa**: Là thành phần web phía server được viết bằng Java
-   **Bản chất**: Là Java class triển khai interface Servlet hoặc extends HttpServlet
-   **Chức năng**: Xử lý HTTP request và tạo response động

### 4.2. Apache Tomcat

-   **Định nghĩa**: Là container quản lý và thực thi Servlet instances
-   **Bản chất**: Là phần mềm server/container runtime
-   **Chức năng**: Cung cấp services và môi trường để Servlet có thể hoạt động

### 4.3. Mối quan hệ

```
Tomcat (Container)
    ↓ manages and executes
Servlet (Java Component)
    ↓ processes
HTTP Request/Response
```

**Quan trọng**: Tomcat **không phải là Servlet**; nó là container quản lý và thực thi các Servlet instances.

## 6. Kết luận

Apache Tomcat là một **Servlet Container/Web Application Container** chuyên dụng, cung cấp môi trường thực thi cho các ứng dụng web Java. Nó quản lý vòng đời của Servlet, cung cấp HTTP processing, và đảm bảo isolation giữa các web applications. Trong production, Tomcat thường được deploy sau một web server (Nginx/Apache) để tối ưu hiệu năng và bảo mật.
