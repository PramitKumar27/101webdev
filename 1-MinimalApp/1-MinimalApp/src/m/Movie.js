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
 * @param {{isbn: string, title: string, year: number}} slots - Object creation slots.
 */
function Book( slots) {
  this.isbn = slots.isbn;
  this.title = slots.title;
  this.year = slots.year;
}
/***********************************************
 ***  Class-level ("static") properties  *******
 ***********************************************/
Book.instances = {};  // initially an empty collection (a map)

/*********************************************************
 ***  Class-level ("static") storage management methods **
 *********************************************************/
// Convert record/row to object
Movie.convertRec2Obj = function (MovieRec) {
  const movie = new Movie( MovieRec);
  return movie;
};
// Load the book table from Local Storage
Movie.retrieveAll = function () {
  var MoviesString="";  
  try {
    if (localStorage.getItem("movies")) {
      MoviesString = localStorage.getItem("movies");
    }
  } catch (e) {
    alert("Error when reading from Local Storage\n" + e);
  }
  if (MoviesString) {
    const movies = JSON.parse( MoviesString);
    const keys = Object.keys( movies);
    console.log(`${keys.length} movies loaded.`);
    for (let i=0; i < keys.length; i++) {
      let key = keys[i];
      Movie.instances[key] = Movie.convertRec2Obj( movies[key]);
    }
  }
};
//  Save all book objects to Local Storage
Movie.saveAll = function () {
  var error = false;
  try {
    const MoviesString = JSON.stringify( Movie.instances);
    localStorage.setItem("movies", MoviesString);
  } catch (e) {
    alert("Error when writing to Local Storage\n" + e);
    error = true;
  }
  if (!error) {
    const nmrOfMovies = Object.keys( Movie.instances).length;
    console.log(`${nmrOfMovies} movies saved.`);
  }
};
//  Create a new book row
Movie.add = function (slots) {
  const movie = new Movie( slots);
  // add book to the Book.instances collection
  Movie.instances[slots.isbn] = movie;
  console.log(`Movie ${slots.isbn} created!`);
};
//  Update an existing book row
Movie.update = function (slots) {
  const movie = Movie.instances[slots.isbn],
        year = parseInt( slots.year);  // convert string to integer
  if (movie.title !== slots.title) movie.title = slots.title;
  if (movie.year !== year) movie.year = year;
  console.log(`Movie ${slots.isbn} modified!`);
};
//  Delete a book row from persistent storage
Movie.destroy = function (isbn) {
  if (Movie.instances[isbn]) {
    console.log(`Movie ${isbn} deleted`);
    delete Movie.instances[isbn];
  } else {
    console.log(`There is no movie with ID ${isbn} in the database!`);
  }
};
/*******************************************
*** Auxiliary methods for testing **********
********************************************/
//  Create and save test data
Movie.generateTestData = function () {
  Movie.instances["1"] = new Movie({isbn:"1", title:"Pulp Fiction", year:"1994-05-12"});
  Movie.instances["2"] = new Movie({isbn:"2", title:"Star Wars", year:"1977-05-25"});
  Movie.instances["3"] = new Movie({isbn:"3", title:"Casablanca", year:"1943-01-23"});
  Movie.instances["4"] = new Movie({isbn:"4", title:"The Godfather", year:"1972-03-15"});
  Movie.saveAll();
};
//  Clear data
Movie.clearData = function () {
  if (confirm("Do you really want to delete all movie data?")) {
    Movie.instances = {};
    localStorage.setItem("movies", "{}");
  }
};
