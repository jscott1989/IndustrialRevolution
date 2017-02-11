import $ from "jQuery"
import { game } from "./main"
import { NORMAL_SPEED, FAST_SPEED } from "./game"
import * as staffTab from './tabs/staff';

// UI State
var activeTab = "news";


export const initialise = () => {
    update_tabs();
    bind();
}


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


    $(".tab").click(function() {
        activeTab = $(this).data("tab-name")
        update_tabs()
    })

    $("#popup .okay_button").click(() => {
        popup_okay()
    });

    staffTab.bind()
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


const update_tabs = () => {
    $(".tab").removeClass("active");
    $("#" + activeTab + "tab").addClass("active");
    $(".tab_content").removeClass("active");
    $("#tab" + activeTab).addClass("active");
}

export const update_stats = (age, money, prestige) => {
    $('#age').html(age)
    $('#money').html('$' + money)
    $('#prestige').text(prestige)
}

export const popup = (title, content) => {
    game.pause();
    $('#popup .title').text(title)
    $('#popup .content').text(content)
    $('#overlay').show()
    $('#popup').show()
}

const popup_okay = () => {
    game.unpause();
    $('#overlay').hide()
    $('#popup').hide()
}