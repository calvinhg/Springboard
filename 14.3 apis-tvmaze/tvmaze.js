"use strict";

const $showsList = $("#shows-list");
const $episodesList = $("#episodes-list");
const $searchForm = $("#search-form");

/** Given a search term, search for tv shows that match that query.
 *
 *  Returns (promise) array of show objects: [show, show, ...].
 *    Each show object should contain exactly: {id, name, summary, image}
 */
async function searchShows(term) {
  // Make request to TVMaze search shows API
  const shows = await axios.get(
    `https://api.tvmaze.com/search/shows?q=${term}`
  );
  return shows.data;
}

/** Given list of shows, create markup for each and add to DOM */
function populateShows(shows) {
  $showsList.empty();

  for (let item of shows) {
    let { id, name, image, summary } = item.show;
    // Truncate long summaries
    if (summary.length > 333) {
      summary = summary.substring(0, 333) + "...";
    }
    // Replace empty images
    if (image === null) {
      image = { medium: "https://tinyurl.com/tv-missing" };
    }
    const $show = $(
      `<div data-show-id="${id}" class="show col-sm-6 col-md-4 col-lg-3 mb-4">
         <div class="card">
           <img 
              src="${image.medium}" 
              alt="${name}" 
              class="card-img-top mr-3">
           <div class="card-body">
             <h5 class="card-title text-primary">${name}</h5>
             <p class="card-text"><small>${summary}</small></p>
             <button 
               type="button"
               class="btn btn-outline-dark btn-sm EpButton" 
               data-toggle="modal" 
               data-target="#episodes-modal">
             Episodes
             </button>
           </div></div></div>`
    );

    $showsList.append($show);
  }
}

/** Handle search form submission: get shows from API and display.
 *    Hide episodes area (that only gets shown if they ask for episodes)
 */
async function searchForShowAndDisplay() {
  const term = $("#search-query").val();
  const shows = await searchShows(term);

  populateShows(shows);
}

$searchForm.on("submit", async function (evt) {
  evt.preventDefault();
  await searchForShowAndDisplay();
});

/** Given a show ID, get from API and return (promise) array of episodes:
 *      { id, name, season, number }
 */
async function getEpisodesOfShow(id) {
  // Make request to TVMaze episodes API
  const episodes = await axios.get(
    `https://api.tvmaze.com/shows/${id}/episodes`
  );
  return episodes.data;
}

/** Write a clear docstring for this function... */
function populateEpisodes(episodes) {
  // Clear old episodes (if any)
  $episodesList.empty();

  if (episodes.length === 0) {
    $("#episodes-list").append("<span>No episodes found!</span>");
  }

  for (let episode of episodes) {
    // Destructure object
    const { id, name, season, number } = episode;
    // Make new li
    const $episode = $(
      `<li data-episode-id="${id}">${name} (Season ${season}, number ${number})</li>)`
    );

    $("#episodes-list").append($episode);
  }
}

$showsList.on("click", ".EpButton", async (evt) => {
  const id = $(evt.target.closest(".show")).data("show-id");
  const episodes = await getEpisodesOfShow(id);
  populateEpisodes(episodes);
});
