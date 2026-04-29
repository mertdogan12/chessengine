import { test, expect } from "vitest";
import { Piece } from "../src/components/piece";
import { get_possible_moves } from "../src/logic/possible_move";

test("calculates possible moves for a white pawn", () => {
  const testPiece: Piece = {
    color: "white",
    type: "pawn",
    position:
      0b00000000_00000000_00000000_00000000_00000000_00000000_00000000_10000000n, // Pawn at (7, 0)
  };

  const possibleMoves = get_possible_moves(testPiece);

  expect(possibleMoves).toBe(0b00000000_00000000_00000000_00000000_00000000_00000000_10000000_00000000n);
});

test("calculates possible moves for a knight", () => {
  const testPiece: Piece = {
    color: "white",
    type: "knight",
    position:
      0b00000000_00000000_00000000_00000000_00000000_00000000_00000000_10000000n, // Knight at (7, 0)
  };

  expect(get_possible_moves(testPiece)).toBe(
    0x402000n
  ); 

  testPiece.position = 0b00000000_00000000_00000000_00000000_00001000_00000000_00000000_00000000n; // Knight at (3, 3)

  expect(get_possible_moves(testPiece)).toBe(
    0x142200221400n
  ); 
});