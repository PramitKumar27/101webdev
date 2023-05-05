
import Movie,{GenreEl,MovieRatingEl} from "../m/Movie.mjs";
import {fillSelectWithOptions,createChoiceWidget} from "../../lib/util.mjs";

const formEl = document.forms["Movie"],
      saveButton = formEl["commit"],
    ratingSelEl= formEl["rating"],
    genreFieldsetEL = formEl.querySelector("fieldset[data-bind='genres']");
// load all movie records
Movie.retrieveAll();
fillSelectWithOptions( ratingSelEl, MovieRatingEl.labels);
createChoiceWidget( genreFieldsetEL, "category", [],
    "checkbox", GenreEl.labels, true);
// add event listeners for responsive validation
formEl.movieId.addEventListener("input", function () {formEl.movieId.setCustomValidity(
      Movie.checkMovieIdAsId( formEl.movieId.value).message);
});
formEl.title.addEventListener("input", function () {formEl.title.setCustomValidity(
      Movie.checkTitle( formEl.title.value).message);
});
/*
formEl.releaseDate.addEventListener("input", function () {formEl.releaseDate.setCustomValidity(
      Movie.checkReleaseDate( formEl.releaseDate.value).message);
});
*/
ratingSelEl.addEventListener("click", function () {
    formEl.rating[0].setCustomValidity(
        (!ratingSelEl.getAttribute("data-value")) ?
            "A rating must be selected!":"" );
});
// mandatory value check
genreFieldsetEL.addEventListener("click", function () {
    const val = genreFieldsetEL.getAttribute("data-value");
    formEl.genre[0].setCustomValidity(
        (!val || Array.isArray(val) && val.length === 0) ?
            "At least one genre must be selected!":"" );
});
// Set an event handler for the submit/save button
saveButton.addEventListener("click", function () {
  const slots = { movieId: formEl.movieId.value,
          title: formEl.title.value,
          rating: formEl.rating.value, genre: JSON.parse( genreFieldsetEL.getAttribute("data-value"))};
  // set error messages in case of constraint violations
  formEl.movieId.setCustomValidity( Movie.checkMovieIdAsId( slots.movieId).message);
  formEl.title.setCustomValidity( Movie.checkTitle( slots.title).message);
  /*formEl.releaseDate.setCustomValidity( Movie.checkReleaseDate( slots.releaseDate).message);*/
  formEl.rating.setCustomValidity(Movie.checkMovieRating(slots.rating).message);
  formEl.genre[0].setCustomValidity(Movie.checkGenresEL( slots.genre).message)
    // save the input data only if all the form fields are valid
  if (formEl.checkValidity()) Movie.add( slots);
});

// neutralize the submit event
formEl.addEventListener("submit", function (e) {
  e.preventDefault();
  formEl.reset();
});

// Set a handler for the event when the browser window/tab is closed
window.addEventListener("beforeunload", Movie.saveAll);
