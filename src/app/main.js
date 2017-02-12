require("../styles/main.scss")
import isotip from "isotip"
import { Game } from "./game"
import { initialise } from "./ui"
import $ from "jQuery";
export var game

export const gameover = (prestige) => {
    // for now we just restart
    newgame()
}

export const newgame = () => {
    game = Game()
    initialise()
    game.initialise()
    game.run()
}

isotip.init();

$(document).keyup(function(e){
    if (e.keyCode == 82) {
        game.setGameover();
        newgame();
    }
});

newgame()