const Categories = require('../models/Categories.js');
const estructureApi = require('../helpers/responseApi.js');
exports.allCategories = async (req, res) => {
  try {
      const apiStructure = new estructureApi();
      const categories = await Categories.find({});

      if (categories.length > 0) {
          apiStructure.setResult(categories, "Operación completada exitosamente");
      } else {
          apiStructure.setStatus(404, "Info", "No se encontraron categorías");
      }

      res.json(apiStructure.toResponse());
  } catch (error) {
      console.error("Error en allCategories:", error);
      const apiStructure = new estructureApi();
      apiStructure.setStatus(500, "Error", "Ocurrió un error al procesar la solicitud. Por favor, inténtelo de nuevo más tarde.");
      res.json(apiStructure.toResponse());
  }
};

exports.createCategory = async (req, res) => {
  const apiStructure = new estructureApi();
  const { name } = req.body;

  try {
    // Comprobar si el nombre de la categoría ya existe en la base de datos (sin distinción entre mayúsculas y minúsculas)
    const existingCategory = await Categories.findOne({ name: { $regex: new RegExp(`^${name}$`, 'i') } });

    if (existingCategory) {
      // Devuelve una respuesta de error si el nombre no es único
      apiStructure.setStatus("error", 409, `La categoría '${name}' ya existe`);
    } else {
      // Crea la categoría si el nombre es único
      await Categories.create({ name: name.toLowerCase() }); // Convierte el nombre de la categoría a minúsculas
      apiStructure.setResult(null, "Categoría creada exitosamente");
    }
  } catch (err) {
    console.error("Error en createCategory:", err);
    apiStructure.setStatus("error", 500, "Ocurrió un error  al procesar la solicitud");
  }

  res.json(apiStructure.toResponse());
};



exports.updateCategory = async (req, res) => {
  let apiEstructure = new estructureApi();
  let { id_category } = req.params;
  let { name } = req.body;

  try {
    //* Encuentra la categoría por su ID
    const category = await Categories.findById(id_category);

   //* Comprobar si el nuevo nombre es diferente del nombre actual (sin distinción entre mayúsculas y minúsculas)
    if (category.name.toLowerCase() !== name.toLowerCase()) {

   //* Comprobar si el nuevo nombre ya existe en la base de datos (sin distinción entre mayúsculas y minúsculas)
      const existingName = await Categories.findOne({ name: { $regex: new RegExp(`^${name}$`, 'i') } });

      if (existingName) {
        apiEstructure.setStatus("Error", 400, `El nombre de la categoría '${name}' ya existe`);
        res.json(apiEstructure.toResponse());
        return;
      }
   //* Actualizar el nombre de la categoría
      category.name = name;
      await category.save();
      apiEstructure.setResult(category, "Categoría actualizada correctamente");
    } else {
      apiEstructure.setResult(category, "El nombre de la categoría es igual, no se realizó ninguna actualización.");
    }

    res.json(apiEstructure.toResponse());
  } catch (err) {
    apiEstructure.setStatus("Error", 500, err.message);
    res.json(apiEstructure.toResponse());
  }
};


exports.deleteCategory = async (req, res) => {
  const apiStructure = new estructureApi();
  const id_category = req.params.id_category;

  try {
      const category = await Categories.findById(id_category);

      if (!category) {
          apiStructure.setStatus(404, "Info", "No existe la categoría");
      } else {
          await Categories.findByIdAndDelete(id_category);
          apiStructure.setResult(null, "Categoría eliminada exitosamente");
      }
  } catch (error) {
      console.error("Error en deleteCategory:", error);
      apiStructure.setStatus("error", 500, "Ocurrió un error interno al procesar la solicitud");
  }

  res.json(apiStructure.toResponse());
};
