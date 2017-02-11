import Handlebars from "handlebars"
import $ from "jQuery"
import { game } from "../main"

var source   = $("#completed-research-template").html()
var template = Handlebars.compile(source)

export const update = (researchCompleted) => {
    var html = _.map(researchCompleted, (research) => {
        return template(research)
    }).join("");
    $("#completed_research_table > table").html(html);
}

export const bind = () => {
    /*$(document).on("click", '.hire_button', (a) => {
        game.hire($(a.currentTarget).data("id"));
    })*/
	$(document).on("click", '.sell_button', (a) => {
        game.sell($(a.currentTarget).data("id"));
    })
	$(document).on("click", '.publish_button', (a) => {
        game.publish($(a.currentTarget).data("id"));
    })
}