import Handlebars from "handlebars"
import $ from "jQuery"
import { game } from "../main"

var source   = $("#hireable-person-template").html()
var template = Handlebars.compile(source)

export const update = (available_staff, hired_staff) => {
    var html = _.map(available_staff, (person) => {
        return template(person)
    }).join("");
    $("#hire_table > table").html(html);
}

export const bind = () => {
    $(document).on("click", '.hire_button', (a) => {
        game.hire($(a.currentTarget).data("id"));
    })
}