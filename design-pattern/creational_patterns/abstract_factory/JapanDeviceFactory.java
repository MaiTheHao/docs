package creational_patterns.abstract_factory;

public class JapanDeviceFactory implements DeviceFactory {
    @Override
    public Smartphone createSmartphone() {
        return new JSmartphone("JSmartphone");
    }

    @Override
    public Laptop createLaptop() {
        return new JLaptop("JLaptop");
    }
}
