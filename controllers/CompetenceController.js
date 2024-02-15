const Competences = require('../models/Competence.js')
const Formation_programs = require('../models/Formation_programs.js')
const ApiStructure = require('../helpers/responseApi.js')
const Artiffacts = require('../models/Artiffacts.js')
var mongoose = require('mongoose')

exports.allCompentences = async (req, res) => {
    const apiStructure = new ApiStructure();
    try {

        const competences = await Competences.find({});
        if (competences.length > 0) {
            apiStructure.setResult(competences);
            return res.json(apiStructure.toResponse());
            
        } else {
            apiStructure.setStatus(204, 'No Content', 'No se encontraron competencias');
            return res.json(apiStructure.toResponse());
        }
    } catch (error) {
        console.log(error)
        apiStructure.setStatus(500, "Error", "Ocurrió12 un error al procesar la solicitud. Por favor, inténtelo de nuevo más tarde.");
    }
    return res.json(apiStructure.toResponse());
};


exports.competenceId = async (req, res) => {
    const apiStructure = new ApiStructure();
    try {
        const id_competence = req.params.id_competence;
        const competence = await Competences.findById(id_competence);

        if (competence) {
            apiStructure.setResult(competence);
        } else {
            apiStructure.setStatus(404, 'Info', 'No se encontró la competencia');
        }
    } catch (error) {
        console.error("Error en getCompetenceById:", error);
        apiStructure.setStatus(500, "Error", "Ocurrió un error al procesar la solicitud. Por favor, inténtelo de nuevo más tarde.");
    }

    res.json(apiStructure.toResponse());
};



exports.createCompetences = async (req, res) => {
    let apiStructure = new ApiStructure();
    const {
        labor_competition,
        labor_competence_code,
        program_competition,
        labor_competition_version,
        estimated_duration,
        // quarter,
        // program
    } = req.body;
    const newObjectId = new mongoose.Types.ObjectId();

        // Convierte el ObjectId a string
        const newObjectIdString = newObjectId.toString();

    // let arrayF = []
    // for (let i = 0; i < formation_programs.length; i++) {
    //     const foundprogram= await Formation_programs.findOne({ program_name: formation_programs[i] })

    //     arrayF.push(foundformation_programs._id)

    // }
    // program= arrayF
    // const foundprogram= await Formation_programs.findOne({name : "ADSO"})
    // res.json(foundformation_programs._id)
    const laborCompetitionUpperCase = labor_competition.toUpperCase();

    try {
        const createdCompetence = await Competences.create({
            _id: newObjectIdString,
            labor_competition: laborCompetitionUpperCase,
            labor_competence_code,
            program_competition,
            labor_competition_version,
            estimated_duration,
            // quarter,
            // program
        });

        apiStructure.setResult(createdCompetence, "Competencia creada exitosamente");
    } catch (error) {
        console.error("Error en createCompetences:", error);
        apiStructure.setStatus(500, "Error ", "Se ha producido un error al registrar la competencia. Por favor, inténtelo nuevamente más tarde.");
        return res.json(apiStructure.toResponse())
    }   

    return res.json(apiStructure.toResponse())
}

// exports.compoetenceByFormation = async (req, res) => {

//     let apiStructure = new ApiStructure();
//     let { formation_program_id } = req.params
//     let formationProgram = await Formation_programs.findById({ _id: formation_program_id });
    
//     if (formationProgram != null) {
//         const FormArtifacts = []

//         let numberQuarter = formationProgram.total_duration / 3;
//         const quaterProgram = []
//         for (let i = 1; i <= numberQuarter; i++) {
//             quaterProgram.push(i)
//         }

//         let competence = await Competence.find({
//             program: formation_program_id,
//         });
//         const competenceArray = competence.map((e) => { return e })


//         FormArtifacts.push({
//             quaters: quaterProgram,
//             competences: competenceArray
//         })

//         apiStructure.setResult(FormArtifacts)

//     } else {
//         apiStructure.setStatus(
//             404,
//             "info",
//             "No se encuantra el progrma de formacion"

//         );
//     }
//     res.json(apiStructure.toResponse())


