
import { isNonEmptyString, isIntegerOrIntegerString, cloneObject }
  from "../../lib/util.mjs";
import { NoConstraintViolation, MandatoryValueConstraintViolation,
  RangeConstraintViolation, PatternConstraintViolation, UniquenessConstraintViolation }
  from "../../lib/errorTypes.mjs";
import Enumeration from "../../lib/Enumeration.mjs";

/**
 * Define three Enumerations
 */
const MovieGenreEL = new Enumeration(["Action","Comedy","Animation","Documentary","Drama","Family","Film_Noir", "Horror","Musical","Romance","Crime","Adventure","Sci_Fi","Fantasy","War"])
const MovieRatingEL = new Enumeration({"G":"General Audiences", "PG":"Parental Guidance",
  "PG13":"Not under 13","R":"Restricted","NC17":"Not under 17"})

/*const MovieRatingEL = new Enumeration(["novel","biography",
  "textmovie","other"]);
const MovieGenreEL = new Enumeration(["hardcover","paperback",
  "ePub","PDF"]);*/
/**
 * The class Movie
 * @class
 */
class Movie {
  // using a single record parameter with ES6 function parameter destructuring
  constructor ({movieId, title, rating, movieGenres}) {
    // assign properties by invoking implicit setters
    this.movieId = movieId;
    this.title = title;
    this.rating = rating;
    this.movieGenres = movieGenres;
  }
  get movieId() {
    return this._movieId;
  }
  static checkMovieId( movieId) {
    if (!movieId) return new NoConstraintViolation();
    else if (typeof movieId !== "string" || movieId.trim() === "") {
      return new RangeConstraintViolation(
          "The MovieID must be a non-empty string!");
    } else {
      return new NoConstraintViolation();
    }
  }
  static checkMovieIdAsId( movieId) {
    var validationResult = Movie.checkMovieId( movieId);
    if ((validationResult instanceof NoConstraintViolation)) {
      if (!movieId) {
        validationResult = new MandatoryValueConstraintViolation(
            "A value for the MovieID must be provided!");
      } else if (Movie.instances[movieId]) {
        validationResult = new UniquenessConstraintViolation(
            "There is already a movie record with this MovieID!");
      } else {
        validationResult = new NoConstraintViolation();
      }
    }
    return validationResult;
  }
  set movieId( n) {
    const validationResult = Movie.checkMovieIdAsId( n);
    if (validationResult instanceof NoConstraintViolation) {
      this._movieId = n;
    } else {
      throw validationResult;
    }
  }
  get title() {
    return this._title;
  }
  static checkTitle( t) {
    if (!t) {
      return new MandatoryValueConstraintViolation(
          "A title must be provided!");
    } else if (!isNonEmptyString(t)) {
      return new RangeConstraintViolation(
          "The title must be a non-empty string!");
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
  get rating() {
    return this._rating;
  }
  static checkRating( c) {
    if (!c) {
      return new MandatoryValueConstraintViolation(
          "A rating must be provided!");
    } else if (!isIntegerOrIntegerString(c) || parseInt(c) < 1 ||
        parseInt(c) > MovieRatingEL.MAX) {
      return new RangeConstraintViolation(
          `Invalid value for rating: ${c}`);
    } else {
      return new NoConstraintViolation();
    }
  }
  set rating( c) {
    const validationResult = Movie.checkRating( c);
    if (validationResult instanceof NoConstraintViolation) {
      this._rating = parseInt( c);
    } else {
      throw validationResult;
    }
  }
  get movieGenres() {
    return this._movieGenres;
  }
  static checkMovieGenre( p) {
    if (!p) {
      return new MandatoryValueConstraintViolation(
          "No publication form provided!");
    } else if (!Number.isInteger( p) || p < 1 ||
        p > MovieGenreEL.MAX) {
      return new RangeConstraintViolation(
          `Invalid value for publication form: ${p}`);
    } else {
      return new NoConstraintViolation();
    }
  }
  static checkMovieGenres( genre) {
    if (!genre || (Array.isArray( genre) &&
        genre.length === 0)) {
      return new MandatoryValueConstraintViolation(
          "No publication form provided!");
    } else if (!Array.isArray( genre)) {
      return new RangeConstraintViolation(
          "The value of movieGenres must be an array!");
    } else {
      for (let i of genre.keys()) {
        const validationResult = Movie.checkMovieGenre( genre[i]);
        if (!(validationResult instanceof NoConstraintViolation)) {
          return validationResult;
        }
      }
      return new NoConstraintViolation();
    }
  }
  set movieGenres( genre) {
    const validationResult = Movie.checkMovieGenres( genre);
    if (validationResult instanceof NoConstraintViolation) {
      this._movieGenres = genre;
    } else {
      throw validationResult;
    }
  }
  /*********************************************************
   ***  Other Instance-Level Methods  ***********************
   **********************************************************/
  toString() {
    return `Movie{ MovieID: ${this.movieId}, title: ${this.title},
    rating: ${this.rating},
    movieGenres: ${this.movieGenres.toString()} }`;
  }
  toJSON() {  // is invoked by JSON.stringify
    const rec = {};
    for (let p of Object.keys( this)) {
      // copy only property slots with underscore prefix
      if (p.charAt(0) === "_") {
        // remove underscore prefix
        rec[p.substr(1)] = this[p];
      }
    }
    return rec;
  }
}
/**********************************************************
 ***  Class-level ("static") properties  ******************
 **********************************************************/
// initially an empty collection (in the form of a map)
Movie.instances = {};

/**********************************************************
 ***  Class-level ("static") storage management methods ***
 **********************************************************/
/**
 *  Create a new movie row
 */
Movie.add = function (slots) {
  var movie = null;
  try {
    movie = new Movie( slots);
  } catch (e) {
    console.log( `${e.constructor.name} : ${e.message}`);
    movie = null;
  }
  if (movie) {
    Movie.instances[movie.movieId] = movie;
    console.log( `${movie.toString()} created!`);
  }
};
/**
 *  Update an existing movie row
 */
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
    if (movie.rating !== slots.rating) {
      movie.rating = slots.rating;
      updatedProperties.push("rating");
    }
    if (!movie.movieGenres.isEqualTo( slots.movieGenres)) {
      movie.movieGenres = slots.movieGenres;
      updatedProperties.push("movieGenres");
    }
  } catch (e) {
    console.log(`${e.constructor.name}: ${e.message}`);
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
/**
 *  Delete a movie
 */
Movie.destroy = function (movieId) {
  if (Movie.instances[movieId]) {
    console.log(`${Movie.instances[movieId].toString()} deleted!`);
    delete Movie.instances[movieId];
  } else {
    console.log(`There is no movie with MovieID ${movieId} in the database!`);
  }
};
/**
 *  Convert row to object
 */
Movie.convertRec2Obj = function (movieRow) {
  var movie={};
  try {
    movie = new Movie( movieRow);
  } catch (e) {
    console.log(`${e.constructor.name} while deserializing a movie row: ${e.message}`);
  }
  return movie;
};
/**
 *  Load all movie table rows and convert them to objects
 */
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
    console.log(`${Object.keys( movies).length} movies loaded.`);
    for (let key of Object.keys( movies)) {
      Movie.instances[key] = Movie.convertRec2Obj( movies[key]);
    }
  }
};
/**
 *  Save all movie objects
 */
