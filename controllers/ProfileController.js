const Profile = require('../models/Profiles.js');
const estructuraApi = require('../helpers/responseApi.js');
exports.allProfile = async (req, res) => {
    const apiStructure = new estructuraApi();

    try {
        const profiles = await Profile.find({});

        if (profiles.length > 0) {
            apiStructure.setResult(profiles);
        } else {
            apiStructure.setStatus(404, 'Info', 'No hay perfiles disponibles');
        }
    } catch (error) {
        apiStructure.setStatus(500, 'Error', 'Ocurrió un error al procesar la solicitud. Por favor, inténtelo de nuevo más tarde.');
    }

    return res.json(apiStructure.toResponse());
};

exports.createProfile = async (req, res) => {
    const estructuraApi = new estructuraApi();
    const reqProfile = req.body;

    try {
        const createdProfile = await Profile.create(reqProfile);
        estructuraApi.setResult(createdProfile, "Perfil creado exitosamente");
    } catch (error) {
        console.error('Error al crear el perfil:', error);
        estructuraApi.setStatus(500, 'Error', 'Se ha producido un error al intentar crear el perfil. Por favor, inténtelo nuevamente más tarde.');
    }

    return res.json(estructuraApi.toResponse());
};
