import { h, type VNode } from "snabbdom";
import { get_xys } from "../logic/bitboard";
import { type Piece } from "./piece";
import { get_possible_moves } from "../logic/possible_move";
import { get_pieces, move_piece } from "../gamestate";

export const render_single_move = (
  x: number,
  y: number,
  callback: (x: number, y: number) => void,
): VNode =>
  h("field", {
    on: {
      click: () => callback(x, y),
    },
    style: {
      width: "100%",
      height: "100%",
      backgroundColor: "red",
      gridColumn: String(x + 1),
      gridRow: String(8 - y),
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      margin: "0px",
      opacity: "0.8",
    },
  });

export default (piece: Piece): VNode[] =>
  get_xys(get_possible_moves(piece, false)).map(([x, y]) =>
    render_single_move(x, y, () => move_piece(piece, x, y)),
  );
