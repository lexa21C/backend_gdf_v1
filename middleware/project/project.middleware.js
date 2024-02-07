const { check, validationResult } = require('express-validator');


function validate(req, res, next) {
    const { body } = req;
    
    // Define aquí tus reglas de validación personalizadas
    const customValidationRules = [
        check('name').trim().notEmpty().withMessage('El campo "name" es obligatorio.'),
        check('state').trim().notEmpty().withMessage('El campo "state" es obligatorio.'),
        check('problem_statement').trim().notEmpty().withMessage('El campo "problem_statement" es obligatorio.'),
        check('project_justification').trim().notEmpty().withMessage('El campo "project_justification" es obligatorio.'),
        check('general_objective').trim().notEmpty().withMessage('El campo "general_objective" es obligatorio.'),
        check('specific_objectives').notEmpty().withMessage('El campo "specific_objectives" es obligatorio.'),
        check('scope_feasibility').trim().notEmpty().withMessage('El campo "scope_feasibility" es obligatorio.'),
        check('project_summary').trim().notEmpty().withMessage('El campo "project_summary" es obligatorio.'),
        check('technological_research').trim().notEmpty().withMessage('El campo "technological_research" es obligatorio.'),
        check('glossary').notEmpty().withMessage('El campo "glossary" es obligatorio.'),
        check('date_presentation').trim().notEmpty().withMessage('El campo "date_presentation" es obligatorio.'),
        check('approval_date').trim().notEmpty().withMessage('El campo "approval_date" es obligatorio.'),
    ];
  
    // Ejecuta las reglas de validación personalizadas
    Promise.all(customValidationRules.map(validation => validation.run(req)))
      .then(() => {
        const errors = validationResult(req);
        
        if (!errors.isEmpty()) {
          const errorMessages = errors.array().map((error) => error.msg);
          return res.status(400).json({ errors: errorMessages });
        }
        
        next(); // Si no hay errores de validación, pasa al siguiente middleware o al controlador
      });
  }

  module.exports = {

    validate,
  };
  