# Builder Pattern

Builder là mẫu thiết kế giúp **tạo đối tượng phức tạp** bằng cách tách rời quá trình xây dựng đối tượng khỏi biểu diễn của nó.

## Phân tích cấu trúc

-   **Builder**: Interface hoặc abstract class khai báo các bước xây dựng đối tượng.
-   **Concrete Builder**: Triển khai các bước xây dựng cụ thể cho từng loại đối tượng.
-   **Director**: Điều phối quá trình xây dựng đối tượng.
-   **Product**: Đối tượng cuối cùng được tạo ra.

## Ví dụ code

```java
// Product
public class Computer {
    private String cpu;
    private String ram;
    private String storage;
    public Computer(String cpu, String ram, String storage) {
        this.cpu = cpu;
        this.ram = ram;
        this.storage = storage;
    }
    public void show() {}
}

// Builder
public abstract class ComputerBuilder {
    protected String cpu;
    protected String ram;
    protected String storage;
    public abstract ComputerBuilder setCPU(String cpu);
    public abstract ComputerBuilder setRAM(String ram);
    public abstract ComputerBuilder setStorage(String storage);
    public abstract Computer build();
}

// Concrete Builder
public class GamingComputerBuilder extends ComputerBuilder {
    @Override
    public ComputerBuilder setCPU(String cpu) { this.cpu = cpu; return this; }
    @Override
    public ComputerBuilder setRAM(String ram) { this.ram = ram; return this; }
    @Override
    public ComputerBuilder setStorage(String storage) { this.storage = storage; return this; }
    @Override
    public Computer build() { return new Computer(cpu, ram, storage); }
}
```

## Ưu và nhược điểm

### Ưu điểm

-   Tạo đối tượng phức tạp dễ dàng, rõ ràng từng bước.
-   Dễ mở rộng khi thêm loại builder mới.
-   Tách biệt quá trình xây dựng và biểu diễn đối tượng.

### Nhược điểm

-   Số lượng class tăng khi có nhiều loại builder.
-   Có thể dư thừa nếu đối tượng đơn giản.
