/** Routes for invoices of biztime */

const express = require("express");
const router = express.Router();
const db = require("../db");
const ExpressError = require("../expressError");

/** 404 handler for IDs that return [] */
function checkIfExists(results, id) {
  if (!results.rows.length) {
    throw new ExpressError(`Invoice with id ${id} not found`, 404);
  }
  return;
}

/** 400 handler for IDs that are invalid */
router.use("/:id", (req, res, next) => {
  const { id } = req.params;
  if (!Number(id) || id <= 0) {
    return next(new ExpressError(`${id} is not a valid id!`, 400));
  }
  return next();
});

/** 400 handler for invalid amounts */
router.use("/", (req, res, next) => {
  const { amt } = req.body;
  if (amt) {
    if (!Number(amt)) {
      return next(new ExpressError(`${amt} is not a valid amount!`, 400));
    } else if (amt <= 0) {
      return next(
        new ExpressError(`Amount $${amt} must be greater than 0`, 400)
      );
    }
  }
  next();
});

/** GET /invoices returns list of invoices */
router.get("/", async (req, res, next) => {
  try {
    const results = await db.query("SELECT id, comp_code FROM invoices");
    return res.json({ invoices: results.rows });
  } catch (err) {
    return next(new ExpressError(err.message, 500));
  }
});

/** GET /invoices/<id> returns invoice info or 404 if not found */
router.get("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const invRes = await db.query("SELECT * FROM invoices WHERE id=$1", [id]);
    // If none, throws error that gets handled in catch block
    checkIfExists(invRes, id);

    // Get company info
    const invoice = invRes.rows[0];
    const compRes = await db.query("SELECT * FROM companies WHERE code=$1", [
      invoice.comp_code,
    ]);

    // Add company info to invoice and remove company code
    invoice.company = compRes.rows[0];
    delete invoice.comp_code;

    return res.json({ invoice: invoice });
  } catch (err) {
    // If already an ExpressError, returns it to keep status id
    if (err instanceof ExpressError) {
      return next(err);
    } // Else returns generic error
    return next(new ExpressError(err.message, 500));
  }
});

/** POST /invoices accepts json and adds invoice to DB.
 * Also checks for missing info.*/
router.post("/", async (req, res, next) => {
  try {
    const { comp_code, amt } = req.body;

    if (!comp_code || !amt) {
      throw new ExpressError(
        "Please include a company code and valid amount",
        400
      );
    }

    const results = await db.query(
      "INSERT INTO invoices (comp_code, amt) VALUES ($1, $2) RETURNING *",
      [comp_code, amt]
    );
    return res.status(201).json({ invoice: results.rows[0] });
  } catch (err) {
    if (err instanceof ExpressError) {
      return next(err);
    } else if (err.constraint === "invoices_comp_code_fkey") {
      return next(new ExpressError("Company code doesn't exist", 400));
    } else {
      // Generic error
      return next(new ExpressError(err.message, 500));
    }
  }
});

/** PUT /invoices/<id> accepts json and modifies invoice amount in DB.*/
router.put("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const { amt } = req.body;

    if (!amt) {
      throw new ExpressError("Please include a new amount", 400);
    }

    const results = await db.query(
      "UPDATE invoices SET amt=$1 WHERE id=$2 RETURNING *",
      [amt, id]
    );
    checkIfExists(results, id);
    return res.json({ invoice: results.rows[0] });
  } catch (err) {
    if (err instanceof ExpressError) {
      return next(err);
    } else {
      return next(new ExpressError(err.message, 500));
    }
  }
});

/** DELETE /invoices/<id> deletes invoice from DB.
 * Also checks for 404.*/
router.delete("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;

    const results = await db.query("DELETE FROM invoices WHERE id=$1", [id]);
    if (results.rowCount !== 1) {
      throw new ExpressError(`Invoice with id ${id} not found`, 404);
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
