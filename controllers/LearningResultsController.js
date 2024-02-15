// Importar modelos y módulos necesarios
const Learning_results = require("../models/Learning_results.js")
const ApiStructure = require('../helpers/responseApi.js')
const Competences = require('../models/Competence.js')
var mongoose = require('mongoose')

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
        console.log(result)
        apiStructure.setResult(result);
        return res.json(apiStructure.toResponse());
        // if (!result) {
        //     console.log('ingresa  if ')
        //     apiStructure.setResult(result);
        //     return res.json(apiStructure.toResponse());
        // } else {
        //     apiStructure.setStatus(404, "Info", "No existe el Resultado de Aprendizaje con el ID proporcionado");         
        //     return res.json(apiStructure.toResponse());

        // }
    } catch (error) {
        
        apiStructure.setStatus(500, "Error", "Ocurrió un error al procesar la solicitud.");
    }

    return res.json(apiStructure.toResponse());
};


// Controlador para crear un nuevo resultado de aprendizaje
exports.createResults = async (req, res) => {
    const apiStructure = new ApiStructure();
    try {
        const {learning_result_code, learning_result, competence, _id } = req.body;
        const newObjectId = new mongoose.Types.ObjectId();
        // Verificar si el código ya existe en la base de datos
        const newObjectIdString = newObjectId.toString();
        const existingResult = await Learning_results.findOne({ _id });
        
        // Convertir learning_result a mayúsculas
        const learningResultUpperCase = learning_result.toUpperCase();

        const createdResult = await Learning_results.create({
            _id: newObjectIdString,
            learning_result_code,
            learning_result: learningResultUpperCase,
            competence
        });
        console.log('nuevo objeto creado')
        console.log(createdResult)

        apiStructure.setResult(createdResult, "Resultado de aprendizaje creado exitosamente");
        // if (existingResult) {
        //     apiStructure.setStatus("Failed", 400, `El Código ya existe`);
        // } else {
        //     // Crear un nuevo resultado de aprendizaje
        //     const createdResult = await Learning_results.create({
        //         _id, learning_result, competence
        //     });

        //     apiStructure.setResult(createdResult, "Resultado de aprendizaje creado exitosamente");
        // }
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
        const learningResultUpperCase = reqResult.learning_result.toUpperCase();

        // Actualizar los datos del resultado de aprendizaje
        const updatedResult = await Learning_results.findByIdAndUpdate(code, {
            learning_result_code:reqResult.learning_result_code,
            learning_result: learningResultUpperCase,
            competence: reqResult.competence
        }, { new: true });

        apiStructure.setResult(updatedResult, "Resultado de Aprendizaje Actualizado con Éxito")
        return res.json(apiStructure.toResponse());;
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

