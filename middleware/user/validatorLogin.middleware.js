const { check, validationResult } = require('express-validator');
const userModel = require('../../models/Users.js');
const ApiStructure = require('../../helpers/responseApi.js');

const validateLoginMiddleware = async (req, res, next) => {
  const { email, password } = req.body;
  const apiStructure = new ApiStructure();
  console.log(req.body)
  console.log('validateLoginMiddleware')
  // Verifica que se proporcionen email y password en la solicitud
  if (!email || !password) {
    apiStructure.setStatus("Failed", 400, 'Debe proporcionar un email y una contraseña.');
    return res.status(400).json(apiStructure.toResponse());
  }

  // Verifica que no se proporcionen campos adicionales
  const unexpectedFields = Object.keys(req.body).filter(field => field !== 'email' && field !== 'password');
  if (unexpectedFields.length > 0) {
    apiStructure.setStatus("Failed", 400, 'No se permiten campos adicionales en la solicitud.');
    return res.json(apiStructure.toResponse());
  }

  const existingUser = await userModel.findOne({ email });

  if (!existingUser) {
    apiStructure.setStatus("error", 400, "no existe el usuario");
    console.log()
    return res.status(400).json(apiStructure.toResponse());
  }

  // Si todo está en orden, pasa al siguiente middleware
  next();
};


const validate = async (req, res, next) => {
    console.log('-------------------------------------------------------------')
    // Define aquí tus reglas de validación personalizadas
    const  customValidationRules= [
      check("email")
        .notEmpty().withMessage('El campo de  "correo electrónico" es requerido')
        .isEmail().withMessage('El correo  electrónico no es válido'),
      check("password")
        .notEmpty().withMessage('El campo de "contraseña" es requerido')
    ];
  
    // Ejecuta las reglas de validación personalizadas
    Promise.all(customValidationRules.map(validation => validation.run(req)))
      .then(() => {
        const errors = validationResult(req);
        
        if (!errors.isEmpty()) {
          const errorMessages = errors.array().map((error) => error.msg);
          return res.status(400).json({ errors: errorMessages });
        }
        
        next(); // Si no hay errores de validación, pasa al siguiente middleware o al controlador
      });
  }
  
  module.exports = {
    validateLoginMiddleware,
    validate,
  };
  

