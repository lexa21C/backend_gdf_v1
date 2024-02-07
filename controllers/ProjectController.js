
var Project = require("../models/Projects.js"); 
var estructureApi = require("../helpers/responseApi.js");
var Category = require("../models/Categories.js")
var Record = require("../models/Records.js");
const { body, validationResult } = require('express-validator');

exports.allProjects = async (req, res) => {
    const apiStructure = new estructureApi();

    try {
        const projects = await Project.find().populate('category');

        if (projects.length > 0) {
            apiStructure.setResult(projects);
        } else {
            apiStructure.setStatus(404, "Info", "No existen proyectos");
        }
    } catch (error) {
        console.error("Error al obtener proyectos:", error);
        apiStructure.setStatus(500, "Error", "Ocurrió un error al procesar la solicitud. Por favor, inténtelo de nuevo más tarde.");
    }

    return res.json(apiStructure.toResponse());
};

exports.allProjectsByRecords = async (req, res) => {
    const apiStructure = new estructureApi();

    try {
        const { record_id } = req.params;

        const projects = await Project.find({ record: record_id })
            .populate({
                path: 'record',
                populate: {
                    path: 'user',
                    model: 'Users',
                    populate: {
                        path: 'formation_program',
                        model: 'Formation_programs',
                        populate: {
                            path: 'competence',
                            model: 'Competences',
                            select: '_id labor_competence_code labor_competition labor_competition_version'
                        }
                    }
                }
            })
            .populate('category');

        if (projects.length > 0) {
            apiStructure.setResult(projects);
        } else {
            apiStructure.setStatus(404, "Info", "No existen proyectos formativos para el registro especificado");
        }
    } catch (error) {
        console.error("Error al obtener proyectos formativos por registro:", error);
        apiStructure.setStatus(500, "Error", "Ocurrió un error al procesar la solicitud. Por favor, inténtelo de nuevo más tarde.");
    }

    return res.json(apiStructure.toResponse());
};


// Crear Proyecto
exports.createProject = async (req, res) => {
    const apiStructure = new estructureApi();
    const {
        name, state, problem_statement, project_justification, general_objective,
        specific_objectives, scope_feasibility, project_summary, technological_research,
        glossary, date_presentation, approval_date, category, record
    } = req.body;

    try {
        // Validar datos con express-validator
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            apiStructure.setStatus("Failed", 400, errors.array());
            return res.status(400).json(apiStructure.toResponse());
        }

        // Verificar si el nombre ya existe en la base de datos
        const existingProject = await Project.findOne({ name });

        if (existingProject) {
            apiStructure.setStatus("Failed", 400, `El nombre del proyecto '${name}' ya existe`);
        } else {
            // Obtener IDs de las categorías
            let categoryIds = [];
            const arrayCategories = Array.isArray(category);
            if (arrayCategories) {
                for (let i = 0; i < category.length; i++) {
                    const foundCategory = await Category.findOne({ name: category[i] });
                    if (foundCategory) {
                        categoryIds.push(foundCategory._id);
                    }
                }
            } else {
                const foundCategory = await Category.findOne({ name: category });
                if (foundCategory) {
                    categoryIds.push(foundCategory._id);
                }
            }

            // Verificar si la categoría existe
            if (categoryIds.length === 0) {
                apiStructure.setStatus("Failed", 400, "Categoría no encontrada");
                return res.status(400).json(apiStructure.toResponse());
            }

            // Obtener el registro asociado
            const foundRecord = await Record.findOne({ number_record: record });

            // Verificar si el registro existe
            if (!foundRecord) {
                apiStructure.setStatus("Failed", 400, "Registro no encontrado");
                return res.status(400).json(apiStructure.toResponse());
            }

            // Crear el nuevo proyecto con los datos proporcionados
            const newProject = await Project.create({
                name, state, problem_statement, project_justification, general_objective,
                specific_objectives, scope_feasibility, project_summary, technological_research,
                glossary, date_presentation, approval_date, category: categoryIds, record: foundRecord._id
            });

            apiStructure.setResult(newProject, "Proyecto creado exitosamente");
        }
    } catch (err) {
        console.error("Error al crear el proyecto:", err);
        apiStructure.setStatus("Failed", 500, "Se ha producido un error al intentar crear el proyecto");
    }

    return res.json(apiStructure.toResponse());
};


