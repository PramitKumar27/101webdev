/**
 * @fileOverview  Auxiliary data management procedures
 * @author Gerd Wagner
 */
import Author from "../m/Author.mjs";
import Publisher from "../m/Publisher.mjs";
import Book from "../m/Book.mjs";

/*******************************************
 *** Auxiliary methods for testing **********
 ********************************************/
/**
 *  Create and save test data
 */
function generateTestData() {
  try {
    Author.instances["1"] = new Author({
      authorId: 1,
      name: "Daniel Dennett"
    });
    Author.instances["2"] = new Author({
      authorId: 2,
      name: "Douglas Hofstadter"
    });
    Author.instances["3"] = new Author({
      authorId: 3,
      name: "Immanuel Kant"
    });
    Author.saveAll();
    Publisher.instances["Bantam Books"] = new Publisher({
      name: "Bantam Books",
      address: "New York, USA"
    });
    Publisher.instances["Basic Books"] = new Publisher({
      name: "Basic Books",
      address: "New York, USA"
    });
    Publisher.saveAll();
    Book.instances["0553345842"] = new Book({
      isbn: "0553345842",
      title: "The Mind's I",
      year: 1982,
      authorIdRefs: [1,2],
      publisher_id: "Bantam Books"
    });
    Book.instances["1463794762"] = new Book({
      isbn: "1463794762",
      title: "The Critique of Pure Reason",
      year: 2011,
      authorIdRefs: [3]
    });
    Book.instances["1928565379"] = new Book({
      isbn: "1928565379",
      title: "The Critique of Practical Reason",
      year: 2009,
      authorIdRefs: [3]
    });
    Book.instances["0465030793"] = new Book({
      isbn: "0465030793",
      title: "I Am A Strange Loop",
      year: 2000,
      authorIdRefs: [2],
      publisher_id: "Basic Books"
    });
    Book.saveAll();
  } catch (e) {
    console.log( `${e.constructor.name}: ${e.message}`);
  }
}
/**
 * Clear data
 */
function clearData() {
  if (confirm( "Do you really want to delete the entire database?")) {
    try {
      Author.instances = {};
      localStorage["authors"] = "{}";
      Publisher.instances = {};
      localStorage["publishers"] = "{}";
      Book.instances = {};
      localStorage["books"] = "{}";
      console.log("All data cleared.");
    } catch (e) {
      console.log( `${e.constructor.name}: ${e.message}`);
    }
  }
}

export { generateTestData, clearData };
