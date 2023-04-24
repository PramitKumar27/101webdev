/***********************************************
***  Methods for the use case createMovie  ******
************************************************/
// pl.v.createMovie = {
//   setupUserInterface: function () {
//     const saveButton = document.forms["Movie"].commit;
//     // load all movie objects
//     Movie.retrieveAll();
//     // set an event handler for the submit/save button
//     saveButton.addEventListener("click", 
//         pl.v.createMovie.handleSaveButtonClickEvent);
//     // set a handler for the event when the browser window/tab is closed
//     window.addEventListener("beforeunload", Movie.saveAll);
//   },
//   // save user input data
//   handleSaveButtonClickEvent: function () {
//     const formEl = document.forms["Movie"];
//     const slots = { isbn: formEl.isbn.value,
//         title: formEl.title.value, 
//         year: formEl.year.value};
//     Movie.add( slots);
//     formEl.reset();
//   }
// };

/***********************************************
***  Methods for the use case createMovie  ******
************************************************/
pl.v.createMovie = {
  setupUserInterface: function () {
    const saveButton = document.forms["Movie"].commit;
    // load all movie objects
    Movie.retrieveAll();
    // set an event handler for the submit/save button
    saveButton.addEventListener("click", 
        pl.v.createMovie.handleSaveButtonClickEvent);
    // set a handler for the event when the browser window/tab is closed
    window.addEventListener("beforeunload", Movie.saveAll);
  },
  // save user input data
  handleSaveButtonClickEvent: function () {
    const formEl = document.forms["Movie"];
    const slots = { 
      movieId: formEl.movieId.value.trim(), 
      title: formEl.title.value.trim(), 
      releaseDate: formEl.releaseDate.value.trim()
    };
    Movie.add(slots);
    formEl.reset();
  }
};


