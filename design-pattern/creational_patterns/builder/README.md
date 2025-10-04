# Builder Pattern

Builder pattern phân chia việc tạo đối tượng thành nhiều phần (part) thay vì thực hiện trong một lần duy nhất. Nó tách phần khởi tạo object ra khỏi phần mô tả cấu hình của nó.

---

## Lợi ích

-   Tạo cùng một loại đối tượng, dễ dàng custom ra nhiều biến thể hơn.
-   Code sạch hơn, dễ bảo trì.

---

## Vấn đề

**Ví dụ:** Xây dựng một ngôi nhà.

-   Ban đầu: Xây nền, nóc, tường.
-   Nếu muốn thêm sân, garage thì phải thêm tham số vào constructor.

```java
House(floor, roof, wall); // truyền 3 tham số
House(floor, roof, wall, yard, garage); // truyền 5 tham số
```

-   Nếu chỉ xây nhà basic (không sân, không garage) thì vẫn phải truyền `yard = null`, `garage = null`?
-   => Code xấu, dài, phức tạp.

---

## Giải pháp: Builder Pattern

-   Tách từng công việc xây dựng thành các hàm riêng biệt.
-   Mỗi hành động (xây tường, xây nóc, ...) là một method.
-   Mỗi method có thể nhận tham số riêng, giúp code dễ hiểu và gọn hơn.

**Ví dụ:**

```java
.buildWall()
.buildRoof()
.buildFloor()
```

Muốn thêm garage, yard:

```java
.buildGarage()
.buildYard()
```

Muốn bỏ garage thì chỉ cần không gọi `.buildGarage()`.

---

## Tính linh hoạt

-   Dễ dàng custom thứ tự, thêm/bớt hàm, thay đổi tham số của từng hàm.
-   Không cần dùng constructor với các tham số static định trước, chỉ cần gọi các hàm theo kiểu chain (mỗi hàm trả về `this`).

---

## Kết luận

Builder Pattern giúp code sạch, dễ đọc, dễ mở rộng và linh hoạt hơn khi tạo đối tượng phức tạp.

---

> **Note:**  
> Trong thực tế, phần Builder thường được thiết kế dưới dạng một interface riêng biệt.  
> Ví dụ: Nếu `House` là đối tượng mong muốn (Product), ta sẽ tạo một interface `HouseBuilder` để định nghĩa các bước xây dựng cho House.  
> Sau này, có thể mở rộng bằng cách tạo các builder khác nhau như `CheapHouseBuilder` cho nhà giá rẻ, `ExpHouseBuilder` cho nhà mắc tiền, hoặc kết hợp nhiều kiểu builder với `CombinedHouseBuilder`.  
> Cách tiếp cận này giúp mở rộng và tùy biến quá trình xây dựng đối tượng mà không ảnh hưởng đến cấu trúc chung.
