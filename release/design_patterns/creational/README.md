# Creational Patterns (Nhóm mẫu khởi tạo)

Nhóm **Creational Patterns (Nhóm mẫu khởi tạo)** cung cấp các cơ chế khởi tạo đối tượng khác nhau, giúp tăng tính linh hoạt và khả năng tái sử dụng mã nguồn. Các mẫu này trừu tượng hóa quá trình tạo đối tượng, giúp hệ thống độc lập với cách các đối tượng của nó được tạo ra, cấu thành và biểu diễn.

Chúng che giấu cách các cá thể (instances) của các lớp được tạo ra và kết hợp với nhau. Hệ thống chỉ biết đến giao diện của chúng chứ không cần biết đến lớp cụ thể, từ đó đem lại sự linh hoạt trong việc cấu hình đối tượng ở cả thời điểm biên dịch (compile-time) và thời điểm chạy (run-time).

---

## Mục lục

-   [1. Abstract Factory](#1-abstract-factory)
-   [2. Builder](#2-builder)
-   [3. Factory Method](#3-factory-method)
-   [4. Prototype](#4-prototype)
-   [5. Singleton](#5-singleton)
-   [Thảo luận chung về các mẫu Creational](#thảo-luận-chung-về-các-mẫu-creational)

---

## 1. Abstract Factory

*   **Mục đích:** Cung cấp một giao diện để tạo ra các *họ* (families) gồm các đối tượng liên quan hoặc phụ thuộc lẫn nhau mà không cần phải chỉ định các lớp (classes) cụ thể của chúng.
*   **Đặc điểm và ứng dụng:** Mẫu này (còn được gọi là **Kit**) được sử dụng khi hệ thống cần được cấu hình bằng một trong nhiều họ sản phẩm và bạn muốn áp đặt ràng buộc rằng các sản phẩm trong một họ phải được sử dụng cùng nhau.
*   **Lợi ích:**
    *   **Cách ly các lớp cụ thể:** Giúp ứng dụng kiểm soát các lớp đối tượng được tạo ra vì Factory đóng gói trách nhiệm và quy trình tạo sản phẩm.
    *   **Dễ dàng trao đổi họ sản phẩm:** Việc thay đổi toàn bộ hệ thống sang một họ sản phẩm khác có thể được thực hiện dễ dàng bằng cách thay đổi lớp Factory khởi tạo ban đầu.
    *   **Đảm bảo tính nhất quán:** Đảm bảo các sản phẩm được thiết kế để làm việc chung với nhau sẽ không bị xáo trộn với họ sản phẩm khác.
*   **Chi tiết tài liệu:** [Xem chi tiết Abstract Factory Pattern](./abstract_factory.md)

---

## 2. Builder

*   **Mục đích:** Tách biệt quá trình xây dựng của một đối tượng phức tạp khỏi biểu diễn của nó, sao cho cùng một quá trình xây dựng có thể tạo ra các biểu diễn (representations) khác nhau.
*   **Đặc điểm và ứng dụng:** Mẫu này được dùng khi thuật toán tạo ra đối tượng phức tạp cần phải độc lập với các thành phần tạo nên đối tượng đó và cách chúng được lắp ráp. Khác với các mẫu tạo đối tượng trong một lần duy nhất, Builder xây dựng đối tượng theo từng bước (step by step) dưới sự kiểm soát của một đối tượng "Director" (Người chỉ đạo).
*   **Lợi ích:**
    *   Cho phép bạn thay đổi biểu diễn nội bộ của sản phẩm bằng cách định nghĩa các Builder mới.
    *   Phân tách mã nguồn xây dựng và biểu diễn, qua đó cải thiện tính mô-đun.
    *   Mang lại quyền **kiểm soát chi tiết hơn đối với quá trình xây dựng** và cấu trúc của sản phẩm cuối cùng.
*   **Chi tiết tài liệu:** [Xem chi tiết Builder Pattern](./builder.md)

---

## 3. Factory Method

*   **Mục đích:** Định nghĩa một giao diện để tạo đối tượng, nhưng để các lớp con (subclasses) quyết định lớp nào sẽ được khởi tạo. Factory Method cho phép một lớp trì hoãn việc khởi tạo đối tượng cho các lớp con.
*   **Đặc điểm và ứng dụng:** (Còn gọi là **Virtual Constructor**). Mẫu này đặc biệt hữu ích cho các framework khi một lớp cha (thường là abstract) cần khởi tạo một đối tượng nhưng không thể lường trước được lớp cụ thể nào sẽ được tạo.
*   **Lợi ích:**
    *   Loại bỏ việc phải ràng buộc (bind) các lớp cụ thể vào mã nguồn, mã nguồn chỉ cần xử lý thông qua giao diện của đối tượng (Product).
    *   Cung cấp các **điểm neo (hooks) cho các lớp con** để có thể dễ dàng mở rộng và định nghĩa lại cách đối tượng được tạo.
    *   Dùng để kết nối các hệ thống phân cấp lớp (class hierarchies) song song lại với nhau.
*   **Chi tiết tài liệu:** [Xem chi tiết Factory Method Pattern](./factory_method.md)

---

## 4. Prototype

*   **Mục đích:** Chỉ định loại đối tượng cần tạo bằng cách sử dụng một cá thể làm bản mẫu (prototypical instance), và tạo ra các đối tượng mới bằng cách sao chép (copy/clone) bản mẫu này.
*   **Đặc điểm và ứng dụng:** Prototype rất có ích khi bạn muốn tránh việc phải tạo ra các hệ thống phân cấp lớp Factory song song với hệ thống phân cấp lớp Product, hoặc khi các lớp cần tạo chỉ khác nhau ở một vài trạng thái cụ thể.
*   **Lợi ích:**
    *   Thêm và xóa các sản phẩm tại thời điểm chạy (run-time) dễ dàng chỉ bằng cách đăng ký một bản mẫu mới với client.
    *   Xác định các đối tượng mới bằng cách thay đổi giá trị hoặc thay đổi cấu trúc của bản mẫu hiện có, giảm số lượng lớp (classes) đáng kể.
    *   Định cấu hình ứng dụng bằng các lớp được tải động (dynamically loaded) tại thời điểm chạy.
*   **Chi tiết tài liệu:** [Xem chi tiết Prototype Pattern](./prototype.md)

---

## 5. Singleton

*   **Mục đích:** Đảm bảo một lớp chỉ có duy nhất một phiên bản (instance), và cung cấp một điểm truy cập toàn cục đến phiên bản đó.
*   **Đặc điểm và ứng dụng:** Hữu ích khi hệ thống chỉ cần đúng một đối tượng để hoạt động, ví dụ như bộ quản lý cửa sổ (window manager), tệp hệ thống, hay ống đệm máy in (printer spooler).
*   **Lợi ích:**
    *   Kiểm soát chặt chẽ cách thức và thời điểm đối tượng được truy cập thông qua việc đóng gói nó.
    *   **Giảm thiểu việc sử dụng các biến toàn cục (global variables)** làm ô nhiễm không gian tên (name space) của ứng dụng.
    *   Hỗ trợ mở rộng thông qua kế thừa và có thể dễ dàng điều chỉnh cấu hình hệ thống để cho phép nhiều hơn một phiên bản nếu sau này có nhu cầu thay đổi.
*   **Chi tiết tài liệu:** [Xem chi tiết Singleton Pattern](./singleton.md)

---

## Thảo luận chung về các mẫu Creational

Các mẫu khởi tạo thường có mối quan hệ bổ trợ hoặc thay thế lẫn nhau:

*   **Sự cấu thành đối tượng (Object Composition):** Mẫu *Abstract Factory*, *Builder* và *Prototype* tập trung vào khía cạnh này, trong đó chúng định nghĩa một đối tượng đóng vai trò là "nhà máy" để sản xuất ra các sản phẩm.
*   **Sử dụng kế thừa (Subclassing):** Trái lại, *Factory Method* tập trung vào việc sử dụng kế thừa, tạo ra đối tượng thông qua một phương thức mà các lớp con có thể ghi đè (override).
*   **Sự tiến hóa của thiết kế:** Trong quá trình thiết kế, người ta thường bắt đầu bằng cách sử dụng *Factory Method* vì nó đơn giản nhất, sau đó có thể tiến hóa sang việc sử dụng *Abstract Factory*, *Prototype* hoặc *Builder* nếu hệ thống đòi hỏi tính linh hoạt cao hơn.
*   **Sự kết hợp giữa các mẫu:**
    *   *Abstract Factory* và *Builder* có thể dùng kết hợp cùng các mẫu khác; ví dụ, *Abstract Factory* thường được cấu trúc dưới dạng một tập hợp các *Factory Method*, hoặc nó có thể được thiết kế bằng cách sử dụng *Prototype*.
    *   Một lớp *Singleton* thường được dùng để quản lý thể hiện duy nhất của một lớp *Abstract Factory*.

---
[← Quay lại trang chủ](../../README.md)
