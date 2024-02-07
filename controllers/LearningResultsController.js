// Importar modelos y módulos necesarios
const Learning_results = require("../models/Learning_results.js")
const ApiStructure = require('../helpers/responseApi.js')
const Competences = require('../models/Competence.js')


// Controlador para listar todos los resultados de aprendizaje asociados a una competencia por su ID
exports.listLearningResults = async (req, res) => {
    const apiStructure = new ApiStructure();

    try {
        const { competence_id } = req.params;

        // Buscar resultados de aprendizaje relacionados con la competencia especificada
        const results = await Learning_results.find({ competence: competence_id });

        if (results.length > 0) {
            apiStructure.setResult(results, "Resultados de aprendizaje obtenidos correctamente");
        } else {
            apiStructure.setStatus(404, 'Info', 'No hay resultados de aprendizaje asociados a la competencia especificada');
        }
    } catch (error) {
        
        apiStructure.setStatus(500, 'Error', 'Ocurrió un error  al procesar la solicitud.');
    }

    return res.json(apiStructure.toResponse());
};

// Controlador para listar un resultado de aprendizaje por su ID
exports.resultById = async (req, res) => {
    const apiStructure = new ApiStructure();
    try {
        const { id_Result } = req.params;

        // Buscar un resultado de aprendizaje por su ID
        const result = await Learning_results.findById(id_Result);

        if (result) {
            apiStructure.setResult(result);
        } else {
            apiStructure.setStatus(404, "Info", "No existe el Resultado de Aprendizaje con el ID proporcionado");
        }
    } catch (error) {
        
        apiStructure.setStatus(500, "Error", "Ocurrió un error al procesar la solicitud.");
    }

    return res.json(apiStructure.toResponse());
};


// Controlador para crear un nuevo resultado de aprendizaje
exports.createResults = async (req, res) => {
    const apiStructure = new ApiStructure();
    try {
        const { learning_result, competence, _id } = req.body;

        // Verificar si el código ya existe en la base de datos
        const existingResult = await Learning_results.findOne({ _id });

        if (existingResult) {
            apiStructure.setStatus("Failed", 400, `El Código ya existe`);
        } else {
            // Crear un nuevo resultado de aprendizaje
            const createdResult = await Learning_results.create({
                _id, learning_result, competence
            });

            apiStructure.setResult(createdResult, "Resultado de aprendizaje creado exitosamente");
        }
    } catch (error) {
        apiStructure.setStatus(500, "Error ", "Se ha producido un error al registrar el Resultado de aprendizaje. Por favor, inténtelo nuevamente más tarde.");
    }

    return res.json(apiStructure.toResponse());
};

// Controlador para actualizar un resultado de aprendizaje por su código
exports.updateResults = async (req, res) => {
    const apiStructure = new ApiStructure();
    try {
        const code = req.params.code;
        const reqResult = req.body;

        // Buscar un resultado de aprendizaje por su código
        const result = await Learning_results.findById(code);

        if (!result) {
            apiStructure.setStatus(404, "Info", "No existe el Resultado de Aprendizaje");
            return res.json(apiStructure.toResponse());
        }

        // Actualizar los datos del resultado de aprendizaje
        const updatedResult = await Learning_results.findByIdAndUpdate(code, {
            learning_result: reqResult.learning_result,
            competence: reqResult.competence
        }, { new: true });

        apiStructure.setResult(updatedResult, "Resultado de Aprendizaje Actualizado con Éxito");
    } catch (error) {
        apiStructure.setStatus(500, "Error ", "Ocurrió un error al procesar la solicitud. Por favor, inténtelo de nuevo más tarde.");
    }

    return res.json(apiStructure.toResponse());
};

// Controlador para eliminar un resultado de aprendizaje por su ID
exports.deleteResults = async (req, res) => {
    const apiStructure = new ApiStructure();

    try {
        const idResult = req.params.id_result;
        console.log(idResult)
        const deletedResult = await Learning_results.findByIdAndDelete(idResult);

        if (deletedResult) {
            apiStructure.setResult("Eliminado exitosamente");
        } else {
            apiStructure.setStatus(404, "Info", "No existe el resultado de aprendizaje");
        }
    } catch (error) {
        console.error("Error al eliminar resultado de aprendizaje:", error);
        apiStructure.setStatus(500, "Error interno", "Ocurrió un error interno al procesar la solicitud.");
    }

    return res.json(apiStructure.toResponse());
};

