// PART ONE

class Vehicle {
  constructor(make, model, year) {
    this.make = make;
    this.model = model;
    this.year = year;
  }
  honk() {
    return "Beep";
  }
  toString() {
    const { make, model, year } = this;
    return `The vehicle is a ${year} ${make} ${model}.`;
  }
}

let my1stVehicle = new Vehicle("Honda", "Monster Truck", 1999);
console.log(my1stVehicle.toString());

// PART TWO

class Car extends Vehicle {
  numWheels = 4;
}

let my2ndCar = new Car("Toyota", "Corolla", 2005);
console.log(my2ndCar.toString());
console.log(my2ndCar.honk());
console.log(my2ndCar.numWheels);

// PART THREE

class Motorcycle extends Vehicle {
  numWheels = 2;
  revEngine() {
    return "VROOM!!!";
  }
}

let myMotorcycle = new Motorcycle("Honda", "Nighthawk", 2000);
console.log(myMotorcycle.toString());
console.log(myMotorcycle.revEngine());

// PART FOUR

class Garage {
  constructor(cap) {
    this.capacity = cap;
    this.vehicles = [];
  }
  add(vehicle) {
    if (!(vehicle instanceof Vehicle)) {
      return "Only vehicles are allowed in here!";
    }
    if (this.vehicles.length === this.capacity) {
      return "Sorry, we're full.";
    }
    this.vehicles.push(vehicle);
    return "Vehicle added!";
  }
}

let myGarage = new Garage(2);
console.log(myGarage.vehicles);
console.log(myGarage.add(my2ndCar));
console.log(myGarage.vehicles);
console.log(myGarage.add("Taco"));

console.log(myGarage.add(myMotorcycle));
console.log(myGarage.vehicles);

console.log(myGarage.add(my1stVehicle));
