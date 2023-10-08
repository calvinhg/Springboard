const express = require("express");
const router = express.Router();
const User = require("../models/user");
const jwt = require("jsonwebtoken");
const { SECRET_KEY } = require("../config");
const ExpressError = require("../expressError");

/** POST /login - login: {username, password} => {token} */
router.post("/login", async (req, res, next) => {
  try {
    const { username, password } = req.body;

    if (await User.authenticate(username, password)) {
      await User.updateLoginTimestamp(username);
      const token = jwt.sign({ username }, SECRET_KEY);
      return res.json({ token });
    }
    throw new ExpressError("Invalid username/password", 401);
  } catch (err) {
    return next(err);
  }
});

/** POST /register - register user: registers, logs in, and returns token.
 * {username, password, first_name, last_name, phone} => {token}. */
router.post("/register", async (req, res, next) => {
  try {
    const user = await User.register(req.body);
    await User.updateLoginTimestamp(user.username);
    const token = jwt.sign({ username: user.username }, SECRET_KEY);
    return res.json({ token });
  } catch (err) {
    return next(err);
  }
});

module.exports = router;
