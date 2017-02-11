export const Person = (name, age, skill, cost) => {
    this.getName = () => name
    this.getAge = () => age
    this.getSkill = () => skill
    this.getCost = () => cost

    return this
}

export const generatePerson = () => {
    return Person("Jonny", 1, 2, 3)
}