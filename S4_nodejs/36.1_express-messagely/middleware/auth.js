/** Middleware for handling req authorization for routes. */

const jwt = require("jsonwebtoken");
const { SECRET_KEY } = require("../config");
const ExpressError = require("../expressError");

/** Middleware: Authenticate user. */
function authenticateJWT(req, res, next) {
  try {
    const tokenFromBody = req.body._token || req.headers["_token"];
    const payload = jwt.verify(tokenFromBody, SECRET_KEY);
    req.user = payload; // create a current user
    return next();
  } catch (err) {
    // not an error, just not authd
    return next();
  }
}

/** Middleware: Requires user is authenticated. */
function checkLoggedIn(req, res, next) {
  if (!req.user) {
    return next(new ExpressError("Unauthorized", 401));
  } else {
    return next();
  }
}

/** Middleware: Requires correct username. */
function checkCorrUsr(req, res, next) {
  try {
    if (req.user.username === req.params.username) {
      return next();
    } else {
      return next(new ExpressError("Unauthorized", 401));
    }
  } catch (err) {
    // errors would happen here if we made a request and req.user is undefined
    return next(new ExpressError("Unauthorized", 401));
  }
}
// end

module.exports = {
  authenticateJWT,
  checkLoggedIn,
  checkCorrUsr,
};
