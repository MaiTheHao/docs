# Eager Singleton Implementation

## Mục lục

-   [Giới thiệu](#giới-thiệu)
-   [Các bước triển khai](#các-bước-triển-khai)
-   [Code Implementation](#code-implementation)
-   [Testing](#testing)
-   [Tổng kết](#tổng-kết)

## Giới thiệu

Đã đến lúc bắt đầu triển khai **Singleton design pattern**. Đầu tiên, chúng ta sẽ triển khai **Eager Singleton**.

Đây là một trong những **cách đơn giản nhất** để triển khai Singleton design pattern.

Như đã thảo luận, yêu cầu cho Singleton design pattern là chúng ta muốn đảm bảo rằng **chỉ có một instance duy nhất** của class được tạo ra. Điều đó có nghĩa chúng ta muốn ngăn chặn bất kỳ ai tạo instance của class.

## Các bước triển khai

### Bước 1: Private Constructor

Để làm điều đó, chúng ta sẽ khai báo một constructor trong class, là một **private constructor**.

```java
private EagerSingleton() {
    // Private constructor
}
```

Điều này sẽ xử lý việc **ngăn chặn inheritance** (kế thừa) cũng như ngăn chặn việc tạo instance. Vì chúng ta có private constructor nên không thể kế thừa từ EagerSingleton.

### Bước 2: Tạo Singleton Instance

Tiếp theo, chúng ta muốn tạo singleton instance. Để làm điều đó, chúng ta sẽ khai báo một **private static final field**, kiểu là chính class này.

```java
private static final EagerSingleton instance = new EagerSingleton();
```

Biến static này bây giờ giữ instance duy nhất mà chúng ta sẽ tạo ra.

### Bước 3: Public Access Method

Cuối cùng, chúng ta cần cung cấp một **publicly accessible static method** trả về instance này cho thế giới bên ngoài.

```java
public static EagerSingleton getInstance() {
    return instance;
}
```

## Code Implementation

```java
public class EagerSingleton {
    // Private static final instance - được tạo khi class load
    private static final EagerSingleton instance = new EagerSingleton();

    // Private constructor ngăn chặn tạo instance từ bên ngoài
    private EagerSingleton() {
        // Private constructor
    }

    // Public method để truy cập instance
    public static EagerSingleton getInstance() {
        return instance;
    }
}
```

Bây giờ bất kỳ ai cũng có thể gọi method `getInstance()` và nhận được quyền truy cập vào singleton instance.

## Testing

Để kiểm tra điều này, chúng ta tạo một Client class:

```java
public class Client {
    public static void main(String[] args) {
        // Không thể tạo instance bằng constructor (vì private)
        // EagerSingleton obj = new EagerSingleton(); // Compile Error!

        // Cách duy nhất để có instance là qua getInstance()
        EagerSingleton singleton1 = EagerSingleton.getInstance();
        EagerSingleton singleton2 = EagerSingleton.getInstance();

        // Kiểm tra xem cả hai reference có trỏ đến cùng object không
        System.out.println(singleton1 == singleton2); // true
    }
}
```

Chúng ta có thể gọi method `getInstance()` nhiều lần, và mỗi lần chúng ta sẽ nhận được **chính xác cùng một instance**.

Khi chạy Client class, chúng ta sẽ thấy kết quả `true`, vì **equals operator** kiểm tra references và chỉ trả về `true` nếu cả hai reference đều trỏ đến chính xác cùng một object.

## Tổng kết

Đây là **Eager Singleton implementation** trong Java. Những điều duy nhất bạn cần chú ý:

1. ✅ **Private Constructor** - Đảm bảo constructor là private
2. ✅ **Static Instance Creation** - Tạo singleton instance khi khởi tạo static variable
3. ✅ **Public Static Method** - Cung cấp public static method để lấy instance

> **Đặc điểm Eager Singleton**: Instance được tạo **ngay lập tức** khi class được load, không cần đợi ai đó gọi `getInstance()`.

---

_Đây là cách triển khai eager singleton._
