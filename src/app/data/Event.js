var uuid = require('uuid');
var stochasm = require('stochasm')
var randomLetter = require('random-letter');
var rand = require('random-number');
var pickRandom = require('pick-random');

export function Event(id, title, description) {
    this.id = id
    this.title = title
    this.description = description
    return this
}