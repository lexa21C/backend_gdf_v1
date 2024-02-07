const User = require("../../models/Users.js");
const Profile = require("../../models/Profiles.js");
const ApiStructure = require('../../helpers/responseApi.js');
const { check, validationResult } = require('express-validator');

const   validateUserData = async (req, res, next) => {
  const { email } = req.body;
  let apiStructure = new ApiStructure();
  const existingUser = await User.findOne({ email });
  console.log(existingUser)
  if (existingUser) {
    apiStructure.setStatus("Failed", 400, `Lo sentimos, la dirección de correo electrónico '${email}' ya está siendo utilizada por otro usuario. Por favor, elige una dirección de correo electrónico diferente.`);
    return res.json(apiStructure.toResponse());
  }  
  // Si el correo no está duplicado y el perfil existe, pasa al siguiente middleware o al controlador
  next();
}
module.exports = {
    validateUserData,
  };
  