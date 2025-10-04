package oop.encapsulation;

/*
 * Tính đóng gói (Encapsulation):
 * - Là việc gói gọn dữ liệu và các phương thức (method) xử lý dữ liệu vào trong một đối tượng.
 * - Che giấu các chi tiết cài đặt bên trong và bảo vệ dữ liệu khỏi sự truy cập không mong muốn từ bên ngoài.
 * - Thường sử dụng các thuộc tính private và cung cấp phương thức public (getter/setter) để truy cập dữ liệu.
 */

// Lớp Human với thuộc tính private (đóng gói)
class Human {
    // modifier
    // public
    // private
    // protected

    public String species = "Human";
    private String name; // tên
    private int age;     // tuổi

    // Constructor
    public Human(String name, int age) {
        this.name = name;
        this.age = age;
    }

    // Phương thức public để truy cập dữ liệu (getter)
    public String getName() {
        return name;
    }

    public int getAge() {
        return age;
    }

    // Phương thức public để thay đổi dữ liệu (setter)
    public void setName(String name) {
        this.name = name;
    }
    
    public void setAge(int age) {
        this.age = age;
    }

    // Phương thức public cho hành động
    public void speak() {
        System.out.println(name + " is speaking.");
    }
}

public class Main {
    public static void main(String[] args) {
        // Tạo đối tượng Human và truy cập dữ liệu qua phương thức public
        Human human = new Human("John", 30);

        // human.species // "Human"
        // human.name; // Lỗi: name là private
        // human.age; // Lỗi: age là private

        human.speak();
        System.out.println("Name: " + human.getName());
        System.out.println("Age: " + human.getAge());
    }
}
