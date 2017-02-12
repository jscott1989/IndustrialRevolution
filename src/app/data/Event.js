import _ from 'lodash'
import * as ui from '../ui'

function ludditeEvent(game) {
    scheduled_events
    ui.popup(
        "Luddite Movement gaining popularity",
        "Industrial output at risk. Hire 5 more staff within one month or risk reduced productivity.",
    )
}

function disputeEvent(game) {
    return [
        "Dispute between " + a + " and " + b,
        "There has been a dispute at work between " + a + " and " + b + ". You must resolve this or face further unrest."
    ]
}

function moleEvent(game) {
    return [
        "Mole from rival company",
        "A supposed mole from a rivaly company is offering data that could advance your research. You do not know how reliable this person is.",
        "Accept the deal", "Pay XXX", () => {
            alert("BADDIE!")
        }, "Reject", "", () => {

        }
    ]
}

function warEvent(game) {
    return [
        "Naopleonic Wars demand large industrial output.",
        "There will be increased investment in the military sector."
    ]
}

var all_events = [ludditeEvent]//, disputeEvent, moleEvent, warEvent]

var events = _.shuffle(all_events)
var scheduled_events = []

export const selectEvent = (game, date) => {
    // First check for scheduled events
    scheduled_events = _.filter(scheduled_events, (x) => {
        if (x[0].isSameAs(data, 'day')) {
            x[1](game)
            return false
        }
        return true
    })

    // 1 in 50 chance of an event happening
    if (Math.random() < 0.02) {
        let evt = events.pop();
        if (events.length == 0) {
            events = _.shuffle(all_events)
        }
        return evt(game)
    }
    return null
}