
import Movie ,{ GenreEl,MovieRatingEl}from "../m/Movie.mjs";
import { fillSelectWithOptions ,createChoiceWidget} from "../../lib/util.mjs";

const formEl = document.forms["Movie"],
      saveButton = formEl["commit"],
      selectMovieEl = formEl["selectMovie"]
    ,ratingSelEl= formEl["rating"],
    genreFieldsetEL = formEl.querySelector("fieldset[data-bind='genres']");
// load all movie records
Movie.retrieveAll();
// set up the movie selection list
fillSelectWithOptions( Movie.instances, selectMovieEl, "movieId", "title");
// when a movie is selected, populate the form with its data
selectMovieEl.addEventListener("change", function () {
  const movieKey = selectMovieEl.value;
  if (movieKey) {  // set form fields
    const movie = Movie.instances[movieKey];
    createChoiceWidget( ratingSelEl, "category",
        [movie.rating], "radio", MovieRatingEl.labels);
    createChoiceWidget( genreFieldsetEL, "genres",
        movie.movieGenre, "checkbox", GenreEl.labels);
    ["movieId","title"].forEach( function (p) {
      formEl[p].value = movie[p] ? movie[p] : "";
      // delete custom validation error message which may have been set before
      formEl[p].setCustomValidity("");
    });
  } else {
    formEl.reset();
  }
});

fillSelectWithOptions( ratingSelEl, MovieRatingEl.labels);
// add event listeners for responsive validation
formEl.title.addEventListener("input", function () {
  formEl.title.setCustomValidity(
      Movie.checkTitle( formEl.title.value).message);
});
/*
formEl.releaseDate.addEventListener("input", function () {
  formEl.releaseDate.setCustomValidity(
      Movie.checkReleaseDate( formEl.releaseDate.value).message);
});
*/
// mandatory value check
ratingSelEl.addEventListener("click", function () {
  formEl.rating[0].setCustomValidity(
      (!ratingSelEl.getAttribute("data-value")) ?
          "A rating must be selected!" : "" );
});
// mandatory value check
genreFieldsetEL.addEventListener("click", function () {
  const val = genreFieldsetEL.getAttribute("data-value");
  formEl.genres[0].setCustomValidity(
      (!val || Array.isArray(val) && val.length === 0) ?
          "At least one genre must be selected!" : "" );
});

// set an event handler for the submit/save button
saveButton.addEventListener("click", handleSaveButtonClickEvent);
// neutralize the submit event
formEl.addEventListener("submit", function (e) {
  e.preventDefault();
  formEl.reset();
});
// Set a handler for the event when the browser window/tab is closed
window.addEventListener("beforeunload", Movie.saveAll);

// event handler for the submit/save button
function handleSaveButtonClickEvent () {
  const formEl = document.forms['Movie'],
        selectMovieEl = formEl.selectMovie;
  const slots = { movieId: formEl.movieId.value,
    title: formEl.title.value,
    rating: ratingSelEl.getAttribute("data-value"),
    genres: JSON.parse(genreFieldsetEL.getAttribute("data-value"))
  };
  // set error messages in case of constraint violations
  formEl.title.setCustomValidity( Movie.checkTitle( slots.title).message);
  formEl.releaseDate.setCustomValidity( Movie.checkReleaseDate( slots.releaseDate).message);
  if (formEl.checkValidity()) {
    Movie.update( slots);
    // update the selection list option
    selectMovieEl.options[selectMovieEl.selectedIndex].text = slots.title;
  }
}
