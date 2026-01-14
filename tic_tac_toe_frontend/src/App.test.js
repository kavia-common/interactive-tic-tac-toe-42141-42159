import { fireEvent, render, screen } from "@testing-library/react";
import App from "./App";

function clickCell(n) {
  fireEvent.click(screen.getByRole("button", { name: new RegExp(`^Cell ${n}$`, "i") }));
}

test("renders the game shell", () => {
  render(<App />);
  expect(screen.getByRole("heading", { name: /tic tac toe/i })).toBeInTheDocument();
  expect(screen.getByRole("status")).toHaveTextContent(/current player:\s*x/i);
  expect(screen.getByRole("button", { name: /new game/i })).toBeInTheDocument();
});

test("can play moves leading to an X win and blocks further moves", () => {
  render(<App />);

  // X: 1, O: 4, X: 2, O: 5, X: 3 -> X wins top row
  clickCell(1);
  clickCell(4);
  clickCell(2);
  clickCell(5);
  clickCell(3);

  expect(screen.getByRole("status")).toHaveTextContent(/player x wins/i);

  // Further clicks should not be possible (board disables after game end).
  expect(screen.getByRole("button", { name: /^cell 6$/i })).toBeDisabled();
});

test("reset clears the board and sets X to start", () => {
  render(<App />);

  clickCell(1); // X
  expect(screen.getByRole("status")).toHaveTextContent(/current player:\s*o/i);

  fireEvent.click(screen.getByRole("button", { name: /new game/i }));

  expect(screen.getByRole("status")).toHaveTextContent(/current player:\s*x/i);
  // Cell 1 should be empty again (aria label reverts back without ", X")
  expect(screen.getByRole("button", { name: /^cell 1$/i })).toBeInTheDocument();
});
