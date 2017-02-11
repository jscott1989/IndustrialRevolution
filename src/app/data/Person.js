var uuid = require('uuid');

export function Person(id, name, age, skill, fee, salary) {
    this.id = id
    this.name = name
    this.age = age
    this.skill = skill
    this.fee = fee
    this.salary = salary

    return this
}

export const generatePerson = () => {
    
    var age = getAge();
    //var salary = getSalary();

    return new Person(uuid.v4(), "Jonny", age, 2, 3, 4, 5)
}

function getAge(){
	var age = require('random-number');
	var options = {
		min: 20,
		max: 50,
		integer: true
	}
	return age(options);
}

function getSalary(){
	
}