const moment = require('moment')
const _ = require('lodash')

export const LUDDITE_STATUS = "LUDDITE_STATUS"
export const WAR_STATUS = "WAR_STATUS"
export const DISPUTE_STATUS = "DISPUTE_STATUS"


export const MAX_AGE = 45
export const NORMAL_SPEED = 1000
export const FAST_SPEED = 500
const startDate = moment(new Date(1796, 5, 0));

import $ from 'jQuery';
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
    var statuses = [];

    var luddite_target = 0;
    var disputing_staff = [];

    this.setDisputingStaff = (i) => disputing_staff = i
    this.setLudditeTarget = (i) => luddite_target = i
    this.getHiredStaff = () => {return hiredStaff}

    this.setStatus = (status) => {
        if (!(_.includes(statuses, status))) {
            statuses.push(status)
            $('#' + status + 'status').addClass("active")
        }
    }
    this.statusSet = (status) => _.includes(statuses, status)
    this.unsetStatus = (status) => {
        _.remove(statuses, (x) => x == status)
        $('#' + status + 'status').removeClass("active")
    }

    this.setGameover = () => {
        gameover = true;
    }

    var age = 20;

    var research_web = {};
    var researchCompleted = [];
    var research_points = 0;
    var latest_discovery = null;

    var money = 300;
    var prestige = 0;
    var funding = 0;

    var loan = 0;
    var gameover = false;


    var news = require("./data/news.json");

    this.initialise = () => {


        this.generateHires(12)
        ui.update_stats(age, money, prestige);
        ui.refresh_time_controls(speed, isPaused)
        this.generateResearch()
        $('.status').removeClass('active')

        this.tick(true)

        ui.popup("Demo", "We created a lot of nice systems but had trouble pulling them together at the end into a fun game. Check out our newspaper, staff management, and research interface though :p Maybe it'll be a game one day!")
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

            var research = new Research(    research_json[i]["id"], 
                                            research_json[i]["officialTitle"], 
                                            research_json[i]["overview"], 
                                            research_json[i]["section"], 
                                            research_json[i]["cost"], 
                                            research_json[i]["date"], 
                                            research_json[i]["prestigevalue"], // prestige
                                            research_json[i]["currencyvalue"], // finance
                                            0, 
                                            prerequisites);
            research_web[research.id] = research;
            if(research.id == 1) {
                researchCompleted.push(research);
                research.completed = true;
                latest_discovery = research;
            }
        }
        
        researchTab.update(researchCompleted)
    }

    this.update_research_money_percentage = (percentage) => {
        this.funding = percentage;
    }

    this.processResearch = () => {

        var staff_points = 0

        _.each(hiredStaff, (staff) => {
            staff_points += staff.skill;
        });

        research_points += staff_points;

        var date = startDate.clone().add(time, 'days')
        if (date.get('date') == 1) {
            research_points += money * (funding / 100)
        }

        console.log("RP:"+research_points);

        /*
            if(funded_points >= currentResearch.cost){
                researchTechnology(currentResearch);
            }
        */


        //console.log("ARGH!")
        var next = [];
        for(var id in research_web) {
            //console.log("ID: "+id);
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

        var discovery = false;
        // process research points distribution
        for(var i=0; i < next.length; i++) {
            var research = next[i];
            var price = Math.min((research_points/next.length), research_points);
            research.progress = research.progress + price;
            research_points = research_points - price;

            // check for discovery
            if(research.progress >= research.cost) {
                console.log("DISCOVERY");
                discovery = true;
                research.completed = true;
                researchCompleted.push(research);

                latest_discovery = research;

                ui.popup("New discovery "+research.name, research.description);
            }
        }

        if(discovery)
            researchTab.update(researchCompleted);

        //console.log("POSSIBLY NEXT DISCOVERED");
        //console.log(next);
        /*var random_research = next[Math.floor(Math.random() * next.length)];
        if(random_research != null) {
            random_research.completed = true;
        
            researchCompleted.push(random_research);
        }*/
    }

    /**
     * This manages the primary game loop
     */
    this.run = () => {
        //console.log("RUN", gameover)
        if (!gameover) {
            if (!isPaused) {
                this.tick();
            }
            setTimeout(this.run, speed)
        }
    }

    this.tick = (first) => {
        if (!gameover) {
            time += 1;
            var date = startDate.clone().add(time, 'days')
            ui.update_date(date)
            newsTab.refresh_news(news, date, latest_discovery, prestige)
            this.matchEvents(date)
            this.processResearch()
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
        }
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
                console.log("Set", gameover)
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
        money -= money * (funding / 100) //Minus funding bonus
        ui.update_stats(age, money, prestige)
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

        if (this.statusSet(LUDDITE_STATUS) && hiredStaff.length >= luddite_target) {
            // End the problem
            this.unsetStatus(LUDDITE_STATUS)
            ui.popup("Luddites satisfied", "Productivity has returned to normal.")
        }
    }

    this.fire = (id) => {
        hiredStaff = _.filter(hiredStaff, (a) => a.id != id);
        staffTab.update(availableToHire, hiredStaff)
        if (this.statusSet(DISPUTE_STATUS)) {
            disputing_staff = _.filter(disputing_staff, (x) => _.includes(hiredStaff, x))
            if (disputing_staff.length <= 1) {
                ui.popup("End of dispute", "The dispute has been resolved. Productivity returns to normal.")
                this.unsetStatus(DISPUTE_STATUS)
            }
        }
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
            gameover = true;
            ui.popup("You are bankrupt", "At the age of " + age + ", you have gone bankrupt. Your prestige was " + prestige, () => {
                alert("DONE")
                main.gameover(prestige)
            });
        // }
    }

    return this;
}