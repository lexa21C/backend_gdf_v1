const router = require('express').Router();
const {checkAuth} = require('../middleware/auth.js')

const ProjectController = require('../controllers/ProjectController.js')
const {validate} = require('../middleware/project/project.middleware.js');



//* Proyectos
router.get('/projects', ProjectController.allProjects);
router.get('/project/:record_id', ProjectController.allProjectsByRecords);
router.post('/project',validate, ProjectController.createProject);
router.get('/project/show/:id_project', ProjectController.projectById);
router.put('/project/:id_project', ProjectController.updateProjects);
router.delete('/project/:id_project', ProjectController.deleteProject);
router.post('/projects_search', ProjectController.searchProject);
router.get('/projects/:formationPrograms_Id',ProjectController.getFichasAndProjectsByProgram);

module.exports = router;
