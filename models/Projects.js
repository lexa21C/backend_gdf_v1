var mongoose = require('mongoose')
var Schema = mongoose.Schema

var Project = Schema({
    name: String,
    state: String,
    problem_statement: String,
    project_justification: String,
    general_objective: String,
    specific_objectives: [],
    scope_feasibility: String,
    project_summary: String,
    technological_research: String,
    glossary: [],
    date_presentation: String,
    approval_date: String,

    category: [{
        type: Schema.Types.ObjectId,
        ref: "Categories",
    }],

    record: [{
        type: Schema.Types.ObjectId,
        ref: "Records",
    }],

},{
    timestamps : true,
    versionKey: false
})

module.exports = mongoose.model('Projects', Project)