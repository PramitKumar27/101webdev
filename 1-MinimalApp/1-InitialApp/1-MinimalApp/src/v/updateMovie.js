/***********************************************
***  Methods for the use case updateMovie  ******
************************************************/
pl.v.updateMovie = {
  setupUserInterface: function () {
    const formEl = document.forms["commit"],
        saveButton = formEl.commit,
        selectMovieEl = formEl.selectMovie;
    // load all movie objects
    Movie.retrieveAll();
    // populate the selection list with movies
    for (let key of Object.keys( Movie.instances)) {
      const movie = Movie.instances[key];
      const optionEl = document.createElement("option");
      optionEl.text = movie.title;
      optionEl.value = movie.isbn;
      selectMovieEl.add( optionEl, null);
    }
    // when a movie is selected, fill the form with its data
    selectMovieEl.addEventListener("change", 
	    pl.v.updateMovie.handleMovieSelectionEvent);
    // set an event handler for the submit/save button
    saveButton.addEventListener("click",
        pl.v.updateMovie.handleSaveButtonClickEvent);
    // handle the event when the browser window/tab is closed
    window.addEventListener("beforeunload", Movie.saveAll);
  },
  handleMovieSelectionEvent: function () {
    const formEl = document.forms["commit"],
          selectMovieEl = formEl.selectMovie,
          key = selectMovieEl.value;
    if (key) {
      const movie = Movie.instances[key];
      formEl.isbn.value = movie.isbn;
      formEl.title.value = movie.title;
      formEl.year.value = movie.year;
    } else {
      formEl.reset();
    }
  },
  // save data
  handleSaveButtonClickEvent: function () {
    const formEl = document.forms["commit"],
        selectMovieEl = formEl.selectMovie;
    const slots = { isbn: formEl.isbn.value,
        title: formEl.title.value,
        year: formEl.year.value
    };
    Movie.update(slots);
    // update the selection list option element
    selectMovieEl.options[selectMovieEl.selectedIndex].text = slots.title;
    formEl.reset();
  }
};