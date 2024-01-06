import React from "react";
import "./Cell.css";

/** A single cell on the board.
 *
 * This has no state --- just two props:
 *
 * - flipCells: a function rec'd from the board which flips this
 *      cell and the cells around of it
 *
 * - isLit: boolean, is this cell lit?
 *
 * This handles clicks --- by calling flipCells
 *
 **/
const Cell = ({ flipCells, isLit, coord }) => {
  const classes = `Cell ${isLit ? "Cell-lit" : ""}`;
  const boundFlipper = flipCells.bind(null, coord)
  return <td className={classes} onClick={boundFlipper} />;
}

export default Cell;
