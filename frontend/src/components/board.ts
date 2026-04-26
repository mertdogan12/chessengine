import { h, type VNode } from "snabbdom";
import { type GameState } from "../gamestate";

import figure from "./piece";
import field from "./field";
import { get_possible_moves } from "../logic/possible_move";

export default (gameState: GameState): VNode =>
  h(
    "div#board",
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
      [
        gameState.pieces.map(figure).flat(),
        gameState.selectedPiece ? field(get_possible_moves(gameState.selectedPiece)).flat() : []
      ].flat(),
    ),
  );
