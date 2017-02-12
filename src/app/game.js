const moment = require('moment')
const _ = require('lodash')

// Tom doesn't know what he's talking about

export const MAX_AGE = 45
export const NORMAL_SPEED = 1000
export const FAST_SPEED = 500
const startDate = moment(new Date(1796, 5, 0));

import * as ui from './ui'
import * as staffTab from './tabs/staff';
import { generatePerson } from "./data/Person"
import { selectEvent } from "./data/Event"
import * as researchTab from './tabs/research';
import { Research } from "./data/Research"
import * as main from './main'
import * as newsTab from './tabs/news'

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

    var research_web = {};
    var researchCompleted = [];
    var research_points = 0;

    var money = 1000;
    var prestige = 0;

    var loan = 0;
    var gameover = false;


    var news = require("./data/news.json");

    this.initialise = () => {


        this.generateHires(20)
        ui.update_stats(age, money, prestige);
        ui.refresh_time_controls(speed, isPaused)
        this.generateResearch()

        this.tick(true)
    }


    this.generateHires = (num) => {
        _.each(_.range(num), () => {
            availableToHire.push(generatePerson())
        });
        staffTab.update(availableToHire, hiredStaff)
    }

    this.generateResearch = () => {

        var research_json = require("./data/research.json")

        for (var i = 0; i < research_json.length; i++){
            var prerequisites = [];
            if (research_json[i]["prerequisites"]){
                if (typeof research_json[i]["prerequisites"] === "string"){
                    prerequisites = research_json[i]["prerequisites"].split(",")
                }
                else{
                    prerequisites.push(research_json[i]["prerequisites"])
                }
            }

            var research = new Research(research_json[i]["id"], research_json[i]["officialTitle"], research_json[i]["overview"], research_json[i]["section"], 0, research_json[i]["date"], 0, 0, 0, prerequisites);
            research_web[research.id] = research;
            if(research.id == 1) {
                researchCompleted.push(research);
                research.completed = true;
            }
        }
        
        researchTab.update(researchCompleted)
    }


    this.processResearch = () => {

        var staff_points = 0

        _.each(hiredStaff, (staff) => {
            staff_points += staff.skill;
        });

        var funded_points = staff_points + funding;

        research_points += funded_points;

        console.log(research_points);

        /*
            if(funded_points >= currentResearch.cost){
                researchTechnology(currentResearch);
            }
        */


        console.log("ARGH!")
        var next = [];
        for(var id in research_web) {
            console.log("ID: "+id);
            var research = research_web[id];
            if(!research.completed) {
                // if prerequisites are empty, possibly discover this
                if(research.prerequisites.length == 0) {
                    next.push(research);
                } else {
                // if a prerequisite is completed, possibly discover this
                    for(var i=0; i < research.prerequisites.length; i++){
                        var pre = research_web[research.prerequisites[i]];
                        if(pre.completed) {
                            next.push(research);
                            break;  // only need to add this once if a prereq is completed
                        }
                    } 
                }
            }
        }
        console.log("NEXT");
        console.log(next);
        var random_research = next[Math.floor(Math.random() * next.length)];
        if(random_research != null)
            random_research.completed = true;

        researchCompleted.push(random_research);

        researchTab.update(researchCompleted);
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

    this.tick = (first) => {
        time += 1;
        var date = startDate.clone().add(time, 'days')
        ui.update_date(date)

        if (!first) {
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
        newsTab.refresh_news(news, date, researchCompleted, prestige)
        this.matchEvents(date)
        this.processResearch()
    }

    this.matchEvents = (date) => {
        var event = selectEvent(this, date)
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