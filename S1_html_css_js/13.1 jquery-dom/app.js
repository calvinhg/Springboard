// PART ONE

// Q1
$(function () {
  console.log("Let's get ready to party with jQuery!");
});

// Q2
$("article img").addClass("image-center");

// Q3
$("p:last-of-type").remove();

//Q4
$("h1").css("font-size", Math.floor(Math.random() * 101));

//Q5
$("ol").append("<li>Tasty puppy! Click on it to eat it.</li>");

//Q6
$("aside")
  .empty()
  .append(
    "<p>This list never existed, I don't know why you're being so confrontational.</p>"
  );

//Q7
$(".form-control").on("change", function () {
  const red = $("#red").val();
  const green = $("#green").val();
  const blue = $("#blue").val();
  $("body")
    // .css("background-color", `rgb(${red}, ${green}, ${blue})`)
    // .css("color", `rgb(${255 - red}, ${255 - green}, ${255 - blue})`);
    .css({
      "background-color": `rgb(${red}, ${green}, ${blue})`,
      color: `rgb(${255 - red}, ${255 - green}, ${255 - blue})`,
    });
});

//Q8
$("img").on("click", function () {
  $(this.remove());
});

// PART TWO

const form = $("<form>")
  .append("<p>Movie Title <input type='text' id='movTitle'/></p>")
  .append(
    "<p>Movie Rating <input type='number' id='movRating' min='0' max='10'/></p>"
  )
  .append("<p><input type='submit' id='movSubmit'/></p>");

const movList = $("<table><thead><tr></thead><tbody>");

$(".container").append(form, movList);

$("tr")
  .append("<th>Movie Title</th>")
  .append("<th>Rating</th>")
  .append("<th class='remove'>");

$("form").on("submit", function (evt) {
  evt.preventDefault();

  const movTitle = $("#movTitle").val();
  const movRating = $("#movRating").val();

  if (movTitle.length < 3 || movRating === "") {
    alert("Please fill the form!");
    return;
  }

  const newRow = $("<tr>")
    .append(`<td>${movTitle}</td>`)
    .append(`<td>${movRating}</td>`)
    .append("<td class='remove'>X</td>")

    .on("click", ".remove", function () {
      $(this).parent().remove();
    });

  $("tbody").append(newRow);
});
