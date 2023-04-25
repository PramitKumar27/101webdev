/**
 * @fileOverview  The model class Book with attribute definitions and storage management methods
 * @author Gerd Wagner
 * @copyright Copyright � 2013-2014 Gerd Wagner, Chair of Internet Technology, Brandenburg University of Technology, Germany. 
 * @license This code is licensed under The Code Project Open License (CPOL), implying that the code is provided "as-is", 
 * can be modified to create derivative works, can be redistributed, and can be used in commercial applications.
 */
/**
 * Constructor function for the class Book 
 * @constructor
 * @param {{movieId: number, title: string, releaseDate: Date}} slots - Object creation slots.
 */
function Movie( slots) {
  this.movieId = slots.movieId;
  this.title = slots.title;
  this.releaseDate = slots.releaseDate;
}
/***********************************************
 ***  Class-level ("static") properties  *******
 ***********************************************/
Movie.instances = {};  // initially an empty collection (a map)

/*********************************************************
 ***  Class-level ("static") storage management methods **
 *********************************************************/
// Convert record/row to object
Movie.convertRec2Obj = function (MovieRec) {
  const movie = new Movie(MovieRec);
  return movie;
};
// Load the movie table from Local Storage
Movie.retrieveAll = function () {
  var MoviesString="";  
  try {
    if (localStorage.getItem("Movies")) {
      MoviesString = localStorage.getItem("Movies");
    }
  } catch (e) {
    alert("Error when reading from Local Storage\n" + e);
  }
  if (MoviesString) {
    const Movies = JSON.parse( MoviesString);
    const keys = Object.keys( Movies);
    console.log(`${keys.length} Movies loaded.`);
    for (let i=0; i < keys.length; i++) {
      let key = keys[i];
      Movie.instances[key] = Movie.convertRec2Obj( Movies[key]);
    }
  }
};
//  Save all movie objects to Local Storage
Movie.saveAll = function () {
  var error = false;
  try {
    const MoviesString = JSON.stringify( Movie.instances);
    localStorage.setItem("Movies", MoviesString);
  } catch (e) {
    alert("Error when writing to Local Storage\n" + e);
    error = true;
  }
  if (!error) {
    const nmrOfMovies = Object.keys( Movie.instances).length;
    console.log(`${nmrOfMovies} Movies saved.`);
  }
};
//  Create a new movie row
Movie.add = function (slots) {
  const movie = new Movie( slots);
  // add movie to the Movie.instances collection
  Movie.instances[slots.movieId] = movie;
  console.log(`Movie ${slots.movieId} created!`);
};
//  Update an existing movie row
Movie.update = function (slots) {
  const movie = Movie.instances[slots.movieId],
         releaseDate1 = slots.releaseDate;  // convert string to integer
  if (movie.title !== slots.title) movie.title = slots.title;
  if (movie.releaseDate !== releaseDate1) movie.releaseDate = releaseDate1;
  console.log(`Movie ${slots.movieId} modified!`);
};
//  Delete a movie row from persistent storage
Movie.destroy = function (movieId) {
  if (Movie.instances[movieId]) {
    console.log(`Movie ${movieId} deleted`);
    delete Movie.instances[movieId];
  } else {
    console.log(`There is no Movie with ID ${movieId} in the database!`);
  }
};
/*******************************************
*** Auxiliary methods for testing **********
********************************************/
//  Create and save test data
Movie.generateTestData = function () {
  Movie.instances["1"] = new Movie({movieId:"1", title:"Pulp Fiction", releaseDate:"1994-05-12"});
  Movie.instances["2"] = new Movie({movieId:"2", title:"Star Wars", releaseDate:"1977-05-25"});
  Movie.instances["3"] = new Movie({movieId:"3", title:"Casablanca", releaseDate:"1943-01-23"});
  Movie.instances["4"] = new Movie({movieId:"4", title:"The Godfather", releaseDate:"1972-03-15"});
  Movie.saveAll();
};
//  Clear data
Movie.clearData = function () {
  if (confirm("Do you really want to delete all Movie data?")) {
    Movie.instances = {};
    localStorage.setItem("Movies", "{}");
  }
};
