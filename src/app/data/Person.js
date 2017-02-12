var uuid = require('uuid');
var stochasm = require('stochasm')
var randomLetter = require('random-letter');
var rand = require('random-number');
var pickRandom = require('pick-random');

export function Person(id, avatar, name, age, skill) {
    this.avatar = avatar
    this.id = id
    this.name = name
    this.age = age
    this.skill = skill
    this.salary = stochasm({kind:"integer", mean: this.skill, stdev: 15, min: 20, max: 90}).next()
    this.fee = Math.round(this.salary * stochasm({kind:"float", mean: 3, stdev: 0.5, min: 2.5, max: 3.5}).next())

    return this
}

export const generatePerson = () => {
    
    var name = getName();
    var age = getAge();
    var skill = getSkill();
    var avatar = getAvatar();

    return new Person(uuid.v4(), avatar, name, age, skill)
}

var i = 1;
function getAvatar(){
	i = i + 1;
    if (i > 44) {
        i= 1;
    }
    return i;
}

function getName(){
	var firstName = randomLetter();
	var lastName = pickRandom(["Smith", "Jones", "Johnson", "Williams", "Brown", "Green", "Davis", "Miller", "Wilson", "Miller", "Wilson", "Taylor", "Anderson", "Lawrence", "Stevens", "Warner", "Watson", "Thomas", "Martin", "Harris", "Clark", "Singh", "Scott", "Li", "Rodriguez", "Khan"]);

	var name = firstName.toUpperCase() + ". " + lastName;

	return name;
}

function getAge(){
	
	var options = {
		min: 20,
		max: 50,
		integer: true
	}
	return rand(options);
}

function getSkill(){
	var skill = stochasm({kind:"integer", mean: 55, stdev: 5, min: 10, max: 90});

	return skill.next();
}
