var uuid = require('uuid');
var stochasm = require('stochasm')
var randomLetter = require('random-letter');
var rand = require('random-number');
var pickRandom = require('pick-random');

function gaussian(mean, stdev) {
    var y2;
    var use_last = false;
    return function() {
        var y1;
        if(use_last) {
           y1 = y2;
           use_last = false;
        }
        else {
            var x1, x2, w;
            do {
                 x1 = 2.0 * Math.random() - 1.0;
                 x2 = 2.0 * Math.random() - 1.0;
                 w  = x1 * x1 + x2 * x2;               
            } while( w >= 1.0);
            w = Math.sqrt((-2.0 * Math.log(w))/w);
            y1 = x1 * w;
            y2 = x2 * w;
            use_last = true;
       }

       var retval = mean + stdev * y1;
       if(retval > 0) 
           return retval;
       return -retval;
   }
}

export function Person(id, avatar, name, age, skill) {
    this.avatar = avatar
    this.id = id
    this.name = name
    this.age = age
    this.skill = skill
    this.salary = Math.round(gaussian(this.skill, this.skill * 0.1)())
    // this.salary = stochasm({kind:"integer", mean: this.skill, stdev: 15, min: 20, max: 90}).next()
    this.fee = Math.round(gaussian(this.salary * 3, this.salary * 0.1)())
    // this.fee = Math.round(this.salary * stochasm({kind:"float", mean: 3, stdev: 0.5, min: 2.5, max: 3.5}).next())

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
