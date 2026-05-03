import { get_bitboard } from "./logic/bitboard";
import { type Piece, Color, PieceType } from "./components/piece";
import { classModule, eventListenersModule, init, styleModule, toVNode, type VNode } from "snabbdom";

import board from "./components/board";

export interface GameState {
  pieces: Piece[][],
  selectedPiece: Piece | null,
};

const el = document.getElementById("app");
let app: VNode | null = el ? toVNode(el) : null;

var gamestate: GameState;

export const set_selected_piece = (piece: Piece, x: number, y: number) => {
  if (gamestate.selectedPiece === piece) {
    gamestate.selectedPiece = null;
    patch();
    return;
  }

  var p = { ...piece };
  p.position = piece.position & get_bitboard(x, y);

  gamestate.selectedPiece = p;
  patch();
};

export const move_piece = (piece: Piece | null, x: number, y: number) => {
  if (!piece) return;

  const newPosition = get_bitboard(x, y);

  gamestate.pieces[piece.color][piece.type].position ^= piece.position;
  gamestate.pieces[piece.color][piece.type].position |= newPosition;
  
  gamestate.selectedPiece = null;
  patch();
}

export const get_pieces = (color: typeof Color[keyof typeof Color]): Piece[] => gamestate.pieces[color];

export const initialize_gamestate = () => {
  gamestate = {
    pieces: [[], []],
    selectedPiece: null,
  };

  gamestate.pieces[Color.White][PieceType.Pawn] = { color: Color.White, type: PieceType.Pawn, position: 0x000000000000ff00n };
  set_row(0, gamestate.pieces[Color.White], Color.White);

  gamestate.pieces[Color.Black][PieceType.Pawn] = { color: Color.Black, type: PieceType.Pawn, position: 0x00ff000000000000n };
  set_row(7, gamestate.pieces[Color.Black], Color.Black);

  patch();
};

const set_row = (y: number, pieces: Piece[], color: typeof Color[keyof typeof Color]) => {
  pieces[PieceType.Rook] = { color: color, type: PieceType.Rook, position: get_bitboard(0, y) | get_bitboard(7, y) };
  pieces[PieceType.Knight] = { color: color, type: PieceType.Knight, position: get_bitboard(1, y) | get_bitboard(6, y) };
  pieces[PieceType.Bishop] = { color: color, type: PieceType.Bishop, position: get_bitboard(2, y) | get_bitboard(5, y) };
  pieces[PieceType.Queen] = { color: color, type: PieceType.Queen, position: get_bitboard(3, y) };
  pieces[PieceType.King] = { color: color, type: PieceType.King, position: get_bitboard(4, y) };
};

const patch = () => {
  const patchFn = init([classModule, styleModule, eventListenersModule]);

  if (!app) return;

  app = patchFn(app, board(gamestate));
}
