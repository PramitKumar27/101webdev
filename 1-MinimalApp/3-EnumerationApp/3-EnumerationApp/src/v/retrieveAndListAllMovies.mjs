/**
 * @fileOverview  Contains various view functions for the use case listMovies
 * @author Gerd Wagner
 */
import Movie, { MovieRatingEL, GenreEL } from "../m/Movie.mjs";

const tableBodyEl = document.querySelector("table#movies > tbody");
// retrieve all Movie records
Movie.retrieveAll();
for (const key of Object.keys( Movie.instances)) {
  const movie = Movie.instances[key];
  const row = tableBodyEl.insertRow();
  row.insertCell().textContent = movie.movieId;
  row.insertCell().textContent = movie.title;
  row.insertCell().textContent = MovieRatingEL.labels[movie.movieRating];
  row.insertCell().textContent = GenreEL.stringify(
     movie.genre);
}
