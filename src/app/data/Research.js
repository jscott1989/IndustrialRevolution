var uuid = require('uuid');

export function Research(id, name, description, cost, optimal_year, prestige_value, financial_value, risk, prerequisites, completed=false, x=null, y=null) {
    this.id = id
    this.name = name
    this.description = description
    this.cost = cost
    this.optimal_year = optimal_year // This is the year that this is most likely to be invented. Mean time to happen.
    this.prestige_value = prestige_value
    this.financial_value = financial_value
    this.risk = risk
    this.prerequisites = prerequisites

    this.completed = completed
    this.date_completed = null

    this.start_x = x
    this.start_y = y

    return this
}

export const generateResearch = () => {
    return new Research(uuid.v4(), "Invention", "This is clever", 100, 1780, 7, 1000000, 0.5, [1,2,3])
}