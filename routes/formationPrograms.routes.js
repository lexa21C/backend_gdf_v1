const router = require('express').Router();
const {checkAuth} = require('../middleware/auth.js')
const FormationPrograms = require('../controllers/FormationProgramController.js')
const { validateFormationProgram,validateCodeUniqueness } = require('../middleware/formationProgram/create.middleware.js')
const { validateExistenceMiddleware} = require('../middleware/formationProgram/update.middleware.js')
//* Programas de Formación 
router.get('/formation_programs', FormationPrograms.allFormationPrograms)
router.get('/formation_program/:id_formation_program', FormationPrograms.allFormationProgram)
router.post('/formation_program', FormationPrograms.createFormstionPrograms)
router.put('/formation_program/:id_formation_program',FormationPrograms.updateFormationPrograms)
router.delete('/formation_program/:id_formation_programs', FormationPrograms.deleteFormationPrograms)

router.get('/formation_programs/:user_id', FormationPrograms.allFormationProgramIdUser)
router.get('/formation_programs/show/:id_formation_programs', FormationPrograms.formationProgramsById )

module.exports = router;