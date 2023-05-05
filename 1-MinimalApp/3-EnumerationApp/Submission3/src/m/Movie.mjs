
/**
 * Constructor function for the class Movie 
 * @constructor
 */
import { isNonEmptyString, isIntegerOrIntegerString, cloneObject }
  from "../../lib/util.mjs";
import { NoConstraintViolation, MandatoryValueConstraintViolation, RangeConstraintViolation,
  UniquenessConstraintViolation }
  from "../../lib/errorTypes.mjs";
import Enumeration from "../../lib/Enumeration.mjs";

const GenreEl = new Enumeration(["Action","Comedy","Animation","Documentary","Drama","Family","Film_Noir", "Horror","Musical","Romance","Crime","Adventure","Sci_Fi","Fantasy","War"])
const MovieRatingEl = new Enumeration({"G":"General Audiences", "PG":"Parental Guidance",
  "PG13":"Not under 13","R":"Restricted","NC17":"Not under 17"})

class Movie {
  // assign default values
  constructor ({movieId, title, rating, movieGenre}) {
    this.movieId = movieId;   // string
    this.title = title;  // string
    this.movieGenre = movieGenre;
    this.rating = rating;
  }
  get movieId(){
    return this._movieId
  }
  static checkMovieId (id) {
    if (!id) return new NoConstraintViolation();
    else if (typeof(id) !== "string" || id.trim() === "") {
      return new RangeConstraintViolation("The MovieId must be a non-empty string!");
    }  else {
      return new NoConstraintViolation();
    }
  };

  static checkMovieIdAsId = function (id) {
    var validationResult = Movie.checkMovieId( id);
    if ((validationResult instanceof NoConstraintViolation)) {
      if (!id) {
        validationResult = new MandatoryValueConstraintViolation(
            "A value for the MovieId must be provided!");
      } else if (Movie.instances[id]) {
        validationResult = new UniquenessConstraintViolation(
            "There is already a movie record with this ID!");
      } else if (isNaN(id) || parseInt(id) < 0) {
        validationResult = new RangeConstraintViolation(
            "Movie Id cannot be a negative number");
      }else {
        validationResult = new NoConstraintViolation();
      }
    }
    return validationResult;
  };

  set movieId (id) {
    const validationResult = Movie.checkMovieIdAsId( id);
    if (validationResult instanceof NoConstraintViolation) {
      this._movieId = id;
    } else {
      throw validationResult;
    }
  };

  get title() {
    return this._title;
  }

  static checkTitle( t) {
    if (!t) {
      return new MandatoryValueConstraintViolation(
          "A title must be provided!");
    } else if (!isNonEmptyString(t)) {
      return new RangeConstraintViolation("The title must be a non-empty string!");
    } else if (t.length > 120) { // Add a new condition to check the length of the title
      return new RangeConstraintViolation("The title must not exceed 120 characters!");
    } else {
      return new NoConstraintViolation();
    }
  }
  set title( t) {
    const validationResult = Movie.checkTitle( t);
    if (validationResult instanceof NoConstraintViolation) {
      this._title = t;
    } else {
      throw validationResult;
    }
  }

  get rating(){
    return this._rating;
  }
  static checkMovieRating (r) {
    if (!r) {
      return new MandatoryValueConstraintViolation(
          "A rating must be provided!");
    } else if (!isIntegerOrIntegerString(r) || parseInt(r) < 1 ||
        parseInt(r) > MovieRatingEl.MAX) {
      return new RangeConstraintViolation(
          `Invalid value for rating: ${r}`);
    } else {
      return new NoConstraintViolation();
    }
  }

  set rating(r){
    const validationResult = Movie.checkMovieRating( r);
    if (validationResult instanceof NoConstraintViolation) {
      this._rating = parseInt( r);
    } else {
      throw validationResult;
    }
  }
  get movieGenre(){
    return this._movieGenre
  }
  static checkGenre(t){
    if (!t) {
      return new MandatoryValueConstraintViolation(`No genre provided! ${parseInt(t)}`);
    } else if (!Number.isInteger( t) || t < 1 ||
        t > GenreEl.MAX) {
      return new RangeConstraintViolation(`Invalid value for genre: ${t}`);
    } else {
      return new NoConstraintViolation();
    }
  }
  static checkGenresEL (genre){
    if (!genre || (Array.isArray( genre) &&
        genre.length === 0)) {
      return new MandatoryValueConstraintViolation(
          `No genre provided! ${GenreEl.MAX}`);
    } else if (!Array.isArray( genre)) {
      return new RangeConstraintViolation(
          "The value of genre must be an array!");
    } else {
      for (let i of genre.keys()) {
        const validationResult = Movie.checkGenre( genre[i]);
        if (!(validationResult instanceof NoConstraintViolation)) {
          return validationResult;
        }
      }
      return new NoConstraintViolation();
    }
  }

  set movieGenre(t){
    const validationResult = Movie.checkGenresEL( t);
    if (validationResult instanceof NoConstraintViolation) {
      this._movieGenre = t;
    } else {
      throw validationResult;
    }
  }

  toString() {
    return `Movie{ Movie ID: ${this.movieId}, title: ${this.title} ,
     rating: ${this.rating}, movieGenre: ${this.movieGenre.toString()} }`;
  }
}

// initially an empty collection (in the form of a map)
Movie.instances = {};







