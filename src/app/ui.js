import $ from "jQuery"
import { game } from "./main"
import { NORMAL_SPEED, FAST_SPEED } from "./game"

/**
 * Establish UI bindings.
 */
export const bind = () => {
    $("#play").click(() => {
        game.play()
    })

    $("#pause").click(() => {
        game.pause()
    })

    $("#ff").click(() => {
        game.fastforward()
    })
}


export const update_date = (date) => {
    document.getElementById("day").innerHTML = date.format("dddd")
    document.getElementById("date").innerHTML = date.format("DD/MM/YYYY")
}

export const refresh_time_controls = (speed, isPaused) => {
    if (isPaused) {
        $("#pause").addClass("active")
        $("#play").removeClass("active")
        $("#ff").removeClass("active")
    } else if (speed == NORMAL_SPEED) {
        $("#pause").removeClass("active")
        $("#play").addClass("active")
        $("#ff").removeClass("active")
    } else {
        $("#pause").removeClass("active")
        $("#play").removeClass("active")
        $("#ff").addClass("active")
    }
}