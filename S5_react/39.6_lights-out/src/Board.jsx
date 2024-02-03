import React, { useState, useEffect } from "react";
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
  const [targetMoves, setTargetMoves] = useState(0)
  const [moves, setMoves] = useState(0)

  /** create a board nRows high/nCols wide, every cell lit */
  function createBoard() {
    const initialBoard = Array.from({ length: nRows },
      () => Array(nCols).fill(false));
    
    return initialBoard;
  }

  /** Flip a random amount between 1/3 and 2/3 of cells with their neighbors */
  function flipInitialCells() {
    const totalCells = nRows * nCols;
    const maxFlip = totalCells * 2 / 3;
    const minFlip = totalCells / 3;
    // Calc num of cells to flip
    const nCellsToFlip = Math.floor(Math.random() * (maxFlip - minFlip) + minFlip);
    
    // Create array in form of ['0-0', '0-1', '0-2', '1-0'...]
    const arrOfIdx = board.reduce((arr, row, y) => {
      return arr.concat(row.map((_, x) => y + "-" + x));
    }, []);
    
    // Randomly remove items from the array, and flip their coord
    for (let i = 0; i < nCellsToFlip; i++) {
      const randIdx = Math.floor(Math.random() * arrOfIdx.length);
      flipCells(arrOfIdx.splice(randIdx, 1)[0]);
    };
    setTargetMoves(nCellsToFlip)
    setTimeout(() => {
      setMoves(0)
    }, 10);
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

      setMoves(moves + 1)

      return boardCopy
    });
  }

  useEffect(() => flipInitialCells(), [])  

  // if the game is won, just show a winning msg & render nothing else
  if (hasWon()) {
    return (<>
      <p>You win!</p>
      <button id="restartBtn" onClick={flipInitialCells}>Restart</button>
    </>)
  }

  // make table board
  return (<>
    <table><tbody>
      {board.map((row, y) => <tr key={"row-" + y}>
        {row.map((cell, x) =>
          <Cell flipCells={flipCells} isLit={cell}
            coord={y + "-" + x} key={x + "-" + y} />)}
      </tr>) }
    </tbody></table>
    <footer>
      <span id="moves">Moves: {moves}</span>
      <button id="restartBtn" onClick={flipInitialCells}>Restart</button>
      <span id="target">Target: {targetMoves}</span>
    </footer>
  </>)
}

export default Board;
