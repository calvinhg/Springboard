const $guess = $("#guess");
const $words = $("#words");

$guess.on("keydown", async (evt) => {
  // Only run if Enter pressed
  if (evt.key === "Enter") {
    // Do nothing if less than 3 letters
    if ($guess.val().length < 3) return;

    // Save guess and empty input form
    const guess = $guess.val().toLowerCase();
    $guess.val("");

    // Get response from server, save to variables
    const resp = await axios.post("/guess", { guess });
    const { result, score, words_found: words } = resp.data;

    // Create and show alert message
    const msg = getMessage(result, guess);
    showMessage(msg, guess);

    // Add words to word list and update score
    if (result === "ok") {
      updateWords(words, guess);
      $("#score").text(score);
    }
  }
});

/** Create message body and type (for alert color) */
function getMessage(result, guess) {
  if (result === "not-on-board") {
    return { text: `"${guess}" isn't on the board!`, type: "danger" };
  }
  if (result === "not-word") {
    return { text: `"${guess}" isn't a word!`, type: "danger" };
  }
  if (result === "already-found") {
    return { text: `You already found "${guess}"!`, type: "warning" };
  }
  if (result === "ok") {
    return { text: `Nice! You found "${guess}"!`, type: "success" };
  }
}

/** Create jquery element and add to messages element,
 * then fade it out after 3 seconds */
function showMessage(msg, guess) {
  const $message = $(`<div id="guess-${guess}">`)
    .addClass(`alert alert-${msg.type} fade show`)
    .text(`${msg.text}`);
  $("#messages").append($message);

  setTimeout(() => {
    $(`#guess-${guess}`).alert("close");
  }, 3000);
}

/** Add words to list of found words. If no words yet,
 * clear element and make badge with number of words.
 */
function updateWords(words, guess) {
  if (words.length === 1) {
    $words
      .text("You found: ")
      .append(
        "<span id='num-words' class='badge badge-secondary'>1 word</span><hr>"
      );
  }
  // Add a badge for every new word
  $words.append(`<span class="badge badge-light">${guess}</span> `);
  // Change num-words found
  $("#num-words").text(`${words.length} words`);
}

/** When button clicked, show the board, start the timer,
 * and stop the game when it ends.
 */
$("#start").on("click", () => {
  const time = 59;
  const intervalID = startGame(time);

  setTimeout(() => {
    stopGame(intervalID);
  }, (time + 1) * 1000);
});

/** Hide start button, show board and guess input, and focus on it.
 *
 * Start timer and return its interval id  so it can be stopped.
 */
function startGame(time) {
  // Only two elements hidden are the board and the input
  $(".d-none").toggleClass("d-none");
  $("#start").toggleClass("d-none").text("Go again!");
  $guess.focus();

  return setInterval(() => {
    $("#timer").text(time-- + "s");
  }, 1000);
}

/** Show button, hide board and input and stop the timer.
 *
 * Post stats to server (already saved in the server so no
 * need to pass them.)
 */
function stopGame(intervalID) {
  $("#start").toggleClass("d-none");
  $("table").toggleClass("d-none");
  $(".input-group").toggleClass("d-none");
  clearInterval(intervalID);

  axios.post("/stats");
}
