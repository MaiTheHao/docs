package creational_patterns.abstract_factory;

public class Main {
 public static void main(String[] args) {
    DeviceFactory factory;

    factory = new USADeviceFactory();
    Smartphone usPhone = factory.createSmartphone();
    Laptop usLaptop = factory.createLaptop();
    System.out.println("USA Smartphone: " + usPhone.getSpecs());
    System.out.println("USA Laptop: " + usLaptop.getSpecs());

    factory = new JapanDeviceFactory();
    Smartphone jpPhone = factory.createSmartphone();
    Laptop jpLaptop = factory.createLaptop();
    System.out.println("Japan Smartphone: " + jpPhone.getSpecs());
    System.out.println("Japan Laptop: " + jpLaptop.getSpecs());
 }
}
