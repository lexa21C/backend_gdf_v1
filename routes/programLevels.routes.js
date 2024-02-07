const express = require('express');
const router = express.Router();
const programLevelsController = require('../controllers/programLevelsController.js');

// Ruta para obtener todos los niveles de programa
router.get('/programlevels', programLevelsController.allProgramLevels);

module.exports = router;