exports.projectById = async (req, res) => {
    const apiEstructure = new estructureApi();
    const id_project = req.params.id_project;

    try {
        const project = await Project.findById(id_project).populate("category");

        if (project) {
            apiEstructure.setResult(project);
        } else {
            apiEstructure.setStatus(404, "No se encontró el Proyecto Formativo");
        }
    } catch (error) {
        console.error("Error al obtener el proyecto por ID:", error);
        apiEstructure.setStatus(500, "Error ", "Ocurrió un error interno al obtener el proyecto.");
    }

    res.json(apiEstructure.toResponse());
};
exports.updateProjects = async (req, res) => {
    let apiEstructure = new estructureApi();
    let id_project = req.params.id_project;
    let reqproject = req.body;

    try {
        const project = await Project.findById(id_project);

        if (!project) {
            apiEstructure.setStatus(404, "Info", "No se encontró el Proyecto");
            return res.json(apiEstructure.toResponse());
        }

        let arrayCategories = [];

        if (Array.isArray(reqproject.category)) {
            for (let i = 0; i < reqproject.category.length; i++) {
                const categoryName = reqproject.category[i].name || reqproject.category[i];
                const foundcategory = await Category.findOne({ name: categoryName });
                if (foundcategory) {
                    arrayCategories.push(foundcategory._id);
                }
            }
            reqproject.category = arrayCategories;
        } else {
            const foundcategory = await Category.findOne({ name: reqproject.category });
            reqproject.category = foundcategory ? foundcategory._id : null;
        }

        const updatedProject = await Project.findByIdAndUpdate(id_project, reqproject, { new: true });

        if (updatedProject) {
            apiEstructure.setResult(updatedProject, "Proyecto actualizado exitosamente");
        } else {
            apiEstructure.setStatus(404, "Info", "No se encontró el Proyecto después de la actualización");
        }
    } catch (error) {
        console.error("Error al actualizar el proyecto:", error);
        apiEstructure.setStatus(500, "Error interno", "Ocurrió un error interno al actualizar el proyecto.");
    }

    res.json(apiEstructure.toResponse());
};

exports.deleteProject = async (req, res) => {
    try {
        const apiEstructure = new estructureApi();
        const id_project = req.params.id_project;

        const project = await Project.findById({ _id: id_project });

        if (!project) {
            apiEstructure.setStatus(404, "Info", "No existe el proyecto");
            return res.json(apiEstructure.toResponse());
        }

        await Project.findByIdAndDelete({ _id: id_project });
        apiEstructure.setResult("Proyecto Eliminado");
        res.json(apiEstructure.toResponse());
    } catch (error) {
        console.error("Error al intentar eliminar el proyecto:", error);
        const apiEstructure = new estructureApi();
        apiEstructure.setStatus(500, "Error ", "Ocurrió un error  al intentar eliminar el proyecto.");
        res.json(apiEstructure.toResponse());
    }
};

exports.searchProject = async (req, res) => {
    try {
        const apiEstructure = new estructureApi();
        const { name, categories } = req.body;

        let query = { name: { $regex: new RegExp(name, 'i') } };
        
        if (categories && categories.length > 0) {
            const categoryIds = await Category.find({ name: { $in: categories } }).distinct('_id');
            query.category = { $in: categoryIds };
        }

        const projects = await Project.find(query).populate('category');

        if (projects.length > 0) {
            apiEstructure.setResult(projects);
        } else {
            apiEstructure.setStatus(404, "Info", "No se encontraron proyectos");
        }

        res.json(apiEstructure.toResponse());
    } catch (error) {
        console.error("Error al buscar proyectos:", error);
        const apiEstructure = new estructureApi();
        apiEstructure.setStatus(500, "Error interno", "Ocurrió un error interno al buscar proyectos.");
    }
    return res.json(apiEstructure.toResponse());
};


const searchCategory = async (res, projectIds, categories) => {
    try {
        const apiEstructure = new estructureApi();
        const result = [];

        for (let i = 0; i < projectIds.length; i++) {
            const projects = await Project.find({ _id: projectIds[i], category: categories[i] }).populate('category');
            result.push(projects);
        }

        apiEstructure.setResult(result, "Búsqueda exitosa");
        res.json(apiEstructure.toResponse());
    } catch (error) {
        console.error("Error al realizar la búsqueda por categoría:", error);
        const apiEstructure = new estructureApi();
        apiEstructure.setStatus(500, "Error ", "Ocurrió un error al buscar proyectos por categoría.");
        res.json(apiEstructure.toResponse());
    }
};




// Controlador para buscar fichas y proyectos por el ID del programa
exports.getFichasAndProjectsByProgram = async (req, res) => {
    const programId = req.params.formationPrograms_Id;
  
    try {
      // Buscar todas las fichas que tienen el mismo programa
      const fichas = await Record.find({ formation_program: programId });
  
      // Recopilar los IDs de las fichas encontradas
      const fichaIds = fichas.map(ficha => ficha._id);
  
      // Buscar todos los proyectos asociados a las fichas encontradas
      const projects = await Project.find({ record: { $in: fichaIds } }).populate('category');
  
      // Devolver las fichas y proyectos encontrados
      return res.json({ fichas, projects });
    } catch (error) {
      console.error("Error al buscar fichas y proyectos por programa:", error);
      return res.status(500).json({ error: 'Error en la consulta.' });
    }
  };
  