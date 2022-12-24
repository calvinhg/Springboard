const gameContainer = document.getElementById("game");

const EMOTES = [
  // "chocolate",
  // "hahaa",
  // "kappa",
  // "kermwut",
  // "madman",
  // "chocolate",
  // "hahaa",
  // "kappa",
  // "kermwut",
  // "madman"
  "aBlobDj", "aBlobParty", "aBoi", "aCoggers",
  "aCrabRaveEmpty", "aDab", "aEyesShake", "aJeb",
  "aParrotParty", "aPoggers", "aBlobDj", "aBlobParty",
  "aBoi", "aCoggers", "aCrabRaveEmpty", "aDab",
  "aEyesShake", "aJeb", "aParrotParty", "aPoggers"
];

// here is a helper function to shuffle an array
// it returns the same array with values shuffled
// it is based on an algorithm called Fisher Yates if you want to research more
function shuffle(array) {
  let counter = array.length;

  // While there are elements in the array
  while (counter > 0) {
    // Pick a random index
    let index = Math.floor(Math.random() * counter);

    // Decrease counter by 1
    counter--;

    // And swap the last element with it
    let temp = array[counter];
    array[counter] = array[index];
    array[index] = temp;
  }

  return array;
}

let shuffledEmotes = shuffle(EMOTES);

// this function loops over the array of emotes
// it creates a new div and gives it a class with the value of the color
// it also adds an event listener for a click for each card
function createDivsForEmotes(emoteArray) {
  let id = 1; // Set diff id for each div
  for (let emote of emoteArray) {
    // create new divs
    const FlipContainer = document.createElement("div");
    FlipContainer.classList.add("flip-container");

    const flipper = document.createElement("div");
    flipper.classList.add("flipper");

    const front = document.createElement("div");
    front.classList.add("front");

    const frontImg = document.createElement("img");
    frontImg.src = "emotes/aThink360.gif";

    const back = document.createElement("div");
    back.classList.add("back");

    const backImg = document.createElement("img");
    backImg.src = `emotes/${emote}.gif`;
    backImg.classList.add(emote)

    // set img id and increment it (one id per img)
    backImg.setAttribute("id", id++);

    // call a function handleCardClick when front div is clicked on
    front.addEventListener("click", handleCardClick);

    // append the divs to the element
    gameContainer.append(FlipContainer);
    FlipContainer.append(flipper);
    flipper.append(front);
    front.append(frontImg);
    flipper.append(back);
    back.append(backImg);    
  }
}

// placeholder is to check if it's the first or second click
let placeholder = document.createElement("div");
let previousCard = placeholder;
let waiting = false;
// TODO: Implement this function!
function handleCardClick(event) {
  // from front div > flipper (parent) > back (sibling) > backImg (first child)
  let currentCard = event.path[1].nextElementSibling.children[0];

  // First click on card, make sure it's not already matched
  if ((previousCard.classList[0] === undefined)
   && (currentCard.classList[1] != "matched")) {
    event.path[3].classList.toggle("flip");
    previousCard = currentCard;
  }

  // Second click on same card OR still waiting OR already matched
  else if (((previousCard.classList[0] === currentCard.classList[0])
        && (previousCard.id === currentCard.id))
        || (waiting === true) || (currentCard.classList[1] === "matched")) {
    // console.log(waiting);
    // console.log("samecard");
    return;
  }

  // Second click on diff card (no match)
  else if (previousCard.classList[0] != currentCard.classList[0]) {
    event.path[3].classList.toggle("flip");
    waiting = true;
    setTimeout(function () {
      // from backImg > back > flipper > flipper-container
      previousCard.parentElement.parentElement.parentElement.classList.toggle("flip");
      // same but simpler for current card
      event.path[3].classList.toggle("flip");
      previousCard = placeholder;
      // Won't let other cards to be flipped while two are visible
      waiting = false;
    }, 1000)
  }

  // Second click on match
  else if ((previousCard.classList[0] === currentCard.classList[0])
        && (previousCard.id != currentCard.id)) {
    // console.log("match")
    event.path[3].classList.toggle("flip");
    // Same as previous elif ^^^ except they're not flipped back
    previousCard.parentElement.parentElement.parentElement.classList.toggle("matched");
    currentCard.classList.toggle("matched");
    previousCard = placeholder;
  }
}

// when the DOM loads
createDivsForEmotes(shuffledEmotes);

/*(>.<)*/