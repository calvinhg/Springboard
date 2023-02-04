const BASE_URL = "/api/cupcakes";
const $cupCards = $("#cupcake-cards");
const $postSubmit = $("#post-submit");
const $alert = $("#alert-msg");

/** Make card ready to be appended to list of cupcakes */
function makeCard(cupc) {
  if (cupc.frosting === null) cupc.frosting = "no";

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

/** Populate page with cupcakes on load */
$(window).on("load", async () => {
  // Get all cupcakes
  const resp = await axios.get(BASE_URL);
  const cupcakes = resp.data.cupcakes;

  // Append cupcakes to page
  for (let cupcake of cupcakes) {
    $cupCards.append(makeCard(cupcake));
  }
});

/** Handle form submissions */
$postSubmit.on("click", async (e) => {
  e.preventDefault();

  // Get data from form
  const data = {
    flavor: $("#flavor").val(),
    frosting: $("#frosting").val(),
    size: $("#size").val(),
    rating: $("#rating").val(),
    image: $("#image").val(),
  };

  let resp;
  try {
    resp = await axios.post(BASE_URL, data);
  } catch (err) {
    showError(err.response.data.error.err_details);
    return;
  }

  // Add cupcake to page and empty form
  $cupCards.append(makeCard(resp.data.cupcake));
  $("input").val("");
});

/** Show error in alert element then hide after 5s */
function showError(msg) {
  $alert.text(msg).parent().toggleClass("show");
  setTimeout(() => {
    $alert.parent().toggleClass("show");
  }, 5000);
}

/** Scroll to bottom of form when opening it */
$("#cupcake-form").on("shown.bs.collapse", () =>
  window.scrollTo(0, window.screenX)
);
