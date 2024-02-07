const { check, validationResult} = require('express-validator');
const Competence = require("../../models/Competence.js");
const ApiStruture = require("../../helpers/responseApi.js");
async function validateCodeUniqueness(req, res, next) {
    const { labor_competence_code } = req.body;
    let apiStructure = new ApiStruture();
    const existingCode = await Competence.findOne({ labor_competence_code });
    if (existingCode) {
        apiStructure.setStatus("Failed", 400, `Lo sentimos, el código de competencia laboral '${labor_competence_code}' ya está en uso. Por favor, elija un código único.`);
        return res.json(apiStructure.toResponse());
    }  
    // Si el código de competencia laboral no está duplicado y el perfil existe, pasa al siguiente middleware o al controlador
    next();
    
}


const validateCompetence = async (req, res, next) => {
    const { body } = req;
    const apiStructure = new ApiStruture ();
    const expectedFields = ["labor_competition", "labor_competence_code", "competition_name", "labor_competition_version", "estimated_duration", "quarter", "program" ];
    const hasUnexpectedFields = Object.keys(body).some(field => !expectedFields.includes(field))
    if (hasUnexpectedFields){
        apiStructure.setStatus("Failed", 400, "No se permiten campos adicionales en la solicitud." )
        return res.json(apiStructure.toResponse());
    }
    console.log('middleware')
    const competence =  [
        check("labor_competition")
            .trim()
            .notEmpty().withMessage('El campo "competencia laboral" es obligatorio.')
            .isString().withMessage('El campo "competencia laboral" debe ser una cadena de caracteres.'),
        check("labor_competence_code")
            .trim()
            .notEmpty().withMessage('El campo "código de competencia laboral" es obligatorio.')
            .isNumeric().withMessage('El campo "código de competencia laboral" debe ser un valor numérico.'),
        check("competition_name")
            .trim()
            .notEmpty().withMessage('El campo  "nombre de la competencia"  es obligatorio.')
            .isString().withMessage('El campo "nombre de la competencia"  debe ser una cadena de caracteres.'),
        check("labor_competition_version")
            .trim()
            .notEmpty().withMessage('El campo "versión de competencia laboral" es obligatorio')
            .isString().withMessage('El campo "versión de competencia laboral" debe ser una cadena de caracteres.'),
        check("estimated_duration")
            .isString().withMessage('El campo "duracion estimada" debe ser una cadena de caracteres.'),
        check("program")
            .trim()
            .notEmpty().withMessage('El campo "programa de formacion" es obligatatorio.')
    ]

    Promise.all(competence.map(validation => validation.run(req)))
        .then(() => {
            const errors = validationResult(req);
            if(!errors.isEmpty()){
                const errorMessages = errors.array().map((error) => error.msg);
                apiStructure.setStatus(
                    "Failed",
                    400,
                    errorMessages
                );
                res.json(apiStructure.toResponse());
            }
            next();
        })

}

module.exports = {
    validateCompetence,
    validateCodeUniqueness
}