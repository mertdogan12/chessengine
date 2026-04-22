import { h, type VNode } from "snabbdom";
import { type Bitboard, get_xys } from "./bitboard";

type Color = "white" | "black";
type PieceType = "pawn" | "rook" | "knight" | "bishop" | "queen" | "king";

export interface Piece {
  color: Color;
  type: PieceType;
  position: Bitboard;
}

const renderSinglePiece = (piece: Piece, x: number, y: number): VNode =>
  h("figure." + piece.type, {
    style: {
      width: "100%",
      height: "100%",
      backgroundImage: `url(/${piece.type}-${piece.color}.svg)`,
      backgroundSize: "contain",
      backgroundRepeat: "no-repeat",
      backgroundPosition: "center",
      gridColumn: String(8 - x),
      gridRow: String(8 - y),
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      margin: "0px",
    },
  });

export default (piece: Piece): VNode[] => get_xys(piece.position).map(([x, y]) => renderSinglePiece(piece, x, y));
