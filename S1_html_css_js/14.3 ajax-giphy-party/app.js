console.log("Let's get this party started!");

$("#removeBtn").on("click", (evt) => {
  evt.preventDefault();

  for (let gif of $("#gifs").children()) {
    gif.remove();
  }
});

$("#searchBtn").on("click", (evt) => {
  evt.preventDefault();

  // Get tag to search with
  const searchTag = $("#searchInput").val();
  $("#searchInput").val(""); // Empty form

  addGif(searchTag);
});

// Gets new gif and appends to #gifs
const addGif = async (tag) => {
  try {
    const api_key = "MhAodEJIJxQMxW9XqxKjyXfNYdLoOIym";
    const params = { params: { tag, api_key } };
    const data = await axios.get(
      "https://api.giphy.com/v1/gifs/random",
      params
    );
    // Downsized image to fit better
    const url = data.data.data.images.downsized.url;

    // Make new img el with url found from data
    const newGif = $("<img>")
      .addClass("img-fluid")
      .attr({ width: "100%", src: url });
    // Make new column el and put image in it
    const newCol = $("<div>").addClass("col-4 text-center p-1").append(newGif);
    // Append col to #gifs
    $("#gifs").append(newCol);
  } catch (error) {
    alert("Gif not found!");
    console.log(error);
  }
};
