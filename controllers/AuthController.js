// Importar las funciones y módulos necesarios
const { compare } = require('../helpers/Bycript');  // Importar función de comparación de contraseñas
const { tokenSign, decodeSign } = require('../helpers/token');  // Importar funciones para tokens
const userModel = require('../models/Users.js');  // Importar el modelo de usuario
const training_center = require('../models/Training_centers');  // Importar el modelo de centros de entrenamiento
const ApiStructure = require('../helpers/responseApi.js');  // Importar clase para estructurar respuestas JSON

exports.signup = async (req, res) => {
  try {
    const { email, password } = req.body;
    const apiStructure = new ApiStructure();

    const user = await userModel.findOne({ email })
      .populate('formation_program')
      .populate('type_profile')
      .populate('training_center');

    if (!user) {
      apiStructure.setStatus("Error", 400, "Usuario no encontrado");
      return res.json(apiStructure.toResponse());
    }

    const isPasswordValid = await compare(password, user.password);
    const tokenSession = await tokenSign(user);

    if (isPasswordValid) {
      console.log('Autenticación exitosa');
      return res.json({
        user,
        tokenSession,
      });
    } else {
      console.log('Autenticación fallida');
      apiStructure.setStatus(409, "Error", "Credenciales inválidas");
      return res.json(apiStructure.toResponse());
    }
  } catch (err) {
    console.error(err);
    const apiStructure = new ApiStructure();
    apiStructure.setStatus(500, 'Error', 'Error del servidor');
    return res.json(apiStructure.toResponse());
  }
};

// Definir la función controladora para decodificar un token
exports.singDecode = async (req, res) => {
  // Obtener el token del cuerpo de la solicitud
  const { token } = req.body;
  // Crear una instancia de ApiStructure para manejar la respuesta
  const apiStructure = new ApiStructure();
  try {
    // Decodificar el token
    const decode = await decodeSign(token);
    // Establecer el resultado en apiStructure
    apiStructure.setResult(decode);
  } catch (err) {
    // Manejar errores y establecer el estado como error interno del servidor
    apiStructure.setStatus(500, 'error', err.message);
  }
  // Enviar la respuesta JSON generada por apiStructure
  res.json(apiStructure.toResponse());
};
