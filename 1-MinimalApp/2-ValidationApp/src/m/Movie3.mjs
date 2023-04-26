/**
 * @fileOverview  The model class movie with attribute definitions and storage management methods
 * @author Gerd Wagner
 * @copyright Copyright 2013-2014 Gerd Wagner, Chair of Internet Technology, Brandenburg University of Technology, Germany.
 * @license This code is licensed under The Code Project Open License (CPOL), implying that the code is provided "as-is",
 * can be modified to create derivative works, can be redistributed, and can be used in commercial applications.
 */
import { isNonEmptyString } from "../../lib/util.mjs";
import { RangeConstraintViolation } from "../../lib/errorTypes.mjs";

class Movie {
  constructor(slots) {
    this.movieId = slots.movieId;
    this.title = slots.title;
    this.releaseDate = slots.releaseDate;
  }

  set movieId(movieId) {
    if (!Number.isInteger(movieId) || movieId < 0) {
      throw new RangeConstraintViolation('movieId must be a positive integer');
    }
    this._movieId = movieId;
  }

  get movieId() {
    return this._movieId;
  }

  set title(title) {
    if (!isNonEmptyString(title) || title.length > 120) {
      throw new RangeConstraintViolation('title must be a non-empty string with at most 120 characters');
    }
    this._title = title;
  }

  get title() {
    return this._title;
  }

  set releaseDate(releaseDate) {
    const minReleaseDate = new Date('1895-12-28');
    if (releaseDate && releaseDate < minReleaseDate) {
      throw new RangeConstraintViolation('releaseDate must be greater than or equal to 1895-12-28');
    }
    this._releaseDate = releaseDate;
  }

  get releaseDate() {
    return this._releaseDate;
  }
}

export { Movie };
