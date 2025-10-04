package creational_patterns.abstract_factory;

public class Laptop implements Device {
    private String name;
    private String specs;

    public Laptop(String name, String specs) {
        this.name = name;
        this.specs = specs;
    }

    public String getName() {
        return name;
    }

    public String getSpecs() {
        return specs;
    }
}
