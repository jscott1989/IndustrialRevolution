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
import * as researchTab from './tabs/research';
import { Research, generateResearch } from "./data/Research"
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

    var research_web = [];
    var researchCompleted = [];

    var money = 1000;
    var prestige = 0;

    var loan = 0;
    var gameover = false;

    var events = [
        
    ]

    var news = [
    {
        "title": "MIRACLE CURE FOUND IN COWPOX?",
        "subjectAndSubtitle": "Zoologist suggests that cowpox infection provides complete immunity to smallpox virus: Scientists are investigating the validity of a supposed “miracle vaccination” reported by Edward Jenner as a way to provide immunity to the dreaded disease smallpox. If confirmed by other scientists, this serum will enable a massive influx of workers back into businesses and ensure a landslide profit for chemical engineers and agricultural companies.",
        "dates": "1796-06-01"
    },
    {
        "title": "NEW TRANSPORT SYSTEM RUMORED IN CORNWALL",
        "subjectAndSubtitle": "Horse-drawn transport has been the social norm and often a necessity for land-based travelling, but recently whispers of a “revolutionary upgrade” to the system has been heard near the residence of Cornish mining engineer Richard Trevithick. Using the relatively recently found potential of steam power, Trevithick’s invention is seemingly set to replace horses in rail-carriage movement, providing greater power and rate of movement, though the actual details in this discovery remain “hazy”, as one resident remarked.",
        "dates": "1802-04-30"
    },
    {
        "title": "FURTHER SUCCESS FOR NAPOLEON IN MILAN.",
        "subjectAndSubtitle": "The rate of success for the recently anointed Emperor of France has Parliament both impressed and worried. After earlier victories against the Austrian armies, Napoleon has now reportedly seized both the Italian provinces of Milan and the Republic of San Marco, ensuring his strong hold over mainland Europe. Though Britain remains separated from France, the threatening shadow of the now christened French Empire has prompted many to propose the mass production of army equipment and additional research into new weapons, as the possibility of war is seemingly soon to become a certainty.",
        "dates": "1809-11-17"
    },
    {
        "title": "GWR CONSTRUCTION REPEATED",
        "subjectAndSubtitle": "- With the sure backing of (  ), the massive national railway system has reached completion. Though the cost was inevitably enormous, the results are truly staggering. The railway stretches from London all across both the Midlands and South Western landmass of Britain, with additional connections in the south east, primarily near Hastings and Eastbourne. With mass production of the recently developed steam locomotive, this build has permanently revolutionised the national transport business.",
        "dates": "1837-03-22"
    },
    {
        "title": "NED LUDD’S “WRECKERS” GROWING IN POPULARITY",
        "subjectAndSubtitle": "Recent group gatherings show increasing support: The recently titled “Luddites” have been found giving demonstrations all across southern England, congregating near major industrial centres such as London and Liverpool. Vocally anti-industrialist, the Luddites have claimed that the increase in technological advances undermine their altruistic intent due to the massive increase in unemployment, the main sufferers being the original factory or agricultural workers. Crowds have been encouraged to demand a reduction in use of blast furnaces and spinning wheels to allow a return to traditional work. Government officials have stated that these groups are dangerous and to be avoided, as several incidents of break-ins and sabotage of machines have been reported in London, and more are soon to follow.",
        "dates": "1840-09-15"
    },
    {
        "title": "HOT BLAST FURNACE PAVES THE WAY FOR MASSIVE TECHNOLOGICAL ADVANCE ",
        "subjectAndSubtitle": "( ---) has stepped forward as one of the industrial pioneers of the new age as his new improvement to metal production in factories is met with acclaim from both businessmen and the Royal Academy of Science. Hot Blast takes in the air within the blast furnaces of the factory and preheats it before proper use, allowing for greater rate of production whilst simultaneously lowering necessary consumption of fuel. With this new development, this can truly be considered the new foundation of the current industrial revolution.",
        "dates": "1826-07-10"
    },
    {
        "title": "DISASTER AT AMBERLEY QUARRY",
        "subjectAndSubtitle": "Families mourn as death toll reported to be 26: A normal working day for many soon spiralled into terror as an unnoticed build-up of natural gas ignited within the tunnels at Amberley around one-thirty on the previous Tuesday. Five men were reportedly killed immediately by the blast, the other twenty one falling victim to the falling rocks dislodged by the explosion. Eleven others are currently being treated at Arundel Community Hospital for burns and broken bones.",
        "dates": "1851-09-05"
    },
    {
        "title": "NEW SCIENTIFIC THEORIES EMERGING",
        "subjectAndSubtitle": "Since Newton's laws of mechanics and force remain immovable as a fundamental part of physical sciences, a race has seemed to have begun among the UK's most renowned physicists. The nature of electrical and magnetic force has long been a perplexing issue, but new ideas have emerged regarding their role in the world, particularly in regard to the now commonplace theory of gravity, suggesting a role just as important, but on a scale invisible to the human eye. Should the predictions prove accurate, one may find themselves standing on a landmark in scientific discovery.",
        "dates": "1820-02-03"
    }
]

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
        researchCompleted.push(new Research(1,"Industrial", "", 100, 1780, 7, 1000000, 0.5, [2], true, 0,-100))
        researchCompleted.push(new Research(2,"Agricultural", "", 100, 1780, 7, 1000000, 0.5, [3], true, -95,-31))
        researchCompleted.push(new Research(3,"Medical", "", 100, 7, 1780, 1000000, 0.5, [4], true, -59, 81))
        researchCompleted.push(new Research(4,"Military", "", 100, 7, 1780, 1000000, 0.5, [5], true, 59, 81))
        researchCompleted.push(new Research(5,"Natural Sciences", "", 100, 1780, 7, 1000000, 0.5, [1], true, 95, -31))

        researchCompleted.push(new Research(6,"More Industry", "", 100, 1780, 7, 1000000, 0.5, [1]))
        researchCompleted.push(new Research(8,"Most Industry", "", 100, 1780, 7, 1000000, 0.5, [6]))
        researchCompleted.push(new Research(9,"Much Industry", "", 100, 1780, 7, 1000000, 0.5, [8]))
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
    }

    this.matchEvents = (date) => {
        if (events.length > 0) {
            if (events[0][0] <= date) {
                // The event happens
                ui.popup(events[0][1], events[0][2], () => {
                    events.shift(0);
                });
            }
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