var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var Competence = Schema(
  {
 
    labor_competition: String,
    labor_competence_code: Number,
    program_competition: String,
    labor_competition_version: String,
    estimated_duration: String,
    quarter: Number,
    program: [
      {
        ref: "Formation_programs",
        type: mongoose.Schema.Types.Number,
      },
    ],
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

module.exports = mongoose.model("Competences", Competence);
