package creational_patterns.abstract_factory;

public class Smartphone implements Device{
    private String name;
    private String specs;

    public Smartphone(String name, String specs) {
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
