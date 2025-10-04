# Diamond Problem (Vấn đề Kim cương) trong Kế thừa Đa cấp

## Mô tả

Diamond Problem xảy ra khi một lớp kế thừa từ hai lớp cha, mà cả hai lớp cha này đều kế thừa từ cùng một lớp ông/bà. Điều này tạo ra một "hình kim cương" trong sơ đồ kế thừa, dẫn đến sự mơ hồ khi truy cập thuộc tính hoặc phương thức của lớp ông/bà.

## Mã giả minh họa

```plaintext
class Animal:
    thuộc tính: name, age
    phương thức: eat(), sleep()

class Humman kế thừa Animal:
    phương thức: walk()

class Pet kế thừa Animal:
    phương thức: play()

class Dog kế thừa Humman, Pet:
    phương thức: bark()
```

-   Khi tạo đối tượng `Dog`, nó sẽ có **hai bản sao** của `Animal` (một từ `Humman`, một từ `Pet`).
-   Nếu gọi `dog.eat()`, trình biên dịch không biết nên dùng phương thức `eat()` từ bản sao nào của `Animal`.

## Hậu quả

-   **Mơ hồ** khi truy cập thuộc tính/phương thức của lớp ông/bà.
-   **C++** cho phép đa kế thừa nên có thể gặp vấn đề này nếu không dùng kế thừa ảo.
-   **Java** không cho phép đa kế thừa class để tránh diamond problem.

## Minh họa

```plaintext
      Dog
     /   \
  Humman  Pet
     \   /
     Animal
```

## Giải pháp

-   Trong C++, dùng **kế thừa ảo** (`virtual`) để chỉ có một bản sao của lớp ông/bà.
-   Trong Java, chỉ cho phép đa kế thừa interface, không cho phép đa kế thừa class.
