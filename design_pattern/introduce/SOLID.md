# SOLID printciples

**SOLID** là một nguyên tắc thiết kế gồm 5 nguyên tắc cụ thể:

-   [**S** - **Single Responsibility Principle (SRP)**](#srp)
-   [**O** - **Open Closed Principle (OCP)**](#ocp)
-   [**L** - **Liskov Substitution Principle (LSP)**](#lsp)
-   [**I** - **Interface Segregation Principle (ISP)**](#isp)
-   [**D** - **Dependency Inversion Principle (DIP)**](#dip)

## Ý nghĩa của từng nguyên tắc

### SRP: Một lớp chỉ nên có một lý do để thay đổi, tức là nó chỉ nên có một trách nhiệm duy nhất.

#### Ví dụ

Cho class `UserManager`:

##### Trường hợp sai

```java
public class UserManager {

    // 1. Quản lý thông tin người dùng trong database
    public void saveUserToDatabase(User user){...}

    // 2. Gửi email thông báo
    public void sendWelcomeEmail(User user){...}

    // 3. Ghi log hoạt động
    public void logActivity(String activity){...}

    // 4. Validate thông tin đầu vào
    public boolean validateUser(User user){...}
}
```

Với thiết kế như vầy, `UserManager` có **nhiều lý do để thay đổi**:

-   Sửa cách lưu user &rarr; Sửa `UserManager`.
-   Thay đổi dịch vụ mail &rarr; Sửa `UserManager`.
-   Sửa định dạng log &rarr; Sửa `UserManager`.
-   Sửa quy tắc validate &rarr; Sửa `UserManager`.

##### Trường hợp đúng

Bằng cách tạo ra:

-   `UserRepository` loại bỏ `saveUserToDatabase`.
-   `EmailService` loại bỏ `sendWelcomeEmail`.
-   `LoggerService` loại bỏ `logActivity`.
-   `UserValidator` loại bỏ `validateUser`.

```java
public class UserManager {
    private final UserRepository userRepository;
    private final EmailService emailService;
    private final LoggerService loggerService;
    private final UserValidator userValidator;

    public UserManager() {
        this.userRepository = new UserRepository();
        this.emailService = new EmailService();
        this.loggerService = new LoggerService();
        this.userValidator = new UserValidator();
    }

    public void registerUser(User user) {...}
}
```

#### Lợi ích

-   **Dễ bảo trì và thay đổi**: Nếu muốn đổi cách gửi email, chỉ cần sửa lớp EmailService mà không ảnh hưởng đến các lớp khác.
-   **Dễ kiểm thử**: Có thể kiểm thử từng chức năng một cách độc lập.
-   **Dễ tái sử dụng**: Có thể dùng lại lớp EmailService hay LoggerService ở những nơi khác trong ứng dụng.
-   **Code rõ ràng, dễ hiểu**: Mỗi lớp có một mục đích duy nhất, giúp lập trình viên mới dễ dàng nắm bắt luồng hoạt động của chương trình.

### OCP: Một thực thể phần mềm nên được mở để mở rộng nhưng đóng để sửa đổi

#### Ví dụ

Giả sử có lớp `AreaCalculator` để tính diện tích các hình.

##### Trường hợp sai

```java
public class AreaCalculator {
    public double calculateTotalArea(Object[] shapes) {
        double totalArea = 0;
        for (Object shape : shapes) {
            if (shape instanceof Rectangle) {...}
            if (shape instanceof Circle) {...}
            // Thêm hình mới phải sửa lớp này!
        }
        return totalArea;
    }
}
```

##### Trường hợp đúng

```java
public interface Shape {
    double getArea();
}

public class Rectangle implements Shape {
    private double width, height;
    @Override
    public double getArea() { return width * height; }
}

public class Circle implements Shape {
    private double radius;
    @Override
    public double getArea() { return Math.PI * radius * radius; }
}

public class AreaCalculator {
    public double calculateTotalArea(Shape[] shapes) {
        double totalArea = 0;
        for (Shape shape : shapes) {
            totalArea += shape.getArea();
        }
        return totalArea;
    }
}
```

Ban đầu, nếu muốn thêm `Shape` chúng ta phải sửa lại source trong `AreaCalculator` bằng cách thêm `if-else`.

Bằng cách tạo interface `Shape` với method `getArea()`, các `ConcreteShape` chỉ cần triển khai `Shape` do đó khi thêm bất kỳ hình dạng nào thì miễn là implement của `Shape` thì `AreaCalculator` vẫn chạy mà không gây lỗi.

#### Lợi ích

-   Dễ mở rộng, không cần sửa code cũ.
-   Tăng khả năng bảo trì, giảm lỗi.
-   Thiết kế lỏng lẻo, các module ít phụ thuộc nhau.

---

### LSP: Các đối tượng lớp con có thể thay thế lớp cha mà không làm thay đổi tính đúng đắn của chương trình

#### Ví dụ

##### Trường hợp sai

```java
public class Bird {
    public void fly() { System.out.println("Tôi đang bay!"); }
}

public class Penguin extends Bird {
    @Override
    public void fly() {
        throw new UnsupportedOperationException("Chim cánh cụt không thể bay!");
    }
}

public class BirdShow {
    public void startShow(Bird bird) { bird.fly(); }
}
```

##### Trường hợp đúng

```java
public class Bird {...}

public interface Flyable {
    void fly();
}

public class Sparrow extends Bird implements Flyable {
    @Override
    public void fly() { System.out.println("Chim sẻ đang bay!"); }
}

public class Penguin extends Bird {...}

public class BirdShow {
    public void startFlyingShow(Flyable flyingBird) { flyingBird.fly(); }
}
```

Ban đầu định nghĩa `Bird` phải biết bay, nhưng `Penguin` lại không biết bay dẫn đến lỗi `Penguin` là `Bird` nhưng không hoạt động như `Bird` được định nghĩa.

Bằng cách tạo interface `Flyable`, `Bird` giờ định chỉ định nghĩa thuộc tính không khẳng định khả năng bay do đó `Penguin` giờ đây là `Bird` và hoạt động như `Bird` được định nghĩa.

#### Lợi ích

-   Đảm bảo hệ thống phân cấp đúng đắn.
-   Tránh lỗi khi dùng lớp con thay lớp cha.
-   Tăng khả năng tái sử dụng.

---

### ISP: Client không nên bị buộc phải phụ thuộc vào các interface mà nó không sử dụng

#### Ví dụ

##### Trường hợp sai

```java
public interface IWorker {
    void work();
    void eat();
    void sleep();
}

public class HumanWorker implements IWorker {
    public void work() {}
    public void eat() {}
    public void sleep() {}
}

public class RobotWorker implements IWorker {
    public void work() {}
    public void eat() {} // không dùng
    public void sleep() {} // không dùng
}
```

##### Trường hợp đúng

```java
public interface IWorkable { void work(); }
public interface IFeedable { void eat(); }
public interface ISleepable { void sleep(); }

public class HumanWorker implements IWorkable, IFeedable, ISleepable {
    public void work() {}
    public void eat() {}
    public void sleep() {}
}

public class RobotWorker implements IWorkable {
    public void work() {}
}
```

Ban đầu `IWorkable` định nghĩa `work()`, `eat()`, `sleep()`, và `HummanWorker` và `RobotWorker` triển khai. Nhưng `RobotWorker` lại không hề `eat()` hay `sleep()` dẫn đến việc thừa method không dùng tới (phụ thuộc không sử dụng).

Bằng cách tách từng action thành các interface, giờ đây `RobotWorker` chỉ cần implement action interface cụ thể, do đó không còn bị thừa các method (không phụ thuộc không sử dụng).

#### Lợi ích

-   Tăng tính gắn kết.
-   Giảm phụ thuộc không cần thiết.
-   Dễ bảo trì và mở rộng.

---

### DIP: Module cấp cao không nên phụ thuộc vào module cấp thấp, cả hai nên phụ thuộc vào abstraction & Abstraction không nên phụ thuộc vào chi tiết, chi tiết nên phụ thuộc vào abstraction

> Module cấp cao và Module cấp thấp nói về **mức độ trừu trượng và vai trò trong logic hệ thống**

#### Ví dụ

##### Trường hợp sai

```java
public class EmailService {
    public void sendEmail(String message) {...}
}

public class Notification {
    private EmailService emailService = new EmailService();
    public void send(String message) {...}
}
```

##### Trường hợp đúng

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

Ban đầu ta gắn cứng `EmailService` vào `Nofitication` dẫn đến việc khó thay đổi Service sau này.

Bằng cách tạo interface chung và triển khai nhiều loại `MessageService` và dùng DI (Depecdency Injection) ta có thể linh hoạt thay đổi loại Service nhanh chóng.

#### Lợi ích

-   Module độc lập, linh hoạt.
-   Dễ kiểm thử.
-   Giảm sự ghép nối, dễ bảo trì và mở rộng.
