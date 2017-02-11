require("../styles/main.scss")
import { Game } from "./game"
import { initialise } from "./ui"
initialise()
export const game = Game()
game.initialise()
game.run()