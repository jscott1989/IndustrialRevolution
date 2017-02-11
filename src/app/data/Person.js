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
    return new Person(uuid.v4(), "Jonny", 1, 2, 3, 4, 5)
}