/** PART 2 */

const cardApiUrl = "https://deckofcardsapi.com/api/deck";

function getCardInfo(resp) {
  const card = resp.data.cards[0];
  return card.value.toLowerCase() + " of " + card.suit.toLowerCase();
}

// Question 1
$("#q1").on("click", () => {
  axios
    .get(cardApiUrl + "/new/draw")
    .then((resp) => {
      const cardInfo = getCardInfo(resp);
      console.log(cardInfo);
      $("#q1-resp").text(cardInfo);
    })
    .catch((err) => console.log(err));
});

// Question 2
$("#q2").on("click", () => {
  const cards = [];
  axios
    .get(cardApiUrl + "/new/draw")
    .then((resp) => {
      cards.push(getCardInfo(resp));
      return axios.get(`${cardApiUrl}/${resp.data.deck_id}/draw`);
    })
    .then((resp) => {
      cards.push(getCardInfo(resp));
      console.log(cards[0], "and", cards[1]);
      $("#q2-resp").text(cards[0] + " and " + cards[1]);
    })
    .catch((err) => console.log(err));
});

// Question 3
let deck_id = "";

$(document).ready(() => {
  axios
    .get(cardApiUrl + "/new/shuffle")
    .then((resp) => (deck_id = resp.data.deck_id));
});

$("#q3").on("click", () => {
  axios.get(`${cardApiUrl}/${deck_id}/draw`).then((resp) => {
    const cardUrl = resp.data.cards[0].image;
    const cardInfo = getCardInfo(resp);
    $("#q3-resp").append(`<img src="${cardUrl}" alt="${cardInfo}">`);
    // Remove button if there are no more left
    if (resp.data.remaining === 0) $("#q3").remove();
  });
});
