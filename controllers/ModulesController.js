const Module = require("../models/Modules.js");
const ApiStructure = require("../helpers/responseApi.js");

// Controlador para obtener todos los módulos
exports.allModules = async (req, res) => {
  const apiStructure = new ApiStructure();

  try {
      const modules = await Module.find({});

      if (modules.length > 0) {
          apiStructure.setResult(modules);
      } else {
          apiStructure.setStatus(404, 'Info', 'No hay módulos disponibles');
      }
  } catch (error) {
      console.error('Error al obtener todos los módulos:', error);
      apiStructure.setStatus(500, "Error ", "Ocurrió un error al procesar la solicitud. Por favor, inténtelo de nuevo más tarde.");
     
  }

    return res.json(apiStructure.toResponse());
};


// Controlador para crear un nuevo módulo
exports.createModules = async (req, res) => {
  const apiStructure = new ApiStructure();
  const { path, name, icon, element, layout, auth, sidebar } = req.body;

  try {
    const existingModule = await Module.findOne({ path });

    if (existingModule) {
      apiStructure.setStatus("Failed", 400, `El módulo con la ruta '${path}' ya existe`);
    } else {
      const createdModule = await Module.create({ path, name, icon, element, layout, auth, sidebar });
      apiStructure.setResult(createdModule, "Módulo creado exitosamente");
    }
  } catch (error) {
    console.error('Error al crear el módulo:', error);
    apiStructure.setStatus(500, "Error ", "Ocurrió un error al procesar la solicitud. Por favor, inténtelo de nuevo más tarde.");
  }

  return res.json(apiStructure.toResponse());
};


// Controlador para actualizar un módulo por su ID
exports.updatesModules = async (req, res) => {
  const apiStructure = new ApiStructure();
  const id_module = req.params.id_module;
  const reqModule = req.body;

  try {
    const updatedModule = await Module.findByIdAndUpdate(
      id_module,
      {
        path: reqModule.path,
        name: reqModule.name,
        icon: reqModule.icon,
        element: reqModule.element,
        layout: reqModule.layout,
        auth: reqModule.auth,
        sidebar: reqModule.sidebar
      },
      { new: true }
    );

    if (updatedModule) {
      apiStructure.setResult(updatedModule, "Módulo actualizado correctamente");
    } else {
      apiStructure.setStatus(404, "Info", "No se encontró el módulo para actualizar");
    }
  } catch (error) {
    console.error('Error al actualizar el módulo:', error);
    apiStructure.setStatus(500, 'Error interno', 'Ocurrió un error  al intentar actualizar el módulo.');
  }

  return res.json(apiStructure.toResponse());
};
