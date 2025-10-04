package creational_patterns.builder;

public class HouseBuilder {
    private House house;

    public HouseBuilder() {
        house = new House();
    }

    public HouseBuilder setRoof(String roof) {
        house.roof = roof;
        return this;
    }

    public HouseBuilder setFloor(String floor) {
        house.floor = floor;
        return this;
    }

    public HouseBuilder setWall(String wall) {
        house.wall = wall;
        return this;
    }

    public HouseBuilder setYard(String yard) {
        house.yard = yard;
        return this;
    }

    public HouseBuilder setGarage(String garage) {
        house.garage = garage;
        return this;
    }

    public House build() {
        return house;
    }
}
