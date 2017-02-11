var uuid = require('uuid');
var stochasm = require('stochasm')
var age = require('random-number');

export function Person(id, name, age, skill) {
    this.id = id
    this.name = name
    this.age = age
    this.skill = skill

    this.fee = 
    stochasm({kind:"integer", mean: this.skill * 2.2, stdev: 5, min: 10, max: 100}).next()

    this.salary = 
    stochasm({kind:"integer", mean: this.skill * 0.5, stdev: 5, min: 10, max: 100}).next()

    return this
}

export const generatePerson = () => {
    
    var name = getName();

    var age = getAge();
    var skill = getSkill();

    return new Person(uuid.v4(), name, age, skill)
}

function getName(){
	var randomLetter = require('random-letter');
	var firstName = randomLetter();

	const pickRandom = require('pick-random');
	var lastName = pickRandom(["Smith", "Jones", "Bob", "Foo", "Bar"]);

	var name = firstName.toUpperCase() + ". " + lastName;

	return name;
}

function getAge(){
	
	var options = {
		min: 20,
		max: 50,
		integer: true
	}
	return age(options);
}

function getSkill(){
	var skill = stochasm({kind:"integer", mean: 55, stdev: 5, min: 10, max: 90});

	return skill.next();
}

function getLuck(){
	var stochasm = require('stochasm')
	var luck = stochasm({kind:"integer", mean: 40, stdev: 2, min: 1, max: 100});
	return luck.next();
}