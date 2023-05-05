
import Movie, {GenreEl, MovieRatingEl} from "../m/Movie.mjs";

const tableBodyEl = document.querySelector("table#movies>tbody");
// retrieve all movie records
Movie.retrieveAll();
// list all movie records
for (let key of Object.keys( Movie.instances)) {
  const movie = Movie.instances[key];
  const row = tableBodyEl.insertRow();
  row.insertCell().textContent = movie.movieId;
  row.insertCell().textContent = movie.title;
  row.insertCell().textContent = MovieRatingEl.labels[movie.rating];
  row.insertCell().textContent = GenreEl.stringify(movie.movieGenre)
}
