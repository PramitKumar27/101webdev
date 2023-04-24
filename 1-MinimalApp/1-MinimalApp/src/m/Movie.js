/**
 * Constructor function for the class Movie 
 * @constructor
 * @param {{movieId: number, title: string, releaseDate: Date}} slots - Object creation slots.
 */
function Movie(slots) {
  // check if movieId is provided or not
  if (typeof slots.movieId !== "number") {
    throw new Error("Missing movie ID.");
  }
  // set the unique identifier property
  this.movieId = slots.movieId;

  // check if title is provided or not
  if (typeof slots.title !== "string" || slots.title.trim() === "") {
    throw new Error("Missing or invalid movie title.");
  }
  // set the title property
  this.title = slots.title.trim();

  // check if releaseDate is provided and valid
  if (slots.releaseDate !== undefined && !(slots.releaseDate instanceof Date)) {
    throw new Error("Invalid release date.");
  }
  // set the releaseDate property (use undefined if not provided)
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
Movie.convertRec2Obj = function (movieRec) {
  const movie = new Movie(movieRec);
  return movie;
};

// Load the movie table from Local Storage
Movie.retrieveAll = function () {
  let moviesString = "";  
  try {
    if (localStorage.getItem("movies")) {
      moviesString = localStorage.getItem("movies");
    }
  } catch (e) {
    throw new Error("Error when reading from Local Storage\n" + e);
  }
  if (moviesString) {
    const movies = JSON.parse(moviesString);
    const keys = Object.keys(movies);
    console.log(`${keys.length} movies loaded.`);
    for (let i = 0; i < keys.length; i++) {
      const key = keys[i];
      Movie.instances[key] = Movie.convertRec2Obj(movies[key]);
    }
  }
};

//  Save all movie objects to Local Storage
Movie.saveAll = function () {
  let error = false;
  try {
    const moviesString = JSON.stringify(Movie.instances);
    localStorage.setItem("movies", moviesString);
  } catch (e) {
    throw new Error("Error when writing to Local Storage\n" + e);
  }
  if (!error) {
    const nmrOfMovies = Object.keys(Movie.instances).length;
    console.log(`${nmrOfMovies} movies saved.`);
  }
};

//  Create a new movie object
Movie.add = function (slots) {
  const movie = new Movie(slots);
  // add movie to the Movie.instances collection
  Movie.instances[slots.movieId] = movie;
  console.log(`Movie ${slots.movieId} created!`);
};

//  Update an existing movie object
Movie.update = function (slots) {
  const movie = Movie.instances[slots.movieId];
  if (movie) {
    if (slots.title && slots.title.trim() !== "") {
      movie.title = slots.title.trim();
    }
    if (slots.releaseDate instanceof Date) {
      movie.releaseDate = slots.releaseDate;
    } else if (slots.releaseDate === undefined) {
      // if releaseDate is not provided, set it to undefined
      movie.releaseDate = undefined;
    }
    console.log(`Movie ${slots.movieId} modified!`);
  }
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
  Movie.instances["1"] = new Movie({movieId:"1", title:"Pulp Fiction",releaseDate:"1994-05-12"});
  Movie.instances["2"] = new Movie({movieId:"2", title:"Star Wars", releaseDate:"1977-05-25"});
  Movie.instances["3"] = new Movie({movieId:"3", title:"Casablanca", releaseDate:"1943-01-23"});
  Movie.instances["4"] = new Movie({movieId:"4", title:"The Godfather",releaseDate:"1972-03-15"});
  Movie.saveAll();
};
//  Clear data
Movie.clearData = function () {
  if (confirm("Do you really want to delete all Movie data?")) {
    Movie.instances = {};
    localStorage.setItem("Movies", "{}");
  }
};
