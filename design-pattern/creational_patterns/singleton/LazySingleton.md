# Lazy Singleton Implementation

## Mục lục

-   [Giới thiệu](#giới-thiệu)
-   [Các bước triển khai](#các-bước-triển-khai)
-   [Vấn đề Synchronization](#vấn-đề-synchronization)
-   [Double Check Locking](#double-check-locking)
-   [Volatile Keyword](#volatile-keyword)
-   [Code Implementation](#code-implementation)
-   [Testing](#testing)
-   [Lưu ý quan trọng](#lưu-ý-quan-trọng)

## Giới thiệu

Bây giờ chúng ta sẽ triển khai **Lazy Singleton**. Điều này có nghĩa là singleton instance sẽ được tạo **chỉ khi ai đó thực sự yêu cầu** singleton instance.

## Các bước triển khai

### Bước 1: Private Constructor

Đầu tiên, như bạn có thể đoán, chúng ta sẽ tạo constructor private.

```java
private LazySingleton() {
    // Private constructor
}
```

Vì chúng ta muốn đảm bảo không ai có thể tạo instance của class này bên ngoài class này.

### Bước 2: Static Variable

Tiếp theo, chúng ta sẽ khai báo một **static variable** trong class, cùng kiểu với class này. Static variable này sẽ giữ singleton instance của chúng ta.

```java
private static LazySingleton instance;
```

### Bước 3: Static Method

Chúng ta sẽ cung cấp static method trả về singleton instance cho thế giới bên ngoài. Tôi sẽ đặt tên method này là `getInstance()`.

```java
public static LazySingleton getInstance() {
    if (instance == null) {
        // Tạo instance nếu chưa tồn tại
    }
    return instance;
}
```

## Vấn đề Synchronization

Nhưng chúng ta chưa tạo instance. Để làm điều đó, chúng ta cần đảm bảo rằng chưa có instance nào tồn tại.

Chúng ta sẽ kiểm tra `if (instance == null)`, nghĩa là instance chưa được tạo, thì hãy tạo instance.

**⚠️ Vấn đề**: Chúng ta phải đảm bảo xử lý các **vấn đề synchronization**. Nếu hai thread gọi method này đồng thời, và nếu chúng ta không sử dụng bất kỳ cơ chế synchronization nào, thì chúng ta sẽ tạo ra hai object khác nhau của class này và chúng ta muốn tránh điều đó.

## Double Check Locking

Chúng ta sẽ sử dụng **synchronized block** và sử dụng class object associated với LazySingleton.

```java
public static LazySingleton getInstance() {
    if (instance == null) {
        synchronized (LazySingleton.class) {
            if (instance == null) {
                instance = new LazySingleton();
            }
        }
    }
    return instance;
}
```

### Tại sao cần Double Check?

Bây giờ chúng ta đã có lock trên toàn bộ class này. Và như một **double check locking**, chúng ta phải đảm bảo kiểm tra instance có NULL một lần nữa.

**Lý do**: Có thể xảy ra trường hợp hai thread gọi method getInstance() và cả hai đều thấy instance là null. Khi chúng ta hit synchronized block, một thread sẽ lấy được lock và bắt đầu thực thi code bên trong. Thread thứ hai sẽ đợi ở dòng này.

Nếu chúng ta không kiểm tra lần nữa, chỉ đơn giản nói `instance = new LazySingleton()`, chúng ta lại gặp phải cùng vấn đề là cả hai thread sẽ tạo ra hai object riêng biệt.

**Giải thích**: Hai thread đến synchronized block vì instance là null, một thread đi vào và tạo instance, thread thứ hai đang đợi. Ngay khi thread đầu tiên rời khỏi synchronized block, thread thứ hai có thể vào và lại thực thi cùng dòng code, tạo ra instance khác.

Để tránh điều đó, chúng ta kiểm tra null cho instance variable **một lần nữa** trong synchronized block.

## Volatile Keyword

```java
private static volatile LazySingleton instance;
```

**Vấn đề**: Khi nhiều thread tham chiếu đến một variable, khá phổ biến là các thread này sẽ **cache value** của variable này trong một trong các CPU register.

**Giải pháp**: Java cung cấp keyword `volatile`. Khi chúng ta khai báo instance variable là volatile, nó sẽ chỉ báo cho các thread rằng chúng không nên sử dụng cached version của giá trị variable này.

Mỗi lần chúng muốn truy cập giá trị instance, chúng sẽ tham chiếu đến **main memory** và chúng ta có thể đảm bảo rằng cả hai thread đến synchronized block sẽ nhận được **giá trị mới nhất**.

## Code Implementation

```java
public class LazySingleton {
    // Volatile để tránh caching issues
    private static volatile LazySingleton instance;

    // Private constructor
    private LazySingleton() {
        // Private constructor
    }

    // Double-checked locking pattern
    public static LazySingleton getInstance() {
        if (instance == null) {
            synchronized (LazySingleton.class) {
                if (instance == null) {
                    instance = new LazySingleton();
                }
            }
        }
        return instance;
    }
}
```

## Testing

```java
public class Client {
    public static void main(String[] args) {
        LazySingleton singleton1 = LazySingleton.getInstance();
        LazySingleton singleton2 = LazySingleton.getInstance();

        // Kiểm tra xem cả hai reference có trỏ đến cùng instance không
        System.out.println(singleton1 == singleton2); // true
    }
}
```

Khi chạy Java application, bạn sẽ thấy chúng ta lại nhận được `true`, cho biết chúng ta thực sự có một singleton.

## Lưu ý quan trọng

**Hai điểm quan trọng cần nhớ:**

1. ✅ Sử dụng `volatile` keyword
2. ✅ Kiểm tra instance null **hai lần** (double check locking)

**Về Java Version**: Keyword `volatile` được cải thiện trong **JDK version 1.5**. Nếu bạn sử dụng Java version thấp hơn 1.5 (không nên), thì bạn nên tìm cách khác để triển khai Lazy Singleton.

---

_Đây là cách triển khai lazy singleton sử dụng double check locking._
singleton.

All right.

So this is how you can implement the lazy singleton using double check locking.

Now, one point to note here is that while the keyword was implementation of this keyboard was enhanced

in the JDK version 1.5.

So if you are using a Java version, which is less than 1.5, which should not be the case, then you

should look for another way to implement Lazy Singleton and I'm going to show you that in the next video.
