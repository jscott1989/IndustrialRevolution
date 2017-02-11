const moment = require('moment')
const _ = require('lodash')

export const NORMAL_SPEED = 1000
export const FAST_SPEED = 500
const startDate = moment(new Date(1670, 0, 1));

import * as ui from './ui'
import * as staffTab from './tabs/staff';
import { generatePerson } from "./data/Person"
import * as researchTab from './tabs/research';
import { Research } from "./data/Research"

/**
 * A game encapsulates an entire game state.
 */
export const Game = () => {
    var speed = NORMAL_SPEED;
    var isPaused = false;

    var time = 0; // Days passed since the start date
    
    var availableToHire = [];
    var hiredStaff = [];

    var researchCompleted = [];

    var money = 1000;
    var prestige = 0;

    this.initialise = () => {
        this.generateHires(20)
        this.generateResearch()
        ui.update_stats(money, prestige);
    }


    this.generateHires = (num) => {
        _.each(_.range(num), () => {
            availableToHire.push(generatePerson())
        });
        staffTab.update(availableToHire, hiredStaff)
    }

    this.generateResearch = () => {
        researchCompleted.push(new Research(1,"Industrial", "", 100, 1780, 7, 1000000, 0.5, [2]))
        researchCompleted.push(new Research(2,"Agricultural", "", 100, 1780, 7, 1000000, 0.5, [3]))
        researchCompleted.push(new Research(3,"Medical", "", 100, 7, 1780, 1000000, 0.5, [4]))
        researchCompleted.push(new Research(4,"Military", "", 100, 7, 1780, 1000000, 0.5, [5]))
        researchCompleted.push(new Research(5,"Natural Sciences", "", 100, 1780, 7, 1000000, 0.5, [1]))

        researchCompleted.push(new Research(6,"More Industry", "", 100, 1780, 7, 1000000, 0.5, [1]))
        researchCompleted.push(new Research(7,"Surgery", "", 100, 1780, 7, 1000000, 0.5, [3]))
        researchTab.update(researchCompleted)
    }

    /**
     * This manages the primary game loop
     */
    this.run = () => {
        if (!isPaused) {
            this.tick();
        }
        setTimeout(this.run, speed)
    }

    this.tick = () => {
        time += 1;
        var date = startDate.clone().add(time, 'days')
        ui.update_date(date)

        if (date.get('date') == 1) {
            this.payday()
        } if (date.day() == 0) {
            this.startofweek()
        }
    }

    this.startofweek = () => {
        this.churnstaff()
    }

    this.payday = () => {
        var totalCost = _.reduce(hiredStaff, (sum, n) => {
            return sum + n.salary
        }, 0)
        money -= totalCost
        ui.update_stats(money, prestige)
        ui.popup("Payday", "You paid your staff $" + totalCost)
    }

    this.play = () => {
        if (isPaused) {
            isPaused = false
        }
        speed = NORMAL_SPEED
        ui.refresh_time_controls(speed, isPaused)
    }

    this.pause = () => {
        isPaused = true;
        ui.refresh_time_controls(speed, isPaused)
    }

    this.unpause = () => {
        isPaused = false;
        ui.refresh_time_controls(speed, isPaused)
    }

    this.fastforward = () => {
        if (isPaused) {
            isPaused = false
        }
        speed = FAST_SPEED
        ui.refresh_time_controls(speed, isPaused)
    }

    this.findByID = (a, id) => {
        for (var b in a) {
            if (a[b].id == id) {
                return a[b];
            }
        }
        return null;
    }

    this.hire = (id) => {
        var matchingPerson = this.findByID(availableToHire, id);
        availableToHire = _.filter(availableToHire, (a) => a.id != id);
        hiredStaff.push(matchingPerson);
        staffTab.update(availableToHire, hiredStaff)
        money -= matchingPerson.fee
        ui.update_stats(money, prestige)
    }

    this.fire = (id) => {
        hiredStaff = _.filter(hiredStaff, (a) => a.id != id);
        staffTab.update(availableToHire, hiredStaff)
    }

    this.churnstaff = () => {
        availableToHire = _.filter(availableToHire, (s) => Math.random() >= 0.5)
        this.generateHires(Math.floor(Math.random() * 5))
        staffTab.update(availableToHire, hiredStaff)
    }


    this.sell = (id) => {
        var matchingResearch = this.findByID(researchCompleted, id);
        //availableToHire = _.filter(availableToHire, (a) => a.id != id);
        //hiredStaff.push(matchingPerson);
        //staffTab.update(availableToHire, hiredStaff)
        alert("Bought "+id.name);
    }

    return this;
}