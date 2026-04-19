import { h, type VNode } from "snabbdom";

type Color = "white" | "black";
type PieceType = "pawn" | "rook" | "knight" | "bishop" | "queen" | "king";

export type Position = [number, number];

export interface Piece {
  color: Color;
  type: PieceType;
}

export default function (piece: Piece, position: Position): VNode {
  return h("figure." + piece.type, {
    style: {
      width: "100%",
      height: "100%",
      backgroundImage: `url(/${piece.type}-${piece.color}.svg)`,
      backgroundSize: "contain",
      backgroundRepeat: "no-repeat",
      backgroundPosition: "center",
      gridColumn: String(position[0] + 1),
      gridRow: String(position[1] + 1),
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      margin: "0px",
    },
  });
}
