import { type Bitboard, get_bitboard } from "./bitboard";
import { type Piece } from "./piece";

export type GameState = Piece[];

export const initializeGamestate = (): GameState => {
  const state: Piece[] = [];

  state.push(...getRow("black", 7));
  state.push(...getRow("white", 0));

  var white_pawns: Bitboard = 0n;
  var black_pawns: Bitboard = 0n;

  for (let i = 0; i < 8; i++) {
    white_pawns |= get_bitboard(i, 1);
    black_pawns |= get_bitboard(i, 6);
  }

  state.push({ color: "white", type: "pawn", position: white_pawns });
  state.push({ color: "black", type: "pawn", position: black_pawns });

  return state;
};

const getRow = (color: "white" | "black", y: number): Piece[] => [
  { color, type: "rook", position: get_bitboard(0, y) | get_bitboard(7, y) },
  { color, type: "knight", position: get_bitboard(1, y) | get_bitboard(6, y) },
  { color, type: "bishop", position: get_bitboard(2, y) | get_bitboard(5, y) },
  { color, type: "queen", position: get_bitboard(3, y) },
  { color, type: "king", position: get_bitboard(4, y) },
];
