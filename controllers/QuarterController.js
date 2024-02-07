const Quarter = require('../models/Quarters.js')
const ApiStructure = require('../helpers/responseApi.js')
const Formation_programs = require('../models/Formation_programs.js')
const Competences = require('../models/Competence.js')

exports.allQuarters = async (req, res) => {
    const apiStructure = new ApiStructure();
    const { formation_program_id } = req.params;
    console.log('quater')
    try {
        
        const formationProgram = await Formation_programs
        .findById(formation_program_id,'competence')

       
        console.log(formationProgram.competence)
        const competenceIds =formationProgram.competence

// Mapear cada ID y realizar una búsqueda en el modelo Competences
const competencesData = await Promise.all(competenceIds.map(async (competenceId) => {
    console.log(competenceId)
    console.log(competenceId.toString())
  try {
    // Buscar el documento de competencia por ID
    const competence = await Competences.findById(competenceId.toString()).lean();

    if (!competence) {
      // Manejar el caso donde no se encuentra una competencia con el ID dado
      console.warn(`No se encontró la competencia con ID: ${competenceId}`);
      return null;
    }

    return competence;
  } catch (error) {
    // Manejar errores durante la búsqueda de competencia
    console.error(`Error al buscar la competencia con ID: ${competenceId}`, error);
    return null;
  }
}));

// Filtrar elementos nulos que podrían haber ocurrido por competencias no encontradas o errores
const validCompetencesData = competencesData.filter((competenceData) => competenceData !== null);

// Aquí tienes la información de todas las competencias encontradas
console.log(validCompetencesData);
        if (!formationProgram) {
            apiStructure.setStatus(404, "info", "No se encontró el programa de formación");
            return res.json(apiStructure.toResponse());
        }

        const quarters = await Quarter.find({ formation_program: formation_program_id }).lean().populate('competence');
        const competences = await Competences.find({
            program: formation_program_id,
        }).lean();

        const formArtifacts = [{
            quarters: quarters,
            competences: competences
        }];
        apiStructure.setResult(formArtifacts);

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
        // Comprobar si el número ya existe en la base de datos
        const existingQuarter = await Quarter.findOne({ number: number });

        if (existingQuarter) {
            // Devuelve una respuesta de error si el número no es único
            apiStructure.setStatus("Failed", 400, `El número del trimestre '${number}' ya existe`);
        } else {
            // Crea el Trimestre si el número es único
            const newQuarter = await Quarter.create({
                number,
                competence,
                formation_program
            });

            apiStructure.setResult(newQuarter, 'Trimestre creado con éxito');
        }
    } catch (error) {
        console.error("Error en createQuarter:", error);
        apiStructure.setStatus(500, "Error", "Ocurrió un error al procesar la solicitud. Por favor, inténtelo de nuevo más tarde.");
    }

    res.json(apiStructure.toResponse());
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
