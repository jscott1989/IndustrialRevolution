const moment = require('moment')
const _ = require('lodash')

export const MAX_AGE = 45
export const NORMAL_SPEED = 1000
export const FAST_SPEED = 500
const startDate = moment(new Date(1796, 4, 1));

import * as ui from './ui'
import * as staffTab from './tabs/staff';
import { generatePerson } from "./data/Person"
import * as researchTab from './tabs/research';
import { Research, generateResearch } from "./data/Research"
import * as main from './main'

/**
 * A game encapsulates an entire game state.
 */
export const Game = () => {
    var speed = NORMAL_SPEED;
    var isPaused = true;

    var time = 0; // Days passed since the start date
    
    var availableToHire = [];
    var hiredStaff = [];

    var age = 20;

    var research_web = [];
    var researchCompleted = [];

    var money = 1000;
    var prestige = 0;

    var loan = 0;
    var gameover = false;

    var events = [
        [new Date(1796, 5, 0, 0, 0, 1), "MIRACLE CURE FOUND IN COWPOX?", "Zoologist reports that cowpox infection provides complete immunity to smallpox virus. Industries are hailing the release of a supposed “miracle vaccination” discovered by Edward Jenner as a way to provide immunity to the dreaded disease smallpox. If confirmed by other scientists, this serum will enable a massive influx of workers back into businesses and ensure a landslide profit for chemical engineers and agricultural companies."]
    ]

    this.initialise = () => {


        this.generateHires(20)
        ui.update_stats(age, money, prestige);
        ui.refresh_time_controls(speed, isPaused)
        this.generateResearch()
    }


    this.generateHires = (num) => {
        _.each(_.range(num), () => {
            availableToHire.push(generatePerson())
        });
        staffTab.update(availableToHire, hiredStaff)
    }

    this.generateResearch = () => {


        var research_json = require("./data/research.json")

        /*
        
        {
        "id": 1,
        "officalTitle": "Atomic Theory",
        "overview": "New insight into the fundamental nature of matter and the potential building blocks of the Universe",
        "date": 1805,
        "currencyvalue": "Low",
        "prestigevalue": "High",
        "section": "Science"
        }
        */

        //research_web = _.map(research_json, (research) => [


        for (var i = 0; i < research_json.length; i++){
            var prerequisites = [];
            if (typeof research_json[i]["prerequisites"]){
                if (typeof research_json[i]["prerequisites"] === "string"){
                    prerequisites = research_json[i]["prerequisites"].split(",")
                }
                else{
                    prerequisites.push(research_json[i]["prerequisites"])
                }
            }

            research_web.push(new Research(research_json[i]["id"], research_json[i]["officialTitle"], research_json[i]["overview"], 0, research_json[i]["date"], 0, 0, 0, prerequisites));

        }

        _.each(research_web, (research) => {
            researchCompleted.push(research)
        });

        console.log(researchCompleted);
        
        researchTab.update(researchCompleted)
        /*
        researchCompleted.push(new Research(1,"Industrial", "", 100, 1780, 7, 1000000, 0.5, [2]))
        researchCompleted.push(new Research(2,"Agricultural", "", 100, 1780, 7, 1000000, 0.5, [3]))
        researchCompleted.push(new Research(3,"Medical", "", 100, 7, 1780, 1000000, 0.5, [4]))
        researchCompleted.push(new Research(4,"Military", "", 100, 7, 1780, 1000000, 0.5, [5]))
        researchCompleted.push(new Research(5,"Natural Sciences", "", 100, 1780, 7, 1000000, 0.5, [1]))

        researchCompleted.push(new Research(6,"More Industry", "", 100, 1780, 7, 1000000, 0.5, [1]))
        researchCompleted.push(new Research(7,"Surgery", "", 100, 1780, 7, 1000000, 0.5, [3]))
        researchTab.update(researchCompleted)
        */
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
        this.matchEvents(date)
    }

    this.matchEvents = (date) => {
        console.log(events[0][0], date, events[0][0] <= date);
        console.log("E", events[0])
        if (events[0][0] <= date) {
            // The event happens
            ui.popup(events[0][1], events[0][2], () => {
                events.shift(0);
            });
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
            availableToHire = _.filter(availableToHire, (h) => {
                h.age += 1
                return h.age <= MAX_AGE
            })

            hiredStaff = _.filter(hiredStaff, (h) => {
                h.age += 1
                if (h.age > MAX_AGE) {
                    ui.popup(h.name + " has died", "At the grand old age of " + h.age + ", " + h.name + " has died peacefully in their sleep")
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