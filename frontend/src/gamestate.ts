import { type Piece, type Position } from "./piece";

export type GameState = Map<Position, Piece>;

export function initializeGamestate(): GameState {
  const state: GameState = new Map();

  setFistRow(state, "white", 0);
  setFistRow(state, "black", 7);

  for (let i = 0; i < 8; i++) {
    state.set([i, 1], { color: "white" , type: "pawn" });
    state.set([i, 6], { color: "black" , type: "pawn" });
  }

  return state;
}

function setFistRow(state: GameState, color: "white" | "black", y: number) {
  state.set([0, y], { color, type: "rook" });
  state.set([1, y], { color, type: "knight" });
  state.set([2, y], { color, type: "bishop" });
  state.set([3, y], { color, type: "queen" });
  state.set([4, y], { color, type: "king" });
  state.set([5, y], { color, type: "bishop" });
  state.set([6, y], { color, type: "knight" });
  state.set([7, y], { color, type: "rook" });
}