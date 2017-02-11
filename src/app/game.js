const moment = require('moment')
const _ = require('lodash')

export const MAX_AGE = 45
export const NORMAL_SPEED = 1000
export const FAST_SPEED = 500
const startDate = moment(new Date(1796, 11, 1));

import * as ui from './ui'
import * as staffTab from './tabs/staff';
import { generatePerson } from "./data/Person"
import * as researchTab from './tabs/research';
import { generateResearch } from "./data/Research"
import * as main from './main'

/**
 * A game encapsulates an entire game state.
 */
export const Game = () => {
    var speed = NORMAL_SPEED;
    var isPaused = false;

    var time = 0; // Days passed since the start date
    
    var availableToHire = [];
    var hiredStaff = [];

    var age = 20;
    var researchCompleted = [];

    var money = 1000;
    var prestige = 0;

    var loan = 0;
    var gameover = false;

    this.initialise = () => {
        this.generateHires(20)
        ui.update_stats(age, money, prestige);
        ui.refresh_time_controls(speed, isPaused)
        this.generateResearch(7)
    }


    this.generateHires = (num) => {
        _.each(_.range(num), () => {
            availableToHire.push(generatePerson())
        });
        staffTab.update(availableToHire, hiredStaff)
    }

    this.generateResearch = (num) => {
        _.each(_.range(num), () => {
            researchCompleted.push(generateResearch())
        });
        researchTab.update(researchCompleted)
    }

    /**
     * This manages the primary game loop
     */
    this.run = () => {
        if (!gameover) {
            if (!isPaused) {
                this.tick();
            }
            setTimeout(this.run, speed)
        }
    }

    this.tick = () => {
        time += 1;
        var date = startDate.clone().add(time, 'days')
        ui.update_date(date)

        if (date.get('date') == 1) {
            this.payday()
        }
        if (date.day() == 0) {
            this.startofweek()
        }
        if (date.dayOfYear() == 1) {
            this.startofyear()
        }
        if (money < 0) {
            this.outofmoney()
        }
    }

    this.startofweek = () => {
        this.churnstaff()
    }

    this.startofyear = () => {
        this.age()
    }

    this.age = () => {
        age += 1

        if (age > MAX_AGE) {
            ui.popup("You have died", "At the age of " + age + " you have died. Your prestige is " + prestige, () => {
                gameover = true
                main.gameover(prestige)
            })
        } else {
            _.filter(availableToHire, (h) => {
                h.age += 1
                return h.age <= MAX_AGE
            })

            _.filter(hiredStaff, (h) => {
                h.age += 1
                ui.popup(h.name + " has died", "At the grand old age of " + h.age + ", " + h.name + " has died peacefully in their sleep")
                if (h.age > MAX_AGE) {
                    return false
                }
                return true
            })
            ui.update_stats(age, money, prestige)
            staffTab.update(availableToHire, hiredStaff)
        }

    }

    this.payday = () => {
        var totalCost = _.reduce(hiredStaff, (sum, n) => {
            return sum + n.salary
        }, 0)
        money -= totalCost
        ui.update_stats(age, money, prestige)
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
        ui.update_stats(age, money, prestige)
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

    this.outofmoney = () => {
        // We have ran out of money, if we already have a loan, it's game over. Otherwise
        // we offer a one off loan
        // if (loan == 0) {

        // } else {
            ui.popup("You are bankrupt", "At the age of " + age + ", you have gone bankrupt. Your prestige was " + prestige, () => {
                gameover = true;
                main.gameover(prestige)
            });
        // }
    }

    return this;
}