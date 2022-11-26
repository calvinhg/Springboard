// Given this function:
function filterOutOdds() {
  var nums = Array.prototype.slice.call(arguments);
  return nums.filter(function (num) {
    return num % 2 === 0;
  });
}
// Refactor it to use the rest operator & an arrow function:
/* Write an ES2015 Version */
const filterOdds = (...nums) => nums.filter((num) => num % 2 === 0);

// findMin
// Write a function called findMin that accepts a variable number of arguments and returns the smallest argument.
// Make sure to do this using the rest and spread operator.

const findMin = (...nums) => Math.min(...nums);

console.log(findMin(1, 4, 12, -3)); // -3
console.log(findMin(1, -1)); // -1
console.log(findMin(3, 1)); // 1

// mergeObjects
// Write a function called mergeObjects that accepts two objects and returns a new object which contains all the keys and values of the first object and second object.

const mergeObjects = (obj1, obj2) => ({ ...obj1, ...obj2 });

mergeObjects({ a: 1, b: 2 }, { c: 3, d: 4 }); // {a:1, b:2, c:3, d:4}

// doubleAndReturnArgs
// Write a function called doubleAndReturnArgs which accepts an array and a variable number of arguments. The function should return a new array with the original array values and all of additional arguments doubled.

const doubleAndReturnArgs = (arr, ...nums) => [
  ...arr,
  ...nums.map((num) => num * 2),
];

console.log(doubleAndReturnArgs([1, 2, 3], 4, 4)); // [1,2,3,8,8]
console.log(doubleAndReturnArgs([2], 10, 4)); // [2, 20, 8]

// Slice and Dice!
// For this section, write the following functions using rest, spread and refactor these functions to be arrow functions!
// Make sure that you are always returning a new array or object and not modifying the existing inputs.

/** remove a random element in the items array
and return a new array without that item. */

const removeRandom = (...items) => {
  const randIndex = Math.floor(Math.random() * items.length);
  return items.filter((item, id) => (id !== randIndex ? true : false));
};

console.log(
  "removeRandom:",
  removeRandom(1, 2, 3, 4, 56, 8, 4, 1, 65, 6, 7, 53, 7)
);

/** Return a new array with every item in array1 and array2. */

const extend = (array1, array2) => [...array1, ...array2];

console.log("extend:", extend([4, 4, 8, 3], [3, "afa", true]));

/** Return a new object with all the keys and values
from obj and a new key/value pair */

const addKeyVal = (obj, key, val) => ({ ...obj, [key]: val });

let guy = { name: "johnny", age: 13 };
console.log("addKeyVal:", addKeyVal(guy, "grade", 10));

/** Return a new object with a key removed. */

const removeKey = (obj, key) => {
  const newObj = { ...obj };
  delete newObj[key];
  return newObj;
};

console.log("removeKey:", removeKey(guy, "age"));

/** Combine two objects and return a new object. */

const combine = (obj1, obj2) => ({ ...obj1, ...obj2 });

let favs = { band: "muse", food: "pizza" };
console.log("combine:", combine(guy, favs));

/** Return a new object with a modified key and value. */

const update = (obj, key, val) => ({ ...obj, [key]: val });

console.log("update:", update(favs, "food", "turkey"));
