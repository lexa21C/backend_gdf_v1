const router = require('express').Router();
const {checkAuth} = require('../middleware/auth.js')
const LearningResultsController=require('../controllers/LearningResultsController.js')

//* Resultados de Aprendizaje

router.get('/learningResults/:competence_id',LearningResultsController.listLearningResults)
router.post('/learningResults',LearningResultsController.createResults)
router.put('/learningResults/:code',LearningResultsController.updateResults);
router.delete('/learningResult/:id_result', LearningResultsController.deleteResults)
router.get('/learningResults/show/:id_Result',LearningResultsController.resultById);

module.exports = router;
