/**
 * @fileOverview  Contains various view functions for the use case listMovies
 * @author Gerd Wagner
 */
import Movie from "../m/Movie2.mjs";

const tableBodyEl = document.querySelector("table#movies>tbody");
// retrieve all Movie records
Movie.retrieveAll();
// list all Movie records
for (let key of Object.keys( Movie.instances)) {
  const movie = Movie.instances[key];
  const row = tableBodyEl.insertRow();
  row.insertCell().textContent = movie.movieId;
  row.insertCell().textContent = movie.title;
  row.insertCell().textContent = movie.releaseDate;
  // row.insertCell().textContent = movie.edition || "";
}
