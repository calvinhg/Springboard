const express = require("express");
const router = express.Router();
const User = require("../models/user");
const { checkLoggedIn, checkCorrUsr } = require("../middleware/auth");

/** GET / - get list of users.
 * => {users: [{username, first_name, last_name, phone}, ...]}
 **/
router.get("/", checkLoggedIn, async (req, res, next) => {
  try {
    return res.json({ users: await User.all() });
  } catch (err) {
    next(err);
  }
});

/** GET /:username - get detail of users.
 * => {user: {username, first_name, last_name, phone, join_at, last_login_at}} **/
router.get("/:username", checkLoggedIn, async (req, res, next) => {
  try {
    const { username } = req.params;
    return res.json({ user: await User.get(username) });
  } catch (err) {
    next(err);
  }
});

/** GET /:username/to - get messages to user
 * => {messages: [{id, body, sent_at, read_at,
 *  from_user: {username, first_name, last_name, phone}}, ...]}
 **/
router.get("/:username/to", checkCorrUsr, async (req, res, next) => {
  try {
    const { username } = req.params;
    return res.json({ messages: await User.messagesTo(username) });
  } catch (err) {
    next(err);
  }
});

/** GET /:username/from - get messages from user
 * => {messages: [{id, body, sent_at,read_at,
 *  to_user: {username, first_name, last_name, phone}}, ...]}
 **/
router.get("/:username/from", checkCorrUsr, async (req, res, next) => {
  try {
    const { username } = req.params;
    return res.json({ messages: await User.messagesFrom(username) });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
