// Select the section with an id of container without using querySelector.
const containerById = document.getElementById("container");
// console.log(containerById);

// Select the section with an id of container using querySelector.
const containerByQS = document.querySelector("#container");
// console.log(containerByQS);

// Select all of the list items with a class of “second”.
const seconds = document.querySelectorAll(".second");
// console.log(seconds);

// Select a list item with a class of third, but only the list item inside of the ol tag.
const thirdOfOl = document.querySelector("ol .third");
// console.log(thirdOfOl);

// Give the section with an id of container the text “Hello!”.
const hello = document.createElement("p");
hello.innerText = "Hello!";
containerByQS.prepend(hello);

// Add the class main to the div with a class of footer.
const footer = document.querySelector(".footer");
footer.classList.add("main");

// Remove the class main on the div with a class of footer.
footer.classList.remove("main");

// Create a new li element.
const newLi = document.createElement("li");

// Give the li the text “four”.
newLi.innerText = "four";

// Append the li to the ul element.
const ul = document.querySelector("ul");
ul.append(newLi);

// Loop over all of the lis inside the ol tag and give them a background color of “green”.
const lis = thirdOfOl.parentElement.children;
for (let li of lis) {
  li.style.backgroundColor = "green";
};

// Remove the div with a class of footer
footer.remove();