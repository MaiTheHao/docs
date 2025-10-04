# SOLID

SOLID là một tập hợp 5 nguyên tắc thiết kế hướng đối tượng giúp viết code dễ hiểu, dễ bảo trì và dễ mở rộng. Áp dụng SOLID giúp giảm sự phụ thuộc giữa các thành phần, tăng khả năng tái sử dụng và giảm chi phí bảo trì phần mềm.

## 1. Tổng Quan Về SOLID

-   **SOLID là gì?**  
     SOLID là viết tắt của 5 nguyên tắc thiết kế hướng đối tượng:

    -   **S** - _Single Responsibility Principle (SRP)_: Nguyên tắc Trách nhiệm Đơn nhất
    -   **O** - _Open/Closed Principle (OCP)_: Nguyên tắc Mở/Đóng
    -   **L** - _Liskov Substitution Principle (LSP)_: Nguyên tắc Thay thế Liskov
    -   **I** - _Interface Segregation Principle (ISP)_: Nguyên tắc Tách biệt Giao diện
    -   **D** - _Dependency Inversion Principle (DIP)_: Nguyên tắc Đảo ngược Phụ thuộc

-   **Tại sao SOLID quan trọng?**  
     Giúp tạo ra code linh hoạt, dễ thay đổi, dễ kiểm thử và bền vững.

-   **Lợi ích:**  
     Giảm thiểu sự phụ thuộc giữa các thành phần, tăng khả năng tái sử dụng code, giảm chi phí bảo trì.

---

## 2. Các Nguyên Tắc SOLID Với Ví Dụ Java

### 2.1. Single Responsibility Principle (SRP) - Nguyên tắc Trách nhiệm Đơn nhất

**Một class chỉ nên có một lý do để thay đổi.**

**Ví dụ vi phạm SRP:**

```java
class Report {
        public void generateReport() { System.out.println("Generating report..."); }
        public void saveReportToFile(String filename) { System.out.println("Saving report to " + filename); }
        public void sendReportByEmail(String email) { System.out.println("Sending report to " + email); }
}
```

_Class `Report` có nhiều trách nhiệm: tạo, lưu, gửi báo cáo._

**Ví dụ tuân thủ SRP:**

```java
class ReportGenerator {
        public void generateReport() { System.out.println("Generating report..."); }
}
class ReportSaver {
        public void saveReportToFile(String filename) { System.out.println("Saving report to " + filename); }
}
class ReportSender {
        public void sendReportByEmail(String email) { System.out.println("Sending report to " + email); }
}
```

_Mỗi class chỉ có một trách nhiệm duy nhất._

---

### 2.2. Open/Closed Principle (OCP) - Nguyên tắc Mở/Đóng

**Class nên mở để mở rộng, đóng để sửa đổi.**

**Ví dụ vi phạm OCP:**

```java
class Invoice {
        private double amount;
        public Invoice(double amount) { this.amount = amount; }
        public double calculateTotal(String type) {
                if ("standard".equals(type)) return amount;
                else if ("discount".equals(type)) return amount * 0.9;
                return amount;
        }
}
```

_Thêm loại hóa đơn mới phải sửa code cũ._

**Ví dụ tuân thủ OCP:**

```java
interface InvoiceCalculator {
        double calculate(double amount);
}
class StandardInvoiceCalculator implements InvoiceCalculator {
        public double calculate(double amount) { return amount; }
}
class DiscountInvoiceCalculator implements InvoiceCalculator {
        public double calculate(double amount) { return amount * 0.9; }
}
class PremiumInvoiceCalculator implements InvoiceCalculator {
        public double calculate(double amount) { return amount * 0.8; }
}
class Invoice {
        private double amount;
        private InvoiceCalculator calculator;
        public Invoice(double amount, InvoiceCalculator calculator) {
                this.amount = amount;
                this.calculator = calculator;
        }
        public double getTotal() { return calculator.calculate(amount); }
}
```

_Thêm loại hóa đơn mới chỉ cần tạo class mới, không sửa code cũ._

---

### 2.3. Liskov Substitution Principle (LSP) - Nguyên tắc Thay thế Liskov

**Class con phải thay thế được class cha mà không làm thay đổi tính đúng đắn của chương trình.**

**Ví dụ vi phạm LSP:**

```java
class Bird {
        public void fly() { System.out.println("Bird is flying."); }
}
class Ostrich extends Bird {
        @Override
        public void fly() { throw new UnsupportedOperationException("Ostrich cannot fly."); }
}
```

_Ostrich không thể bay nhưng vẫn bị ép phải có phương thức `fly()`._

**Ví dụ tuân thủ LSP:**

```java
interface Flyable { void fly(); }
class Bird implements Flyable {
        public void fly() { System.out.println("Bird is flying."); }
}
class Eagle implements Flyable {
        public void fly() { System.out.println("Eagle is flying high."); }
}
abstract class FlightlessBird { }
class Ostrich extends FlightlessBird { }
```

_Chỉ những loài chim biết bay mới triển khai `Flyable`._

---

### 2.4. Interface Segregation Principle (ISP) - Nguyên tắc Tách biệt Giao diện

**Client không nên phụ thuộc vào các phương thức mà nó không sử dụng.**

**Ví dụ vi phạm ISP:**

```java
interface Worker {
        void work();
        void eat();
        void sleep();
}
class HumanWorker implements Worker {
        public void work() { System.out.println("Human working."); }
        public void eat() { System.out.println("Human eating."); }
        public void sleep() { System.out.println("Human sleeping."); }
}
class RobotWorker implements Worker {
        public void work() { System.out.println("Robot working."); }
        public void eat() { /* Robot không ăn */ }
        public void sleep() { /* Robot không ngủ */ }
}
```

_RobotWorker bị buộc phải implement các phương thức không cần thiết._

**Ví dụ tuân thủ ISP:**

```java
interface Workable { void work(); }
interface Eatable { void eat(); }
interface Sleepable { void sleep(); }
class HumanWorker implements Workable, Eatable, Sleepable {
        public void work() { System.out.println("Human working."); }
        public void eat() { System.out.println("Human eating."); }
        public void sleep() { System.out.println("Human sleeping."); }
}
class RobotWorker implements Workable {
        public void work() { System.out.println("Robot working."); }
}
```

_Mỗi class chỉ implement các interface cần thiết._

---

### 2.5. Dependency Inversion Principle (DIP) - Nguyên tắc Đảo ngược Phụ thuộc

**Module cấp cao không nên phụ thuộc vào module cấp thấp, cả hai nên phụ thuộc vào abstraction.**

**Ví dụ vi phạm DIP:**

```java
class LightBulb {
        public void turnOn() { System.out.println("LightBulb: On"); }
        public void turnOff() { System.out.println("LightBulb: Off"); }
}
class Switch {
        private LightBulb bulb = new LightBulb();
        public void press() {
                bulb.turnOn();
        }
}
```

_Switch phụ thuộc trực tiếp vào LightBulb._

**Ví dụ tuân thủ DIP:**

```java
interface Switchable {
        void turnOn();
        void turnOff();
}
class LightBulb implements Switchable {
        public void turnOn() { System.out.println("LightBulb: On"); }
        public void turnOff() { System.out.println("LightBulb: Off"); }
}
class Fan implements Switchable {
        public void turnOn() { System.out.println("Fan: On"); }
        public void turnOff() { System.out.println("Fan: Off"); }
}
class ElectricPowerSwitch {
        private Switchable device;
        public ElectricPowerSwitch(Switchable device) { this.device = device; }
        public void press() { device.turnOn(); }
}
```

_Switch chỉ phụ thuộc vào abstraction `Switchable`._
