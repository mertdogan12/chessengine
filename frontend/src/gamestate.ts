import { get_bitboard } from "./logic/bitboard";
import { type Piece, equal } from "./components/piece";
import { classModule, eventListenersModule, init, styleModule, toVNode, type VNode } from "snabbdom";

import board from "./components/board";

export interface GameState {
  pieces: Piece[],
  selectedPiece: Piece | null,
};

const el = document.getElementById("app");
let app: VNode | null = el ? toVNode(el) : null;

var gamestate: GameState;

export const set_selected_piece = (piece: Piece, x: number, y: number) => {
  var p = { ...piece };
  p.position = piece.position & get_bitboard(x, y);

  if (equal(gamestate.selectedPiece, p)) return;

  gamestate.selectedPiece = p;
  patch();
};

export const get_pieces = (): Piece[] => [...gamestate.pieces];

export const initialize_gamestate = () => {
  gamestate = {
    pieces: [],
    selectedPiece: null,
  };

  gamestate.pieces.push(...get_row("black", 7));
  gamestate.pieces.push(...get_row("white", 0));

  gamestate.pieces.push({ color: "white", type: "pawn", position: 0x000000000000ff00n });
  gamestate.pieces.push({ color: "black", type: "pawn", position: 0x00ff000000000000n });

  patch();
};

const get_row = (color: "white" | "black", y: number): Piece[] => [
  { color, type: "rook", position: get_bitboard(0, y) | get_bitboard(7, y) },
  { color, type: "knight", position: get_bitboard(1, y) | get_bitboard(6, y) },
  { color, type: "bishop", position: get_bitboard(2, y) | get_bitboard(5, y) },
  { color, type: "queen", position: get_bitboard(3, y) },
  { color, type: "king", position: get_bitboard(4, y) },
];

const patch = () => {
  const patchFn = init([classModule, styleModule, eventListenersModule]);

  if (!app) return;

  app = patchFn(app, board(gamestate));
}
