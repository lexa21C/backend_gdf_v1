const User = require("../../models/Users.js");
const Profile = require("../../models/Profiles.js");
const ApiStructure = require('../../helpers/responseApi.js');
const { check, validationResult } = require('express-validator');

async function validateUserData(req, res, next) {
  const { email } = req.body;
  let apiStructure = new ApiStructure();
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    apiStructure.setStatus("Failed", 400, `Lo sentimos, la dirección de correo electrónico '${email}' ya está siendo utilizada por otro usuario. Por favor, elige una dirección de correo electrónico diferente.`);
    return res.json(apiStructure.toResponse());
  }  
  // Si el correo no está duplicado y el perfil existe, pasa al siguiente middleware o al controlador
  next();
}

const validate = async (req, res, next) => {
  const { body } = req;
  let apiStructure = new ApiStructure();
  // Define aquí los campos esperados
  const expectedFields = ["complete_names", "email", "password","type_profile", "formation_program", "training_center"];
  
  // Verificar que la solicitud solo contenga los campos esperados
  const hasUnexpectedFields = Object.keys(body).some(field => !expectedFields.includes(field));

  if (hasUnexpectedFields) {
    return res.status(400).json({ error: 'No se permiten campos adicionales en la solicitud.' });
  }
  const existingProfile = await Profile.findOne({ type_profile: body.type_profile });
  console.log(!!existingProfile);
  if (!existingProfile) {
      // El perfil no existe, manejar el error
      apiStructure.setStatus("Failed", 400, `El perfil '${body.type_profile}' no existe`);
      return res.json(apiStructure.toResponse());
  }

  // Define aquí tus reglas de validación personalizadas
  const customValidationRules = [
    check("complete_names")
      .trim()
      .notEmpty().withMessage('El campo "nombres completos" es obligatorio')
      .escape()
      .matches(/^[A-Za-z0-9 ]+$/),
    check("email")
      .trim()
      .notEmpty().withMessage('El campo "correo electrónico" es obligatorio')
      .isEmail().withMessage('El correo electrónico no es válido'),
    check("type_profile")
      .trim()
      .notEmpty().withMessage('El campo "type_profile" es obligatorio'),
    check("formation_program")
      .trim()
      .notEmpty().withMessage('El campo "thematic_lines" es obligatorio')
  ];

  // Ejecuta las reglas de validación personalizadas
  Promise.all(customValidationRules.map(validation => validation.run(req)))
    .then(() => {
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        const errorMessages = errors.array().map((error) => error.msg);
        return res.status(400).json({ errors: errorMessages });
      }
      next(); // Si no hay errores de validación y no hay campos adicionales, pasa al siguiente middleware o al controlador
    });
}


module.exports = {
  validateUserData,
  validate,
};
