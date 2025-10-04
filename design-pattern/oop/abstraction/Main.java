package oop.abstraction;

/*
 * Tính trừu tượng (Abstraction):
 * - Tập trung vào việc chỉ hiển thị những thông tin cần thiết và quan trọng cho người dùng,
 *   đồng thời ẩn đi các chi tiết triển khai phức tạp bên trong.
 * - Giúp đơn giản hóa việc sử dụng và tương tác với các đối tượng.
 */

// Lớp trừu tượng
abstract class Animal {
    // Phương thức trừu tượng (không có thân hàm)
    abstract void makeSound();

    // Phương thức bình thường
    void eat() {
        System.out.println("Animal is eating");
    }
}

// Lớp con kế thừa và cài đặt phương thức trừu tượng
class Dog extends Animal {
    @Override
    void makeSound() {
        System.out.println("Woof!");
    }
}

class Diddy extends Animal {
    @Override
    void makeSound() {
        System.out.println("Nigger!");
    }
}

public class Main {
    public static void main(String[] args) {
        Animal myDog = new Dog();
        myDog.makeSound(); // In ra: Woof!
        myDog.eat();       // In ra: Animal is eating
    }
}
