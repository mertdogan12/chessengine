import { h, type VNode } from "snabbdom";
import { type GameState } from "./gamestate";

import figure from "./piece";

export default function (gameState: GameState): VNode {
  return h(
    "div",
    {
      style: {
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      },
    },
    h(
      "div#board",
      {
        style: {
          width: "40vw",
          height: "40vw",
          display: "grid",
          gridTemplateColumns: "repeat(8, 1fr)",
          gridTemplateRows: "repeat(8, 1fr)",
          gap: "0px",
          position: "relative",
          backgroundImage: "url(/chessboard.png)",
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center",
          borderRadius: "1vw",
        },
      },
      Array.from(gameState.entries()).map(([position, piece]) => figure(piece, position)),
    ),
  );
}
