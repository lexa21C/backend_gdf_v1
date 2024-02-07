const Formation_program = require("../../models/Formation_programs.js");
const ApiStructure = require("../../helpers/responseApi.js");

const validateExistenceMiddleware = async (req, res, next) => {
  const apiStructure = new ApiStructure();
  const { id_formation_programs } = req.params;
  const { program_code } = req.body; // Asume que el código del programa está en el cuerpo de la solicitud

  try {
    // Validar existencia del programa de formación por ID
    const existingFormationProgram = await Formation_program.findById({ _id: id_formation_programs });
    if (!existingFormationProgram) {
      apiStructure.setStatus(404, "Info", "No existe el programa de formación");
      return res.json(apiStructure.toResponse());
    }

    // Validar duplicidad del código del programa
    const existingCode = await Formation_program.findOne({ program_code, _id: { $ne: id_formation_programs } });
    if (existingCode) {
      apiStructure.setStatus("Failed", 400, `Lo sentimos, el código del programa de formación '${program_code}' ya está en uso. Por favor, elija un código único.`);
      return res.json(apiStructure.toResponse());
    }

    // Si el programa de formación existe y el código no está duplicado, pasa al siguiente middleware o al controlador
    next();
  } catch (error) {
    console.error("Error al validar la existencia del programa de formación:", error);
    apiStructure.setStatus(500, "Error interno", "Ocurrió un error interno al validar la existencia del programa de formación.");
    return res.json(apiStructure.toResponse());
  }
};

module.exports = { validateExistenceMiddleware };
