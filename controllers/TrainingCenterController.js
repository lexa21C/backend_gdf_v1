const Training_center = require('../models//Training_centers.js');
const estructureApi = require('../helpers/responseApi.js');

exports.allCenters = async (req, res) => {
    const apiStructure = new estructureApi();

    try {
        const centers = await Training_center.find({});

        if (centers.length > 0) {
            apiStructure.setResult(centers, "Centros de formación obtenidos correctamente");
        } else {
            apiStructure.setStatus(404, "Info", "No hay centros de formación disponibles");
        }
    } catch (error) {
        console.error("Error al obtener centros de formación:", error);
        apiStructure.setStatus(500, "Error interno", "Ocurrió un error interno al obtener centros de formación.");
    }

    res.json(apiStructure.toResponse());
};
