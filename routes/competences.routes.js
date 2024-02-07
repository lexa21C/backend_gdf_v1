const router = require('express').Router();
const {checkAuth} = require('../middleware/auth.js')
const CompetenceController = require('../controllers/CompetenceController.js')
const {validateCodeUniqueness, validateCompetence } = require('../middleware/competence/competence.middleware.js')
const {  validateExistenceMiddleware } = require('../middleware/competence/update.middleware.js')
//* Competencias
router.get('/competences', CompetenceController.allCompentences)
router.post('/competence' , CompetenceController.createCompetences)
router.put('/competence/:id_competence', CompetenceController.updateCompetences)
router.delete('/competence/:id_competence', CompetenceController.deleteCompetence)

router.get('/competence/:id_competence', CompetenceController.competenceId)
router.get('/competences/:formation_program_id', CompetenceController.compoetenceByFormation)

module.exports = router;