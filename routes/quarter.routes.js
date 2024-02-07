const router = require('express').Router();
const {checkAuth} = require('../middleware/auth.js')
const QuartersController=require('../controllers/QuarterController.js')

//* Trimestres
router.get('/quarter/:formation_program_id',QuartersController.allQuarters);
router.post('/quarter',QuartersController.createQuarter);
router.put('/quarter/:quarterId',QuartersController.updateQuarter);
router.delete('/quarter/:quarterId',QuartersController.deleteQuarter);

module.exports = router;
