var mongoose = require('mongoose')

var Schema = mongoose.Schema

var Result = Schema({
    _id: {
        type: mongoose.Schema.Types.Mixed,
        default: () => mongoose.Types.ObjectId()// Genera automáticamente un ObjectId y lo convierte a string
    },
    learning_result_code:Number,
    learning_result: String,
    competence:[{
        res:"Competence",
        type: Schema.Types.String
    }],

},{
    timestamps : true,
    versionKey: false
})
module.exports = mongoose.model('Learning_results', Result)