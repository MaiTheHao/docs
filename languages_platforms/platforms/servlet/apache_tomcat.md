# Định nghĩa và Vai trò của Apache Tomcat trong Mô hình Servlet

## 1. Định nghĩa chuẩn về Apache Tomcat

Apache Tomcat là một **Servlet Container** (hay Web Container) mã nguồn mở, được phát triển bởi Apache Software Foundation. Cụ thể:

-   **Bản chất**: Tomcat là một triển khai (implementation) của các đặc tả Jakarta Servlet, Jakarta Expression Language và JavaServer Pages (JSP)
-   **Môi trường thực thi**: Chạy trên JVM và cung cấp HTTP connectors để nhận request; cung cấp các runtime services cần thiết để thực thi Java web applications (Servlet/JSP)
-   **Định vị**: Là một Servlet container / Web application container, **không phải** là một full Java EE application server (như WildFly, GlassFish) vì không có sẵn các enterprise services như EJB/JTA/JMS

## 2. Vai trò trong Mô hình Servlet

### 2.1. Servlet Container (Web Container)

Tomcat đóng vai trò là **Servlet Container** với các chức năng chính:

-   **Quản lý vòng đời Servlet**: Khởi tạo (init), gọi các phương thức xử lý request (service), và hủy Servlet (destroy)
-   **URL Mapping**: Điều hướng HTTP request đến đúng Servlet được cấu hình
-   **Quản lý luồng**: Sử dụng thread pool để xử lý request đồng thời
-   **Cách ly ứng dụng**: Mỗi webapp có classloader riêng để tránh dependency clash
-   **Cung cấp môi trường runtime**: Cho các thành phần web Java (Servlet, JSP, Filter)

### 2.2. Các thành phần chính

Theo kiến trúc Tomcat:

-   **Catalina**: Core servlet container, quản lý lifecycle và context isolation
-   **Coyote**: HTTP connector hỗ trợ HTTP/1.1 và HTTP/2 (tuỳ cấu hình connector)
-   **Jasper**: JSP Engine, compile JSP thành Java servlet code tại runtime

### 2.3. Threading Model

Tomcat sử dụng **thread pool model** để xử lý request:

-   Connector type (BIO/NIO/NIO2/APR) ảnh hưởng đến cách xử lý concurrent connections

-   Cấu hình `maxThreads`, `acceptCount` quyết định khả năng xử lý đồng thời
-   **Quan trọng**: Servlet instances được shared across threads

#### 2.3.1. Chi tiết Connector Types và ý nghĩa thực tế

**BIO (Blocking I/O)**

-   Mỗi kết nối thường chiếm một thread trong xử lý IO; nếu nhiều kết nối chờ, dễ hết thread
-   Đơn giản nhưng kém scale so với NIO; hiếm dùng ở production hiện đại

**NIO (Non-blocking I/O, selector-based)**

-   Dùng selector để manage nhiều kết nối trên vài thread; worker thread xử lý request khi sẵn sàng
-   Thích hợp khi có nhiều kết nối nhẹ/idle (keep-alive)

**NIO2 (Asynchronous NIO của Java)**

-   API bất đồng bộ tốt hơn, có thể giảm contention; đôi khi hiệu quả hơn NIO trên JVM hiện đại

**APR / Native (via Tomcat Native + OpenSSL / APR)**

-   Dùng native OS calls (sendfile, SSL native) → hiệu năng cao, throughput lớn, low latency cho static content hoặc nhiều kết nối

**Tóm lại**: NIO/NIO2/APR giúp handle hàng chục/nghìn kết nối với ít threads hơn; BIO tiêu tốn nhiều thread per connection

#### 2.3.2. Cấu hình Threading: maxThreads vs acceptCount vs maxConnections

**maxThreads**: Số worker threads tối đa để xử lý requests đồng thời. Nếu tất cả busy, kết nối mới sẽ bị đưa vào hàng đợi (nếu còn chỗ) hoặc bị từ chối

**acceptCount**: Độ dài hàng đợi cho các kết nối chưa được gán thread khi tất cả worker đang bận. Nếu hàng đợi này đầy, OS sẽ refuse connection (client có thể nhận ECONNREFUSED hoặc timeout)

**maxConnections**: (đối với connector NIO/APR) Giới hạn số connections được chấp nhận ở cấp connector (khác với threads)

**connectionTimeout / keepAlive**: Quyết định bao lâu một kết nối idle vẫn chiếm slot — ảnh hưởng đến số connections/threads thực tế

```
Incoming connections → Kernel accept queue → Tomcat accept (tùy connector)
→ nếu worker available → xử lý
→ nếu không → chờ trong acceptCount
→ nếu acceptCount đầy → refuse
```

#### 2.3.3. Hậu quả khi cấu hình sai

**maxThreads quá thấp** → Request chờ/queue, latency tăng, có thể 503/connection refused khi accept queue đầy

**maxThreads quá cao** → Memory tăng, context-switching, GC pressure, throughput có thể giảm

**acceptCount quá thấp** → Client bị từ chối khi tăng đột biến

**Connector blocking + long-blocking requests** (IO, DB) → Thread pool cạn → hệ thống "dừng phục vụ" mặc dù CPU rãnh

**Keep-alive dài + nhiều clients idle** → Giữ connections/slots vô ích

#### 2.3.4. Servlet instances shared across threads

**Default model**: Container tạo một instance của servlet (per mapping) và gọi `service()` nhiều lần từ nhiều threads song song

**Hậu quả**: Mọi biến instance (field) trong servlet là shared giữa requests → nếu dùng để lưu trạng thái per-request sẽ gây race condition

## 3. Servlet Container hay Application Server?

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

## 5. Thread Safety Considerations

**Cảnh báo Implementation**: Servlet instance được shared across threads:

```java
// ❌ KHÔNG ĐÚNG - Race condition
public class BadServlet extends HttpServlet {
    private int counter = 0; // Shared mutable state!

    protected void doGet(HttpServletRequest req, HttpServletResponse resp) {
        counter++; // Thread-unsafe!
    }
}

// ✅ ĐÚNG - Thread-safe
public class GoodServlet extends HttpServlet {
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) {
        int localCounter = 0; // Local variable, thread-safe
        // Process request...
    }
}
```

## 6. Kết luận

Apache Tomcat là một **Servlet Container/Web Application Container** chuyên dụng, cung cấp môi trường thực thi cho các ứng dụng web Java. Nó quản lý vòng đời của Servlet, cung cấp HTTP processing, và đảm bảo isolation giữa các web applications. Trong production, Tomcat thường được deploy sau một web server (Nginx/Apache) để tối ưu hiệu năng và bảo mật.
