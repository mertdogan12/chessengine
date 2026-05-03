import { h, type VNode } from "snabbdom";
import { type Bitboard, get_xys } from "../logic/bitboard";
import { set_selected_piece } from "../gamestate";

export const Color = {
  White: 0,
  Black: 1,
} as const;

export const PieceType = {
  Pawn: 0,
  Rook: 1,
  Knight: 2,
  Bishop: 3,
  Queen: 4,
  King: 5
} as const;

export interface Piece {
  color: typeof Color[keyof typeof Color];
  type: typeof PieceType[keyof typeof PieceType];
  position: Bitboard;
}

const render_single_piece = (piece: Piece, x: number, y: number): VNode => 
  h("figure." + piece.type, {
    on: {
      click: () => {
        set_selected_piece(piece, x, y);
      }
    },
    style: {
      width: "100%",
      height: "100%",
      backgroundImage: `url(/${piece.type}-${piece.color}.svg)`,
      backgroundSize: "contain",
      backgroundRepeat: "no-repeat",
      backgroundPosition: "center",
      gridColumn: String(x + 1),
      gridRow: String(8 - y),
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      margin: "0px",
    },
  },
);

export const equal = (a: Piece | null, b: Piece | null): boolean => {
  if (a === null || b === null) return a === b;
  return a.color === b.color && a.type === b.type && a.position === b.position;
};

export default (piece: Piece): VNode[] =>
get_xys(piece.position).map(([x, y]) => render_single_piece(piece, x, y));