// }
exports.compoetenceByFormation= async (req, res) => {
    const apiStructure = new ApiStructure();
    const { formation_program_id } = req.params;
    const competence = []
    try {
        
        const formationProgram = await Formation_programs
        .findById(formation_program_id,'competence')
        console.log('--------------------------------------------------------')
        console.log(formationProgram)
        console.log('--------------------------------------------------------')


        const competenceIds =formationProgram.competence
        console.log(competenceIds)

// Mapear cada ID y realizar una búsqueda en el modelo Competences
const competencesData = await Promise.all(competenceIds.map(async (competenceId) => {
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



        if (!formationProgram) {
            apiStructure.setStatus(404, "info", "No se encontró el programa de formación");
            return res.json(apiStructure.toResponse());
        }
        console.log()
        
        apiStructure.setResult(competencesData);

        return res.json(apiStructure.toResponse());
    } catch (error) {
        console.error("Error en allQuarters:", error);
        apiStructure.setStatus(500, "Error", "Ocurrió un error al procesar la solicitud. Por favor, inténtelo de nuevo más tarde.");
    }
    return res.json(apiStructure.toResponse());
};

// exports.updateCompetences = async (req, res) => {
//     let apiStructure = new ApiStructure();
//     let id_competence = req.params.id_competence
//     try {

//         let { _id, labor_competition,labor_competence_code,competition_name,labor_competition_versio,estimated_duration, quarter, program} = req.body;
//         // const competence = await Competence.findById({_id: id_competence})
//         // if(!competence){
//         //     apiStructure.setResult()
//         // }
    
//         console.log(('competence udpated'))
//         const competenceUpdate = await Competence.findByIdAndUpdate(
//             {_id:id_competence},
//             {_id: labor_competence_code,  labor_competition,labor_competence_code,competition_name,labor_competition_versio,estimated_duration, quarter, program},
//             {new: true}  
//             )
//         console.log(competenceUpdate)   
//         if (competenceUpdate.length > 0){
//             console.log(competenceUpdate)
//             apiStructure.setResult(competenceUpdate,"Actualizado")
//         } else {
//             apiStructure.setStatus(404, "info", "No se  encuentra la competencia ")
//         }
//     } catch {


//     }


//     res.json(apiStructure.toResponse())
// }
exports.updateCompetences = async (req, res) => {
    const apiStructure = new ApiStructure();
    const id_competence = req.params.id_competence;

    try {
        const {
            labor_competition,
            labor_competence_code,
            competition_name,
            labor_competition_version,
            estimated_duration,
            quarter,
            program
        } = req.body;
        const laborCompetitionUpperCase = labor_competition.toUpperCase();


        const competenceUpdate = await Competences.findByIdAndUpdate(
            id_competence,
            {
                labor_competition: laborCompetitionUpperCase,
                labor_competence_code,
                competition_name,
                labor_competition_version,
                estimated_duration,
                quarter,
                program
            },
            { new: true }
        );

        if (competenceUpdate) {
            apiStructure.setResult(competenceUpdate, "Competencia actualizada correctamente");
        } else {
            apiStructure.setStatus(404, "Info", "No se encontró la competencia");
        }
    } catch (error) {
        console.error("Error en updateCompetences:", error);
        apiStructure.setStatus(500, "Error interno", "Ocurrió un error al procesar la solicitud. Por favor, inténtelo de nuevo más tarde.");
    }

    return res.json(apiStructure.toResponse());
};

exports.deleteCompetence = async (req, res) => {
    const apiStructure = new ApiStructure();

    try {
        const { id_competence } = req.params;
        const competence = await Competences.findByIdAndDelete(id_competence);

        if (competence) {
            apiStructure.setResult("Competencia eliminada correctamente");
        } else {
            apiStructure.setStatus(404, "Info", "No existe la competencia");
        }
    } catch (error) {
        console.error("Error al eliminar la competencia:", error);
        apiStructure.setStatus(500, "Error ", "Ocurrió un error interno al eliminar la competencia.");
    }

    return res.json(apiStructure.toResponse());
};
















// exports.updateCompetences = async (req, res) => {
//     let apiEstructure = new ApiStructure();
//     let id_competence = req.params.id_competence;
//     let competenceUpdate = req.body;

//     const competence = await Competence.findById({_id: id_competence});
//     if (competence){
//         apiEstructure.setResult('Actualizado')
//     }else {
//         apiEstructure.setResult(404, "info","No exite la competencia")
//     }
//     await  Competence.findByIdAndUpdate(id_competence, {})
// }