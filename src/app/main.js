require("../styles/main.scss")
import isotip from "isotip"
import { Game } from "./game"
import { initialise } from "./ui"
export var game

export const gameover = (prestige) => {
    // for now we just restart
    newgame()
}

export const newgame = () => {
    game = Game()
    game.initialise()
    initialise()
    game.run()
}

isotip.init();

newgame()