# Middleware trong Servlet - Cơ chế Filter

## 1. Filter trong Kiến trúc Servlet

### Vị trí trong Servlet Container

Theo kiến trúc Servlet, **Filter** được **Servlet Container** (như Apache Tomcat) quản lý và thực thi **trước khi request đến Servlet**:

```
[Client] → [Web Server] → [Servlet Container]
                              ↓
                         [Filter Chain] → [Servlet Instance]
                              ↑
                    (Container manages lifecycle)
```

**Container responsibilities**:

-   Tạo và quản lý Filter instances theo cấu hình
-   Xây dựng FilterChain dựa trên URL mapping
-   Gọi `init()` khi container khởi động
-   Gọi `destroy()` khi container shutdown

## 2. Filter Lifecycle - Container Management

### Container quản lý vòng đời Filter

Tương tự như Servlet, **Container hoàn toàn quản lý** vòng đời của Filter:

```java
// Container tự động gọi các phương thức này
public void init(FilterConfig config) throws ServletException {
    // Container gọi một lần khi filter được load
}

public void doFilter(ServletRequest request, ServletResponse response,
                    FilterChain chain) throws IOException, ServletException {
    // Container gọi mỗi khi có request match URL pattern
    // Container cung cấp FilterChain để continue
}

public void destroy() {
    // Container gọi khi shutdown
}
```

### Thread Safety trong Filter

**Cảnh báo**: Giống như Servlet, **Filter instance được shared** giữa nhiều threads:

```java
Filter Instance (shared - managed by Container)
├── Container Thread-1 → doFilter(request1, response1, chain)
├── Container Thread-2 → doFilter(request2, response2, chain)
└── Container Thread-3 → doFilter(request3, response3, chain)
```

> **Quan trọng**: Không sử dụng instance variables mutable trong Filter để tránh race condition.

## 3. FilterChain - Container Mechanism

### Container xây dựng FilterChain

**Servlet Container** tự động tạo FilterChain dựa trên:

-   URL pattern mapping trong `web.xml` hoặc `@WebFilter`
-   Thứ tự khai báo filter-mapping
-   Cuối chain luôn là Servlet target

```java
// Container pattern cho FilterChain
chain.doFilter(request, response); // Container tiếp tục chain
```

### Request/Response Wrappers

**Container cho phép** modify request/response thông qua Wrapper pattern:

```java
// Container hỗ trợ wrapper mechanism
HttpServletRequestWrapper wrappedRequest =
    new HttpServletRequestWrapper((HttpServletRequest) request) {
        // Override methods để modify request
    };

chain.doFilter(wrappedRequest, response); // Container forward wrapped object
```

## 4. Container Integration vs Framework

### Servlet Container (Tomcat) - Cơ chế gốc

**Ưu điểm**:

-   **Container native**: Tomcat quản lý trực tiếp, hiệu suất tối ưu
-   **Portable**: Tuân thủ Servlet spec, chạy trên mọi compliant container
-   **Cross-cutting**: Áp dụng toàn bộ webapp mà không cần code change
-   **Early interception**: Container gọi filter trước servlet

**Hạn chế**:

-   **Single mechanism**: Chỉ có Filter, không có alternative
-   **Manual chain management**: Phải tự quản lý thứ tự và dependencies
-   **Broad scope**: Áp dụng cho cả static resources nếu không exclude

### So sánh với Framework Middleware

| **Servlet Filter (Container)** | **Framework Middleware (Spring/NestJS)** |
| ------------------------------ | ---------------------------------------- |
| Container-managed lifecycle    | Framework-managed lifecycle              |
| URL pattern based              | Route/endpoint specific                  |
| Servlet spec compliant         | Framework specific                       |
| Limited conditional logic      | Rich conditional/contextual routing      |

## 5. Production Deployment Considerations

### Container Configuration

Trong **production deployment** với Tomcat:

```
[Nginx] → [Tomcat Container]
            ↓
       [Filter Chain] → [Servlet]
```

**Cấu hình tối ưu**:

-   Filter chỉ áp dụng cho dynamic content (exclude static resources)
-   Thứ tự filter: Authentication → Authorization → Logging → Business logic
-   Thread-safe implementation cho high-concurrency

### Container Threading Impact

**Filter với Tomcat threading model**:

-   NIO/NIO2 connector: Filter execution trong thread pool
-   Blocking operations trong filter ảnh hưởng maxThreads
-   Memory footprint: Filter instances shared, chỉ local variables per-request

## 6. Kết luận

**Filter trong Servlet** là middleware mechanism **duy nhất** được Container cung cấp. Nó được **Tomcat container quản lý hoàn toàn**, từ lifecycle đến thread management. Mặc dù đơn giản hơn so với framework middleware hiện đại, Filter vẫn là **giải pháp hiệu quả** cho cross-cutting concerns trong Java web applications, đặc biệt khi cần **container-level integration** và **portability** giữa các deployment environments.
