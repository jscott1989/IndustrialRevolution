import _ from 'lodash'
import * as ui from '../ui'
import { LUDDITE_STATUS, WAR_STATUS, DISPUTE_STATUS } from '../game'

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
    if (game.getHiredStaff().length >= 2) {
        var randomStaff = _.shuffle(game.getHiredStaff())
        var staffA = randomStaff[0];
        var staffB = randomStaff[1];
        var rest_staff = [staffA.name]
        var disputing_staff = [staffA, staffB]
        game.setDisputingStaff(disputing_staff)
        game.setStatus(DISPUTE_STATUS)
        var deadline = date.clone()
        deadline.add(1, 'day')
        var f = (game, date) => {
            if (!(game.statusSet(DISPUTE_STATUS))) {
                return ;
            }
            if (Math.random() > 0.95) {
                ui.popup("End of dispute", rest_staff.join(", ") + " and " + staffB.name + " have resolved their differences.")
                game.unsetStatus(DISPUTE_STATUS)
            } else {
                if (game.getHiredStaff().length > disputing_staff.length && Math.random() > 0.2) {
                    var new_staff = _.shuffle(_.filter(game.getHiredStaff(), (x) => !(_.includes(disputing_staff, x))))[0]
                    disputing_staff.push(new_staff);
                    game.setDisputingStaff(disputing_staff)
                    ui.popup(
                        new_staff.name + " joins the dispute",
                        new_staff.name + " has joined the dispute between " + rest_staff.join(", ") + " and " + staffB.name + ". You must resolve this or face further unrest."
                    )
                    rest_staff.push(new_staff.name)
                }
                var deadline = date.clone()
                deadline.add(1, 'day')

                scheduled_events.push([deadline, f])
            }
        }
        scheduled_events.push([deadline, f])
        ui.popup(
            "Dispute between " + rest_staff.join(", ") + " and " + staffB.name,
            "There has been a dispute at work between " + rest_staff.join(", ") + " and " + staffB.name + ". You must resolve this or face further unrest."
        )
    }
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
    game.setStatus(WAR_STATUS)
    var deadline = date.clone()
    deadline.add(1, 'month')
    var f = (game, date) => {
        if (Math.random() > 0.2) {
            ui.popup("War is over", "Military investment returns to normal.")
            game.unsetStatus(WAR_STATUS)
        } else {
            var deadline = date.clone()
            deadline.add(1, 'month')
            scheduled_events.push([deadline, f])
        }
    }
    scheduled_events.push([deadline, f])
    game.setStatus(WAR_STATUS)
    ui.popup(
        "War!",
        "Napoleonic Wars demand large industrial output. There will be increased investment in the military sector."
    )
}

var all_events = [ludditeEvent, disputeEvent, moleEvent, warEvent]

var events = _.shuffle(all_events)
var scheduled_events = []

export const selectEvent = (game, date) => {
    // First check for scheduled events
    _.each(scheduled_events, (x) => {
        if (x[0].isSame(date, 'day')) {
            x[1](game, date)
        }
    })

    scheduled_events = _.filter(scheduled_events, (x) => x[0].isAfter(date))

    if (Math.random() < 0.02) {
        let evt = events.pop();
        if (events.length == 0) {
            events = _.shuffle(all_events)
        }
        return evt(game, date)
    }
    return null
}