// Quick Question #1
// What does the following code return?

new Set([1, 1, 2, 2, 3, 4]);
// Returns a set containing 1, 2, 3 and 4 (no dupes)

// Quick Question #2
// What does the following code return?

[...new Set("referee")].join("");
// "ref":
// 1: Makes a set of "referee", so only keeps "r", "e", and "f"
// 2: Spreads the set into an array => ["r", "e", "f"]
// 3: Turns the array back into a string by joining the letters

// Quick Questions #3
// What does the Map m look like after running the following code?

let m = new Map();
m.set([1, 2, 3], true);
m.set([1, 2, 3], false);
// A map with two elements:
// 1: key = [1,2,3], value = true;
// 2: key = [1,2,3], value = false;
// The arrays don't have the same reference so both were added.

// hasDuplicate;
// Write a function called hasDuplicate which accepts an array and returns true or false if that array contains a duplicate

const hasDuplicate = (arr) => (arr.length === new Set(arr).size ? false : true);

hasDuplicate([1, 3, 2, 1]); // true
hasDuplicate([1, 5, -1, 4]); // false

// vowelCount
// Write a function called vowelCount which accepts a string and returns a map where the keys are numbers and the values are the count of the vowels in the string.

const vowelCount = (str) => {
  const vowels = new Map();
  // Iterate through lowercase chars of the string
  for (let ch of str.toLowerCase()) {
    // Only continue if ch is a vowel
    if ("aeiou".indexOf(ch) !== -1) {
      // If vowels map doesn't have the char as a key
      if (!vowels.has(ch)) {
        vowels.set(ch, 1);
      } else {
        // Set (key = ch, val = current val + 1)
        vowels.set(ch, vowels.get(ch) + 1);
      }
    }
  }
  return vowels;
};

vowelCount("awesome"); // Map { 'a' => 1, 'e' => 2, 'o' => 1 }
vowelCount("Colt"); // Map { 'o' => 1 }
