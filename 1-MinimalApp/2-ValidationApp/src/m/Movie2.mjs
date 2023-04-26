/**
 * @fileOverview  The model class movie with attribute definitions and storage management methods
 * @author Gerd Wagner
 * @copyright Copyright 2013-2014 Gerd Wagner, Chair of Internet Technology, Brandenburg University of Technology, Germany. 
 * @license This code is licensed under The Code Project Open License (CPOL), implying that the code is provided "as-is", 
 * can be modified to create derivative works, can be redistributed, and can be used in commercial applications.
 */
/**
 * Constructor function for the class movie 
 * @constructor
 * @param {{movieId: Number, title: string, releaseDate: Year}} slots
 */
import { isNonEmptyString, nextYear, isIntegerOrIntegerString, cloneObject }
  from "../../lib/util.mjs";
import { NoConstraintViolation, MandatoryValueConstraintViolation, RangeConstraintViolation,
  IntervalConstraintViolation, PatternConstraintViolation, UniquenessConstraintViolation }
  from "../../lib/errorTypes.mjs";

function Movie( slots) {
  // assign default values
  this.movieId = "";   // string
  this.title = "";  // string
  this.releaseDate = 0;    // number (int)
  // this.edition   number (int) optional
  // set properties only if constructor is invoked with an argument
  if (arguments.length > 0) {
    this.setMovieId( slots.movieId); 
    this.setTitle( slots.title); 
    this.setReleaseDate( slots.releaseDate);
  // optional
  }
}
/*********************************************************
***  Class-level ("static") properties  ******************
**********************************************************/
// initially an empty collection (in the form of a map)
Movie.instances = {};

/*********************************************************
***  Checks and Setters  *********************************
**********************************************************/
Movie.checkMovieId = function (id) {
  if (!id) return new NoConstraintViolation();
  else if (typeof(id) !== "string" || id.trim() === "") {
    return new RangeConstraintViolation("The Movie ID must be a non-empty string!");
  // } else if (!(/\b\d{9}(\d|X)\b/.test( id))) {
  //   return new PatternConstraintViolation(
  //       'The Movie ID must be a 10-digit string or a 9-digit string followed by "X"!');
  } else {
    return new NoConstraintViolation();
  }
};
Movie.checkMovieIdAsId = function (id) {
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
};
Movie.prototype.setMovieId = function (id) {
  const validationResult = Movie.checkMovieIdAsId( id);
  if (validationResult instanceof NoConstraintViolation) {
    this.movieId = id;
  } else {
    throw validationResult;
  }
};
Movie.checkTitle = function (t) {
  if (!t) {
    return new MandatoryValueConstraintViolation("A title must be provided!");
  } else if (!isNonEmptyString(t)) {
    return new RangeConstraintViolation("The title must be a non-empty string!");
  } else {
    return new NoConstraintViolation();
  }
};
Movie.prototype.setTitle = function (t) {
  var validationResult = Movie.checkTitle( t);
  if (validationResult instanceof NoConstraintViolation) {
    this.title = t;
  } else {
    throw validationResult;
  }
};
Movie.checkReleaseDate = function (y) {
  const YEAR_FIRST_MOVIE = "1895-12-28";
  if (!y) {
    return new MandatoryValueConstraintViolation(
	    "A release year must be provided!");
  // } else if (!isIntegerOrIntegerString( y)) {
  //   return new RangeConstraintViolation("The value of year must be an integer!");
  } else {
    // if (typeof y === "string") y = parseInt(y);
    if (y < YEAR_FIRST_MOVIE || y > nextYear()) {
      return new IntervalConstraintViolation(
          `The value of year must be between ${YEAR_FIRST_MOVIE} and next year!`);
    } else {
      return new NoConstraintViolation();
    }
  }
};
Movie.prototype.setReleaseDate = function (y) {
  const validationResult = Movie.checkReleaseDate( y);
  if (validationResult instanceof NoConstraintViolation) {
    this.releaseDate = parseInt( y);
  } else {
    throw validationResult;
  }
};
// movie.checkEdition = function (e) {
//   // the "edition" attribute is optional
//   if (!e || e === "") return new NoConstraintViolation();
//   else {
//     if (!isIntegerOrIntegerString(e) || parseInt(e) < 1) {
//       return new RangeConstraintViolation(
// 	      "The value of edition must be a positive integer!");
//     } else {
//       return new NoConstraintViolation();
//     }
//   }
// };
// movie.prototype.setEdition = function (e) {
//   var validationResult = movie.checkEdition( e);
//   if (validationResult instanceof NoConstraintViolation) {
//     if (!e || e === "") delete this.edition;  // unset optional property
//     else this.edition = parseInt( e);
//   } else {
//     throw validationResult;
//   }
// };
/*********************************************************
***  Other Instance-Level Methods  ***********************
**********************************************************/
/**
 *  Serialize movie object 
 */
Movie.prototype.toString = function () {
  var movieStr = `Movie{ movieId: ${this.movieId}, title: ${this.title}, releaseDate: ${this.releaseDate}`;
  
  return movieStr;
};
/*********************************************************
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
    console.log( `${e.constructor.name}: ${e.message}`);
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
      movie.setTitle( slots.title);
      updatedProperties.push("title");
    }
    if (movie.releaseDate !== parseInt(slots.releaseDate)) {
      movie.setReleaseDate( slots.releaseDate);
      updatedProperties.push("releaseDate");
    }
    // if (slots.edition && parseInt( slots.edition) !== movie.edition) {
    //   // slots.edition has a non-empty value that is new
    //   movie.setEdition( slots.edition);
    //   updatedProperties.push("edition");
    // } else if (!slots.edition && movie.edition) {
    //   // slots.edition has an empty value that is new
    //   delete movie.edition;  // unset the property "edition"
    //   updatedProperties.push("edition");
	  // }
  } catch (e) {
    console.log( `${e.constructor.name}: ${e.message}`);
    noConstraintViolated = false;
    // restore object to its state before updating
     Movie.instances[movie.movieId] = objectBeforeUpdate;
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
    console.log( `${Movie.instances[movieId].toString()} deleted!`);
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
    console.log( `${Object.keys( movies).length} movies loaded.`);
    for (let key of Object.keys( movies)) {
      Movie.instances[key] = Movie.convertRec2Obj( movies[key]);
    }
  }
};
/**
 *  Save all movie objects
 */
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
      releaseDate: "1994-05-12",
    });
    Movie.instances["2"] = new Movie({
      movieId: "2",
      title: "Star Wars",
      releaseDate: "1977-05-25",
    });
    Movie.instances["3"] = new Movie({
      movieId: "3",
      title: "Casablanca",
      releaseDate: "1943-01-23",
    });
    Movie.instances["4"] = new Movie({
      movieId: "4",
      title: "The Godfather",
      releaseDate: "1972-03-15",
    });
    Movie.saveAll();
  } catch (e) {
    console.log(`${e.constructor.name}: ${e.message}`);
  }
};
/**
 * Clear data
 */
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
