import { test, expect } from "vitest";
import piece, { Piece } from "../src/components/piece";

test("renders a single piece correctly", () => {
  const testPiece: Piece = {
    color: "white",
    type: "knight",
    position:
      0b00000000_00000000_00000000_00000000_00000000_00000000_00100000_00000000n, // Knight at (5, 0)
  };

  const vnode = piece(testPiece);

  expect(vnode).toHaveLength(1);

  expect(vnode[0].data?.style?.gridColumn).toBe("6");
  expect(vnode[0].data?.style?.gridRow).toBe("7");
});

test("renders multiple pieces correctly", () => {
  const testPiece: Piece = {
    color: "black",
    type: "pawn",
    position:
      0b00000001_00000000_00000000_00000000_00000000_00000000_00000000_10000000n, // Pawns at (0, 0) and (7, 7)
  };

  const vnodes = piece(testPiece);

  expect(vnodes).toHaveLength(2);

  // First pawn
  expect(vnodes[0].data?.style?.gridColumn).toBe("8");
  expect(vnodes[0].data?.style?.gridRow).toBe("8");

  // Second pawn
  expect(vnodes[1].data?.style?.gridColumn).toBe("1");
  expect(vnodes[1].data?.style?.gridRow).toBe("1");
});
