/**
 * @fileOverview  The model class Movie with attribute definitions and storage management methods
 * @author Gerd Wagner
 * @copyright Copyright 2014-2015 Gerd Wagner, Chair of Internet Technology, Brandenburg University of Technology, Germany.
 * @license This code is licensed under The Code Project Open License (CPOL), implying that the code is provided "as-is",
 * can be modified to create derivative works, can be redistributed, and can be used in commercial applications.
 */
import { isNonEmptyString, isIntegerOrIntegerString, cloneObject }
    from "../../lib/util.mjs";
import { NoConstraintViolation, MandatoryValueConstraintViolation,
    RangeConstraintViolation, PatternConstraintViolation, UniquenessConstraintViolation }
    from "../../lib/errorTypes.mjs";
import Enumeration from "../../lib/Enumeration.mjs";

/**
 * Define three Enumerations
 */
const MovieRatingEL = new Enumeration({"G":"General Audiences", "PG":"Parental Guidance",
    "PG13":"Not Under 13","R":"Restricted","NC17":"Not Under 17"});
const GenreEL = new Enumeration(["Action","Animation","Crime","War","Sci-Fi","Adventure","Fantasy",
    "Comedy","Documentary","Drama","Family","Film-Noir","Horror","Musical","Romance"]);

/**
 * The class Movie
 * @class
 */
class Movie {
  // using a single record parameter with ES6 function parameter destructuring
  constructor ({movieId, title,
                 movieRating, genre}) {
    // assign properties by invoking implicit setters
    this.movieId = movieId;
    this.title = title;
    this.movieRating = movieRating;
    this.genre = genre;
  }
  get movieId() {
    return this._movieId;
  }
  static checkMovieId( id) {
    if (!id) return new NoConstraintViolation();
else if (typeof(id) !== "string" || id.trim() === "") {
return new RangeConstraintViolation("The Movie ID must be a non-empty string!");
} else {
return new NoConstraintViolation();
}
  }
  static checkMovieIdAsId( id) {
    var validationResult = Movie.checkMovieId( id);
if ((validationResult instanceof NoConstraintViolation)) {
if (!id) {
validationResult = new MandatoryValueConstraintViolation(
"A value for the Movie ID must be provided!");
} else if (Movie.instances[id]) {
validationResult = new UniquenessConstraintViolation(
"There is already a movie record with this ID!");
} else {
validationResult = new NoConstraintViolation();
}
}
return validationResult;
}
  set movieId( id) {
    const validationResult = Movie.checkMovieIdAsId( id);
if (validationResult instanceof NoConstraintViolation) {
this._movieId = id;
 } else {
    throw validationResult;
  }
  }
  get title() {
    return this._title;
  }
  static checkTitle( t) {
    if (!t) {
    return new MandatoryValueConstraintViolation("A title must be provided!");
  } else if (!isNonEmptyString(t)) {
    return new RangeConstraintViolation("The title must be a non-empty string!");
  } else {
    return new NoConstraintViolation();
  }
  }
  set title( t) {
    var validationResult = Movie.checkTitle( t);
  if (validationResult instanceof NoConstraintViolation) {
    this._title = t;
  } else {
    throw validationResult;
  }
  }
  
  get movieRating() {
    return this._movieRating;
  }
  static checkMovieRating( m) {
    if (!m) {
      return new MandatoryValueConstraintViolation(
        "A rating must be provided!");
    } else if (!isIntegerOrIntegerString(m) || parseInt(m) < 1 ||
      parseInt(m) > MovieRatingEL.MAX) {
      return new RangeConstraintViolation(
        `Invalid value for rating: ${m}`);
    } else {
      return new NoConstraintViolation();
    }
  }
  set movieRating( m) {
    const validationResult = Movie.checkMovieRating( m);
    if (validationResult instanceof NoConstraintViolation) {
      this._movieRating = parseInt( m);
    } else {
      throw validationResult;
    }
  }

  get genre() {
    return this._genre;
  }
  static checkGenre( g) {
    if (!g) {
      return new MandatoryValueConstraintViolation(
        "No genre provided!");
    } else if (!Number.isInteger( g) || g < 1 ||
      g > GenreEL.MAX) {
      return new RangeConstraintViolation(
        `Invalid value for genre: ${g}`);
    } else {
      return new NoConstraintViolation();
    }
  }
  static checkGenres( movieGenre) {
    if (!movieGenre || (Array.isArray( movieGenre) &&
      movieGenre.length === 0)) {
      return new MandatoryValueConstraintViolation(
        "No genre provided!");
    } else if (!Array.isArray( movieGenre)) {
      return new RangeConstraintViolation(
        "The value of Genre must be an array!");
    } else {
      for (let i of movieGenre.keys()) {
        const validationResult = Movie.checkGenre( movieGenre[i]);
        if (!(validationResult instanceof NoConstraintViolation)) {
          return validationResult;
        }
      }
      return new NoConstraintViolation();
    }
  }
  set genre( movieGenre) {
    const validationResult = Movie.checkGenres( movieGenre);
    if (validationResult instanceof NoConstraintViolation) {
      this._genre = movieGenre;
    } else {
      throw validationResult;
    }
  }
  /*********************************************************
   ***  Other Instance-Level Methods  ***********************
   **********************************************************/
  toString() {
    return `Movie{ MovieID: ${this.movieId}, title: ${this.title},
    movieRating: ${this.movieRating},
    genre: ${this.genre.toString()} }`;
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
 *  Create a new Movie row
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
 *  Update an existing Movie row
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
    if (movie.movieRating !== slots.movieRating) {
      movie.movieRating = slots.movieRating;
      updatedProperties.push("movieRating");
    }
    if (!movie.genre.isEqualTo( slots.genre)) {
      movie.genre = slots.genre;
      updatedProperties.push("genre");
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
    console.log(`There is no movie with ID ${movieId} in the database!`);
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
 *  Load all Movie table rows and convert them to objects
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
 *  Save all Movie objects
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
    Movie.instances["1"] = new Movie({
      movieId: "1",
      title: "Pulp Fiction",
      movieRating: MovieRatingEL.R,
      genre: [
        GenreEL.CRIME,
        GenreEL.DRAMA
      ]
    });
    Movie.instances["2"] = new Movie({
      movieId: "2",
      title: "Star wars",
      movieRating: MovieRatingEL.PG,
      genre: [
        GenreEL.ACTION,
        GenreEL.ADVENTURE,
        GenreEL.FANTASY,
      ]
    });
    Movie.instances["3"] = new Movie({
      movieId: "3",
      title: "Casablanca",
      movieRating: MovieRatingEL.PG,
      genre: [
        GenreEL.DRAMA,
        GenreEL.ROMANCE,
        GenreEL.WAR
      ]
    });
    Movie.instances["4"] = new Movie({
      movieId: "4",
      title: "The Godfather",
      movieRating: MovieRatingEL.R,
      genre: [
        GenreEL.CRIME,
        GenreEL.DRAMA
      ]
    });
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
export { MovieRatingEL, GenreEL };
