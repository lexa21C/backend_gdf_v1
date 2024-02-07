const Thematic_lines = require('../models/Thematic_lines.js')
const ApiStructure = require('../helpers/responseApi.js')

exports.allthematics = async (req, res) => {
    const apiStructure = new ApiStructure();

    try {
        const thematics = await Thematic_lines.find({}).populate('formation_program');

        if (thematics.length > 0) {
            apiStructure.setResult(thematics, "Líneas temáticas obtenidas correctamente");
        } else {
            apiStructure.setStatus(404, "Info", "No hay líneas temáticas disponibles");
        }
    } catch (error) {
        console.error("Error al obtener líneas temáticas:", error);
        apiStructure.setStatus(500, "Error interno", "Ocurrió un error interno al obtener líneas temáticas.");
    }

    res.json(apiStructure.toResponse());
};


