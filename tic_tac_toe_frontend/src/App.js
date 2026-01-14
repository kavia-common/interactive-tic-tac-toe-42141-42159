import React, { useMemo, useState } from "react";
import "./App.css";

const PLAYER_X = "X";
const PLAYER_O = "O";

/**
 * Determine whether a board has a winner.
 * Returns:
 * - winner: "X" | "O" | null
 * - line: number[] | null (indices 0..8 of the winning line)
 */
function calculateWinner(board) {
  const lines = [
    // Rows
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    // Columns
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    // Diagonals
    [0, 4, 8],
    [2, 4, 6],
  ];

  for (const [a, b, c] of lines) {
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return { winner: board[a], line: [a, b, c] };
    }
  }
  return { winner: null, line: null };
}

function isBoardFull(board) {
  return board.every((cell) => cell !== null);
}

// PUBLIC_INTERFACE
function App() {
  /** Board is a 9-length array of "X" | "O" | null */
  const [board, setBoard] = useState(Array(9).fill(null));
  /** X always starts */
  const [currentPlayer, setCurrentPlayer] = useState(PLAYER_X);

  const outcome = useMemo(() => calculateWinner(board), [board]);

  const isGameOver = Boolean(outcome.winner) || isBoardFull(board);
  const isDraw = !outcome.winner && isBoardFull(board);

  const statusText = outcome.winner
    ? `Player ${outcome.winner} wins`
    : isDraw
      ? "Draw game"
      : `Current player: ${currentPlayer}`;

  function handleSquareClick(index) {
    // Ignore moves after game end or on occupied squares.
    if (isGameOver) return;
    if (board[index] !== null) return;

    const next = board.slice();
    next[index] = currentPlayer;
    setBoard(next);
    setCurrentPlayer((p) => (p === PLAYER_X ? PLAYER_O : PLAYER_X));
  }

  // PUBLIC_INTERFACE
  function handleReset() {
    /** Reset board and set X to start. */
    setBoard(Array(9).fill(null));
    setCurrentPlayer(PLAYER_X);
  }

  return (
    <div className="appRoot">
      <main className="gameShell" aria-label="Tic Tac Toe">
        <header className="gameHeader">
          <div className="titleBlock">
            <h1 className="gameTitle">Tic Tac Toe</h1>
            <p className="gameSubtitle">Ocean Professional</p>
          </div>

          <div
            className={`statusPill ${
              outcome.winner ? "statusPill--win" : isDraw ? "statusPill--draw" : ""
            }`}
            role="status"
            aria-live="polite"
          >
            {statusText}
          </div>
        </header>

        <section className="boardCard" aria-label="Game board">
          <div className="board" role="grid" aria-label="3 by 3 board">
            {board.map((value, idx) => {
              const isWinning = outcome.line?.includes(idx) ?? false;
              const isX = value === PLAYER_X;
              const isO = value === PLAYER_O;

              return (
                <button
                  key={idx}
                  type="button"
                  className={[
                    "cell",
                    value ? "cell--filled" : "cell--empty",
                    isWinning ? "cell--winning" : "",
                    isX ? "cell--x" : "",
                    isO ? "cell--o" : "",
                  ].join(" ")}
                  onClick={() => handleSquareClick(idx)}
                  aria-label={`Cell ${idx + 1}${value ? `, ${value}` : ""}`}
                  role="gridcell"
                  disabled={isGameOver || value !== null}
                >
                  <span className="cellValue" aria-hidden="true">
                    {value}
                  </span>
                </button>
              );
            })}
          </div>
        </section>

        <footer className="controls">
          <button type="button" className="btnPrimary" onClick={handleReset}>
            New game
          </button>
          <p className="hintText">
            X starts. Click an empty square to place your mark.
          </p>
        </footer>
      </main>
    </div>
  );
}

export default App;
