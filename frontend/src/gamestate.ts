import { get_bitboard, type Bitboard } from "./logic/bitboard";
import { type Piece, Color, PieceType } from "./components/piece";
import {
  classModule,
  eventListenersModule,
  init,
  styleModule,
  toVNode,
  type VNode,
} from "snabbdom";

import board from "./components/board";
import { rochade_possible } from "./logic/possible_move";
import { render_single_move } from "./components/move";

export interface GameState {
  pieces: Piece[][];
  selectedPiece: Piece | null;
  rochade: [boolean, boolean];
}

const el = document.getElementById("app");
let app: VNode | null = el ? toVNode(el) : null;

var gamestate: GameState;

export const rochade_vnodes = (): VNode[] => {
  if (
    !gamestate.selectedPiece ||
    gamestate.selectedPiece.type !== PieceType.King || 
    gamestate.rochade[gamestate.selectedPiece.color]
  )
    return [];

  const possible = rochade_possible(gamestate.selectedPiece.color);
  const vnodes: VNode[] = [];

  if (possible[0]) {
    vnodes.push(
      render_single_move(
        2,
        gamestate.selectedPiece.color === Color.White ? 0 : 7,
        () => rochade(gamestate.selectedPiece!.color, true),
      ),
    );
  }
  if (possible[1]) {
    vnodes.push(
      render_single_move(
        6,
        gamestate.selectedPiece.color === Color.White ? 0 : 7,
        () => rochade(gamestate.selectedPiece!.color, false),
      ),
    );
  }

  return vnodes;
};

const rochade = (color: (typeof Color)[keyof typeof Color], long: boolean) => {
  let kingPosition: Bitboard = 0n
  let rookPosition: Bitboard = 0n
  let rookOldPosition: Bitboard = 0n

  const king = gamestate.pieces[color][PieceType.King];
  const rook = gamestate.pieces[color][PieceType.Rook];

  if (long) {
    kingPosition = 0b100n;
    rookPosition = 0b1000n;
    rookOldPosition = 0b1n;
  } else {
    kingPosition = 0b1000000n;
    rookPosition = 0b100000n;
    rookOldPosition = 0b10000000n;
  }

  if (color === Color.Black) {
    kingPosition <<= 56n;
    rookPosition <<= 56n;
    rookOldPosition <<= 56n;
  }

  king.position ^= king.position;
  king.position |= kingPosition;

  rook.position ^= rookOldPosition;
  rook.position |= rookPosition;

  gamestate.selectedPiece = null;
  gamestate.rochade[color] = true;
  patch();
}

export const set_selected_piece = (piece: Piece, x: number, y: number) => 
  set_selected_piece_bitboard(piece, get_bitboard(x, y));

const set_selected_piece_bitboard = (piece: Piece, position: Bitboard) => {
  if (gamestate.selectedPiece === piece) {
    gamestate.selectedPiece = null;
    patch();
    return;
  }

  var p = { ...piece };
  p.position = position;

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
};

export const get_pieces = (
  color: (typeof Color)[keyof typeof Color],
): Piece[] => gamestate.pieces[color];

export const get_opponent_pieces = (
  color: (typeof Color)[keyof typeof Color],
) => get_pieces(((color + 1) % 2) as (typeof Color)[keyof typeof Color]);

export const initialize_gamestate = () => {
  gamestate = {
    pieces: [[], []],
    rochade: [false, false],
    selectedPiece: null,
  };

  gamestate.pieces[Color.White][PieceType.Pawn] = {
    color: Color.White,
    type: PieceType.Pawn,
    position: 0x000000000000ff00n,
  };
  set_row(0, gamestate.pieces[Color.White], Color.White);

  gamestate.pieces[Color.Black][PieceType.Pawn] = {
    color: Color.Black,
    type: PieceType.Pawn,
    position: 0x00ff000000000000n,
  };
  set_row(7, gamestate.pieces[Color.Black], Color.Black);

  patch();
};

const set_row = (
  y: number,
  pieces: Piece[],
  color: (typeof Color)[keyof typeof Color],
) => {
  pieces[PieceType.Rook] = {
    color: color,
    type: PieceType.Rook,
    position: get_bitboard(0, y) | get_bitboard(7, y),
  };
  pieces[PieceType.Knight] = {
    color: color,
    type: PieceType.Knight,
    position: get_bitboard(1, y) | get_bitboard(6, y),
  };
  pieces[PieceType.Bishop] = {
    color: color,
    type: PieceType.Bishop,
    position: get_bitboard(2, y) | get_bitboard(5, y),
  };
  pieces[PieceType.Queen] = {
    color: color,
    type: PieceType.Queen,
    position: get_bitboard(3, y),
  };
  pieces[PieceType.King] = {
    color: color,
    type: PieceType.King,
    position: get_bitboard(4, y),
  };
};

const patch = () => {
  const patchFn = init([classModule, styleModule, eventListenersModule]);

  if (!app) return;

  app = patchFn(app, board(gamestate));
};