Movie.saveAll = function () {
  var error=false;
  const nmrOfMovies = Object.keys( Movie.instances).length;
  try {
    const moviesString = JSON.stringify( Movie.instances);
    localStorage["movies"] = moviesString;
  } catch (e) {
    alert("Error when writing to Local Storage\n" + e);
    error = true;
  }
  if (!error) console.log(`${nmrOfMovies} movie records saved.`);
};
/*******************************************
 *** Auxiliary methods for testing **********
 ********************************************/
/**
 *  Create and save test data
 */
Movie.generateTestData = function () {
  try {
    Movie.instances["1"] = new Movie(
        {movieId:"1", title:"Pulp Fiction", rating:MovieRatingEL.R
          ,movieGenre: [MovieRatingEL.PG]});
    Movie.instances["2"] = new Movie(
        {movieId:"2", title:"Star Wars", rating:MovieRatingEL.PG, movieGenre:[MovieGenreEL.Action, MovieGenreEL.Adventure, MovieGenreEL.Fantasy, MovieGenreEL.Sci_Fi]});
    Movie.instances["3"] = new Movie(
        {movieId:"3", title:"Casablanca", rating:MovieRatingEL.PG, movieGenre:[MovieGenreEL.Drama, MovieGenreEL.Film_Noir, MovieGenreEL.Romance, MovieGenreEL.War]});
    Movie.instances["4"] = new Movie(
        {movieId:"4", title:"The Godfather", rating:MovieRatingEL.R, movieGenre:[MovieGenreEL.Crime, MovieGenreEL.Drama,MovieGenreEL.]});
    Movie.saveAll();
  } catch (e) {
    console.log(`${e.constructor.name} : ${e.message}`);
  }
};
/**
 * Clear data
 */
Movie.clearData = function () {
  if (confirm( "Do you really want to delete all movie data?")) {
    try {
      Movie.instances = {};
      localStorage["movies"] = "{}";
      console.log( "All data cleared.");
    } catch (e) {
      console.log( `${e.constructor.name} : ${e.message}`);
    }
  }
};

export default Movie;
export { MovieRatingEL, MovieGenreEL };
