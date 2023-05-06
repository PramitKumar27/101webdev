/**
 * @fileOverview  View methods for the use case "update Movie"
 * @author Gerd Wagner
 */
import Movie, { MovieRatingEL, GenreEL } from "../m/Movie.mjs";
import { fillSelectWithOptions, createChoiceWidget } from "../../lib/util.mjs";

const formEl = document.forms["Movie"], submitButton = formEl["commit"],
    selectMovieEl = formEl["selectMovie"],
    movieRatingFieldsetEl = formEl.querySelector("fieldset[data-bind='movieRating']"),
    genreFieldsetEl = formEl.querySelector("fieldset[data-bind='genre']");
// load all Movie records
Movie.retrieveAll();
// set up the Movie selection list
fillSelectWithOptions( selectMovieEl, Movie.instances, {displayProp:"title"});
// when a Movie is selected, populate the form with its data
selectMovieEl.addEventListener( "change", function () {
  const movieKey = selectMovieEl.value;
  if (movieKey) {
    const movie = Movie.instances[movieKey];
    formEl.movieId.value = movie.movieId;
    formEl.title.value = movie.title;
    // set up the publication forms selection list
    // set up the category radio button group
    createChoiceWidget( movieRatingFieldsetEl, "movieRating",
      [movie.category], "radio", MovieRatingEL.labels);
    // set up the publicationForms checkbox group
    createChoiceWidget( genreFieldsetEl, "genre",
      movie.genre, "checkbox", GenreEL.labels);
  } else {
    formEl.reset();
    
  }
});
// set up the Movie language selection list

// add event listeners for responsive validation
formEl.title.addEventListener("input", function () {
  formEl.title.setCustomValidity(
    Movie.checkTitle( formEl.title.value).message);
});
// simplified validation: check only mandatory value
// mandatory value check
movieRatingFieldsetEl.addEventListener("click", function () {
  formEl.movieRating[0].setCustomValidity(
    (!movieRatingFieldsetEl.getAttribute("data-value")) ?
      "A rating must be selected!" : "" );
});
// mandatory value check
genreFieldsetEl.addEventListener("click", function () {
  const val = genreFieldsetEl.getAttribute("data-value");
  formEl.genre[0].setCustomValidity(
    (!val || Array.isArray(val) && val.length === 0) ?
      "At least one genre must be selected!" : "" );
});
// Set an event handler for the submit/save button
submitButton.addEventListener("click", handleSubmitButtonClickEvent);
// neutralize the submit event
formEl.addEventListener("submit", function (e) {
  e.preventDefault();
  formEl.reset();
});
// Set a handler for the event when the browser window/tab is closed
window.addEventListener("beforeunload", Movie.saveAll);

/**
 * check data and invoke update
 */
function handleSubmitButtonClickEvent() {
  if (!MovieIdRef) return;
  const slots = { movieId: formEl.movieId.value,
    title: formEl.title.value,
    movieRating: movieRatingFieldsetEl.getAttribute("data-value"),
    genre: JSON.parse( genreFieldsetEl.getAttribute("data-value"))
  };
  // construct the list of selected otherAvailableLanguages
  // set error messages in case of constraint violations
  formEl.title.setCustomValidity( Movie.checkTitle( slots.title).message);
  // set the error message for category constraint violations on the first radio button
  formEl.movieRating[0].setCustomValidity(
      Movie.checkMovieRating( slots.movieRating).message);
  // set the error message for publicationForms constraint violations on the first checkbox
  formEl.genre[0].setCustomValidity(
      Movie.checkGenre( slots.genre).message);
  if (formEl.checkValidity()) {
    Movie.update( slots);
    // update the selection list option
    selectMovieEl.options[selectMovieEl.selectedIndex].text = slots.title;
  }
}
