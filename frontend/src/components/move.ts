import { h, type VNode } from "snabbdom";
import { get_xys } from "../logic/bitboard";
import { type Piece } from "./piece";
import { get_possible_moves } from "../logic/possible_move";
import { move_piece } from "../gamestate";

const render_single = (x: number, y: number, piece: Piece | null): VNode => 
    h("field", {
        on: {
            click: () => move_piece(piece, x, y),
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
        }
    });

export default (piece: Piece): VNode[] =>
    get_xys(get_possible_moves(piece)).map(([x, y]) => render_single(x, y, piece));