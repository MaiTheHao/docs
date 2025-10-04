# Lazy Initialization Holder Idiom

## Mục lục

-   [Giới thiệu](#giới-thiệu)
-   [Lazy Initialization Holder Idiom là gì?](#lazy-initialization-holder-idiom-là-gì)
-   [Các bước triển khai](#các-bước-triển-khai)
-   [Cách hoạt động](#cách-hoạt-động)
-   [Code Implementation](#code-implementation)
-   [Demonstration](#demonstration)
-   [So sánh với Double Check Locking](#so-sánh-với-double-check-locking)
-   [Ưu điểm](#ưu-điểm)

## Giới thiệu

Trong video này, chúng ta sẽ xem xét một cách khác để triển khai **Lazy Singleton**.

Trong bài học trước, chúng ta đã thấy có thể sử dụng **double check locking** và **volatile keyword** để tạo lazy singleton.

Nhưng có một cách khác để triển khai lazy singleton, đó là sử dụng cái gọi là **lazy initialization holder idiom**.

## Lazy Initialization Holder Idiom là gì?

Đây là một pattern sử dụng **static inner class** để giữ singleton instance, tận dụng cơ chế class loading của JVM để đảm bảo thread safety và lazy initialization.

## Các bước triển khai

### Bước 1: Private Constructor

Để bắt đầu, chúng ta sẽ tạo constructor private.

```java
private LazyRegistryWithHolder() {
    // Private constructor
}
```

Điều này xử lý inheritance cũng như đảm bảo không ai có thể tạo instance của class từ bên ngoài.

### Bước 2: Static Inner Class

Tiếp theo, chúng ta cần một variable giữ singleton instance. Thay vì khai báo instance variable trong class chính, chúng ta sẽ khai báo một **static inner class**.

```java
private static class RegistryHolder {
    static final LazyRegistryWithHolder instance = new LazyRegistryWithHolder();
}
```

### Bước 3: Public Static Method

Chúng ta sẽ có public static method như thường lệ, trả về singleton instance cho thế giới bên ngoài.

```java
public static LazyRegistryWithHolder getInstance() {
    return RegistryHolder.instance;
}
```

## Cách hoạt động

### So sánh với Eager Singleton

Nhớ lại khi chúng ta triển khai **eager singleton**, vì instance được khởi tạo như một static variable initialization, ngay khi class loader load class, class loader sẽ khởi tạo static variable này với instance mới.

Đó là lý do nó được gọi là **eager singleton**, vì trước khi ai đó gọi method `getInstance()`, instance đã được tạo.

### Cách Holder Pattern hoạt động

Ở đây, chúng ta **không khai báo static variable** trong main class. Thay vào đó, chúng ta có một inner class, một **private static inner class**, và class đó có static variable này.

Áp dụng cùng logic, ngay khi class loader load class `RegistryHolder`, nó sẽ khởi tạo instance variable này và tạo singleton instance.

**Điểm khác biệt**: Cách duy nhất để ai đó có thể truy cập class này hoặc khiến class loader load nó là nếu ai đó gọi method `getInstance()`.

Vì bên trong method này chúng ta đang tham chiếu hoặc tạo tham chiếu đầu tiên đến `RegistryHolder`.

➡️ **Kết quả**: Chúng ta thực sự sử dụng **lazy initialization**.

Class này sẽ không được khởi tạo trừ khi ai đó gọi method `getInstance()`.

## Code Implementation

```java
public class LazyRegistryWithHolder {

    // Private constructor
    private LazyRegistryWithHolder() {
        System.out.println("In Singleton"); // Để demo
    }

    // Private static inner class
    private static class RegistryHolder {
        static final LazyRegistryWithHolder instance = new LazyRegistryWithHolder();
    }

    // Public static method để truy cập instance
    public static LazyRegistryWithHolder getInstance() {
        return RegistryHolder.instance;
    }
}
```

## Demonstration

### Test 1: Chỉ tham chiếu class

```java
public class Client {
    public static void main(String[] args) {
        LazyRegistryWithHolder registry; // Chỉ tham chiếu, không gọi method
        System.out.println("Done");
    }
}
```

**Kết quả**:

```
Done
```

Constructor không được gọi vì chúng ta chỉ tham chiếu đến class, không gọi `getInstance()`.

### Test 2: Gọi getInstance()

```java
public class Client {
    public static void main(String[] args) {
        LazyRegistryWithHolder singleton = LazyRegistryWithHolder.getInstance();
        System.out.println("Done");
    }
}
```

**Kết quả**:

```
In Singleton
Done
```

Bây giờ constructor được gọi vì chúng ta gọi method `getInstance()`.

### Test 3: Gọi nhiều lần

```java
public class Client {
    public static void main(String[] args) {
        LazyRegistryWithHolder singleton1 = LazyRegistryWithHolder.getInstance();
        LazyRegistryWithHolder singleton2 = LazyRegistryWithHolder.getInstance();
        System.out.println("Done");
    }
}
```

**Kết quả**:

```
In Singleton
Done
```

Constructor chỉ được gọi **một lần**, dù chúng ta gọi `getInstance()` nhiều lần.

## So sánh với Double Check Locking

### Encapsulation

Inner class là **private**, không ai có thể truy cập từ bên ngoài:

```java
// Không compile được!
// RegistryHolder holder; // Error: not visible
```

### Thread Safety

**Không cần synchronization** - JVM đảm bảo class loading là thread-safe.

**Không cần volatile** - Class loading mechanism đã xử lý visibility issues.

**Không cần double check locking** - JVM đảm bảo static initialization chỉ xảy ra một lần.

## Ưu điểm

✅ **Thread Safe**: JVM đảm bảo class loading thread-safe  
✅ **Lazy Loading**: Instance chỉ được tạo khi cần  
✅ **No Synchronization Overhead**: Không có performance penalty  
✅ **Simple**: Code đơn giản hơn double check locking  
✅ **No Volatile**: Không cần volatile keyword

> **Kết luận**: Đây là singleton implementation sử dụng **lazy initialization holder idiom** - một cách elegant và hiệu quả để tạo lazy singleton mà không cần explicit synchronization.

---

_Đây là một trong những cách tốt nhất để triển khai Singleton pattern trong Java._
