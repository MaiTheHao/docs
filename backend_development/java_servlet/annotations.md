# Mục Lục Annotation Trong Jakarta Servlet

-   [1. @WebServlet](#webservlet)
-   [2. @WebFilter](#webfilter)
-   [3. @WebListener](#weblistener)

---

## 1. @WebServlet

### Giải Thích

`@WebServlet` là annotation dùng để khai báo một servlet trong ứng dụng web. Được đặt trên lớp kế thừa từ `jakarta.servlet.http.HttpServlet`, annotation này cho phép cấu hình các thuộc tính như:

-   **name**: Tên servlet (tùy chọn). Nếu không chỉ định, container sẽ tự động tạo tên.
-   **urlPatterns** / **value**: Danh sách URL mà servlet sẽ xử lý (bắt buộc ít nhất một).
    -   Có thể sử dụng wildcard: `"/*"`, `"*.jsp"`, `"/api/*"`
    -   Exact match: `"/login"`, `"/user/profile"`
-   **initParams**: Các tham số khởi tạo cho servlet dạng `@WebInitParam(name="key", value="value")`.
-   **loadOnStartup**: Thứ tự khởi tạo khi ứng dụng start (giá trị số, càng nhỏ càng ưu tiên). Giá trị âm = không load khi startup.
-   **asyncSupported**: Cho phép xử lý bất đồng bộ (non-blocking). Mặc định `false`.
-   **description**: Mô tả servlet (tùy chọn).
-   **displayName**: Tên hiển thị trong công cụ quản lý.

Annotation này giúp loại bỏ cấu hình XML, tích hợp trực tiếp vào mã nguồn, dễ bảo trì và phát triển.

### Ví Dụ

```java
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.annotation.WebInitParam;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;

@WebServlet(
    name = "CalculatorServlet",
    urlPatterns = {"/calculate", "/calc"},
    asyncSupported = true,
    loadOnStartup = 1,
    initParams = {
        @WebInitParam(name = "debug", value = "true"),
        @WebInitParam(name = "maxResults", value = "100")
    }
)
public class CalculatorServlet extends HttpServlet {
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws IOException {
        String debug = getInitParameter("debug");
        int a = Integer.parseInt(req.getParameter("a"));
        int b = Integer.parseInt(req.getParameter("b"));
        resp.getWriter().println("Sum: " + (a + b));
    }
}
```

---

## 2. @WebFilter

### Giải Thích

`@WebFilter` dùng để khai báo một filter, đặt trên lớp triển khai giao diện `jakarta.servlet.Filter`. Filter cho phép xử lý request/response trước khi đến servlet hoặc sau khi rời servlet. Các thuộc tính chính:

-   **filterName**: Tên filter (tùy chọn). Nếu không chỉ định, container tự tạo.
-   **urlPatterns** / **value**: URL áp dụng filter (bắt buộc).
    -   Patterns tương tự @WebServlet: `"/*"`, `"*.html"`, `"/api/*"`
-   **servletNames**: Áp dụng filter cho các servlet cụ thể theo tên.
-   **dispatcherTypes**: Loại dispatcher áp dụng filter:
    -   `REQUEST`: Request trực tiếp từ client (mặc định)
    -   `FORWARD`: Request được forward từ servlet khác
    -   `INCLUDE`: Request được include từ servlet khác
    -   `ERROR`: Request đến error page
    -   `ASYNC`: Request bất đồng bộ
-   **initParams**: Tham số khởi tạo cho filter.
-   **asyncSupported**: Hỗ trợ bất đồng bộ. Mặc định `false`.
-   **description**: Mô tả filter.
-   **displayName**: Tên hiển thị.

Filter thường dùng cho logging, authentication, encoding, hoặc xử lý chung cho nhiều request.

### Ví Dụ

```java
import jakarta.servlet.annotation.WebFilter;
import jakarta.servlet.annotation.WebInitParam;
import jakarta.servlet.DispatcherType;
import jakarta.servlet.Filter;
import jakarta.servlet.FilterChain;
import jakarta.servlet.FilterConfig;
import jakarta.servlet.ServletException;
import jakarta.servlet.ServletRequest;
import jakarta.servlet.ServletResponse;
import java.io.IOException;

@WebFilter(
    filterName = "SecurityFilter",
    urlPatterns = {"/admin/*", "/api/*"},
    asyncSupported = true,
    dispatcherTypes = {DispatcherType.REQUEST, DispatcherType.FORWARD},
    initParams = {
        @WebInitParam(name = "encoding", value = "UTF-8"),
        @WebInitParam(name = "logLevel", value = "INFO")
    }
)
public class SecurityFilter implements Filter {
    private String encoding;

    public void init(FilterConfig config) throws ServletException {
        encoding = config.getInitParameter("encoding");
    }

    public void doFilter(ServletRequest req, ServletResponse resp, FilterChain chain)
            throws IOException, ServletException {
        req.setCharacterEncoding(encoding);
        System.out.println("Request from: " + req.getRemoteAddr());
        chain.doFilter(req, resp);
    }

    public void destroy() {}
}
```

---

## 3. @WebListener

### Giải Thích

`@WebListener` dùng để đăng ký một listener cho các sự kiện trong ứng dụng web. Đặt trên lớp triển khai các giao diện listener:

**Các loại Listener hỗ trợ:**

-   **ServletContextListener**: Sự kiện khởi tạo/hủy application context
-   **ServletContextAttributeListener**: Sự kiện thay đổi attribute trong context
-   **ServletRequestListener**: Sự kiện tạo/hủy request
-   **ServletRequestAttributeListener**: Sự kiện thay đổi attribute trong request
-   **HttpSessionListener**: Sự kiện tạo/hủy session
-   **HttpSessionAttributeListener**: Sự kiện thay đổi attribute trong session
-   **HttpSessionActivationListener**: Sự kiện activate/passivate session
-   **HttpSessionBindingListener**: Sự kiện bind/unbind object vào session

**Thuộc tính:**

-   **value**: Mô tả listener (tùy chọn)
-   Không yêu cầu thuộc tính cụ thể khác, chỉ cần đặt annotation trên lớp.

### Ví Dụ

```java
import jakarta.servlet.annotation.WebListener;
import jakarta.servlet.ServletContextEvent;
import jakarta.servlet.ServletContextListener;
import jakarta.servlet.ServletRequestEvent;
import jakarta.servlet.ServletRequestListener;
import jakarta.servlet.http.HttpSessionEvent;
import jakarta.servlet.http.HttpSessionListener;

@WebListener("Application lifecycle listener")
public class AppLifecycleListener implements ServletContextListener,
                                            ServletRequestListener,
                                            HttpSessionListener {

    // Application events
    public void contextInitialized(ServletContextEvent sce) {
        System.out.println("Application started!");
        // Thêm servlet động
        sce.getServletContext()
           .addServlet("DynamicServlet", new DynamicServlet())
           .addMapping("/dynamic");
    }

    public void contextDestroyed(ServletContextEvent sce) {
        System.out.println("Application stopped!");
    }

    // Request events
    public void requestInitialized(ServletRequestEvent sre) {
        System.out.println("Request started: " + sre.getServletRequest().getRemoteAddr());
    }

    public void requestDestroyed(ServletRequestEvent sre) {
        System.out.println("Request completed");
    }

    // Session events
    public void sessionCreated(HttpSessionEvent se) {
        System.out.println("Session created: " + se.getSession().getId());
    }

    public void sessionDestroyed(HttpSessionEvent se) {
        System.out.println("Session destroyed: " + se.getSession().getId());
    }
}
```
