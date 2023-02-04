const BASE_URL = "/api/cupcakes";
const $cupCards = $("#cupcake-cards");

$(window).on("load", async () => {
  const resp = await axios.get(BASE_URL);
  const cupcakes = resp.data.cupcakes;
  console.log(cupcakes);

  for (cupc of cupcakes) {
    if (cupc.frosting === null) cupc.frosting = "no";
    $cupCards.append(makeCard(cupc));
  }
});

function makeCard(cupc) {
  const $column = $(`
    <div class='col-6 col-md-4 col-lg-3 col-xl-2'
    data-id='${cupc.id}'></div>
  `);
  const $card = $(`
    <div class='card'><img src='${cupc.image}'
    class='card-img-top' alt='cupcake_${cupc.id}'></div>
  `);
  const $cardBody = $(`
    <div class='card-body'><h6 class='card-title'>
    ${cupc.flavor} with ${cupc.frosting} frosting</h6></div>
  `);
  const $details = $(`
    <ul class='list-group list-group-flush'>
      <li class='list-group-item'>Size: ${cupc.size}</li>
      <li class='list-group-item'>Rating: ${cupc.rating}/10</li>
  `);
  return $column.append($card.append($cardBody).append($details));
}
