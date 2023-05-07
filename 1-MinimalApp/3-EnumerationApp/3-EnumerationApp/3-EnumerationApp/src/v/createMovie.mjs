/**
 * @fileOverview  View methods for the use case "create book"
 * @author Gerd Wagner
 */
import Movie, { MovieRatingEL, GenreEL } from "../m/Movie.mjs";
import { fillSelectWithOptions, createChoiceWidget } from "../../lib/util.mjs";

const formEl = document.forms["Movie"],
  movieRatingFieldsetEl = formEl.querySelector("fieldset[data-bind='movieRating']"),
  genreFieldsetEl = formEl.querySelector("fieldset[data-bind='genre']"),
  saveButton = formEl["commit"];
// load all book records
Movie.retrieveAll();
// set up the originalLanguage selection list

// set up the otherAvailableLanguages selection list

// set up the category radio button group
createChoiceWidget( movieRatingFieldsetEl, "movieRating", [],
    "radio", MovieRatingEL.labels, true);
// set up the publicationForms checkbox group
createChoiceWidget( genreFieldsetEl, "genre", [],
    "checkbox", GenreEL.labels);
// add event listeners for responsive validation
formEl.movieId.addEventListener("input", function () {
  formEl.movieId.setCustomValidity( Movie.checkMovieIdAsId( formEl.movieId.value).message);
});
formEl.title.addEventListener("input", function () {
  formEl.title.setCustomValidity( Movie.checkTitle( formEl.title.value).message);
});

// mandatory value check
movieRatingFieldsetEl.addEventListener("click", function () {
  formEl.movieRating[0].setCustomValidity(
    (!movieRatingFieldsetEl.getAttribute("data-value")) ?
      "A category must be selected!":"" );
});
// mandatory value check
genreFieldsetEl.addEventListener("click", function () {
  const val = genreFieldsetEl.getAttribute("data-value");
  formEl.genre[0].setCustomValidity(
    (!val || Array.isArray(val) && val.length === 0) ?
      "At least one genre must be selected!":"" );
});
// set an event handler for the submit/save button
saveButton.addEventListener("click", handleSaveButtonClickEvent);
// neutralize the submit event
formEl.addEventListener( 'submit', function (e) {
  e.preventDefault();
  formEl.reset();
});
// set a handler for the event when the browser window/tab is closed
window.addEventListener("beforeunload", Movie.saveAll);

// event handler for the submit/save button
function handleSaveButtonClickEvent() {
  const slots = { movieId: formEl.movieId.value,
    title: formEl.title.value,
    movieRating: movieRatingFieldsetEl.getAttribute("data-value"),
    genre: JSON.parse( genreFieldsetEl.getAttribute("data-value"))
  };
  // construct the list of selected otherAvailableLanguages

  // set error messages in case of constraint violations
  formEl.movieId.setCustomValidity( Movie.checkMovieIdAsId( slots.movieId).message);
  formEl.title.setCustomValidity( Movie.checkTitle( slots.title).message);
  formEl.movieRating[0].setCustomValidity(
      Movie.checkMovieRating( slots.movieRating).message);
  formEl.genre[0].setCustomValidity(
      Movie.checkGenre( slots.genre).message);
  // save the input data only if all form fields are valid
  if (formEl.checkValidity()) Movie.add( slots);
}
