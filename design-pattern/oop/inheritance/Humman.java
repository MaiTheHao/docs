package oop.inheritance;

public class Humman extends Animal {
    // Constructor cho lớp Humman
    public Humman(String name, int age) {
        super(name, "Humman", age);
    }

    // Humman nói
    public void speak() {
        System.out.println(super.name + " is speaking.");
    }
}
