/*
Write a function called hasOddNumber which accepts an array and returns true if the array contains at least one odd number, otherwise it returns false.

Examples:
  hasOddNumber([1,2,2,2,2,2,4]) // true
  hasOddNumber([2,2,2,2,2,4]) // false
*/

function hasOddNumber(arr) {
  return arr.some((num)=> {return num%2 === 1});
}

/*
Write a function called hasAZero which accepts a number and returns true if that number contains at least one zero. Otherwise, the function should return false

Examples:
  hasAZero(3332123213101232321) // true
  hasAZero(1212121) // false
*/

function hasAZero(num) {
  // Convert num to a string then to an array
  const arrOfNum = Array.from(num.toString());
  // If any digit is 0, return true
  return arrOfNum.some((digit)=> {return digit === "0"});
}

/*
Write a function called hasOnlyOddNumbers which accepts an array and returns true if every single number in the array is odd. If any of the values in the array are not odd, the function should return false. 

Examples:
  hasOnlyOddNumbers([1,3,5,7]) // true
  hasOnlyOddNumbers([1,2,3,5,7]) // false
*/

function hasOnlyOddNumbers(arr) {
  // If all nums are divisible by 2, they are odd, return true
  return arr.every((num)=> {return num%2 === 1});
}

/*
Write a function called hasNoDuplicates which accepts an array and returns true if there are no duplicate values (more than one element in the array that has the same value as another). If there are any duplicates, the function should return false.

Examples:
  hasNoDuplicates([1,2,3,1]) // false
  hasNoDuplicates([1,2,3]) // true
*/

function hasNoDuplicates(arr) {
  const arr2 = []; // Make empty array to fill
  // If any returns true, then there's a dupe
  const hasDupes = arr.some((num)=> {
    // If arr2 contains num, it's a dupe, return true
    if (arr2.includes(num)) {
      return true;
    }
    // If arr2 doesn't contain num, add num to arr2 and continue
    arr2.push(num);
    return false;
  })
  return !hasDupes;
}

/*
Write a function called hasCertainKey which accepts an array of objects and a key, and returns true if every single object in the array contains that key. Otherwise it should return false.

Examples:
  var arr = [
    {title: "Instructor", first: 'Elie', last:"Schoppik"}, 
    {title: "Instructor", first: 'Tim', last:"Garcia", isCatOwner: true}, 
    {title: "Instructor", first: 'Matt', last:"Lane"}, 
    {title: "Instructor", first: 'Colt', last:"Steele", isCatOwner: true}
  ]
  
  hasCertainKey(arr,'first') // true
  hasCertainKey(arr,'isCatOwner') // false
*/

function hasCertainKey(arr, key) {
  // If all the obj[keys] are not undefined, return true
  return arr.every((obj)=> {return obj[key] !== undefined});
}

/*
Write a function called hasCertainValue which accepts an array of objects and a key, and a value, and returns true if every single object in the array contains that value for the specific key. Otherwise it should return false.

Examples:
  var arr = [
    {title: "Instructor", first: 'Elie', last:"Schoppik"}, 
    {title: "Instructor", first: 'Tim', last:"Garcia", isCatOwner: true}, 
    {title: "Instructor", first: 'Matt', last:"Lane"}, 
    {title: "Instructor", first: 'Colt', last:"Steele", isCatOwner: true}
  ]
  
  hasCertainValue(arr,'title','Instructor') // true
  hasCertainValue(arr,'first','Elie') // false
  
*/

function hasCertainValue(arr, key, searchValue) {
  // If all the obj[keys] are whats searched for, return true
  return arr.every((obj)=> {return obj[key] === searchValue});
}
