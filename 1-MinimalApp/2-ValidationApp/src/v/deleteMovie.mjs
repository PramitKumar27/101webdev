/**
 * @fileOverview  Contains various view functions for the use case deleteMovie
 * @author Mircea Diaconescu
 * @author Gerd Wagner
 */
import Movie from "../m/Movie.mjs";
import { fillSelectWithOptions } from "../../lib/util.mjs";

const formEl = document.forms['Movie'],
    deleteButton = formEl.commit,
    selectMovieEl = formEl.selectMovie;
// load all Movie records
Movie.retrieveAll();
// set up the Movie selection list
fillSelectWithOptions( Movie.instances, selectMovieEl,"movieId", "title");
// Set an event handler for the submit/delete button
deleteButton.addEventListener("click", function () {
  const isbn = selectMovieEl.value;
  if (isbn) {
    Movie.destroy( isbn);
    // remove deleted Movie from select options
    selectMovieEl.remove( selectMovieEl.selectedIndex);
  }
});
// Set a handler for the event when the browser window/tab is closed
window.addEventListener("beforeunload", Movie.saveAll);
