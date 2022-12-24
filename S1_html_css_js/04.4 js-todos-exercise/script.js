// Get needed variables from DOM
const newTodoForm = document.querySelector("#addNew");
const input = document.querySelector("#newTodo");
const todoList = document.querySelector("#todoList");

// Create todoID counter on initial page load
if (!localStorage.todoID){
  localStorage.setItem("todoID", 0);
}

function addTodo(input, strike, id) {

  // Make new li, append it to the list
  let newTodo = document.createElement("li");
  newTodo.innerText = input;
  newTodo.dataset.id = id;
  todoList.append(newTodo);

  // Check if the button or strikethrough is wanted
  if (!strike) {
    // Add buttons after the li
    let newDone = document.createElement("button");
    newDone.innerText = "Done!";
    newTodo.append(newDone);
  }
  // Or add strikethrough
  else {
    newTodo.classList.add("done");
  }
  
  // Make remove button
  let newRemove = document.createElement("button");
  newRemove.innerText = "Remove";
  newTodo.append(newRemove);
}

// Create event that adds new todo
newTodoForm.addEventListener("submit", function(e) {
  e.preventDefault();

  // Add new item to localStorage
  localStorage.setItem(localStorage.todoID, JSON.stringify([input.value, false]));

  // Call fn to create new todo
  addTodo(input.value, false, localStorage.todoID);

  input.value = ""; // Empty the form
  localStorage.todoID++;  // Increment counter
})

// Create one event that listens to all the buttons clicked using event delegation
todoList.addEventListener("click", function (e) {
  // Find ID and text of the todo in the localStorage
  let currentID = parseInt(e.path[1].dataset.id);
  let currentTodo = JSON.parse(localStorage.getItem(currentID))[0];

  // If first button clicked, remove the button and strikethrough the text
  if (e.path[0].innerText === "Done!") {
    e.path[0].remove();
    e.path[1].classList.add("done"); // class "done" adds strikethrough

    // Change second value in localStorage to true for strikethrough
    localStorage.setItem(currentID, JSON.stringify([currentTodo, true]))
  } 
  // If second button clicked, remove the whole li
  else if (e.path[0].innerText === "Remove") {
    e.path[1].remove();

    // Remove todo from localStorage too
    localStorage.removeItem(currentID);
  }
})

// Recreate list when page loads
window.addEventListener("load", function(e) {

  // Iterate as many times as localStorage has IDs
  for (let id = 0; id < localStorage.todoID; id++) {

    // Only create new todos for elements that exist
    if (localStorage.getItem(id) != null) {
      let todo = JSON.parse(localStorage.getItem(id));
      addTodo(todo[0], todo[1], id);
    }
  }

  // Reset todoID counter if localStorage is empty
  if (localStorage.length === 1) {
    localStorage.todoID = 0;
  }
})