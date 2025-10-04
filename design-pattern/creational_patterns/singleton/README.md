# Singleton Design Pattern

## Mục lục

-   [Giới thiệu](#giới-thiệu)
-   [Định nghĩa](#định-nghĩa)
-   [Vấn đề giải quyết](#vấn-đề-giải-quyết)
-   [Lưu ý về Global State](#lưu-ý-về-global-state)
-   [UML Diagram](#uml-diagram)
-   [Các bước triển khai](#các-bước-triển-khai)
-   [Các loại triển khai](#các-loại-triển-khai)
-   [Triển khai bằng Enum](#triển-khai-bằng-enum)
-   [Khuyến nghị](#khuyến-nghị)

## Giới thiệu

Bây giờ là lúc học về **Singleton design pattern**.

Đây là một **creational design pattern** (mẫu thiết kế tạo đối tượng), và rất có khả năng bạn đã sử dụng mẫu thiết kế singleton này trong code của mình vì đây là một trong những design pattern được sử dụng nhiều nhất.

## Định nghĩa

Một **singleton class** hoặc class triển khai Singleton Design pattern chỉ có **một instance duy nhất** trong chương trình của bạn, và instance đó thường có thể truy cập toàn cục thông qua một điểm duy nhất.

Bạn cung cấp quyền truy cập vào instance duy nhất đó thông qua một method hoặc một public field trong singleton class của bạn.

## Vấn đề giải quyết

Vấn đề chính mà design pattern này giải quyết là **đảm bảo chỉ có một instance duy nhất** của class trong ứng dụng của bạn.

## Lưu ý về Global State

⚠️ **Lưu ý quan trọng**: Bất kỳ state nào bạn thêm vào singleton object sẽ trở thành một phần của **global state** của ứng dụng vì singleton instance được chia sẻ toàn cục.

Điều này có nghĩa là nó có thể truy cập ở bất kỳ đâu trong ứng dụng của bạn. Tất cả state của nó được coi là global state.

Tôi nhấn mạnh điểm này vì thông thường việc có một global state lớn là dấu hiệu của một **thiết kế hoặc triển khai tồi**.

## UML Diagram

UML diagram rất đơn giản. Cơ bản, chúng ta có một class đơn giản gọi là singleton.

Điều duy nhất bạn nên nhớ là chúng ta cung cấp một **static method** thường được gọi là `getInstance()`, và method này trả về instance duy nhất có trong ứng dụng của bạn.

Class này thường tự chịu trách nhiệm tạo ra instance duy nhất đó.

## Các bước triển khai

Để đảm bảo chỉ có một instance duy nhất, chúng ta cần kiểm soát việc tạo instance:

1. **Kiểm soát constructor**: Đảm bảo constructor của class không thể truy cập từ bên ngoài class
2. **Ngăn Subclassing**: Không cho phép kế thừa vì khi cho phép subclassing, việc tạo subclass không còn trong tầm kiểm soát
3. **Theo dõi instance**: Giữ track của instance duy nhất đó. Thường thì chính Singleton class là nơi tốt để giữ hoặc theo dõi instance đó
4. **Cung cấp truy cập**: Đảm bảo cung cấp quyền truy cập vào instance đó thông qua một public method

> **Lưu ý**: Chúng ta cũng có thể expose instance này như một final static field, nhưng nó không hoạt động cho tất cả các kiểu triển khai singleton.

## Các loại triển khai

Có hai loại triển khai singleton:

### 1. Eager Singleton

-   **Eager Singleton** là singleton mà instance được tạo ngay khi class được load
-   Chúng ta không đợi ai đó thực sự yêu cầu instance đó
-   Ngay khi class được load, chúng ta sẽ tiến hành tạo instance duy nhất

### 2. Lazy Singleton

-   **Lazy Singleton** ngược lại với eager singleton
-   Chúng ta không tạo instance trừ khi ai đó thực sự yêu cầu nó

## Triển khai bằng Enum

Có một cách cuối cùng để triển khai singleton, đó là **sử dụng enum**.

Cách này được trình bày bởi **Joshua Bloch** tại Google I/O 2008 và cũng được đề cập trong cuốn sách **Effective Java**.

Thay vì tạo singleton như một class thường, chúng ta tạo một enum và khai báo singleton instance như một enum constant, sau đó có thể tiếp tục thêm bất kỳ method nào bạn thường thêm trong class của mình.

### Ưu điểm của Enum Singleton:

1. **Không thể kế thừa**: Bạn không thể extend từ bất kỳ enum nào
2. **Không thể tạo object**: Bạn không thể tạo object của enum trong class. Object duy nhất của enum này sẽ là instance constant mà chúng ta đã khai báo
3. **Xử lý Serialization**: Enum xử lý các vấn đề serialization/deserialization vì khi sử dụng regular class, nếu bạn deserialize một singleton instance đã được serialize trước đó, bạn sẽ nhận được một object khác

## Khuyến nghị

**Cách tốt nhất** trong tất cả những gì chúng ta đã thấy, tôi khuyến nghị cao việc **sử dụng lazy initialization holder** vì pattern này cung cấp những điều tốt nhất của cả hai thế giới:

-   Bạn không phải đối phó với các vấn đề synchronization rõ ràng và sử dụng volatile
-   Bạn vẫn có được instance được tạo khi ai đó thực sự cần nó

Nếu điều này cũng quá phức tạp, bạn có thể sử dụng **eager singleton** nơi chúng ta tạo singleton instance ngay khi class được load.

> **Lưu ý**: Cách tốt nhất là **không sử dụng Singleton** vì nó được coi là một **anti-pattern**.

Chúng ta sẽ thảo luận về anti-pattern này trong phần pitfalls của design pattern này.

---

_Đây là tất cả các triển khai của Singleton trong Java._
