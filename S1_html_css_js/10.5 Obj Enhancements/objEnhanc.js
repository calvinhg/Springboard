// Same keys and values
function createInstructorOLD(firstName, lastName) {
  return {
    firstName: firstName,
    lastName: lastName,
  };
}

// Same keys and values ES2015
/* Write an ES2015 Version */

const createInstructor = (firstName, lastName) => ({ firstName, lastName });

console.log("createInstructor:", createInstructor("bob", "smith"));

// Computed Property Names
var favoriteNumber = 42;
var instructorOLD1 = {
  firstName: "Colt",
};
instructorOLD1[favoriteNumber] = "That is my favorite!";

// Computed Property Names ES2015
/* Write an ES2015 Version */

const instructor1 = {
  firstName: "Colt",
  ["42"]: "That's my favorite!",
};
console.log("CPN:", instructor1);

// Object Methods
var instructorOLD2 = {
  firstName: "Colt",
  sayHi: function () {
    return "Hi!";
  },
  sayBye: function () {
    return this.firstName + " says bye!";
  },
};

// Object Methods ES2015
/* Write an ES2015 Version */

const instructor2 = {
  firstName: "Colt",
  sayHi() {
    return "Hi!";
  },
  sayBye() {
    return this.firstName + " says bye!";
  },
};
console.log("sayBye:", instructor2.sayBye());

// createAnimal function
// Write a function which generates an animal object. The function should accepts 3 arguments:

// // species: the species of animal (‘cat’, ‘dog’)
// // verb: a string used to name a function (‘bark’, ‘bleet’)
// // noise: a string to be printed when above function is called (‘woof’, ‘baaa’)
// Use one or more of the object enhancements we’ve covered.

const createAnimal = (species, verb, noise) => {
  return {
    species,
    [verb]() {
      return noise;
    },
  };
};

const d = createAnimal("dog", "bark", "Woooof!");
// {species: "dog", bark: ƒ}
console.log(d.bark()); //"Woooof!"

const s = createAnimal("sheep", "bleet", "BAAAAaaaa");
// {species: "sheep", bleet: ƒ}
console.log(s.bleet()); //"BAAAAaaaa"
