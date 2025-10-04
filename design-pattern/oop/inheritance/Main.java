package oop.inheritance;

/*
 * Tính kế thừa (Inheritance):
 * - Cho phép một lớp (class) mới (lớp con) kế thừa các thuộc tính và phương thức từ một lớp đã có (lớp cha).
 * - Thúc đẩy việc tái sử dụng mã nguồn và giảm sự trùng lặp.
 */

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
