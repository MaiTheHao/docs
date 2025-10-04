package creational_patterns.builder;

public class Main {
    public static void main(String[] args) {
        HouseBuilder builder = new HouseBuilder();
        House house = builder
            .setRoof("Tile Roof")
            .setFloor("Wooden Floor")
            .setWall("Brick Wall")
            .setYard("Large Yard")
            .setGarage("Two-car Garage")
            .build();

        System.out.println("House Details:");
        System.out.println("Roof: " + house.roof);
        System.out.println("Floor: " + house.floor);
        System.out.println("Wall: " + house.wall);
        System.out.println("Yard: " + house.yard);
        System.out.println("Garage: " + house.garage);
    }
}
