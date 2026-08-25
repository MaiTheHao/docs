# Spring Boot

Bộ tài liệu kỹ thuật Spring Boot — mỗi file tập trung vào một layer cụ thể, đủ dense để tra cứu nhanh và hiểu sâu cơ chế nội tại.

## Table of Contents

- [Navigation](#navigation)

---

## Navigation

| Bài | Nội dung cốt lõi | Chi tiết kỹ thuật |
| :--- | :--- | :--- |
| [`01_startup_ioc_container.md`](01_startup_ioc_container.md) | **Startup & IoC Container** | Phân tích quy trình `SpringApplication.run()`, so sánh `ApplicationContext` vs `BeanFactory`, và cơ chế phân loại runtime web type (`SERVLET`/`REACTIVE`/`NONE`). |
| [`02_bean_lifecycle_di.md`](02_bean_lifecycle_di.md) | **Bean Lifecycle & DI** | 8 bước vòng đời Bean, tách biệt giữa Scan & Instantiate phase, và 3-level cache giải quyết Circular Dependency. |
| [`03_spring_mvc_web_layer.md`](03_spring_mvc_web_layer.md) | **Spring MVC & Web Layer** | Phân luồng `DispatcherServlet`, cơ chế xử lý Exception giữa Filter vs HandlerInterceptor/`@RestControllerAdvice`, và `OncePerRequestFilter`. |
| [`04_auto_configuration.md`](04_auto_configuration.md) | **Auto Configuration** | Cơ chế nạp metadata từ `AutoConfiguration.imports`, điều kiện đánh giá `@ConditionalOnClass` vs `@ConditionalOnMissingBean`. |
| [`05_aop_proxy.md`](05_aop_proxy.md) | **AOP & Proxy** | Cơ chế Proxy (JDK Dynamic Proxy vs CGLIB), phân tích hiện tượng self-invocation làm mất proxy context trong `@Transactional`. |

---
[← Back to Release README](../README.md)
