/** PART 2 */

const cardApiUrl = "https://deckofcardsapi.com/api/deck";

function getCardInfo(resp) {
  const card = resp.data.cards[0];
  return card.value.toLowerCase() + " of " + card.suit.toLowerCase();
}

// Question 1
$("#q1").on("click", async () => {
  try {
    const resp = await axios.get(cardApiUrl + "/new/draw");
    const cardInfo = getCardInfo(resp);
    console.log(cardInfo);
    $("#q1-resp").text(cardInfo);
  } catch (err) {
    console.log(err);
  }
});

// Question 2
$("#q2").on("click", async () => {
  const cards = [];

  const resp1 = await axios.get(cardApiUrl + "/new/draw");
  cards.push(getCardInfo(resp1));
  const deckId = resp1.data.deck_id;

  const resp2 = await axios.get(`${cardApiUrl}/${deckId}/draw`);
  cards.push(getCardInfo(resp2));

  console.log(cards[0], "and", cards[1]);
  $("#q2-resp").text(cards[0] + " and " + cards[1]);
});

// Question 3
let deckId = "";

$(document).ready(async () => {
  const resp = await axios.get(cardApiUrl + "/new/shuffle");
  deckId = resp.data.deck_id;
});

$("#q3").on("click", async () => {
  const resp = await axios.get(`${cardApiUrl}/${deckId}/draw`);

  const cardUrl = resp.data.cards[0].image;
  const cardInfo = getCardInfo(resp);

  $("#q3-resp").append(`<img src="${cardUrl}" alt="${cardInfo}">`);
  // Remove button if there are no more left
  if (resp.data.remaining === 0) $("#q3").remove();
});