/*Movie.checkReleaseDate = function (y) {
  var date = new Date(y);
  var compareDate = new Date('1895-12-28');
  if (!y) {
    return new MandatoryValueConstraintViolation("A release date must be provided!");
  }else if (date < compareDate) {
    return new RangeConstraintViolation(
        "The movie release date needs to be greater than or equal to 28-12-1895");
  } else {
    return new NoConstraintViolation();
  }
};
Movie.prototype.setReleaseDate = function (y) {
  const validationResult = Movie.checkReleaseDate(y);
  if (validationResult instanceof NoConstraintViolation) {
    this.releaseDate = (y);
  } else {
    throw validationResult;
  }
};*/


Movie.add = function (slots) {
  var movie = null;
  try {
    movie = new Movie( slots);
  } catch (e) {
    console.log( `${e.constructor.name}: ${e.message}`);
    movie = null;
  }
  if (movie) {
    Movie.instances[movie.movieId] = movie;
    console.log( `${movie.toString()} created!`);
  }
};

Movie.update = function (slots) {
  var noConstraintViolated = true,
      updatedProperties = [];
  const movie = Movie.instances[slots.movieId],
        objectBeforeUpdate = cloneObject( movie);
  try {
    if (movie.title !== slots.title) {
      movie.title = slots.title;
      updatedProperties.push("title");
    }
    /*if (movie.releaseDate !== parseInt(slots.releaseDate)) {
      movie.setReleaseDate( slots.releaseDate);
      updatedProperties.push("releaseDate");
    }*/
    if(movie.rating !== slots.rating){
      movie.setMovieRatingEl = slots.rating;
      updatedProperties.push("rating")
    }
    if(!movie.movieGenre.isEqualTo(slots.movieGenre)){
      movie.movieGenre = slots.movieGenre;
      updatedProperties.push("movieGenre")
    }
  } catch (e) {
    console.log( `${e.constructor.name}: ${e.message}`);
    noConstraintViolated = false;
    // restore object to its state before updating
    Movie.instances[slots.movieId] = objectBeforeUpdate;
  }
  if (noConstraintViolated) {
    if (updatedProperties.length > 0) {
      console.log(`Properties ${updatedProperties.toString()} modified for movie ${slots.movieId}`);
    } else {
      console.log(`No property value changed for movie ${slots.movieId}!`);
    }
  }
};

Movie.destroy = function (movieId) {
  if (Movie.instances[movieId]) {
    console.log( `${Movie.instances[movieId].toString()} deleted!`);
    delete Movie.instances[movieId];
  } else {
    console.log(`There is no movie with Movie ID ${movieId} in the database!`);
  }
};

Movie.convertRec2Obj = function (movieRow) {
  var movie={};
  try {
    movie = new Movie( movieRow);
  } catch (e) {
    console.log(`${e.constructor.name} while deserializing a movie row: ${e.message}`);
  }
  return movie;
};

Movie.retrieveAll = function () {
  var moviesString="";
  try {
    if (localStorage["movies"]) {
      moviesString = localStorage["movies"];
    }
  } catch (e) {
    alert("Error when reading from Local Storage\n" + e);
  }
  if (moviesString) {
    const movies = JSON.parse( moviesString);
    console.log( `${Object.keys( movies).length} movies loaded.`);
    for (let key of Object.keys( movies)) {
      Movie.instances[key] = Movie.convertRec2Obj( movies[key]);
    }
  }
};

Movie.saveAll = function () {
  var moviesString="", error=false;
  const nmrOfMovies = Object.keys( Movie.instances).length;
  try {
    moviesString = JSON.stringify( Movie.instances);
    localStorage["movies"] = moviesString;
  } catch (e) {
    alert("Error when writing to Local Storage\n" + e);
    error = true;
  }
  if (!error) console.log( `${nmrOfMovies} movies saved.`);
};

Movie.generateTestData = function () {
  try {
    Movie.instances["1"] = new Movie(
        {movieId:"1", title:"Pulp Fiction", rating:MovieRatingEl.R
        ,movieGenre: [MovieRatingEl.PG]});
    Movie.instances["2"] = new Movie(
        {movieId:"2", title:"Star Wars", rating:MovieRatingEl.PG, movieGenre:[GenreEl.Action, GenreEl.Adventure, GenreEl.Fantasy, GenreEl.Sci_Fi]});
    Movie.instances["3"] = new Movie(
        {movieId:"3", title:"Casablanca", rating:MovieRatingEl.PG, movieGenre:[GenreEl.Drama, GenreEl.Film_Noir, GenreEl.Romance, GenreEl.War]});
    Movie.instances["4"] = new Movie(
        {movieId:"4", title:"The Godfather", rating:MovieRatingEl.R, movieGenre:[GenreEl.Crime, GenreEl.Drama]});
    Movie.saveAll();
  } catch (e) {
    console.log(`${e.constructor.name}: ${e.message}`);
  }
};

Movie.clearData = function () {
  if (confirm("Do you really want to delete all movie data?")) {
    try {
      Movie.instances = {};
      localStorage["movies"] = "{}";
      console.log("All data cleared.");
    } catch (e) {
      console.log(`${e.constructor.name}: ${e.message}`);
    }
  }
};

export default Movie;
export { GenreEl, MovieRatingEl };
