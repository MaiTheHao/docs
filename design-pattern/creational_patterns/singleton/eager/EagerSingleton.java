package creational_patterns.singleton.eager;

class EagerSingleton {
    private static final EagerSingleton instance = new EagerSingleton();

    private EagerSingleton() {
        System.out.println("Instance created");
    }

    public static EagerSingleton getInstance() {
        return EagerSingleton.instance;
    }
}

class Main {
    public static void main(String[] args) {
        System.out.println("Starting...");

        EagerSingleton a = EagerSingleton.getInstance();
        EagerSingleton b = EagerSingleton.getInstance();

        System.out.println(a.equals(b));
    }
}