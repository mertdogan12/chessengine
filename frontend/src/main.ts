import { classModule, init, styleModule, h } from "snabbdom";

const patch = init([classModule, styleModule]);

const app = document.getElementById("app");

const vnode = h("div#app", { style: { color: "red" } }, h("h1", "Hello world"));

patch(app!, vnode)