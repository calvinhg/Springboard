// Object Destructuring 1
// What does the following code return/print?

let facts = { numPlanets: 8, yearNeptuneDiscovered: 1846 };
let { numPlanets, yearNeptuneDiscovered } = facts;

console.log(numPlanets);
// Prints 8
console.log(yearNeptuneDiscovered);
// Prints 1846

// Object Destructuring 2
// What does the following code return/print?

let planetFacts = {
  numPlanets: 8,
  yearNeptuneDiscovered: 1846,
  yearMarsDiscovered: 1659,
};

let { numPlanets: numP2, ...discoveryYears } = planetFacts;
console.log(discoveryYears);
// Prints an object identical to planetFacts except it doesn't contain numPlanets

// Object Destructuring 3
// What does the following code return/print?

function getUserData({ firstName, favoriteColor = "green" }) {
  return `Your name is ${firstName} and you like ${favoriteColor}`;
}

getUserData({ firstName: "Alejandro", favoriteColor: "purple" });
// "Your name is Alejandro and you like purple"
getUserData({ firstName: "Melissa" });
// "Your name is Melissa and you like green"
getUserData({});
// "Your name is undefined and you like green"

// Array Destructuring 1
// What does the following code return/print?

let [first, second, third] = ["Maya", "Marisa", "Chi"];

console.log(first); // Maya
console.log(second); // Marisa
console.log(third); // Chi

// Array Destructuring 2
// What does the following code return/print?

let [raindrops, whiskers, ...aFewOfMyFavoriteThings] = [
  "Raindrops on roses",
  "whiskers on kittens",
  "Bright copper kettles",
  "warm woolen mittens",
  "Brown paper packages tied up with strings",
];

console.log(raindrops); // "Raindrops on roses"
console.log(whiskers); // "whiskers on kittens"
console.log(aFewOfMyFavoriteThings);
// An array containing the last three strings of the previous array

// Array Destructuring 3
// What does the following code return/print?

let numbers = [10, 20, 30];
[numbers[1], numbers[2]] = [numbers[2], numbers[1]];

console.log(numbers); // [10, 30, 20]

// ES2015 Refactoring
// In this exercise, you’ll refactor some ES5 code into ES2015.

// ES5 Assigning Variables to Object Properties
var obj1 = {
  numbers: {
    a: 1,
    b: 2,
  },
};
var a1 = obj1.numbers.a;
var b1 = obj1.numbers.b;

// ES2015 Object Destructuring
/* Write an ES2015 Version */

const obj = {
  numbers: {
    a: 1,
    b: 2,
  },
};
const {
  numbers: { a, b },
} = obj;
console.log("numbers:", a, b);

// ES5 Array Swap
var arr = [1, 2];
var temp = arr[0];
arr[0] = arr[1];
arr[1] = temp;

// ES2015 One-Line Array Swap with Destructuring
/* Write an ES2015 Version */

const array = [1, 3];
[array[0], array[1]] = [array[1], array[0]];
console.log("Array swap:", array);

// raceResults()
// Write a function called raceResults which accepts a single array argument. It should return an object with the keys first, second, third, and rest.

// - first: the first element in the array
// - second: the second element in the array
// - third: the third element in the array
// - rest: all other elements in the array

// Write a one line function to make this work using
// - An arrow function
// - Destructuring
// - ‘Enhanced’ object assignment (same key/value shortcut)

const raceResults = ([first, second, third, ...rest]) => ({
  first,
  second,
  third,
  rest,
});

console.log(raceResults(["Tom", "Margaret", "Allison", "David", "Pierre"]));

/*
  {
    first: "Tom",
    second: "Margaret",
    third: "Allison",
    rest: ["David", "Pierre"]
  }
*/
