import { h, type VNode } from "snabbdom";
import { type Bitboard, get_xys } from "../logic/bitboard";

type Color = "white" | "black";
type PieceType = "pawn" | "rook" | "knight" | "bishop" | "queen" | "king";

export interface Piece {
  color: Color;
  type: PieceType;
  position: Bitboard;
}

const render_single_piece = (piece: Piece, x: number, y: number): VNode => 
  h("figure." + piece.type, {
    on: {
      click: () => {
        console.log(`Clicked on ${piece.color} ${piece.type} at (${x}, ${y})`);
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

export default (piece: Piece): VNode[] =>
get_xys(piece.position).map(([x, y]) => render_single_piece(piece, x, y));
