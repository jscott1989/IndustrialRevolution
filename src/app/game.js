const moment = require('moment')
const _ = require('lodash')

export const NORMAL_SPEED = 1000
export const FAST_SPEED = 500
const startDate = moment(new Date(1670, 0, 1));

import * as ui from './ui'
import { generatePerson } from "./data/Person"

/**
 * A game encapsulates an entire game state.
 */
export const Game = () => {
    var speed = NORMAL_SPEED;
    var isPaused = false;

    var time = 0; // Days passed since the start date
    
    var availableToHire = [];

    this.initialise = () => {
        this.generateHires(20)
        console.log(availableToHire)
    }


    this.generateHires = (num) => {
        _.each(_.range(num), () => {
            availableToHire.push(generatePerson());
        });
    }

    /**
     * This manages the primary game loop
     */
    this.run = () => {
        if (!isPaused) {
            this.tick();
        }
        setTimeout(this.run, speed);
    }

    this.tick = () => {
        time += 1;
        var date = startDate.clone().add(time, 'days');
        ui.update_date(date);
    }

    this.play = () => {
        if (isPaused) {
            isPaused = false;
        }
        speed = NORMAL_SPEED;
        ui.refresh_time_controls(speed, isPaused);
    }

    this.pause = () => {
        isPaused = true;
        ui.refresh_time_controls(speed, isPaused);
    }

    this.fastforward = () => {
        if (isPaused) {
            isPaused = false;
        }
        speed = FAST_SPEED;
        ui.refresh_time_controls(speed, isPaused);
    }

    return this;
}