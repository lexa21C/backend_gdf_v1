const { check, validationResult} = require('express-validator');
const Formation_program = require("../../models/Formation_programs.js");
const ApiStruture = require("../../helpers/responseApi.js");
const errorMessages = require('../../helpers/errorMessages.js');
async function validateCodeUniqueness(req, res, next) {
    const { program_code } = req.body;
    let apiStructure = new ApiStruture();

        const existingCode = await Formation_program.findOne({ program_code });
        if (existingCode) {
            apiStructure.setStatus("Failed", 400, `Lo sentimos, el código del programa de formación '${program_code}' ya está en uso. Por favor, elija un código único.`);
            return res.json(apiStructure.toResponse());
        }  
    
    // Si el código de competencia laboral no está duplicado y el perfil existe, pasa al siguiente middleware o al controlador
    next();
    
}


const validateFormationProgram = async (req, res, next) => {
    const apiStructure = new ApiStruture();
    console.log('middleware')
    const formationProgram = [
        check("program_name")
            .trim()
            .notEmpty().withMessage(errorMessages.fieldIsRequired("nombre del programa") )
            .isString().withMessage(errorMessages.fieldMustBeString("nombre del programa")),
        check("program_code")
            .trim()
            .notEmpty().withMessage(errorMessages.fieldIsRequired("código Programa"))
            .isNumeric().withMessage(errorMessages.fieldMustBeNumeric("código Programa")),
        check("total_duration")
            .trim()
            .notEmpty().withMessage(errorMessages.fieldIsRequired("total duracion" ))
            .isString().withMessage(errorMessages.fieldMustBeString("total duracion" )),
        check("Program_version")
            .trim()
            .notEmpty().withMessage(errorMessages.fieldIsRequired("Programa version")),
        check("program_start_date")
            .trim()
            .notEmpty().withMessage(errorMessages.fieldIsRequired("Fecha incio del programa")),
        check("program_end_date")
            .trim()
            .notEmpty().withMessage( errorMessages.fieldIsRequired( "Fecha final del programa")),
        // check("competence")
        //     .notEmpty().withMessage(errorMessages.fieldIsRequired("competencias" )),
        // // check("program_level")
        //     .notEmpty().withMessage(errorMessages.fieldIsRequired("Nivel programa")),
        check("thematic_line")
            .notEmpty().withMessage(errorMessages.fieldIsRequired("línea temática"))
    ]
    Promise.all(formationProgram.map(validation => validation.run(req)))
        .then(() => {
            const errors = validationResult(req);
            if(!errors.isEmpty()){
                const errorMessages = errors.array().map((error) => error.msg);
                apiStructure.setStatus(
                    "Failed",
                    400,
                    errorMessages
                );
                return res.json(apiStructure.toResponse());
            }
            next();
        })
}

module.exports = {
    validateFormationProgram,
    validateCodeUniqueness
}