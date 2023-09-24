/** Routes for industries of biztime */

const express = require("express");
const router = express.Router();
const db = require("../db");
const ExpressError = require("../expressError");
const slugify = require("slugify");

/** 404 handler for all invalid codes */
function checkIfExists(results, code) {
  if (!results.rows.length) {
    throw new ExpressError(`Industry with code ${code} not found`, 404);
  }
  return;
}

/** GET /industries returns list of industries */
router.get("/", async (req, res, next) => {
  try {
    const results = await db.query("SELECT * FROM industries");
    return res.json({ industries: results.rows });
  } catch (err) {
    return next(new ExpressError(err.message, 500));
  }
});

/** GET /industries/<code> returns industry info or 404 if not found */
router.get("/:code", async (req, res, next) => {
  try {
    const { code } = req.params;
    // Get industry info with industries
    const indRes = await db.query(
      `
      SELECT i.code, i.name, c.name AS companies
      FROM industries as i
      LEFT JOIN comps_inds AS ci ON i.code = ci.ind_code
      LEFT JOIN companies AS c ON c.code = ci.comp_code
      WHERE i.code=$1`,
      [code]
    );
    // If none, throws error that gets handled in catch block
    checkIfExists(indRes, code);

    // Select first result and add all other companies to it
    const industry = indRes.rows[0];
    industry.companies = indRes.rows.map((i) => i.companies);
    // Change array to be empty if no companies
    if (industry.companies[0] === null) industry.companies = [];

    return res.json({ industry: industry });
  } catch (err) {
    // If already an ExpressError, returns it to keep status code
    if (err instanceof ExpressError) {
      return next(err);
    } // Else returns generic error
    return next(new ExpressError(err.message, 500));
  }
});

/** POST /industries accepts json and adds industry to DB.
 * Also checks for conflict or missing info.*/
router.post("/", async (req, res, next) => {
  try {
    const { name = "", code = slugify(name || "") } = req.body;
    if (!name) {
      throw new ExpressError("Please include a name", 400);
    }

    const results = await db.query(
      "INSERT INTO industries (code, name) VALUES ($1, $2) RETURNING code, name",
      [code, name]
    );
    return res.status(201).json({ industry: results.rows[0] });
  } catch (err) {
    if (err instanceof ExpressError) {
      return next(err);
    } else if (err.constraint === "industries_pkey") {
      return next(
        new ExpressError(
          "Auto-generated industry code already exists. Please include a new code.",
          400
        )
      );
    } else if (err.constraint === "industries_name_key") {
      return next(new ExpressError("Industry name already exists!", 400));
    } else {
      // Generic error
      return next(new ExpressError(err.message, 500));
    }
  }
});

/** POST /industries/<code> accepts json and
 * adds or removes a company to industry.
 * Also checks for 404 or missing info.*/
router.post("/:ind_code", async (req, res, next) => {
  const { ind_code } = req.params;
  const { comp_code } = req.body;
  try {
    if (!comp_code) {
      throw new ExpressError("Please include a company code", 400);
    }

    // Try to delete if it exists
    const delRes = await db.query(
      "DELETE FROM comps_inds WHERE ind_code=$1 AND comp_code=$2",
      [ind_code, comp_code]
    );
    // If successful delete, return
    if (delRes.rowCount === 1) {
      return res.json({ status: `Removed ${comp_code} from ${ind_code}` });
    }

    // Otherwise try to add to db. 404s get caught below
    await db.query(
      "INSERT INTO comps_inds (ind_code, comp_code) VALUES ($1, $2)",
      [ind_code, comp_code]
    );
    return res.json({ status: `Added ${comp_code} to ${ind_code}` });
  } catch (err) {
    if (err instanceof ExpressError) {
      return next(err);
    } else if (err.constraint === "comps_inds_ind_code_fkey") {
      return next(
        new ExpressError(`Industry with code ${ind_code} not found`, 404)
      );
    } else if (err.constraint === "comps_inds_comp_code_fkey") {
      return next(
        new ExpressError(`Company with code ${comp_code} not found`, 404)
      );
    } else {
      return next(new ExpressError(err.message, 500));
    }
  }
});

module.exports = router;
