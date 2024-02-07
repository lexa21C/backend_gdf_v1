var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var Competences = Schema(
  {
    _id: {
      type: mongoose.Schema.Types.Mixed,
      default: () => mongoose.Types.ObjectId()// Genera automáticamente un ObjectId y lo convierte a string
  },
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

module.exports = mongoose.model("Competences", Competences);
