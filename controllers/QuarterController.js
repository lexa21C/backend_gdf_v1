const Quarter = require('../models/Quarters.js')
const ApiStructure = require('../helpers/responseApi.js')
const Formation_programs = require('../models/Formation_programs.js')
const Competences = require('../models/Competence.js')

exports.allQuarters = async (req, res) => {
    const apiStructure = new ApiStructure();
    const { formation_program_id } = req.params;
    try {
        
        const formationProgram = await Formation_programs
        .findById(formation_program_id,'competence')
        
        const quarters = await Quarter.find({ formation_program: formation_program_id }).populate('competence');
        console.log(quarters)
        apiStructure.setResult(quarters);

        return res.json(apiStructure.toResponse());
    } catch (error) {
        console.error("Error en allQuarters:", error);
        apiStructure.setStatus(500, "Error", "Ocurrió un error al procesar la solicitud. Por favor, inténtelo de nuevo más tarde.");
    }
    return res.json(apiStructure.toResponse());
};

exports.createQuarter = async (req, res) => {
    const { number, competence, formation_program } = req.body;
    const apiStructure = new ApiStructure();

    try {
        // // Comprobar si el número ya existe en la base de datos
        // const existingQuarter = await Quarter.findOne({ number: number });

        // if (existingQuarter) {
        //     // Devuelve una respuesta de error si el número no es único
        //     apiStructure.setStatus("Failed", 400, `El número del trimestre '${number}' ya existe`);
        // } else {
        //     // Crea el Trimestre si el número es único
            const newQuarter = await Quarter.create({
                number,
                competence,
                formation_program
            });
             console.log('newQuarter', newQuarter)
            apiStructure.setResult(newQuarter, 'Trimestre creado con éxito');
        
    } catch (error) {
        console.error("Error en createQuarter:", error);
        apiStructure.setStatus(500, "Error", "Ocurrió un error al procesar la solicitud. Por favor, inténtelo de nuevo más tarde.");
    }

    return  res.json(apiStructure.toResponse());
};


exports.updateQuarter = async (req, res) => {
    const apiStructure = new ApiStructure();

    try {
        const { body } = req;
        const { quarterId } = req.params;

        const updatedQuarter = await Quarter.findByIdAndUpdate(quarterId, body, { new: true });

        if (updatedQuarter) {
            apiStructure.setResult(updatedQuarter, 'Trimestre actualizado con éxito');
        } else {
            apiStructure.setStatus(404, 'Info', 'No existe el trimestre');
        }

        return res.json(apiStructure.toResponse());
    } catch (error) {
        console.error("Error in updateQuarter:", error);
        apiStructure.setStatus(500, 'Error', 'Ocurrió un error al procesar la solicitud. Por favor, inténtelo de nuevo más tarde.');
        return res.json(apiStructure.toResponse());
    }
};


exports.deleteQuarter = async (req, res) => {
    const apiStructure = new ApiStructure();

    try {
        const { quarterId } = req.params;
        const deletedQuarter = await Quarter.findByIdAndDelete(quarterId);

        if (deletedQuarter) {
            apiStructure.setResult('Trimestre eliminado correctamente');
        } else {
            apiStructure.setStatus(404, 'Info', 'No existe el trimestre');
        }

        return res.json(apiStructure.toResponse());
    } catch (error) {
        console.error("Error in deleteQuarter:", error);
        apiStructure.setStatus(500, 'Error', 'Ocurrió un error al procesar la solicitud. Por favor, inténtelo de nuevo más tarde.');
        return res.json(apiStructure.toResponse());
    }
};
