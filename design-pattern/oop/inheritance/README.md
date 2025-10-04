# OOP Inheritance Example

## Giới thiệu

Tính kế thừa (Inheritance) là một trong những tính chất quan trọng của lập trình hướng đối tượng (OOP). Nó cho phép một lớp (class) con kế thừa các thuộc tính và phương thức từ lớp cha, giúp tái sử dụng mã nguồn và mở rộng chức năng dễ dàng.

## Ví dụ minh họa

Trong ví dụ này, chúng ta có các lớp:

-   `Animal`: Lớp cha, đại diện cho động vật nói chung.
-   `Dog`: Lớp con kế thừa từ `Animal`, đại diện cho loài chó.
-   `Humman`: Lớp con kế thừa từ `Animal`, đại diện cho con người.

### 1. Lớp cha `Animal`

```java
public class Animal {
    protected String name;
    protected String species;
    protected int age;

    public Animal(String name, String species, int age) { ... }

    public void eat() { ... }
    public void sleep() { ... }
}
```

-   Chứa các thuộc tính chung: tên, loài, tuổi.
-   Có các phương thức chung: `eat()`, `sleep()`.

### 2. Lớp con `Dog`

```java
public class Dog extends Animal {
    public Dog(String name, int age) {
        super(name, "Dog", age);
    }

    public void bark() { ... }
}
```

-   Kế thừa thuộc tính và phương thức từ `Animal`.
-   Thêm phương thức riêng: `bark()`.

### 3. Lớp con `Humman`

```java
public class Humman extends Animal {
    public Humman(String name, int age) {
        super(name, "Humman", age);
    }

    public void speak() { ... }
}
```

-   Kế thừa thuộc tính và phương thức từ `Animal`.
-   Thêm phương thức riêng: `speak()`.

### 4. Sử dụng kế thừa trong `Main`

```java
public class Main {
    public static void main(String[] args) {
        Dog dog = new Dog("Buddy", 3);
        dog.eat();
        dog.sleep();
        dog.bark();

        Humman human = new Humman("Alice", 25);
        human.eat();
        human.sleep();
        human.speak();
    }
}
```

-   Đối tượng `dog` có thể dùng các phương thức của `Animal` (`eat`, `sleep`) và phương thức riêng (`bark`).
-   Đối tượng `human` cũng dùng được các phương thức của `Animal` và phương thức riêng (`speak`).

## Kết luận

-   **Kế thừa** giúp các lớp con sử dụng lại thuộc tính, phương thức của lớp cha.
-   Có thể mở rộng thêm chức năng riêng cho từng lớp con.
-   Giúp mã nguồn ngắn gọn, dễ bảo trì và mở rộng.

---

**Thực hành:**  
Hãy thử tạo thêm các lớp con khác kế thừa từ `Animal` như `Cat`, `Bird`... và bổ sung các phương thức riêng cho từng loài!
