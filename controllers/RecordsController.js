const Formation_programs = require('../models/Formation_programs.js')
const ApiStructure = require('../helpers/responseApi.js');
const Records = require('../models/Records.js');

exports.all = async (req, res) => {
    const apiStructure = new ApiStructure();
    
    try {
        const records = await Records.find({})
        .populate('formation_program')
        .populate({
            path: 'user',
            populate: {
                path: 'training_center',
            }
        });

        if (records.length > 0) {
            apiStructure.setResult(records);
        } else {
            apiStructure.setStatus(404, 'Info', 'No hay fichas disponibles');
        }
    } catch (error) {
        console.error('Error in all:', error);
        apiStructure.setStatus(500, 'Error', 'Ocurrió un error al procesar la solicitud. Por favor, inténtelo de nuevo más tarde.');
    }

    return res.json(apiStructure.toResponse());
};


exports.allRecords = async (req, res) => {
    const apiStructure = new ApiStructure();
    console.log('records 223')
    try {
        const { formationPrograms_Id } = req.params;

        const records = await Records.find({ formation_program: formationPrograms_Id })
            .populate('formation_program')
            .populate({
                path: 'user',
                populate: {
                    path: 'training_center',
                }
            });

        if (records.length > 0) {
            apiStructure.setResult(records);
        } else {
            apiStructure.setStatus(404, 'Info', 'No hay registros disponibles para el programa de formación especificado');
        }
    } catch (error) {
        console.error("Error al obtener registros:", error);
        apiStructure.setStatus(500, 'Error interno', 'Ocurrió un error interno al obtener registros.');
    }

    return res.json(apiStructure.toResponse());
};

exports.recordById = async (req, res) => {
    const apiStructure = new ApiStructure();

    try {
        const { idRecord } = req.params;
        const record = await Records.findById(idRecord).populate('user');

        if (record) {
            apiStructure.setResult(record, "Registro obtenido correctamente");
        } else {
            apiStructure.setStatus(404, "Info", "No se encontró el registro con el ID proporcionado");
        }
    } catch (error) {
        console.error("Error al obtener el registro por ID:", error);
        apiStructure.setStatus(500, "Error interno", "Ocurrió un error interno al obtener el registro por ID.");
    }

    return res.json(apiStructure.toResponse());
};

exports.createRecords = async (req, res) => {
    const { number_record, start_date, finish_date, formation_program, user } = req.body;
    const apiStructure = new ApiStructure();
    console.log('fecha',start_date)
    try {
        const existingRecord = await Records.findOne({ number_record: number_record });
        if (existingRecord) {
            apiStructure.setStatus("Failed", 400, `Ya existe una ficha con el número ${number_record}`);
        } else {
            const createdRecord = await Records.create({
                number_record,
                start_date,
                finish_date,
                formation_program,
                user,
            });
            apiStructure.setResult(createdRecord, "Ficha creada exitosamente");
        }
    } catch (err) {
        console.error("Error al crear la ficha:", err);
        apiStructure.setStatus("Failed", 500, "Ocurrió un error interno al crear la ficha.");
    }

    return res.json(apiStructure.toResponse());
};
exports.updateRecords = async (req, res) => {
    const { number_record, start_date, finish_date, formation_program, user } = req.body;
    const { idRecords } = req.params;
    const apiStructure = new ApiStructure();

    try {
        const existingRecord = await Records.findById(idRecords);

        if (existingRecord) {
            const updatedRecord = await Records.findByIdAndUpdate(idRecords, {
                number_record, start_date, finish_date, formation_program, user
            }, { new: true });

            apiStructure.setResult(updatedRecord, "Ficha actualizada con éxito");
        } else {
            apiStructure.setStatus(404, "Info", "No se encontró la ficha para actualizar");
        }
    } catch (error) {
        console.error("Error al actualizar la ficha:", error);
        apiStructure.setStatus(500, "Error interno", "Ocurrió un error interno al actualizar la ficha.");
    }

    res.json(apiStructure.toResponse());
};


exports.deleteRecords = async (req, res) => {
    const { idRecords } = req.params;
    const apiStructure = new ApiStructure();

    try {
        const existingRecord = await Records.findById(idRecords);

        if (existingRecord) {
            const deletedRecord = await Records.findByIdAndDelete(idRecords);
            apiStructure.setResult( "Ficha eliminada exitosamente");
        } else {
            apiStructure.setStatus(404, "Info", "No se encontró la ficha para eliminar");
        }
    } catch (error) {
        console.error("Error al eliminar la ficha:", error);
        apiStructure.setStatus(500, "Error interno", "Ocurrió un error interno al eliminar la ficha.");
    }

    res.json(apiStructure.toResponse());
};
