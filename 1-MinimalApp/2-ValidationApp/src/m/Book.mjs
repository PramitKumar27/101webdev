/**
 * @fileOverview  The model class Book with attribute definitions and storage management methods
 * @author Gerd Wagner
 * @copyright Copyright 2013-2014 Gerd Wagner, Chair of Internet Technology, Brandenburg University of Technology, Germany. 
 * @license This code is licensed under The Code Project Open License (CPOL), implying that the code is provided "as-is", 
 * can be modified to create derivative works, can be redistributed, and can be used in commercial applications.
 */
/**
 * Constructor function for the class Book 
 * @constructor
 * @param {{isbn: string, title: string, year: number, edition: number?}} slots
 */
import { isNonEmptyString, nextYear, isIntegerOrIntegerString, cloneObject }
  from "../../lib/util.mjs";
import { NoConstraintViolation, MandatoryValueConstraintViolation, RangeConstraintViolation,
  IntervalConstraintViolation, PatternConstraintViolation, UniquenessConstraintViolation }
  from "../../lib/errorTypes.mjs";

function Book( slots) {
  // assign default values
  this.isbn = "";   // string
  this.title = "";  // string
  this.year = 0;    // number (int)
  // this.edition   number (int) optional
  // set properties only if constructor is invoked with an argument
  if (arguments.length > 0) {
    this.setIsbn( slots.isbn); 
    this.setTitle( slots.title); 
    this.setYear( slots.year);
    if (slots.edition) this.setEdition( slots.edition);  // optional
  }
}
/*********************************************************
***  Class-level ("static") properties  ******************
**********************************************************/
// initially an empty collection (in the form of a map)
Book.instances = {};

/*********************************************************
***  Checks and Setters  *********************************
**********************************************************/
Book.checkIsbn = function (id) {
  if (!id) return new NoConstraintViolation();
  else if (typeof(id) !== "string" || id.trim() === "") {
    return new RangeConstraintViolation("The ISBN must be a non-empty string!");
  } else if (!(/\b\d{9}(\d|X)\b/.test( id))) {
    return new PatternConstraintViolation(
        'The ISBN must be a 10-digit string or a 9-digit string followed by "X"!');
  } else {
    return new NoConstraintViolation();
  }
};
Book.checkIsbnAsId = function (id) {
  var validationResult = Book.checkIsbn( id);
  if ((validationResult instanceof NoConstraintViolation)) {
    if (!id) {
      validationResult = new MandatoryValueConstraintViolation(
          "A value for the ISBN must be provided!");
    } else if (Book.instances[id]) {  
      validationResult = new UniquenessConstraintViolation(
          "There is already a book record with this ISBN!");
    } else {
      validationResult = new NoConstraintViolation();
    } 
  }
  return validationResult;
};
Book.prototype.setIsbn = function (id) {
  const validationResult = Book.checkIsbnAsId( id);
  if (validationResult instanceof NoConstraintViolation) {
    this.isbn = id;
  } else {
    throw validationResult;
  }
};
Book.checkTitle = function (t) {
  if (!t) {
    return new MandatoryValueConstraintViolation("A title must be provided!");
  } else if (!isNonEmptyString(t)) {
    return new RangeConstraintViolation("The title must be a non-empty string!");
  } else {
    return new NoConstraintViolation();
  }
};
Book.prototype.setTitle = function (t) {
  var validationResult = Book.checkTitle( t);
  if (validationResult instanceof NoConstraintViolation) {
    this.title = t;
  } else {
    throw validationResult;
  }
};
Book.checkYear = function (y) {
  const YEAR_FIRST_BOOK = 1459;
  if (!y) {
    return new MandatoryValueConstraintViolation(
	    "A publication year must be provided!");
  } else if (!isIntegerOrIntegerString( y)) {
    return new RangeConstraintViolation("The value of year must be an integer!");
  } else {
    if (typeof y === "string") y = parseInt(y);
    if (y < YEAR_FIRST_BOOK || y > nextYear()) {
      return new IntervalConstraintViolation(
          `The value of year must be between ${YEAR_FIRST_BOOK} and next year!`);
    } else {
      return new NoConstraintViolation();
    }
  }
};
Book.prototype.setYear = function (y) {
  const validationResult = Book.checkYear( y);
  if (validationResult instanceof NoConstraintViolation) {
    this.year = parseInt( y);
  } else {
    throw validationResult;
  }
};
Book.checkEdition = function (e) {
  // the "edition" attribute is optional
  if (!e || e === "") return new NoConstraintViolation();
  else {
    if (!isIntegerOrIntegerString(e) || parseInt(e) < 1) {
      return new RangeConstraintViolation(
	      "The value of edition must be a positive integer!");
    } else {
      return new NoConstraintViolation();
    }
  }
};
Book.prototype.setEdition = function (e) {
  var validationResult = Book.checkEdition( e);
  if (validationResult instanceof NoConstraintViolation) {
    if (!e || e === "") delete this.edition;  // unset optional property
    else this.edition = parseInt( e);
  } else {
    throw validationResult;
  }
};
/*********************************************************
***  Other Instance-Level Methods  ***********************
**********************************************************/
/**
 *  Serialize book object 
 */
