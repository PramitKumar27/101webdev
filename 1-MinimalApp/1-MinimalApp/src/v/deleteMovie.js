/***********************************************
***  Methods for the use case "delete book"  ***
************************************************/
pl.v.deleteMovie = {
  setupUserInterface: function () {
    const deleteButton = document.forms["commit"].commit,
          selectEl = document.forms["commit"].selectMovie;
    // load all book objects
    Movie.retrieveAll();
    // populate the selection list with books
    for (let key of Object.keys( Movie.instances)) {
      const movie = Movie.instances[key];
      const optionEl = document.createElement("option");
      optionEl.text = movie.title;
      optionEl.value = movie.isbn;
      selectEl.add( optionEl, null);
    }
    // Set an event handler for the submit/delete button
    deleteButton.addEventListener("click",
        pl.v.deleteMovie.handleDeleteButtonClickEvent);
    // Set a handler for the event when the browser window/tab is closed
    window.addEventListener("beforeunload", Movie.saveAll);
  },
  // Event handler for deleting a book
  handleDeleteButtonClickEvent: function () {
    const selectEl = document.forms["commit"].selectMovie,
          isbn = selectEl.value;
    if (isbn) {
      Movie.destroy( isbn);
      // remove deleted book from select options
      selectEl.remove( selectEl.selectedIndex);
    }
  }
};