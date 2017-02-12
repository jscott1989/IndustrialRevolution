import _ from 'lodash'
import * as ui from '../ui'
import { LUDDITE_STATUS } from '../game'

function ludditeEvent(game, date) {
    var deadline = date.clone()
    var num_staff = game.getHiredStaff().length + 5
    deadline.add(1, 'month')
    scheduled_events.push([deadline, (game, date) => {
        if (game.getHiredStaff().length < num_staff) {
            game.setStatus(LUDDITE_STATUS)
            ui.popup("Equipment destroyed", "Productivity will be harmed.")
            game.setLudditeTarget(num_staff)
        } else {
            ui.popup("The Luddites are satisfied", "You will suffer no productivity penalty.")
        }
    }])
    ui.popup(
        "Luddite Movement gaining popularity",
        "Industrial output at risk. Hire 5 more staff within one month or risk reduced productivity.",
    )
}

function disputeEvent(game, date) {
    return [
        "Dispute between " + a + " and " + b,
        "There has been a dispute at work between " + a + " and " + b + ". You must resolve this or face further unrest."
    ]
}

function moleEvent(game, date) {
    return [
        "Mole from rival company",
        "A supposed mole from a rivaly company is offering data that could advance your research. You do not know how reliable this person is.",
        "Accept the deal", "Pay XXX", () => {
            alert("BADDIE!")
        }, "Reject", "", () => {

        }
    ]
}

function warEvent(game, date) {
    return [
        "Naopleonic Wars demand large industrial output.",
        "There will be increased investment in the military sector."
    ]
}

var all_events = [ludditeEvent]//, disputeEvent, moleEvent, warEvent]

var events = _.shuffle(all_events)
var scheduled_events = []

var done = false;

export const selectEvent = (game, date) => {
    // First check for scheduled events
    scheduled_events = _.filter(scheduled_events, (x) => {
        if (x[0].isSame(date, 'day')) {
            x[1](game, date)
            return false
        }
        return true
    })

    // 1 in 50 chance of an event happening
    // if (Math.random() < 0.02) {
    if (!done) {
        done = true
        let evt = events.pop();
        if (events.length == 0) {
            events = _.shuffle(all_events)
        }
        return evt(game, date)
    }
    return null
}