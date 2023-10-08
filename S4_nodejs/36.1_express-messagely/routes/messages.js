const express = require("express");
const router = express.Router();
const Message = require("../models/message");
const { checkLoggedIn } = require("../middleware/auth");
const ExpressError = require("../expressError");
const User = require("../models/user");

/** GET /:id - get detail of message.
 * => {message: {id, body, sent_at, read_at,
 *  from_user: {username, first_name, last_name, phone},
 *  to_user: {username, first_name, last_name, phone}}
 **/
router.get("/:id", checkLoggedIn, async (req, res, next) => {
  try {
    const { id } = req.params;
    const message = await Message.get(id);

    if (
      req.user.username != message.from_user.username &&
      req.user.username != message.to_user.username
    ) {
      throw new ExpressError(`Access unauthorized to view message ${id}`, 401);
    }

    return res.json({ message });
  } catch (err) {
    next(err);
  }
});

/** POST / - post message.
 * {to_username, body} =>
 *   {message: {id, from_username, to_username, body, sent_at}}
 **/
router.post("/", checkLoggedIn, async (req, res, next) => {
  try {
    req.body.from_username = req.user.username;
    const message = await Message.create(req.body);
    return res.json({ message });
  } catch (err) {
    next(err);
  }
});

/** POST/:id/read - mark message as read:
 *  => {message: {id, read_at}}
 * Make sure that the only the intended recipient can mark as read.
 **/
router.post("/:id/read", checkLoggedIn, async (req, res, next) => {
  try {
    const { id } = req.params;
    const messagesTo = await User.messagesTo(req.user.username);
    if (!messagesTo.some((m) => m.id == id)) {
      throw new ExpressError(
        `Access unauthorized to mark message ${id} as read`,
        401
      );
    }

    const message = await Message.markRead(id);
    return res.json(message);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
