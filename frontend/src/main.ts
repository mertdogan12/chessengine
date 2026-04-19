import { classModule, init, styleModule } from "snabbdom";
import { initializeGamestate } from "./gamestate";

import board from "./board";

const patch = init([classModule, styleModule]);

const app = document.getElementById("app");

const gameState = initializeGamestate();

patch(app!, board(gameState));
