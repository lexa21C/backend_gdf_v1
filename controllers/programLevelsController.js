const ProgramLevels = require('../models/Program_levels.js');
const ApiStructure = require('../helpers/responseApi');

exports.allProgramLevels = async (req, res) => {
  const apiStructure = new ApiStructure();

  try {
    const programLevels = await ProgramLevels.find({});

    if (programLevels.length > 0) {
      apiStructure.setResult(programLevels, "Niveles de programa obtenidos correctamente");
    } else {
      apiStructure.setStatus(404, "Info", "No hay niveles de programa disponibles");
    }
  } catch (error) {
    console.error("Error al obtener niveles de programa:", error);
    apiStructure.setStatus(500, "Error interno", "Ocurrió un error interno al obtener niveles de programa.");
  }

  res.json(apiStructure.toResponse());
};

exports.addProgramLevel = async (req, res) => {
  const apiStructure = new ApiStructure();
  const { _id, program_level } = req.body;

  try {
    const existingProgramLevel = await ProgramLevels.findById(_id);

    if (existingProgramLevel) {
      apiStructure.setStatus(400, "Info", "El nivel de programa con este ID ya existe");
    } else {
      const newProgramLevel = new ProgramLevels({ _id, program_level });
      await newProgramLevel.save();
      apiStructure.setResult(newProgramLevel, "Nivel de programa agregado correctamente");
    }
  } catch (error) {
    console.error("Error al agregar el nivel de programa:", error);
    apiStructure.setStatus(500, "Error interno", "Ocurrió un error interno al agregar el nivel de programa.");
  }

  res.json(apiStructure.toResponse());
};
