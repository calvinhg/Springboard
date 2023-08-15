const express = require("express");
const router = new express.Router();
const { ExpressError, checkIfItem } = require("../middleware");
const items = require("../fakeDb");

/** Return list of all items */
router.get("/", (req, res) => {
  res.json({ items });
});

/** Return single item */
router.get("/:name", checkIfItem, (req, res) => {
  const foundItem = items.find((item) => item.name === req.params.name);
  res.json({ item: foundItem });
});

/** Add item to db */
router.post("/", (req, res, next) => {
  try {
    if (!req.body.name || !req.body.price) {
      throw new ExpressError("Missing name or price", 400);
    }
    if (items.find((item) => item.name === req.body.name)) {
      throw new ExpressError("Item already exists", 400);
    }
    const newItem = { name: req.body.name, price: req.body.price };
    items.push(newItem);
    res.status(201).json({ added: newItem });
  } catch (err) {
    next(err);
  }
});

/** Modify item */
router.patch("/:name", checkIfItem, (req, res) => {
  const foundItem = items.find((item) => item.name === req.params.name);
  if (req.body.name) foundItem.name = req.body.name;
  if (req.body.price) foundItem.price = req.body.price;
  res.json({ item: foundItem });
});

/** Delete item */
router.delete("/:name", checkIfItem, (req, res) => {
  const foundItem = items.findIndex((item) => item.name === req.params.name);
  items.splice(foundItem, 1);
  res.json({ message: "Deleted" });
});

module.exports = router;
