class ExpressError extends Error {
  constructor(message, status) {
    super();
    this.message = message;
    this.status = status;
    // console.error(this.stack);
  }
}

/** Validates and returns [3, 1, 2] from "3,1,2"
 * Throws error if anything else than nums and commas
 */
function getArrFromQuery(query) {
  return query.split(",").map((n) => {
    if (!Number(n)) {
      throw new ExpressError(`${n} is not a number`, 400);
    }
    return Number(n);
  });
}

module.exports = { ExpressError, getArrFromQuery };
