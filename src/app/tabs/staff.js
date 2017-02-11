import Handlebars from "handlebars"
import $ from "jQuery"
import { game } from "../main"

var hiring_source   = $("#hireable-person-template").html()
var hiring_template = Handlebars.compile(hiring_source)

var firing_source   = $("#staff-person-template").html()
var firing_template = Handlebars.compile(firing_source)

export const update = (available_staff, hired_staff) => {
    var hire_html = _.map(available_staff, (person) => {
        return hiring_template(person)
    }).join("");
    $("#hire_table > table").html(hire_html);

    var fire_html = _.map(hired_staff, (person) => {
        return firing_template(person)
    }).join("");
    $("#staff_table > table").html(fire_html);
}

export const bind = () => {
    $(document).on("click", '.hire_button', (a) => {
        game.hire($(a.currentTarget).data("id"));
    })

    $(document).on("click", '.fire_button', (a) => {
        game.fire($(a.currentTarget).data("id"));
    })
}