Book.prototype.toString = function () {
  var bookStr = `Book{ ISBN: ${this.isbn}, title: ${this.title}, year: ${this.year}`;
  if (this.edition) bookStr += `, edition: ${this.edition}`;
  return bookStr;
};
/*********************************************************
***  Class-level ("static") storage management methods ***
**********************************************************/
/**
 *  Create a new book row
 */
Book.add = function (slots) {
  var book = null;
  try {
    book = new Book( slots);
  } catch (e) {
    console.log( `${e.constructor.name}: ${e.message}`);
    book = null;
  }
  if (book) {
    Book.instances[book.isbn] = book;
    console.log( `${book.toString()} created!`);
  }
};
/**
 *  Update an existing book row
 */
Book.update = function (slots) {
  var noConstraintViolated = true,
      updatedProperties = [];
  const book = Book.instances[slots.isbn],
        objectBeforeUpdate = cloneObject( book);
  try {
    if (book.title !== slots.title) {
      book.setTitle( slots.title);
      updatedProperties.push("title");
    }
    if (book.year !== parseInt(slots.year)) {
      book.setYear( slots.year);
      updatedProperties.push("year");
    }
    if (slots.edition && parseInt( slots.edition) !== book.edition) {
      // slots.edition has a non-empty value that is new
      book.setEdition( slots.edition);
      updatedProperties.push("edition");
    } else if (!slots.edition && book.edition) {
      // slots.edition has an empty value that is new
      delete book.edition;  // unset the property "edition"
      updatedProperties.push("edition");
	  }
  } catch (e) {
    console.log( `${e.constructor.name}: ${e.message}`);
    noConstraintViolated = false;
    // restore object to its state before updating
    Book.instances[slots.isbn] = objectBeforeUpdate;
  }
  if (noConstraintViolated) {
    if (updatedProperties.length > 0) {
      console.log(`Properties ${updatedProperties.toString()} modified for book ${slots.isbn}`);
    } else {
      console.log(`No property value changed for book ${slots.isbn}!`);
    }
  }
};
/**
 *  Delete a book
 */
Book.destroy = function (isbn) {
  if (Book.instances[isbn]) {
    console.log( `${Book.instances[isbn].toString()} deleted!`);
    delete Book.instances[isbn];
  } else {
    console.log(`There is no book with ISBN ${isbn} in the database!`);
  }
};
/**
 *  Convert row to object
 */
Book.convertRec2Obj = function (bookRow) {
  var book={};
  try {
    book = new Book( bookRow);
  } catch (e) {
    console.log(`${e.constructor.name} while deserializing a book row: ${e.message}`);
  }
  return book;
};
/**
 *  Load all book table rows and convert them to objects
 */
Book.retrieveAll = function () {
  var booksString="";
  try {
    if (localStorage["books"]) {
      booksString = localStorage["books"];
    }
  } catch (e) {
    alert("Error when reading from Local Storage\n" + e);
  }
  if (booksString) {
    const books = JSON.parse( booksString);
    console.log( `${Object.keys( books).length} books loaded.`);
    for (let key of Object.keys( books)) {
      Book.instances[key] = Book.convertRec2Obj( books[key]);
    }
  }
};
/**
 *  Save all book objects
 */
Book.saveAll = function () {
  var booksString="", error=false;
  const nmrOfBooks = Object.keys( Book.instances).length;
  try {
    booksString = JSON.stringify( Book.instances);
    localStorage["books"] = booksString;
  } catch (e) {
    alert("Error when writing to Local Storage\n" + e);
    error = true;
  }
  if (!error) console.log( `${nmrOfBooks} books saved.`);
};
/*******************************************
*** Auxiliary methods for testing **********
********************************************/
/**
 *  Create and save test data
 */
Book.generateTestData = function () {
  try {
    Book.instances["006251587X"] = new Book({
      isbn: "006251587X",
      title: "Weaving the Web",
      year: 2000,
      edition: 2
    });
    Book.instances["0465026567"] = new Book({
      isbn: "0465026567",
      title: "Gödel, Escher, Bach",
      year: 1999
    });
    Book.instances["0465030793"] = new Book({
      isbn: "0465030793",
      title: "I Am A Strange Loop",
      year: 2008
    });
    Book.saveAll();
  } catch (e) {
    console.log(`${e.constructor.name}: ${e.message}`);
  }
};
/**
 * Clear data
 */
Book.clearData = function () {
  if (confirm("Do you really want to delete all book data?")) {
    try {
      Book.instances = {};
      localStorage["books"] = "{}";
      console.log("All data cleared.");
    } catch (e) {
      console.log(`${e.constructor.name}: ${e.message}`);
    }
  }
};

export default Book;
