package creational_patterns.singleton.lazy;

class LazySingleton {
    private static LazySingleton instance = null;

    private LazySingleton() {
        System.out.println("LazySingleton Instance created");
    };

    public static LazySingleton getInstance() {
        if (instance == null) {
            instance = new LazySingleton();
        }
        return instance;
    }
}

class Main {
    public static void main(String[] args) {
        System.out.println("Starting...");

        LazySingleton a = LazySingleton.getInstance();
        LazySingleton b = LazySingleton.getInstance();

        System.out.println(a.equals(b));
    }
}
