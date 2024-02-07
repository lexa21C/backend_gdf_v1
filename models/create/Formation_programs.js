var mongoose = require('mongoose')
var Schema = mongoose.Schema

var Formation_program = Schema({
    program_name: String,
    program_code: Number,
    number_quarters: Number,
    total_duration:String,
    program_version:String,
    // program_start_date: Date,
    // program_end_date: Date,
    competence : [{
        ref: "Competences",
        type: mongoose.Schema.Types.Number,
    }],

    program_level:{
        ref:'Program_levels',
        type:mongoose.Schema.Types.String,
    },
    thematic_line: {
       ref: 'Thematic_lines',
       type: mongoose.Schema.Types.String,
    }
    // user : [{
    //     ref: "Users",
    //     type: mongoose.Schema.Types.ObjectId,
    // }]
},{
    timestamps : true,
    versionKey: false
})

module.exports = mongoose.model('Formation_programs_create', Formation_program)