import React, { useState } from "react";
import Cell from "./Cell";
import "./Board.css";

/** Game board of Lights out.
 *
 * Properties:
 *
 * - nRows: number of rows of board
 * - nCols: number of cols of board
 * - chanceLightStartsOn: float, chance any cell is lit at start of game
 *
 * State:
 *
 * - board: array-of-arrays of true/false
 *
 *    For this board:
 *       .  .  .
 *       O  O  .     (where . is off, and O is on)
 *       .  .  .
 *
 *    This would be: [[f, f, f], [t, t, f], [f, f, f]]
 *
 *  This should render an HTML table of individual <Cell /> components.
 *
 *  This doesn't handle any clicks --- clicks are on individual cells
 *
 **/
const Board = ({ nRows, nCols, chanceLightStartsOn }) => {
  const [board, setBoard] = useState(createBoard());

  /** create a board nRows high/nCols wide, each cell randomly lit or unlit */
  function createBoard() {
    const initialBoard = Array.from({ length: nRows },
      () => Array(nCols).fill(false));
    
    const totalCells = nRows * nCols;
    const maxCellsToFlip = Math.ceil(totalCells * 2 / 3);
    const minCellsToFlip = Math.floor(totalCells / 3);

    const arrOfIdx = initialBoard.reduce((arr, row, y) => {
      return arr.concat(row.map((_, x) => y + "-" + x));
    }, []);
    
    return initialBoard;
  }

  /** checks to see if every cell in every row is false (unlit) */
  function hasWon() {
    return board.every(row => row.every(cell => !cell));
  }

  function flipCells(coord) {
    setBoard(oldBoard => {
      const [y, x] = coord.split("-").map(Number);

      const flipCell = (y, x, boardCopy) => {
        // if this coord is actually on board, flip it

        if (x >= 0 && x < nCols && y >= 0 && y < nRows) {
          boardCopy[y][x] = !boardCopy[y][x];
        }
      };

      // Make a (deep) copy of the oldBoard
      const boardCopy = oldBoard.map(row => [...row]);

      // in the copy, flip this cell and the cells around it
      flipCell(y, x, boardCopy);
      flipCell(y + 1, x, boardCopy);
      flipCell(y - 1, x, boardCopy);
      flipCell(y, x + 1, boardCopy);
      flipCell(y, x - 1, boardCopy);

      return boardCopy
    });
  }

  // if the game is won, just show a winning msg & render nothing else
  if (hasWon()) console.log('winn');

  // make table board
  return (<table><tbody>
    {board.map((row, y) => <tr key={"row-" + y}>
      {row.map((cell, x) =>
        <Cell flipCells={flipCells} isLit={cell} coord={y + "-" + x} key={x + "-" + y} />)}
   </tr>) }
  </tbody></table>)
}

export default Board;
