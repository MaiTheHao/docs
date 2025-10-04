package oop.inheritance;

// super: tham chiếu đến cha
// instance: thể hiện

public class Dog extends Animal {
    // Constructor cho lớp Dog
    public Dog(String name, int age) {
        super(name, "Dog", age);
    }

    // Chó sủa
    public void bark() {
        System.out.println(super.name + " is barking.");
    }
}
