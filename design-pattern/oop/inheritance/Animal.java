package oop.inheritance;

/*
 * Lớp đại diện cho động vật
 * Chứa các thuộc tính và phương thức chung cho tất cả các loài động vật
 * Các lớp con sẽ kế thừa từ lớp này để mở rộng chức năng
 * Ví dụ: Dog, Cat, Bird sẽ kế thừa từ Animal
 */
public class Animal {
    protected String name; // Tên của động vật
    protected String species; // Loài của động vật
    protected int age; // Tuổi của động vật

    public Animal(String name, String species, int age) {
        this.name = name;
        this.species = species;
        this.age = age;

        System.out.println("Animal constructor called: " + name + ", " + species + ", " + age);
    }

    public void eat() {
        System.out.println(name + " is eating.");
    }

    public void sleep() {
        System.out.println(name + " is sleeping.");
    }
}
// this, super