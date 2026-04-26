import { h, type VNode } from "snabbdom";
import { get_xys, type Bitboard } from "../logic/bitboard";

const render_single = (x: number, y: number): VNode => 
    h("field", {
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

export default (pos: Bitboard): VNode[] =>
    get_xys(pos).map(([x, y]) => render_single(x, y));