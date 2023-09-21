/** Routes for companies of biztime */

const express = require("express");
const router = express.Router();
const db = require("../db");
const ExpressError = require("../expressError");

/** 404 handler for all invalid codes */
function checkIfExists(results, code) {
  if (!results.rows.length) {
    throw new ExpressError(`Company with code ${code} not found`, 404);
  }
  return;
}

/** GET /companies returns list of companies */
router.get("/", async (req, res, next) => {
  try {
    const results = await db.query("SELECT * FROM companies");
    return res.json({ companies: results.rows });
  } catch (err) {
    return next(new ExpressError(err.message, 500));
  }
});

/** GET /companies/<code> returns company info or 404 if not found */
router.get("/:code", async (req, res, next) => {
  try {
    const { code } = req.params;
    const results = await db.query(
      "SELECT code, name, description FROM companies WHERE code=$1",
      [code]
    );

    // If none, throws error that gets handled in catch block
    checkIfExists(results, code);
    return res.json({ company: results.rows[0] });
  } catch (err) {
    // If already an ExpressError, returns it to keep status code
    if (err instanceof ExpressError) {
      return next(err);
    } // Else returns generic error
    return next(new ExpressError(err.message, 500));
  }
});

/** POST /companies accepts json and adds company to DB.
 * Also checks for conflict or missing info.*/
router.post("/", async (req, res, next) => {
  try {
    const { code, name, description } = req.body;

    if (!code || !name || !description) {
      throw new ExpressError(
        "Please include a code, name and description",
        400
      );
    }

    const results = await db.query(
      "INSERT INTO companies (code, name, description) VALUES ($1, $2, $3) RETURNING code, name, description",
      [code, name, description]
    );
    return res.status(201).json({ company: results.rows[0] });
  } catch (err) {
    if (err instanceof ExpressError) {
      return next(err);
    } else if (err.constraint === "companies_pkey") {
      return next(new ExpressError("Company code already exists!", 400));
    } else if (err.constraint === "companies_name_key") {
      return next(new ExpressError("Company name already exists!", 400));
    } else {
      // Generic error
      return next(new ExpressError(err.message, 500));
    }
  }
});

/** PUT /companies/<code> accepts json and modifies company in DB.
 * Also checks for conflict or missing info.*/
router.put("/:code", async (req, res, next) => {
  try {
    const { code } = req.params;
    const { name, description } = req.body;

    if (!name || !description) {
      throw new ExpressError("Please include a new name and description", 400);
    }

    const results = await db.query(
      "UPDATE companies SET name=$1, description=$2 WHERE code=$3 RETURNING code, name, description",
      [name, description, code]
    );
    checkIfExists(results, code);
    return res.json({ company: results.rows[0] });
  } catch (err) {
    if (err instanceof ExpressError) {
      return next(err);
    } else if (err.constraint === "companies_name_key") {
      return next(new ExpressError("Company name already exists!", 400));
    } else {
      return next(new ExpressError(err.message, 500));
    }
  }
});

/** DELETE /companies/<code> deletes company from DB.
 * Also checks for 404.*/
router.delete("/:code", async (req, res, next) => {
  try {
    const { code } = req.params;

    const results = await db.query("DELETE FROM companies WHERE code=$1", [
      code,
    ]);
    if (results.rowCount !== 1) {
      throw new ExpressError(`Company with code ${code} not found`, 404);
    }
    return res.json({ status: "deleted" });
  } catch (err) {
    if (err instanceof ExpressError) {
      return next(err);
    } else {
      return next(new ExpressError(err.message, 500));
    }
  }
});

module.exports = router;
