const express = require("express");
const app = express();
const itemRoutes = require("./routes/items");
const { ExpressError } = require("./middleware");

app.use(express.json());
app.use("/items", itemRoutes);

/** 404 handler */

app.use(function (req, res, next) {
  const e = new ExpressError("Not Found", 404);
  return next(e);
});

/** general error handler */

app.use((err, req, res, next) => {
  res.status(err.status || 500);

  return res.json({
    error: err.message,
  });
});

module.exports = app;
