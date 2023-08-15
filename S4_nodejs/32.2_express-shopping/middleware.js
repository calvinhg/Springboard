class ExpressError extends Error {
  constructor(message, status) {
    super();
    this.message = message;
    this.status = status;
    // console.error(this.stack);
  }
}

/** Checks if item is found, then continues if so */
function checkIfItem(req, res, next) {
  const foundItem = items.find((item) => item.name === req.params.name);
  try {
    if (foundItem === undefined) {
      throw new ExpressError("Item not found", 404);
    } else {
      return next();
    }
  } catch (err) {
    return next(err);
  }
}

module.exports = { ExpressError, checkIfItem };
