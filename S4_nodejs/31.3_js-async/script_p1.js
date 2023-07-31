/** PART 1 */

const numApiUrl = "http://numbersapi.com/";

// Question 1
$("#q1").on("submit", async (evt) => {
  evt.preventDefault();
  // Get num from form
  const favNum = $("#fav-num").val();
  try {
    const resp = await axios.get(`${numApiUrl}${favNum}?json`);
    $("#q1-resp").text(resp.data.text);
  } catch (err) {
    $("#q1-resp").text(err);
  }
});

// Question 2
$("#q2").on("submit", async (evt) => {
  evt.preventDefault();
  // Get both numbers
  const num1 = Number($("#num-range-1").val());
  const num2 = Number($("#num-range-2").val());

  try {
    const resp = await axios.get(`${numApiUrl}${num1}..${num2}?json`);
    // Empty to fill with facts
    let facts = "";
    for (let num = num1; num <= num2; num++) {
      // Add fact and break for new line ._.
      facts += resp.data[num] + "<br>";
    }
    if (!facts) facts = "Please enter a valid range.";
    $("#q2-resp").html(facts); // this might be cheating
  } catch (err) {
    $("#q2-resp").text(err);
  }
});

// Question 3
$("#q3").on("submit", async (evt) => {
  evt.preventDefault();
  const favNum = $("#fav-num2").val();
  const fourFactProms = [];

  // Fill array with promises
  for (let i = 1; i < 5; i++) {
    fourFactProms.push(axios.get(`${numApiUrl}${favNum}?json`));
  }

  let facts = "";
  const fourFacts = await Promise.all(fourFactProms);

  fourFacts.forEach((resp) => (facts += resp.data.text + "<br>"));
  $("#q3-resp").html(facts);
});
