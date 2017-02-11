require("../styles/main.scss")
import { Game } from "./game"
import { bind } from "./ui"
bind();
export const game = Game();
game.run();