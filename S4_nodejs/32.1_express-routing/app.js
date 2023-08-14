const express = require("express");
const { mean, median, mode } = require("simple-statistics");
const { ExpressError, getArrFromQuery } = require("./helpers");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/mean", (req, res, next) => {
  try {
    // Fails if missing or empty string
    if (!req.query.nums) {
      throw new ExpressError("nums are required", 400);
    }
    // Convert query string to array (+ validate)
    const nums = getArrFromQuery(req.query.nums);
    const response = { operation: "mean", value: mean(nums) };

    return res.json({ response: response });
  } catch (err) {
    next(err);
  }
});

app.get("/median", (req, res, next) => {
  try {
    if (!req.query.nums) {
      throw new ExpressError("nums are required", 400);
    }

    const nums = getArrFromQuery(req.query.nums);
    const response = { operation: "median", value: median(nums) };

    return res.json({ response: response });
  } catch (err) {
    next(err);
  }
});

app.get("/mode", (req, res, next) => {
  try {
    if (!req.query.nums) {
      throw new ExpressError("nums are required", 400);
    }

    const nums = getArrFromQuery(req.query.nums);
    const response = { operation: "mode", value: mode(nums) };

    return res.json({ response: response });
  } catch (err) {
    next(err);
  }
});

/** Other option without a bunch of repetition */
// app.get("/:operation", (req, res, next) => {
//   if (!["mean", "median", "mode"].includes(req.params.operation)) {
//     next();
//   }
//   try {
//     if (!req.query.nums) {
//       throw new ExpressError("nums are required", 400);
//     }

//     const nums = getArrFromQuery(req.query.nums);
//     const operation = req.params.operation;
//     const response = { operation: operation, value: 0 };
//     if (operation === "mean") response.value = mean(nums);
//     else if (operation === "median") response.value = median(nums);
//     else if (operation === "mode") response.value = mode(nums);

//     return res.json({ response: response });
//   } catch (err) {
//     next(err);
//   }
// });

app.use((req, res, next) => {
  const e = new ExpressError("Page not found", 404);
  next(e);
});

app.use((err, req, res, next) => {
  const status = err.status || 500;
  const message = err.message;

  return res.status(status).json({ error: { message, status } });
});

app.listen(3000, () => {
  console.log("Running on port 3000");
});
