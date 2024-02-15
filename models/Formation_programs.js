var mongoose = require('mongoose')
var Schema = mongoose.Schema

var Formation_programs = Schema({
    _id: {
        type: mongoose.Schema.Types.Mixed,
        default: () => mongoose.Types.ObjectId()// Genera automáticamente un ObjectId y lo convierte a string
    },
    program_name: String,
    program_code: Number,
    total_duration:{
        type: mongoose.Schema.Types.Mixed
    },
    program_version:String,

    competence : [{
        ref: "Competences",
        type: mongoose.Schema.Types.Mixed,
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

module.exports = mongoose.model('Formation_programs', Formation_programs)