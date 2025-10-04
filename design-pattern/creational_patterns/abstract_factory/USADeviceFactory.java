package creational_patterns.abstract_factory;

public class USADeviceFactory implements DeviceFactory {
    @Override
    public Smartphone createSmartphone() {
        return new USmartphone("USmartphone");
    }

    @Override
    public Laptop createLaptop() {
        return new ULaptop("ULaptop");
    }
}
