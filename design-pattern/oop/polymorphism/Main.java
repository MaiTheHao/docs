package oop.polymorphism;

/*
 * Tính đa hình (Polymorphism):
 * - Cho phép các đối tượng thuộc các lớp khác nhau có thể phản ứng khác nhau với cùng một thông điệp hoặc lời gọi phương thức.
 * - Cùng một tên phương thức có thể thực hiện các hành vi khác nhau tùy thuộc vào đối tượng gọi nó.
 * - Giúp mã linh hoạt và dễ mở rộng hơn.
 */

class Animal {
    public void sound() {}
}

class Dog extends Animal {
    @Override
    public void sound() {
        System.out.println("Woof");
    }
}

class Cat extends Animal {
    @Override
    public void sound() {
        System.out.println("Meow");
    }
}

public class Main {
    public static void main(String[] args) {
        Animal dog = new Dog();
        Animal cat = new Cat();

        dog.sound(); // In ra "Woof"
        cat.sound(); // In ra "Meow"
    }
}
