# Dependency Inversion Principle (DIP)

**Module cấp cao không nên phụ thuộc vào module cấp thấp, cả hai nên phụ thuộc vào abstraction. Abstraction không nên phụ thuộc vào chi tiết, chi tiết nên phụ thuộc vào abstraction.**

> Module cấp cao và Module cấp thấp nói về **mức độ trừu tượng và vai trò trong logic hệ thống**

---

## Ví dụ

### Trường hợp sai

```java
public class EmailService {
    public void sendEmail(String message) {...}
}

public class Notification {
    private EmailService emailService = new EmailService();
    public void send(String message) {...}
}
```

### Trường hợp đúng

```java
public interface MessageService {
    void sendMessage(String message);
}

public class EmailService implements MessageService {
    @Override
    public void sendMessage(String message) {...}
}

public class SmsService implements MessageService {
    @Override
    public void sendMessage(String message) {...}
}

public class Notification {
    private final MessageService messageService;
    public Notification(MessageService messageService) { this.messageService = messageService; }
    public void send(String message) {...}
}
```

Ban đầu ta gắn cứng `EmailService` vào `Notification` dẫn đến việc khó thay đổi Service sau này.

Bằng cách tạo interface chung và triển khai nhiều loại `MessageService` và dùng DI (Dependency Injection) ta có thể linh hoạt thay đổi loại Service nhanh chóng.

---

## Lợi ích

-   Module độc lập, linh hoạt.
-   Dễ kiểm thử.
-   Giảm sự ghép nối, dễ bảo trì và mở rộng.

---
[← Quay lại mục lục SOLID](README.md)
